import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, TrendingDown, Clock, ArrowRight } from 'lucide-react';
import { StockItem, MarketIndex } from '../types/market';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: StockItem[];
  indices: MarketIndex[];
  onSelectStock: (stock: StockItem) => void;
  onSelectIndex: (index: MarketIndex) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  stocks,
  indices,
  onSelectStock,
  onSelectIndex,
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Stocks' | 'Crypto' | 'Indices' | 'ETFs'>('All');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.trim().toLowerCase();

  const filteredStocks = stocks.filter((s) => {
    if (activeTab === 'Stocks' && s.category !== 'US stocks' && s.category !== 'World stocks') return false;
    if (activeTab === 'Crypto' && s.category !== 'Crypto') return false;
    if (activeTab === 'ETFs' && s.category !== 'ETFs') return false;
    if (activeTab === 'Indices') return false;

    if (!normalizedQuery) return true;
    return (
      s.ticker.toLowerCase().includes(normalizedQuery) ||
      s.name.toLowerCase().includes(normalizedQuery) ||
      (s.sector && s.sector.toLowerCase().includes(normalizedQuery))
    );
  });

  const filteredIndices =
    activeTab === 'All' || activeTab === 'Indices'
      ? indices.filter((idx) => {
          if (!normalizedQuery) return true;
          return (
            idx.ticker.toLowerCase().includes(normalizedQuery) ||
            idx.name.toLowerCase().includes(normalizedQuery)
          );
        })
      : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E0E3EB] overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input field */}
        <div className="p-4 border-b border-[#E0E3EB] flex items-center space-x-3 bg-white">
          <Search className="w-5 h-5 text-[#787B86] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ticker, company name, or index (e.g. NVDA, Apple, S&P 500)..."
            className="w-full text-base text-[#131722] placeholder-[#787B86] outline-none font-medium bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#787B86] hover:text-[#131722] rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#F0F3FA] text-[#787B86] border border-[#E0E3EB]">
            ESC
          </span>
        </div>

        {/* Category Tabs */}
        <div className="px-4 py-2 border-b border-[#E0E3EB] bg-[#F7F9FC] flex items-center space-x-1 overflow-x-auto hide-scrollbar text-xs font-semibold">
          {(['All', 'Stocks', 'Crypto', 'Indices', 'ETFs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === tab ? 'bg-white text-[#131722] shadow-xs' : 'text-[#787B86] hover:text-[#2962FF]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto divide-y divide-[#E0E3EB] p-2">
          {filteredIndices.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold text-[#787B86] uppercase tracking-wider">
                Indices & Benchmarks
              </div>
              {filteredIndices.map((idx) => {
                const isPos = idx.changePercent >= 0;
                return (
                  <div
                    key={idx.id}
                    onClick={() => {
                      onSelectIndex(idx);
                      onClose();
                    }}
                    className="p-3 hover:bg-[#F7F9FC] rounded-xl flex items-center justify-between cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0"
                        style={{ backgroundColor: idx.badgeBg }}
                      >
                        {idx.badgeNumber}
                      </div>
                      <div>
                        <div className="font-bold text-[#131722] group-hover:text-[#2962FF] transition-colors flex items-center gap-1.5">
                          <span>{idx.name}</span>
                          <span className="text-[10px] font-semibold text-[#787B86] px-1.5 py-0.2 rounded bg-[#F0F3FA]">
                            {idx.ticker}
                          </span>
                        </div>
                        <div className="text-xs text-[#787B86]">{idx.category}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-[#131722] tabular-nums text-sm">
                        {idx.price.toLocaleString()}
                      </div>
                      <div
                        className={`text-xs font-semibold tabular-nums ${
                          isPos ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPos ? `+${idx.changePercent.toFixed(2)}%` : `${idx.changePercent.toFixed(2)}%`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredStocks.length > 0 ? (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold text-[#787B86] uppercase tracking-wider">
                Equities & Assets
              </div>
              {filteredStocks.map((stock) => {
                const isPos = stock.changePercent >= 0;
                return (
                  <div
                    key={stock.ticker}
                    onClick={() => {
                      onSelectStock(stock);
                      onClose();
                    }}
                    className="p-3 hover:bg-[#F7F9FC] rounded-xl flex items-center justify-between cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0"
                        style={{ backgroundColor: stock.logoBg }}
                      >
                        {stock.logoLetter || stock.ticker[0]}
                      </div>
                      <div>
                        <div className="font-bold text-[#131722] group-hover:text-[#2962FF] transition-colors flex items-center gap-1.5">
                          <span>{stock.ticker}</span>
                          <span className="text-[10px] font-semibold text-[#787B86] px-1.5 py-0.2 rounded bg-[#F0F3FA]">
                            {stock.exchange}
                          </span>
                        </div>
                        <div className="text-xs text-[#787B86]">{stock.name}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-[#131722] tabular-nums text-sm">
                        ${stock.price.toFixed(2)}
                      </div>
                      <div
                        className={`text-xs font-semibold tabular-nums ${
                          isPos ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPos ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            filteredIndices.length === 0 && (
              <div className="py-12 text-center text-sm text-[#787B86]">
                No market symbols found matching &quot;{query}&quot;.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
