export type MarketCategory =
  | 'US stocks'
  | 'World stocks'
  | 'Crypto'
  | 'Futures'
  | 'Forex'
  | 'Government bonds'
  | 'Corporate bonds'
  | 'ETFs'
  | 'Economy';

export type MoverTab = 'Large Cap' | 'Gainers' | 'Losers' | 'Most Active';

export type TechnicalRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SparklinePoint {
  time: string;
  price: number;
}

export interface MarketIndex {
  id: string;
  name: string;
  ticker: string;
  badgeNumber: string;
  badgeBg: string;
  price: number;
  changePercent: number;
  changeAmount: number;
  currency: string;
  isPositive: boolean;
  history: SparklinePoint[];
  high: number;
  low: number;
  open: number;
  prevClose: number;
  category: MarketCategory;
}

export interface StockItem {
  id: string;
  ticker: string;
  name: string;
  exchange: string;
  logoLetter: string;
  logoBg: string;
  logoSvg?: 'apple' | 'nvidia' | 'microsoft' | 'tesla' | 'amazon' | 'meta';
  price: number;
  changePercent: number;
  changeAmount: number;
  volume: string;
  volumeRaw: number;
  marketCap: string;
  marketCapRaw: number;
  technicalRating: TechnicalRating;
  category: MarketCategory;
  sector?: string;
  peRatio?: number;
  dividendYield?: number;
  high52: number;
  low52: number;
  open: number;
  dayHigh: number;
  dayLow: number;
  candles: CandleData[];
  description: string;
}
