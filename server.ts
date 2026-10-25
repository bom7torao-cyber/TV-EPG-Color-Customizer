import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CachedData {
  timestamp: number;
  data: any;
}

const cache = new Map<string, CachedData>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

function inferGenre(rawClass: string, title: string, desc: string): string {
  if (rawClass.includes('gc-anime')) return 'anime';
  if (rawClass.includes('gc-drama')) return 'drama';
  if (rawClass.includes('gc-movie')) return 'movie';
  if (rawClass.includes('gc-music')) return 'music';
  if (rawClass.includes('gc-sports')) return 'sports';

  const text = `${title} ${desc}`;
  if (/ニュース|天気|NEWS|報道|サタデーLIVE|サンデーLIVE|ZIP|めざまし|ひるおび|Nスタ|報道ステーション|WBS|時事/i.test(text)) return 'news';
  if (/バラエティ|バラエティー|SP|オモウマい|イッテQ|しゃべくり|マツコ|アメトーーク|モニタリング|ドッキリ|ダウンタウン|ラヴィット|さんま|有吉|千鳥|チョコプラ/i.test(text)) return 'variety';
  if (/情報|ショッピング|通販|生活|あさイチ|DayDay|スイッチ|ドデスカ|キャッチ|ゴゴスマ|よじごじ|なないろ|買物|カイモノラボ/i.test(text)) return 'info';
  if (/ドキュメンタリー|ドキュメント|世界遺産|情熱大陸|NHKスペシャル|歴史|ダーウィン|ガイア|カンブリア|百名山/i.test(text)) return 'documentary';
  if (/趣味|園芸|将棋|囲碁|料理|きょうの料理|英会話|Eテレ|おかあさんといっしょ|天才てれびくん|ピタゴラ/i.test(text)) return 'hobby';
  if (/アニメ|映画|シネマ/i.test(text)) {
    if (/アニメ/.test(text)) return 'anime';
    if (/映画|シネマ/.test(text)) return 'movie';
  }

  return 'other';
}

function extractFlags(title: string): ('新' | '終' | '再' | '字' | '二' | '解' | '映' | 'デ')[] {
  const flags: ('新' | '終' | '再' | '字' | '二' | '解' | '映' | 'デ')[] = [];
  if (title.includes('🈑') || title.includes('[字]')) flags.push('字');
  if (title.includes('🈟') || title.includes('[新]')) flags.push('新');
  if (title.includes('🈡') || title.includes('[終]')) flags.push('終');
  if (title.includes('🈞') || title.includes('[再]')) flags.push('再');
  if (title.includes('🈓') || title.includes('[デ]')) flags.push('デ');
  if (title.includes('🈖') || title.includes('[解]')) flags.push('解');
  if (title.includes('🈐') || title.includes('[二]')) flags.push('二');
  if (title.includes('🈙') || title.includes('[映]')) flags.push('映');
  return flags;
}

