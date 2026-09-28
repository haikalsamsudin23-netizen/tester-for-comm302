import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Clock, ShieldCheck, Layers } from 'lucide-react';
import { MarketIndex } from '../types/market';

interface IndexDetailModalProps {
  index: MarketIndex | null;
  onClose: () => void;
}

export const IndexDetailModal: React.FC<IndexDetailModalProps> = ({ index, onClose }) => {
  const [selectedTf, setSelectedTf] = useState('1D');

  if (!index) return null;

  const isPositive = index.changePercent >= 0;
  const history = index.history || [];

  const minP = Math.min(...history.map((h) => h.price)) * 0.998;
  const maxP = Math.max(...history.map((h) => h.price)) * 1.002;
  const range = maxP - minP || 1;

  const width = 640;
  const height = 220;

  const points = history.map((pt, i) => {
    const x = (i / (history.length - 1 || 1)) * width;
    const y = height - ((pt.price - minP) / range) * (height - 30) - 15;
    return `${x},${y}`;
  });

  const pathD = history.length > 0 ? `M${points.join(' L')}` : '';
  const areaD = history.length > 0 ? `M0,${height} L${points.join(' L')} L${width},${height} Z` : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E0E3EB] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E0E3EB] flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0"
              style={{ backgroundColor: index.badgeBg }}
            >
              {index.badgeNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-[#131722]">{index.name}</span>
                <span className="text-xs font-semibold text-[#787B86] uppercase px-2 py-0.5 rounded bg-[#F0F3FA]">
                  {index.ticker}
                </span>
              </div>
              <div className="text-xs text-[#787B86] font-medium">{index.category} Benchmark</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold tabular-nums text-[#131722]">
                {index.price.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div
                className={`text-xs font-semibold tabular-nums flex items-center justify-end gap-1 ${
                  isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                }`}
              >
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>
                  {isPositive ? `+${index.changeAmount.toFixed(2)}` : index.changeAmount.toFixed(2)} {index.currency}
                </span>
                <span>({isPositive ? `+${index.changePercent.toFixed(2)}%` : `${index.changePercent.toFixed(2)}%`})</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Timeframe pill selector */}
          <div className="flex items-center space-x-1 bg-[#F0F3FA] p-1 rounded-lg text-xs font-semibold w-fit">
            {['1D', '5D', '1M', '1Y', '5Y', 'ALL'].map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTf(tf)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  selectedTf === tf ? 'bg-white text-[#131722] shadow-xs' : 'text-[#787B86]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Interactive Chart */}
          <div className="border border-[#E0E3EB] rounded-2xl p-4 bg-white">
            <div className="relative w-full overflow-hidden">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 select-none">
                <defs>
                  <linearGradient id="indexModalGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor={isPositive ? '#089981' : '#F23645'} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={isPositive ? '#089981' : '#F23645'} stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d={areaD} fill="url(#indexModalGrad)" />
                <path
                  d={pathD}
                  fill="none"
                  stroke={isPositive ? '#089981' : '#F23645'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Key Index Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-[#787B86] block">Day Range</span>
              <span className="font-bold text-[#131722] tabular-nums">
                ${index.low.toLocaleString()} - ${index.high.toLocaleString()}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[#787B86] block">Open</span>
              <span className="font-bold text-[#131722] tabular-nums">${index.open.toLocaleString()}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[#787B86] block">Previous Close</span>
              <span className="font-bold text-[#131722] tabular-nums">${index.prevClose.toLocaleString()}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[#787B86] block">Currency</span>
              <span className="font-bold text-[#131722]">{index.currency}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
