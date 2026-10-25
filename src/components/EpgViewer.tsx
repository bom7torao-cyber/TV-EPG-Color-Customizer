import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Filter,
  Clock,
  MapPin,
  Calendar,
  Layers,
  Eye,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Info,
  UploadCloud,
  Tv,
  Radio,
  SlidersHorizontal
} from 'lucide-react';
import { Program, Channel, GenreId, RegionConfig } from '../types/epg';
import { GENRE_DEFINITIONS } from '../data/genres';
import { REGIONS, getProgramsForDateAndRegion, getDateString } from '../data/mockEpgData';
import { UserColorConfig } from '../utils/bookmarkletGenerator';
import { ImportModal } from './ImportModal';

interface EpgViewerProps {
  colorConfig: UserColorConfig;
  onSelectProgram: (program: Program, channel: Channel) => void;
  onNavigateToTools: () => void;
  customPrograms?: Program[];
  onAddCustomPrograms?: (programs: Program[]) => void;
}

const START_HOUR = 4; // 04:00
const END_HOUR = 28; // 28:00 (04:00 next day)
const TOTAL_HOURS = END_HOUR - START_HOUR;

export const EpgViewer: React.FC<EpgViewerProps> = ({
  colorConfig,
  onSelectProgram,
  onNavigateToTools,
  customPrograms = [],
  onAddCustomPrograms,
}) => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('group-73');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeGenreFilter, setActiveGenreFilter] = useState<GenreId | 'all'>('all');
  const [filterMode, setFilterMode] = useState<'dim' | 'hide'>('dim');
  // Target Date State (defaults to today 00:00:00)
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const isToday = selectedDate.getTime() === today.getTime();

  // Offset in days relative to today
  const selectedDateOffset = Math.round(
    (selectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const [zoomLevel, setZoomLevel] = useState<'compact' | 'normal' | 'large'>('normal');
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Minute height scale
  const minuteHeight = zoomLevel === 'compact' ? 1.2 : zoomLevel === 'large' ? 2.2 : 1.6;

  const currentRegion = useMemo(() => {
    return REGIONS.find((r) => r.id === selectedRegionId) || REGIONS[0];
  }, [selectedRegionId]);

  // Real-time live data state from bangumi.org official source
  const [liveData, setLiveData] = useState<{
    channels: Channel[];
    programs: Program[];
    dateStr: string;
    regionId: string;
  } | null>(null);
  const [isLoadingLive, setIsLoadingLive] = useState<boolean>(false);
  const [liveError, setLiveError] = useState<string | null>(null);

  const fetchLiveEpg = async () => {
    setIsLoadingLive(true);
    setLiveError(null);
    try {
      const type =
        currentRegion.broadcastType === 'bs'
          ? 'bs'
          : currentRegion.broadcastType === 'cs'
          ? 'cs'
          : 'td';
      const group = currentRegion.groupId ? String(currentRegion.groupId) : '73';
      const y = selectedDate.getFullYear();
      const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const d = String(selectedDate.getDate()).padStart(2, '0');
      const dateStr = `${y}${m}${d}`;

      const res = await fetch(`/api/epg?type=${type}&group=${group}&date=${dateStr}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.programs && json.programs.length > 0) {
        setLiveData({
          channels: json.channels,
          programs: json.programs,
          dateStr: json.dateStr,
          regionId: selectedRegionId,
        });
      }
    } catch (e: any) {
      setLiveError(e.message || 'データ取得エラー');
    } finally {
      setIsLoadingLive(false);
    }
  };

  useEffect(() => {
    fetchLiveEpg();
  }, [selectedRegionId, selectedDate, currentRegion]);

  // Active channels: Uses official bangumi.org channels when liveData is ready, otherwise fallback
  const activeChannels = useMemo(() => {
    if (liveData && liveData.regionId === selectedRegionId && liveData.channels.length > 0) {
      return liveData.channels;
    }
    return currentRegion.channels;
  }, [liveData, selectedRegionId, currentRegion]);

  // DATE-LINKED programs: Uses official bangumi.org real broadcasts when available!
  const rawPrograms = useMemo(() => {
    if (liveData && liveData.regionId === selectedRegionId && liveData.programs.length > 0) {
      return [...liveData.programs, ...customPrograms];
    }
    const base = getProgramsForDateAndRegion(selectedRegionId, selectedDate);
    return [...base, ...customPrograms];
  }, [liveData, selectedRegionId, selectedDate, customPrograms]);

  // Current time position indicator (only active for today)
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const effectiveHour = currentHour < 4 ? currentHour + 24 : currentHour;
  const currentMinutesFromStart = (effectiveHour - START_HOUR) * 60 + currentMinute;
  const currentTimeTop = currentMinutesFromStart * minuteHeight;

  // Jump to specific hour
  const scrollToHour = (targetHour: number) => {
    if (containerRef.current) {
      const minutesFromStart = (targetHour - START_HOUR) * 60;
      const scrollPos = Math.max(0, minutesFromStart * minuteHeight - 50);
      containerRef.current.scrollTo({ top: scrollPos, behavior: 'smooth' });
    }
  };

  const scrollToNow = () => {
    if (containerRef.current) {
      const scrollPos = Math.max(0, currentTimeTop - 200);
      containerRef.current.scrollTo({ top: scrollPos, behavior: 'smooth' });
    }
  };

  const handleSelectOffset = (offset: number) => {
    const next = new Date(today);
    next.setDate(today.getDate() + offset);
    setSelectedDate(next);
    if (offset === 0) {
      scrollToNow();
    } else {
      scrollToHour(5);
    }
  };

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const parts = e.target.value.split('-');
    if (parts.length === 3) {
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 0, 0, 0);
      setSelectedDate(d);
      scrollToHour(5);
    }
  };

  const dateInputValue = useMemo(() => {
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const d = String(selectedDate.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [selectedDate]);

  // Filter and search statistics
  const matchedPrograms = useMemo(() => {
    return rawPrograms.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchCast = p.cast?.some((c) => c.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchCast) return false;
      }
      return true;
    });
  }, [rawPrograms, searchQuery]);

  // Count per genre
  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    rawPrograms.forEach((p) => {
      counts[p.genre] = (counts[p.genre] || 0) + 1;
    });
    return counts;
  }, [rawPrograms]);

  // 8 Days selector buttons (yesterday, today, tomorrow + 5 days)
  const dateButtons = useMemo(() => {
    const list = [];
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    for (let i = -1; i <= 6; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const m = d.getMonth() + 1;
      const dateNum = d.getDate();
      const dayOfWeek = d.getDay();
      const dayName = dayNames[dayOfWeek];
      list.push({
        offset: i,
        label: i === 0 ? '今日' : i === 1 ? '明日' : i === -1 ? '昨日' : `${m}/${dateNum}`,
        subLabel: `(${dayName})`,
        dayOfWeek,
        isSunday: dayOfWeek === 0,
        isSaturday: dayOfWeek === 6,
      });
    }
    return list;
  }, [today]);

  // Formatted date title e.g. "2026年10月25日 (日曜日)"
  const formattedDateTitle = useMemo(() => {
    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth() + 1;
    const d = selectedDate.getDate();
    const dayNames = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
    return `${y}年${m}月${d}日 (${dayNames[selectedDate.getDay()]})`;
  }, [selectedDate]);

  // Calculate dynamic grid column style based on active channel count
  const channelCount = activeChannels.length;
  const colMinWidth = 160; // min width per channel column

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full bg-slate-100 overflow-hidden select-none">
      {/* Top Controls Toolbar */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-4 py-2 shadow-2xs z-30 space-y-2">
        {/* Row 1: Broadcast Type Switcher & Active Date Navigator */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Broadcast Type Pills: Terrestrial (Tokai 73 / Tokyo 42), BS All 12, CS All 10 */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto scrollbar-none">
            {REGIONS.map((r) => {
              const isSelected = r.id === selectedRegionId;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRegionId(r.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {r.broadcastType === 'bs' ? (
                    <Radio className="w-3.5 h-3.5 text-amber-400" />
                  ) : r.broadcastType === 'cs' ? (
                    <Tv className="w-3.5 h-3.5 text-sky-400" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  )}
                  <span>{r.shortLabel}</span>
                  <span className="text-[10px] opacity-75 font-normal">
                    ({r.channels.length}局)
                  </span>
                </button>
              );
            })}
          </div>

          {/* Date Selector with Previous/Next Day, Scrollable Tabs & Calendar Picker */}
          <div className="flex items-center space-x-1 bg-slate-50 border border-slate-300 rounded-xl p-1 text-xs max-w-full overflow-hidden">
            {/* Prev Day */}
            <button
              onClick={() => handleSelectOffset(selectedDateOffset - 1)}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 font-bold shrink-0 flex items-center"
              title="前の日へ"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px] ml-0.5">前日</span>
            </button>

            {/* Date buttons container */}
            <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-0.5">
              {dateButtons.map((btn) => {
                const isSelected = selectedDateOffset === btn.offset;
                const textColor = btn.isSunday
                  ? 'text-rose-600'
                  : btn.isSaturday
                  ? 'text-sky-600'
                  : 'text-slate-700';

                return (
                  <button
                    key={btn.offset}
                    onClick={() => handleSelectOffset(btn.offset)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 leading-tight ${
                      isSelected
                        ? 'bg-orange-500 text-white shadow-xs scale-105'
                        : `hover:bg-slate-200 ${textColor} bg-white/70`
                    }`}
                  >
                    <span>{btn.label}</span>
                    <span className="text-[10px] ml-0.5 opacity-90">{btn.subLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Next Day */}
            <button
              onClick={() => handleSelectOffset(selectedDateOffset + 1)}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 font-bold shrink-0 flex items-center"
              title="次の日へ"
            >
              <span className="hidden sm:inline text-[11px] mr-0.5">翌日</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Native Calendar Picker button */}
            <label
              className="flex items-center space-x-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg px-2 py-1 text-xs cursor-pointer shadow-2xs font-bold shrink-0 transition-colors"
              title="カレンダーから日付を直接選択"
            >
              <Calendar className="w-3.5 h-3.5 text-orange-500" />
              <span className="hidden sm:inline text-[11px]">カレンダー</span>
              <input
                type="date"
                value={dateInputValue}
                onChange={handleCustomDateChange}
                className="sr-only"
              />
            </label>
          </div>
        </div>

        {/* Row 2: Active Date Header, Search, Time Jumps & Scale */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
          {/* Date and Area Label */}
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span>{formattedDateTitle}</span>
              <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                - {currentRegion.name}
              </span>
            </span>

            {isToday && (
              <button
                onClick={scrollToNow}
                className="flex items-center space-x-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-bold px-2 py-0.5 rounded-lg transition-colors"
                title="現在の放送時間へスクロール"
              >
                <Clock className="w-3 h-3 text-amber-600" />
                <span>現在時刻</span>
              </button>
            )}
          </div>

          {/* Quick Time Jumps */}
          <div className="hidden lg:flex items-center space-x-1 text-[11px] bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-bold px-1.5">時間帯:</span>
            <button onClick={() => scrollToHour(5)} className="px-1.5 py-0.5 rounded hover:bg-white text-slate-700">朝 05:00</button>
            <button onClick={() => scrollToHour(9)} className="px-1.5 py-0.5 rounded hover:bg-white text-slate-700">昼前 09:00</button>
            <button onClick={() => scrollToHour(12)} className="px-1.5 py-0.5 rounded hover:bg-white text-slate-700">お昼 12:00</button>
            <button onClick={() => scrollToHour(17)} className="px-1.5 py-0.5 rounded hover:bg-white text-slate-700">夕方 17:00</button>
            <button onClick={() => scrollToHour(19)} className="px-1.5 py-0.5 rounded hover:bg-white text-orange-600 font-bold">ゴールデン 19:00</button>
            <button onClick={() => scrollToHour(23)} className="px-1.5 py-0.5 rounded hover:bg-white text-slate-700">夜 23:00</button>
            <button onClick={() => scrollToHour(25)} className="px-1.5 py-0.5 rounded hover:bg-white text-purple-600 font-bold">深夜アニメ帯 25:00</button>
          </div>

          {/* Search, Import & Zoom Controls */}
          <div className="flex items-center space-x-1.5">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="番組・出演者検索..."
                className="pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-300 rounded-lg w-36 sm:w-48 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ×
                </button>
              )}
            </div>

            {/* Import Button */}
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center space-x-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-2.5 py-1 rounded-lg font-medium transition-colors"
              title="bangumi.orgのHTMLを取り込んで表示"
            >
              <UploadCloud className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">HTML取込</span>
            </button>

            {/* Zoom Toggle */}
            <div className="flex items-center bg-slate-100 border border-slate-300 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setZoomLevel('compact')}
                className={`px-1.5 py-0.5 rounded ${zoomLevel === 'compact' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-500'}`}
                title="コンパクト"
              >
                小
              </button>
              <button
                onClick={() => setZoomLevel('normal')}
                className={`px-1.5 py-0.5 rounded ${zoomLevel === 'normal' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-500'}`}
                title="標準"
              >
                中
              </button>
              <button
                onClick={() => setZoomLevel('large')}
                className={`px-1.5 py-0.5 rounded ${zoomLevel === 'large' ? 'bg-white shadow-xs font-bold text-slate-900' : 'text-slate-500'}`}
                title="拡大"
              >
                大
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: Genre Filter Pills with Real-Time Counts */}
        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none pb-0.5">
          <div className="flex items-center space-x-1.5 flex-nowrap">
            <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap flex items-center gap-1">
              <Filter className="w-3 h-3" />
              絞り込み:
            </span>

            {/* All Button */}
            <button
              onClick={() => setActiveGenreFilter('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap transition-all ${
                activeGenreFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              すべて ({rawPrograms.length})
            </button>

            {/* Genre Pills */}
            {GENRE_DEFINITIONS.slice(0, 9).map((genre) => {
              const isActive = activeGenreFilter === genre.id;
              const gColor = colorConfig.colors[genre.id];
              const count = genreCounts[genre.id] || 0;

              return (
                <button
                  key={genre.id}
                  onClick={() => setActiveGenreFilter(isActive ? 'all' : genre.id)}
                  style={{
                    backgroundColor: isActive ? gColor.border : gColor.bg,
                    color: isActive ? '#ffffff' : gColor.text,
                    borderColor: gColor.border,
                  }}
                  className={`px-2 py-0.5 rounded-md text-xs font-bold whitespace-nowrap border transition-all flex items-center gap-1 shadow-2xs ${
                    isActive ? 'scale-105 ring-2 ring-offset-1 ring-slate-400' : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: isActive ? '#fff' : gColor.border }}
                  />
                  <span>{genre.shortName}</span>
                  <span className="text-[10px] opacity-80">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => setFilterMode(filterMode === 'dim' ? 'hide' : 'dim')}
              className="text-[10px] text-slate-500 hover:text-slate-800 font-medium px-2 py-0.5 rounded border border-slate-200 bg-slate-50 whitespace-nowrap"
            >
              非選択: {filterMode === 'dim' ? '薄く表示' : '非表示'}
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Active Date Status Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white px-3 sm:px-4 py-1.5 flex flex-wrap items-center justify-between gap-1.5 shadow-2xs shrink-0 z-20">
        <div className="flex items-center space-x-2">
          <span className="bg-black/25 text-white font-black px-2.5 py-0.5 rounded-lg text-xs flex items-center gap-1.5 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-amber-200" />
            <span>{formattedDateTitle} の番組表</span>
          </span>
          <span className="text-xs font-bold text-orange-50 hidden md:inline">
            {currentRegion.name}（全{activeChannels.length}局・24時間完全表示中）
          </span>
          {/* Live Data Sync Badge */}
          {isLoadingLive ? (
            <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded font-bold animate-pulse flex items-center gap-1">
              <RotateCcw className="w-3 h-3 animate-spin" />
              公式実データ取得中...
            </span>
          ) : liveData && liveData.regionId === selectedRegionId ? (
            <span className="text-[10px] bg-emerald-700/90 text-white px-2 py-0.5 rounded font-bold flex items-center gap-1 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
              bangumi.org 公式実放送 同期中
            </span>
          ) : (
            <button
              onClick={fetchLiveEpg}
              className="text-[10px] bg-amber-700/90 hover:bg-amber-800 text-white px-2 py-0.5 rounded font-bold flex items-center gap-1 cursor-pointer transition-colors"
              title="公式番組表データを再取得"
            >
              <RotateCcw className="w-3 h-3" />
              最新同期
            </button>
          )}
        </div>
        <div className="flex items-center space-x-1.5 text-xs">
          <button
            onClick={() => handleSelectOffset(selectedDateOffset - 1)}
            className="bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer"
          >
            ◀ 前日
          </button>
          <button
            onClick={() => handleSelectOffset(0)}
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-black transition-colors cursor-pointer ${
              isToday ? 'bg-white text-orange-600 shadow-xs' : 'bg-white/25 text-white hover:bg-white/35'
            }`}
          >
            今日
          </button>
          <button
            onClick={() => handleSelectOffset(selectedDateOffset + 1)}
            className="bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer"
          >
            翌日 ▶
          </button>
        </div>
      </div>

      {/* Main EPG Grid Container (Full Gapless 24h) */}
      <div ref={containerRef} className="flex-1 overflow-auto relative select-none bg-slate-200">
        <div
          className="relative bg-slate-50"
          style={{
            height: `${TOTAL_HOURS * 60 * minuteHeight + 60}px`,
            minWidth: `${Math.max(880, channelCount * colMinWidth + 60)}px`,
          }}
        >
          {/* Sticky Header: Channel Columns */}
          <div className="sticky top-0 z-20 flex bg-slate-800 text-white border-b-2 border-slate-700 shadow-sm">
            {/* Time Axis Header Corner */}
            <div className="w-13 sm:w-15 shrink-0 bg-slate-900 border-r border-slate-700 p-2 flex flex-col items-center justify-center text-slate-400 text-[10px] font-bold">
              <span>時刻</span>
            </div>

            {/* Channel Headers Grid */}
            <div
              className="flex-1 grid divide-x divide-slate-700"
              style={{
                gridTemplateColumns: `repeat(${channelCount}, minmax(${colMinWidth}px, 1fr))`,
              }}
            >
              {activeChannels.map((ch) => (
                <div
                  key={ch.id}
                  className="py-2.5 px-2 flex flex-col items-center justify-center text-center hover:bg-slate-750 transition-colors"
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-black bg-white/20 text-white px-1.5 py-0.2 rounded font-mono">
                      {typeof ch.channelNumber === 'number' ? `${ch.channelNumber}ch` : ch.channelNumber}
                    </span>
                    <span className="text-xs font-bold tracking-tight text-white truncate max-w-[120px]">
                      {ch.shortName}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 truncate max-w-[130px] hidden sm:block">
                    {ch.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Time Grid Body */}
          <div className="flex relative">
            {/* Left Time Column (04:00 to 28:00) */}
            <div className="w-13 sm:w-15 shrink-0 bg-slate-100 border-r-2 border-slate-300 relative select-none">
              {Array.from({ length: TOTAL_HOURS }).map((_, i) => {
                const hourNum = START_HOUR + i;
                const displayHour = hourNum >= 24 ? `翌${hourNum - 24}` : hourNum;
                const isNight = hourNum >= 22 || hourNum < 5;

                return (
                  <div
                    key={hourNum}
                    className={`border-b border-slate-200 flex flex-col items-center justify-start pt-1 font-mono ${
                      isNight ? 'bg-slate-200/60' : 'bg-slate-100'
                    }`}
                    style={{ height: `${60 * minuteHeight}px` }}
                  >
                    <span className="text-sm font-bold text-slate-800 leading-none">
                      {displayHour}
                    </span>
                    <span className="text-[9px] text-slate-500 font-semibold mt-0.5">00</span>
                    <div
                      className="w-full border-t border-dashed border-slate-300"
                      style={{ marginTop: `${30 * minuteHeight - 14}px` }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Grid Columns for Each Channel */}
            <div
              className="flex-1 grid divide-x divide-slate-300 relative bg-slate-50"
              style={{
                gridTemplateColumns: `repeat(${channelCount}, minmax(${colMinWidth}px, 1fr))`,
              }}
            >
              {/* Horizontal Hour Lines Background */}
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: TOTAL_HOURS }).map((_, i) => (
                  <div
                    key={i}
                    className="border-b border-slate-200 w-full"
                    style={{ height: `${60 * minuteHeight}px` }}
                  >
                    <div
                      className="border-b border-slate-100 border-dashed w-full"
                      style={{ marginTop: `${30 * minuteHeight}px` }}
                    />
                  </div>
                ))}
              </div>

              {/* Current Time Red Bar (Active today) */}
              {isToday && currentTimeTop >= 0 && currentTimeTop <= TOTAL_HOURS * 60 * minuteHeight && (
                <div
                  className="absolute left-0 right-0 z-15 pointer-events-none flex items-center"
                  style={{ top: `${currentTimeTop}px` }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-600 -ml-1.5 shadow-sm" />
                  <div className="flex-1 border-t-2 border-rose-600 border-dashed shadow-xs" />
                  <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-l font-mono shadow-sm">
                    {String(currentHour).padStart(2, '0')}:{String(currentMinute).padStart(2, '0')} 現在
                  </span>
                </div>
              )}

              {/* Programs for each channel column */}
              {activeChannels.map((channel) => {
                const channelPrograms = matchedPrograms.filter((p) => p.channelId === channel.id);

                return (
                  <div key={channel.id} className="relative h-full">
                    {channelPrograms.map((program) => {
                      // Calculate top position and height
                      const startMinutes =
                        (program.startHour - START_HOUR) * 60 + program.startMinute;
                      const top = startMinutes * minuteHeight;
                      const height = Math.max(26, program.durationMinutes * minuteHeight);

                      const gDef = GENRE_DEFINITIONS.find((g) => g.id === program.genre);
                      const gColors = colorConfig.colors[program.genre] || colorConfig.colors.other;

                      // Filter matching logic
                      const matchesFilter =
                        activeGenreFilter === 'all' || activeGenreFilter === program.genre;

                      const isHighlightedSearch =
                        Boolean(searchQuery.trim()) &&
                        (program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          program.description.toLowerCase().includes(searchQuery.toLowerCase()));

                      if (!matchesFilter && filterMode === 'hide') {
                        return null;
                      }

                      return (
                        <div
                          key={program.id}
                          onClick={() => onSelectProgram(program, channel)}
                          style={{
                            top: `${top}px`,
                            height: `${height}px`,
                            backgroundColor: gColors.bg,
                            borderLeftWidth: `${colorConfig.borderWidth}px`,
                            borderLeftColor: gColors.border,
                            borderLeftStyle: 'solid',
                          }}
                          className={`absolute left-0 right-0 mx-[1px] rounded-r-xs p-1.5 overflow-hidden cursor-pointer transition-all duration-150 border-b border-black/10 hover:z-20 hover:shadow-md ${
                            !matchesFilter ? 'opacity-20 grayscale-[40%]' : 'opacity-100'
                          } ${
                            isHighlightedSearch
                              ? 'ring-2 ring-amber-500 shadow-md font-semibold'
                              : ''
                          }`}
                        >
                          {/* Program Card Header: Start Time & Genre Tag */}
                          <div className="flex items-center gap-1 leading-none mb-1">
                            <span className="text-[10px] font-bold font-mono text-slate-800 shrink-0">
                              {String(program.startHour >= 24 ? program.startHour - 24 : program.startHour).padStart(2, '0')}
                              :{String(program.startMinute).padStart(2, '0')}
                            </span>

                            {/* Genre Badge Tag */}
                            {colorConfig.showBadge && (
                              <span
                                style={{
                                  backgroundColor: gColors.border,
                                }}
                                className="text-[9px] font-bold text-white px-1 py-0.2 rounded-xs leading-none shrink-0"
                              >
                                {gDef?.shortName || program.genre}
                              </span>
                            )}

                            {/* Program Flags [字] [新] [映] etc */}
                            {program.flags?.map((f) => (
                              <span
                                key={f}
                                className={`text-[8px] font-bold px-0.5 rounded-xs leading-none shrink-0 ${
                                  f === '新'
                                    ? 'bg-rose-500 text-white'
                                    : f === '終'
                                    ? 'bg-slate-700 text-white'
                                    : f === '映'
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-slate-300 text-slate-800'
                                }`}
                              >
                                [{f}]
                              </span>
                            ))}
                          </div>

                          {/* Program Title */}
                          <h4
                            style={{ color: gColors.text }}
                            className="text-xs font-bold leading-tight line-clamp-2"
                          >
                            {program.title}
                          </h4>

                          {/* Description (if height permits) */}
                          {height > 55 && (
                            <p className="text-[10px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                              {program.description}
                            </p>
                          )}

                          {/* Cast (if height permits) */}
                          {height > 90 && program.cast && (
                            <div className="text-[9px] text-slate-500 mt-1 truncate">
                              出: {program.cast.join(', ')}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Bar: Quick Color Legend & Direct Import */}
      <div className="bg-slate-900 text-slate-200 border-t border-slate-800 px-3 sm:px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 shadow-lg z-30">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-400 text-[11px]">凡例:</span>
          <div className="flex items-center space-x-2 flex-wrap text-[11px]">
            {GENRE_DEFINITIONS.slice(0, 6).map((g) => {
              const col = colorConfig.colors[g.id];
              return (
                <div key={g.id} className="flex items-center space-x-1">
                  <span
                    className="w-3 h-3 rounded-xs border"
                    style={{ backgroundColor: col.bg, borderColor: col.border }}
                  />
                  <span>{g.shortName}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
          <span>
            {formattedDateTitle} 放送中
          </span>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="text-orange-400 hover:text-orange-300 font-bold underline flex items-center gap-1"
          >
            <span>HTML取込</span>
            <span>&uarr;</span>
          </button>
        </div>
      </div>

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        channels={currentRegion.channels}
        onImportPrograms={(newPrograms) => {
          if (onAddCustomPrograms) {
            onAddCustomPrograms(newPrograms);
          }
        }}
      />
    </div>
  );
};
