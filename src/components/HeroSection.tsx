import React, { useState } from 'react';
import { ChevronDown, Check, TrendingUp, Clock, Globe } from 'lucide-react';
import { MarketCategory } from '../types/market';

interface HeroSectionProps {
  currentRegion: string;
  onSelectRegion: (region: string) => void;
  onSelectCategory: (category: MarketCategory) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentRegion,
  onSelectRegion,
  onSelectCategory,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const marketRegions = [
    { name: 'United States', category: 'US stocks' as MarketCategory, desc: 'S&P 500, Nasdaq, Dow Jones & US Equities' },
    { name: 'World Markets', category: 'World stocks' as MarketCategory, desc: 'Nikkei, FTSE, DAX, CAC 40 & Global Indices' },
    { name: 'Crypto Ecosystem', category: 'Crypto' as MarketCategory, desc: 'Bitcoin, Ethereum, Altcoins & DeFi tokens' },
    { name: 'Futures & Commodities', category: 'Futures' as MarketCategory, desc: 'Gold, Crude Oil, Natural Gas & Ags' },
    { name: 'Currencies & Rates', category: 'Forex' as MarketCategory, desc: 'EUR/USD, USD/JPY, Yields & Macro' },
  ];

  return (
    <section className="pt-10 pb-6 text-center relative" data-purpose="hero-title">
      <div className="relative inline-block">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          type="button"
          aria-expanded={dropdownOpen}
          className="inline-flex items-center space-x-3 cursor-pointer group focus:outline-none"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#131722] hover:text-[#2962FF] transition-colors">
            Markets, everywhere
          </h1>
          {/* Dropdown Chevron Icon */}
          <div className="mt-1 p-1 rounded-full text-[#131722] group-hover:bg-[#F0F3FA] transition-colors">
            <ChevronDown
              className={`w-6 h-6 stroke-[3] transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </button>

        {/* Market Region Selector Dropdown */}
        {dropdownOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#E0E3EB] py-2 z-30 text-left animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-4 py-2 text-xs font-bold text-[#787B86] uppercase tracking-wider border-b border-[#E0E3EB]">
              Select Market View
            </div>
            {marketRegions.map((region) => {
              const isSelected = currentRegion === region.name;
              return (
                <button
                  key={region.name}
                  onClick={() => {
                    onSelectRegion(region.name);
                    onSelectCategory(region.category);
                    setDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left flex items-start justify-between hover:bg-[#F7F9FC] transition-colors ${
                    isSelected ? 'bg-[#F0F3FA]' : ''
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold text-[#131722] flex items-center gap-1.5">
                      {region.name}
                      {isSelected && (
                        <span className="text-[10px] bg-[#2962FF] text-white px-1.5 py-0.2 rounded font-semibold">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#787B86] mt-0.5">{region.desc}</div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#2962FF] mt-0.5" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Subtle Market Status ticker */}
      <div className="mt-2 flex items-center justify-center gap-2 text-xs text-[#787B86]">
        <span className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#089981]"></span>
          <span className="font-semibold text-[#131722]">US Markets Open</span>
        </span>
        <span>·</span>
        <span>Trading Hours: 09:30 - 16:00 EDT</span>
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline">Delayed by 15 mins</span>
      </div>
    </section>
  );
};