async function fetchAndParseBangumi(type: string, group: string, dateStr: string) {
  let targetUrl = 'https://bangumi.org/epg/td?ggm_group_id=73';
  if (type === 'bs') {
    targetUrl = 'https://bangumi.org/epg/bs';
    if (dateStr) targetUrl += `?broad_cast_date=${dateStr}`;
  } else if (type === 'cs') {
    targetUrl = 'https://bangumi.org/epg/cs';
    if (dateStr) targetUrl += `?broad_cast_date=${dateStr}`;
  } else {
    const groupId = group || '73';
    targetUrl = `https://bangumi.org/epg/td?ggm_group_id=${groupId}`;
    if (dateStr) targetUrl += `&broad_cast_date=${dateStr}`;
  }

  const cacheKey = `${type}_${group}_${dateStr}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const response = await fetch(targetUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch from bangumi.org: HTTP ${response.status}`);
  }

  const html = await response.text();

  // Extract channels
  const channelMatches = [...html.matchAll(/<li class=\"js_channel[^\"]*\">.*?<p>([^<]+)<\/p>/gs)].map(
    (m) => m[1].trim()
  );

  // Extract program lines
  const lineMatches = [...html.matchAll(/<ul id=\"program_line_(\d+)\">(.*?)<\/ul>/gs)];

  const channels: any[] = [];
  const programs: any[] = [];

  lineMatches.forEach(([_, lineIdStr, lineContent]) => {
    const lineIndex = parseInt(lineIdStr, 10) - 1;
    const rawChName = channelMatches[lineIndex] || `CH ${lineIdStr}`;

    // Clean channel name and number
    let chNumber: string | number = lineIdStr;
    let cleanName = rawChName;
    const numMatch = rawChName.match(/^(\d+)\s*(.+)/);
    if (numMatch) {
      chNumber = parseInt(numMatch[1], 10);
      cleanName = numMatch[2].replace(/\s*\d+$/, '').replace(/\.\.$/, '').trim();
    }

    const channelId = `ch_line_${lineIdStr}`;
    let iconBg = 'bg-slate-700';
    if (cleanName.includes('東海')) iconBg = 'bg-emerald-600';
    else if (cleanName.includes('Eテレ')) iconBg = 'bg-amber-500';
    else if (cleanName.includes('NHK')) iconBg = 'bg-blue-600';
    else if (cleanName.includes('中京')) iconBg = 'bg-cyan-600';
    else if (cleanName.includes('CBC')) iconBg = 'bg-indigo-600';
    else if (cleanName.includes('メ〜テレ')) iconBg = 'bg-rose-600';
    else if (cleanName.includes('愛知')) iconBg = 'bg-purple-600';
    else if (cleanName.includes('三重')) iconBg = 'bg-teal-600';
    else if (cleanName.includes('ぎふ')) iconBg = 'bg-lime-600';

    channels.push({
      id: channelId,
      name: cleanName,
      shortName: cleanName.length > 7 ? cleanName.slice(0, 6) : cleanName,
      channelNumber: chNumber,
      iconBg,
      logoText: `${chNumber}`,
      category: type === 'bs' ? 'bs' : type === 'cs' ? 'cs' : 'terrestrial',
    });

    // Extract programs
    const progMatches = [
      ...lineContent.matchAll(/<li[^>]*\ss=\"(\d+)\"\se=\"(\d+)\"[^>]*>(.*?)<\/li>/gs),
    ];

    progMatches.forEach(([_, startStr, endStr, inner]) => {
      let sh = parseInt(startStr.slice(8, 10), 10);
      const sm = parseInt(startStr.slice(10, 12), 10);
      if (sh < 4) sh += 24;

      let eh = parseInt(endStr.slice(8, 10), 10);
      const em = parseInt(endStr.slice(10, 12), 10);
      if (eh < 4) eh += 24;

      const dur = eh * 60 + em - (sh * 60 + sm);
      if (dur <= 0) return;

      const titleM = inner.match(/<p class=\"program_title\">([^<]+)<\/p>/);
      const title = titleM ? titleM[1].trim() : '番組情報';

      const descM = inner.match(/<p class=\"program_detail\">([^<]*)<\/p>/);
      const desc = descM ? descM[1].trim() : '';

      const genreM = inner.match(/class=\"program_time\s+([^\"]+)\"/);
      const rawGenreClass = genreM ? genreM[1] : '';

      const genre = inferGenre(rawGenreClass, title, desc);
      const flags = extractFlags(title);

      programs.push({
        id: `${channelId}-${startStr}`,
        channelId,
        title,
        description: desc,
        startHour: sh,
        startMinute: sm,
        durationMinutes: dur,
        genre,
        flags,
      });
    });
  });

  const result = {
    type,
    group: group || '73',
    dateStr,
    source: 'bangumi.org_live',
    channels,
    programs,
    updatedAt: new Date().toISOString(),
  };

  cache.set(cacheKey, { timestamp: Date.now(), data: result });
  return result;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // API endpoint: Live EPG
  app.get('/api/epg', async (req, res) => {
    try {
      const type = (req.query.type as string) || 'td';
      const group = (req.query.group as string) || '73';
      const date = (req.query.date as string) || '';

      const result = await fetchAndParseBangumi(type, group, date);
      res.json(result);
    } catch (err: any) {
      console.error('Error fetching EPG:', err.message);
      res.status(500).json({
        error: 'Failed to fetch live EPG',
        message: err.message,
      });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
