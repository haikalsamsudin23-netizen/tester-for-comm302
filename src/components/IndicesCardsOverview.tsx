import React from 'react';
import { MarketIndex } from '../types/market';

interface IndicesCardsOverviewProps {
  indices: MarketIndex[];
  onSelectIndex: (index: MarketIndex) => void;
  flashingIndices: Record<string, 'up' | 'down'>;
}

export const IndicesCardsOverview: React.FC<IndicesCardsOverviewProps> = ({
  indices,
  onSelectIndex,
  flashingIndices,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-purpose="indices-cards-grid">
      {indices.slice(0, 4).map((idx, i) => {
        const isPositive = idx.changePercent >= 0;
        const flash = flashingIndices[idx.id];

        return (
          <div
            key={idx.id}
            onClick={() => onSelectIndex(idx)}
            className={`bg-white border border-[#E0E3EB] hover:border-[#b2b5be] rounded-2xl p-4 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
              flash === 'up' ? 'ring-1 ring-[#089981]/50 bg-emerald-50/20' : flash === 'down' ? 'ring-1 ring-[#F23645]/50 bg-rose-50/20' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                {/* Badge Number */}
                <div
                  className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs tracking-tighter shadow-xs shrink-0"
                  style={{ backgroundColor: idx.badgeBg }}
                >
                  {idx.badgeNumber}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#131722] group-hover:text-[#2962FF] transition-colors leading-tight">
                    {idx.name}
                  </h2>
                  <span className="text-xs text-[#787B86] uppercase font-medium">
                    {idx.ticker}
                  </span>
                </div>
              </div>

              {/* % Change Badge */}
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded transition-colors tabular-nums ${
                  isPositive
                    ? 'bg-[#E8F6F3] text-[#089981]'
                    : 'bg-[#FDECEE] text-[#F23645]'
                }`}
              >
                {isPositive ? `+${idx.changePercent.toFixed(2)}%` : `${idx.changePercent.toFixed(2)}%`}
              </span>
            </div>

            <div className="flex items-end justify-between mt-1">
              <div>
                <div className="text-xl font-bold tabular-nums text-[#131722] tracking-tight">
                  {idx.price.toLocaleString('en-US', {
                    minimumFractionDigits: idx.price < 10 ? 3 : 2,
                    maximumFractionDigits: idx.price < 10 ? 3 : 2,
                  })}
                </div>
                <div
                  className={`text-xs font-semibold tabular-nums ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {isPositive ? `+${idx.changeAmount.toFixed(2)}` : idx.changeAmount.toFixed(2)}{' '}
                  {idx.currency}
                </div>
              </div>

              {/* Sparkline SVG */}
              {isPositive ? (
                <svg className="w-24 h-10 text-[#089981] overflow-visible shrink-0" viewBox="0 0 100 40">
                  <defs>
                    <linearGradient id={`grad-green-${idx.id}`} x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#089981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#089981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {i === 1 ? (
                    <>
                      <path d="M0,35 Q20,38 35,26 T70,12 T85,15 T100,2 L100,40 L0,40 Z" fill={`url(#grad-green-${idx.id})`} />
                      <path d="M0,35 Q20,38 35,26 T70,12 T85,15 T100,2" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                    </>
                  ) : i === 3 ? (
                    <>
                      <path d="M0,30 Q25,25 45,35 T75,10 T100,4 L100,40 L0,40 Z" fill={`url(#grad-green-${idx.id})`} />
                      <path d="M0,30 Q25,25 45,35 T75,10 T100,4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                    </>
                  ) : (
                    <>
                      <path d="M0,32 Q15,28 30,30 T60,18 T85,10 T100,5 L100,40 L0,40 Z" fill={`url(#grad-green-${idx.id})`} />
                      <path d="M0,32 Q15,28 30,30 T60,18 T85,10 T100,5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                    </>
                  )}
                </svg>
              ) : (
                <svg className="w-24 h-10 text-[#F23645] overflow-visible shrink-0" viewBox="0 0 100 40">
                  <defs>
                    <linearGradient id={`grad-red-${idx.id}`} x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#F23645" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#F23645" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,8 Q20,12 40,10 T70,26 T85,22 T100,34 L100,40 L0,40 Z" fill={`url(#grad-red-${idx.id})`} />
                  <path d="M0,8 Q20,12 40,10 T70,26 T85,22 T100,34" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                </svg>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
