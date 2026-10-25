import { Program, GenreId } from '../types/epg';
import { GENRE_DEFINITIONS } from '../data/genres';

export function parseBangumiHtml(htmlContent: string, defaultChannelId: string = 'ch1'): Program[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const programs: Program[] = [];

  // Match genre helper
  function detectGenre(text: string): GenreId {
    for (const def of GENRE_DEFINITIONS) {
      for (const kw of def.keywords) {
        if (text.includes(kw)) {
          return def.id;
        }
      }
    }
    return 'other';
  }

  // 1. Try finding bangumi.org typical elements:
  // li[s], time[s], .program_text, .program_box, #program_area li
  const items = doc.querySelectorAll('#program_area li, time[s], li[s], .program_text, div[class*="program"]');

  if (items.length > 0) {
    items.forEach((item, index) => {
      const titleEl = item.querySelector('.program_title, [class*="program_title"], h3, h4, p strong, p');
      const title = (titleEl?.textContent || item.getAttribute('title') || '').trim();
      if (!title || title.length < 2) return;

      const detailEl = item.querySelector('.program_detail, [class*="program_detail"], p:nth-of-type(2)');
      const description = (detailEl?.textContent || '').trim();

      // Parse start time if available in s attribute (e.g. s="202610251900")
      const sAttr = item.getAttribute('s') || item.parentElement?.getAttribute('s') || '';
      let startHour = 19;
      let startMinute = 0;
      let duration = 30;

      if (sAttr.length >= 12) {
        startHour = parseInt(sAttr.substring(8, 10), 10);
        startMinute = parseInt(sAttr.substring(10, 12), 10);
      } else {
        // Fallback: estimate time from sequence
        startHour = 6 + Math.floor(index / 2) % 20;
        startMinute = (index % 2) * 30;
      }

      // Detect flags like [字], [新], [再], [映]
      const flags: ('新' | '終' | '再' | '字' | '二' | '解' | '映' | 'デ')[] = [];
      if (title.includes('[字]') || title.includes('【字】')) flags.push('字');
      if (title.includes('[新]') || title.includes('【新】')) flags.push('新');
      if (title.includes('[再]') || title.includes('【再】')) flags.push('再');
      if (title.includes('[映]') || title.includes('【映】')) flags.push('映');
      if (title.includes('[終]') || title.includes('【終】')) flags.push('終');

      const fullText = title + ' ' + description;
      const genre = detectGenre(fullText);

      programs.push({
        id: `imported-${Date.now()}-${index}`,
        channelId: defaultChannelId,
        title: title.replace(/\[[字新再映画終二解デ]+\]|【[字新再映画終二解デ]+】/g, '').trim(),
        description: description || 'bangumi.orgより取り込んだ番組情報です。',
        startHour,
        startMinute,
        durationMinutes: duration,
        genre,
        flags: flags.length > 0 ? flags : undefined,
      });
    });
  }

  // Fallback: if user pasted plain text list of programs (one per line)
  if (programs.length === 0) {
    const lines = htmlContent.split('\n').map((l) => l.trim()).filter((l) => l.length > 2);
    lines.forEach((line, index) => {
      // Check if line starts with time e.g. "19:00 番組名" or "7:00 [新] アニメ..."
      const timeMatch = line.match(/^(\d{1,2}):(\d{2})\s*(.*)$/);
      let hour = 12;
      let min = 0;
      let title = line;

      if (timeMatch) {
        hour = parseInt(timeMatch[1], 10);
        min = parseInt(timeMatch[2], 10);
        title = timeMatch[3];
      }

      const genre = detectGenre(title);
      programs.push({
        id: `text-import-${index}`,
        channelId: defaultChannelId,
        title,
        description: 'テキストインポートされた番組です。',
        startHour: hour,
        startMinute: min,
        durationMinutes: 30,
        genre,
      });
    });
  }

  return programs;
}
