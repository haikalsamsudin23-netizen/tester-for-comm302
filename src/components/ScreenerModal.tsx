import React, { useState } from 'react';
import { X, Search, Filter, Download, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { StockItem, TechnicalRating } from '../types/market';

interface ScreenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: StockItem[];
  onSelectStock: (stock: StockItem) => void;
}

export const ScreenerModal: React.FC<ScreenerModalProps> = ({
  isOpen,
  onClose,
  stocks,
  onSelectStock,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [sortField, setSortField] = useState<string>('marketCap');
  const [sortAsc, setSortAsc] = useState(false);

  if (!isOpen) return null;

  const sectors = ['All', 'Semiconductors', 'Software Infrastructure', 'Consumer Electronics', 'Auto Manufacturers', 'Internet Retail', 'Interactive Media', 'Enterprise Software', 'Financial Technology'];
  const ratings = ['All', 'Strong Buy', 'Buy', 'Neutral', 'Sell', 'Strong Sell'];

  let filtered = stocks.filter((s) => {
    if (selectedSector !== 'All' && s.sector !== selectedSector) return false;
    if (selectedRating !== 'All' && s.technicalRating !== selectedRating) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
    }
    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    let valA = 0;
    let valB = 0;
    if (sortField === 'price') {
      valA = a.price;
      valB = b.price;
    } else if (sortField === 'changePercent') {
      valA = a.changePercent;
      valB = b.changePercent;
    } else if (sortField === 'volume') {
      valA = a.volumeRaw;
      valB = b.volumeRaw;
    } else if (sortField === 'marketCap') {
      valA = a.marketCapRaw;
      valB = b.marketCapRaw;
    }
    return sortAsc ? valA - valB : valB - valA;
  });

  const handleExportCSV = () => {
    const headers = ['Ticker', 'Name', 'Price', 'ChangePercent', 'Volume', 'MarketCap', 'Rating', 'Sector'];
    const rows = filtered.map((s) => [
      s.ticker,
      `"${s.name}"`,
      s.price,
      s.changePercent,
      s.volume,
      s.marketCap,
      s.technicalRating,
      `"${s.sector || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'tradingview_screener_stocks.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-[#E0E3EB] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E0E3EB] flex items-center justify-between bg-white shrink-0">
          <div>
            <h3 className="text-xl font-bold text-[#131722]">US Stock Screener</h3>
            <p className="text-xs text-[#787B86]">Filter & sort across all active US equities with technical metrics</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#E0E3EB] hover:bg-[#F0F3FA] text-[#131722] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#787B86] hover:text-[#131722] hover:bg-[#F0F3FA] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="p-4 border-b border-[#E0E3EB] bg-[#F7F9FC] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-48 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#787B86]" />
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E0E3EB] bg-white outline-none focus:border-[#2962FF]"
              />
            </div>

            {/* Sector Select */}
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-[#787B86] font-medium">Sector:</span>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="text-xs bg-white border border-[#E0E3EB] rounded-lg px-2.5 py-1.5 outline-none font-medium text-[#131722]"
              >
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Select */}
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-[#787B86] font-medium">Rating:</span>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="text-xs bg-white border border-[#E0E3EB] rounded-lg px-2.5 py-1.5 outline-none font-medium text-[#131722]"
              >
                {ratings.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs font-semibold text-[#787B86]">
            Showing <span className="text-[#131722]">{filtered.length}</span> results
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-y-auto flex-grow">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#F7F9FC] border-b border-[#E0E3EB] text-xs font-semibold text-[#787B86] uppercase tracking-wider z-10">
              <tr>
                <th className="py-3 px-6">Ticker & Name</th>
                <th
                  className="py-3 px-4 text-right cursor-pointer select-none"
                  onClick={() => {
                    if (sortField === 'price') setSortAsc(!sortAsc);
                    else {
                      setSortField('price');
                      setSortAsc(false);
                    }
                  }}
                >
                  Price
                </th>
                <th
                  className="py-3 px-4 text-right cursor-pointer select-none"
                  onClick={() => {
                    if (sortField === 'changePercent') setSortAsc(!sortAsc);
                    else {
                      setSortField('changePercent');
                      setSortAsc(false);
                    }
                  }}
                >
                  Change %
                </th>
                <th
                  className="py-3 px-4 text-right cursor-pointer select-none"
                  onClick={() => {
                    if (sortField === 'volume') setSortAsc(!sortAsc);
                    else {
                      setSortField('volume');
                      setSortAsc(false);
                    }
                  }}
                >
                  Volume
                </th>
                <th
                  className="py-3 px-4 text-right cursor-pointer select-none"
                  onClick={() => {
                    if (sortField === 'marketCap') setSortAsc(!sortAsc);
                    else {
                      setSortField('marketCap');
                      setSortAsc(false);
                    }
                  }}
                >
                  Market Cap
                </th>
                <th className="py-3 px-4 text-center">Technical Rating</th>
                <th className="py-3 px-6 text-left">Sector</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E3EB] text-xs font-medium">
              {filtered.map((stock) => {
                const isPos = stock.changePercent >= 0;
                return (
                  <tr
                    key={stock.ticker}
                    onClick={() => {
                      onSelectStock(stock);
                      onClose();
                    }}
                    className="hover:bg-[#F7F9FC] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-6">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0"
                          style={{ backgroundColor: stock.logoBg }}
                        >
                          {stock.logoLetter || stock.ticker[0]}
                        </div>
                        <div>
                          <div className="font-bold text-[#131722] group-hover:text-[#2962FF] transition-colors">
                            {stock.ticker}
                          </div>
                          <div className="text-[11px] text-[#787B86] truncate max-w-[140px] sm:max-w-none">
                            {stock.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#131722] tabular-nums">
                      ${stock.price.toFixed(2)}
                    </td>
                    <td
                      className={`py-3.5 px-4 text-right font-bold tabular-nums ${
                        isPos ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isPos ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#787B86] tabular-nums">
                      {stock.volume}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-[#131722] tabular-nums">
                      {stock.marketCap}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          stock.technicalRating.includes('Buy')
                            ? 'bg-[#E8F6F3] text-[#089981]'
                            : stock.technicalRating.includes('Sell')
                            ? 'bg-[#FDECEE] text-[#F23645]'
                            : 'bg-[#F0F3FA] text-[#787B86]'
                        }`}
                      >
                        {stock.technicalRating}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-left text-[#787B86]">
                      {stock.sector || 'General'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
