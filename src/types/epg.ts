export type GenreId =
  | 'anime'
  | 'drama'
  | 'sports'
  | 'music'
  | 'movie'
  | 'variety'
  | 'news'
  | 'info'
  | 'documentary'
  | 'hobby'
  | 'theater'
  | 'other';

export interface GenreDef {
  id: GenreId;
  name: string;
  shortName: string;
  defaultBg: string;
  defaultBorder: string;
  defaultText: string;
  iconName: string;
  keywords: string[];
}

export interface ColorScheme {
  id: string;
  name: string;
  description: string;
  colors: Record<GenreId, { bg: string; border: string; text: string }>;
}

export interface Program {
  id: string;
  channelId: string;
  title: string;
  subTitle?: string;
  description: string;
  startHour: number; // 4.0 to 28.0 (28 = 4am next morning)
  startMinute: number;
  durationMinutes: number;
  genre: GenreId;
  subGenre?: string;
  cast?: string[];
  flags?: ('新' | '終' | '再' | '字' | '二' | '解' | '映' | 'デ')[];
  link?: string;
}

export interface Channel {
  id: string;
  name: string;
  shortName: string;
  channelNumber: number | string;
  iconBg: string;
  logoText: string;
  category?: 'terrestrial' | 'bs' | 'cs';
}

export interface RegionConfig {
  id: string;
  groupId: number; // e.g. 73, 42, 99
  name: string;
  shortLabel: string;
  broadcastType: 'terrestrial' | 'bs' | 'cs';
  description: string;
  channels: Channel[];
}
