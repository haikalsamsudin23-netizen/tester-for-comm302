import React, { useState } from 'react';
import { ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Star } from 'lucide-react';
import { MoverTab, StockItem, TechnicalRating } from '../types/market';

interface TopMoversTableProps {
  stocks: StockItem[];
  activeTab: MoverTab;
  onTabChange: (tab: MoverTab) => void;
  onSelectStock: (stock: StockItem) => void;
  onOpenScreener: () => void;
  flashingStocks: Record<string, 'up' | 'down'>;
  watchlist: string[];
  onToggleWatchlist: (ticker: string) => void;
}

type SortField = 'price' | 'changePercent' | 'changeAmount' | 'volume' | 'marketCap';

export const TopMoversTable: React.FC<TopMoversTableProps> = ({
  stocks,
  activeTab,
  onTabChange,
  onSelectStock,
  onOpenScreener,
  flashingStocks,
  watchlist,
  onToggleWatchlist,
}) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortAsc, setSortAsc] = useState(false);

  const tabs: MoverTab[] = ['Large Cap', 'Gainers', 'Losers', 'Most Active'];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (!sortAsc) {
        setSortAsc(true);
      } else {
        setSortField(null);
        setSortAsc(false);
      }
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Filter stocks according to tab
  let displayStocks = [...stocks];
  if (activeTab === 'Gainers') {
    displayStocks = displayStocks.filter((s) => s.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent);
  } else if (activeTab === 'Losers') {
    displayStocks = displayStocks.filter((s) => s.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent);
  } else if (activeTab === 'Most Active') {
    displayStocks = displayStocks.sort((a, b) => b.volumeRaw - a.volumeRaw);
  }

  // Then apply custom column sorting if user clicked a column header
  if (sortField) {
    displayStocks.sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortField === 'price') {
        valA = a.price;
        valB = b.price;
      } else if (sortField === 'changePercent') {
        valA = a.changePercent;
        valB = b.changePercent;
      } else if (sortField === 'changeAmount') {
        valA = a.changeAmount;
        valB = b.changeAmount;
      } else if (sortField === 'volume') {
        valA = a.volumeRaw;
        valB = b.volumeRaw;
      } else if (sortField === 'marketCap') {
        valA = a.marketCapRaw;
        valB = b.marketCapRaw;
      }
      return sortAsc ? valA - valB : valB - valA;
    });
  }

  const renderRatingBadge = (rating: TechnicalRating) => {
    switch (rating) {
      case 'Strong Buy':
      case 'Buy':
        return (
          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E8F6F3] text-[#089981]">
            {rating}
          </span>
        );
      case 'Neutral':
        return (
          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F0F3FA] text-[#787B86]">
            {rating}
          </span>
        );
      case 'Sell':
      case 'Strong Sell':
        return (
          <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FDECEE] text-[#F23645]">
            {rating}
          </span>
        );
    }
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 opacity-40 group-hover/col:opacity-100 transition-opacity" />;
    }
    return sortAsc ? (
      <ArrowUp className="w-3.5 h-3.5 text-[#2962FF]" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-[#2962FF]" />
    );
  };

  return (
    <section
      className="border border-[#E0E3EB] rounded-2xl bg-white overflow-hidden shadow-xs mb-12"
      data-purpose="active-movers-table"
    >
      {/* Table Header Bar & Tabs */}
      <div className="border-b border-[#E0E3EB] p-4 md:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#131722]">Top Movers & Active Stocks</h3>
          <p className="text-xs text-[#787B86] mt-0.5">Real-time quotes and performance analysis</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-1 bg-[#F0F3FA] p-1 rounded-lg text-xs font-semibold">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                type="button"
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#131722] shadow-xs font-bold'
                    : 'text-[#787B86] hover:text-[#2962FF]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" id="markets-stocks-table">
          <thead>
            <tr className="text-xs font-semibold text-[#787B86] uppercase tracking-wider border-b border-[#E0E3EB] bg-[#F7F9FC]">
              <th className="py-3.5 px-6" scope="col">
                Ticker & Name
              </th>
              <th
                onClick={() => handleSort('price')}
                className="py-3.5 px-4 text-right cursor-pointer group/col select-none"
                scope="col"
              >
                <div className="inline-flex items-center gap-1.5 justify-end">
                  <span>Price</span>
                  {renderSortIndicator('price')}
                </div>
              </th>
              <th
                onClick={() => handleSort('changePercent')}
                className="py-3.5 px-4 text-right cursor-pointer group/col select-none"
                scope="col"
              >
                <div className="inline-flex items-center gap-1.5 justify-end">
                  <span>Change %</span>
                  {renderSortIndicator('changePercent')}
                </div>
              </th>
              <th
                onClick={() => handleSort('changeAmount')}
                className="py-3.5 px-4 text-right cursor-pointer group/col select-none"
                scope="col"
              >
                <div className="inline-flex items-center gap-1.5 justify-end">
                  <span>Change $</span>
                  {renderSortIndicator('changeAmount')}
                </div>
              </th>
              <th
                onClick={() => handleSort('volume')}
                className="py-3.5 px-4 text-right cursor-pointer group/col select-none"
                scope="col"
              >
                <div className="inline-flex items-center gap-1.5 justify-end">
                  <span>Volume</span>
                  {renderSortIndicator('volume')}
                </div>
              </th>
              <th
                onClick={() => handleSort('marketCap')}
                className="py-3.5 px-4 text-right cursor-pointer group/col select-none"
                scope="col"
              >
                <div className="inline-flex items-center gap-1.5 justify-end">
                  <span>Market Cap</span>
                  {renderSortIndicator('marketCap')}
                </div>
              </th>
              <th className="py-3.5 px-6 text-center" scope="col">
                Technical Rating
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0E3EB] text-sm font-medium">
            {displayStocks.map((stock) => {
              const isPositive = stock.changePercent >= 0;
              const flash = flashingStocks[stock.ticker];
              const isWatched = watchlist.includes(stock.ticker);

              return (
                <tr
                  key={stock.ticker}
                  onClick={() => onSelectStock(stock)}
                  className={`hover:bg-[#F7F9FC] transition-colors cursor-pointer group ${
                    flash === 'up'
                      ? 'bg-emerald-50/40'
                      : flash === 'down'
                      ? 'bg-rose-50/40'
                      : ''
                  }`}
                >
                  {/* Ticker & Name */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      {/* Watchlist star */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(stock.ticker);
                        }}
                        title={isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#787B86] hover:text-amber-500 focus:outline-none"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            isWatched ? 'fill-amber-400 text-amber-400 opacity-100' : ''
                          }`}
                        />
                      </button>

                      {/* Logo badge */}
                      <div
                        className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs"
                        style={{ backgroundColor: stock.logoBg }}
                      >
                        {stock.logoSvg === 'apple' ? (
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.6-.73 1.01-1.75.9-2.77-.87.04-1.92.58-2.54 1.31-.55.64-.99 1.66-.86 2.65.98.08 1.92-.51 2.5-1.19z" />
                          </svg>
                        ) : (
                          stock.logoLetter
                        )}
                      </div>

                      <div>
                        <div className="font-bold text-[#131722] group-hover:text-[#2962FF] transition-colors flex items-center gap-1.5">
                          <span>{stock.ticker}</span>
                          <span className="text-[10px] font-semibold text-[#787B86] px-1.5 py-0.5 rounded bg-[#F0F3FA]">
                            {stock.exchange}
                          </span>
                        </div>
                        <div className="text-xs text-[#787B86] truncate max-w-[180px] sm:max-w-none">
                          {stock.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4 text-right tabular-nums font-bold text-[#131722]">
                    ${stock.price.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>

                  {/* Change % */}
                  <td
                    className={`py-4 px-4 text-right tabular-nums font-bold ${
                      isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {isPositive ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
                  </td>

                  {/* Change $ */}
                  <td
                    className={`py-4 px-4 text-right tabular-nums font-medium ${
                      isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {isPositive ? `+$${stock.changeAmount.toFixed(2)}` : `-$${Math.abs(stock.changeAmount).toFixed(2)}`}
                  </td>

                  {/* Volume */}
                  <td className="py-4 px-4 text-right tabular-nums text-[#787B86]">
                    {stock.volume}
                  </td>

                  {/* Market Cap */}
                  <td className="py-4 px-4 text-right tabular-nums text-[#131722] font-semibold">
                    {stock.marketCap}
                  </td>

                  {/* Technical Rating */}
                  <td className="py-4 px-6 text-center">
                    {renderRatingBadge(stock.technicalRating)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer with More Link */}
      <div className="border-t border-[#E0E3EB] p-4 text-center bg-white hover:bg-[#F7F9FC] transition-colors">
        <button
          onClick={onOpenScreener}
          type="button"
          className="text-xs font-semibold text-[#2962FF] hover:text-[#1E53E5] inline-flex items-center space-x-1 cursor-pointer focus:outline-none"
        >
          <span>Explore all 500+ US Stocks in Screener</span>
          <ChevronRight className="w-3.5 h-3.5 stroke-[2]" />
        </button>
      </div>
    </section>
  );
};
