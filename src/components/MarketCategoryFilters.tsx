import React from 'react';
import { ChevronRight } from 'lucide-react';
import { MarketCategory } from '../types/market';

interface MarketCategoryFiltersProps {
  activeCategory: MarketCategory;
  onSelectCategory: (cat: MarketCategory) => void;
  onIndicesClick: () => void;
}

const CATEGORIES: MarketCategory[] = [
  'US stocks',
  'World stocks',
  'Crypto',
  'Futures',
  'Forex',
  'Government bonds',
  'Corporate bonds',
  'ETFs',
  'Economy',
];

export const MarketCategoryFilters: React.FC<MarketCategoryFiltersProps> = ({
  activeCategory,
  onSelectCategory,
  onIndicesClick,
}) => {
  return (
    <section className="max-w-[1440px] mx-auto px-4 lg:px-6 mb-8 w-full" data-purpose="market-categories">
      <div className="flex items-center space-x-6 overflow-x-auto hide-scrollbar py-2">
        {/* Section Label Link with Arrow */}
        <button
          onClick={onIndicesClick}
          type="button"
          className="inline-flex items-center space-x-1 text-2xl font-bold text-[#131722] hover:text-[#2962FF] transition-colors flex-shrink-0 cursor-pointer focus:outline-none"
        >
          <span>Indices</span>
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Pill Container */}
        <div className="flex items-center space-x-1 border border-[#E0E3EB] rounded-full p-1 bg-white shadow-sm flex-shrink-0">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                type="button"
                className={`text-xs md:text-sm whitespace-nowrap transition-colors rounded-full cursor-pointer focus:outline-none ${
                  isActive
                    ? 'bg-[#131722] text-white font-semibold px-4 py-1.5 shadow-sm'
                    : 'hover:bg-[#F0F3FA] text-[#131722] font-medium px-3.5 py-1.5'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
