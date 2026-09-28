import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MarketCategoryFilters } from './components/MarketCategoryFilters';
import { IndicesCardsOverview } from './components/IndicesCardsOverview';
import { TopMoversTable } from './components/TopMoversTable';
import { StockDetailModal } from './components/StockDetailModal';
import { IndexDetailModal } from './components/IndexDetailModal';
import { SearchModal } from './components/SearchModal';
import { ScreenerModal } from './components/ScreenerModal';
import { AccountModal } from './components/AccountModal';
import { Footer } from './components/Footer';
import {
  INITIAL_INDICES,
  WORLD_INDICES,
  CRYPTO_INDICES,
  ALL_STOCKS,
  CRYPTO_STOCKS,
  ETF_STOCKS,
} from './data/marketData';
import { MarketCategory, MarketIndex, MoverTab, StockItem } from './types/market';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('US stocks');
  const [activeNav, setActiveNav] = useState('Markets');
  const [activeTab, setActiveTab] = useState<MoverTab>('Large Cap');
  const [currentRegion, setCurrentRegion] = useState('United States');

  // Market Data state
  const [indices, setIndices] = useState<MarketIndex[]>(INITIAL_INDICES);
  const [stocks, setStocks] = useState<StockItem[]>(ALL_STOCKS);

  // Live tick updates & animation states
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  const [flashingStocks, setFlashingStocks] = useState<Record<string, 'up' | 'down'>>({});
  const [flashingIndices, setFlashingIndices] = useState<Record<string, 'up' | 'down'>>({});

  // Modals
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<MarketIndex | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [screenerOpen, setScreenerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // Watchlist & Portfolio
  const [watchlist, setWatchlist] = useState<string[]>(['NVDA', 'AAPL', 'MSFT']);
  const [virtualBalance, setVirtualBalance] = useState<number>(100000.0);

  // Switch displayed indices & stocks based on active category
  useEffect(() => {
    if (activeCategory === 'World stocks') {
      setIndices(WORLD_INDICES);
      setCurrentRegion('World Markets');
    } else if (activeCategory === 'Crypto') {
      setIndices(CRYPTO_INDICES);
      setCurrentRegion('Crypto Ecosystem');
    } else {
      setIndices(INITIAL_INDICES);
      setCurrentRegion('United States');
    }
  }, [activeCategory]);

  // Live price tick simulation (every 3 seconds subtle price movement)
  useEffect(() => {
    if (!isLiveUpdating) return;

    const interval = setInterval(() => {
      // Pick 1 or 2 random stocks to tick
      const randomStockIndex = Math.floor(Math.random() * stocks.length);
      const targetStock = stocks[randomStockIndex];
      if (!targetStock) return;

      const deltaPercent = (Math.random() - 0.49) * 0.4; // between -0.2% and +0.2%
      const newPrice = +(targetStock.price * (1 + deltaPercent / 100)).toFixed(2);
      const priceDiff = +(newPrice - targetStock.price).toFixed(2);
      const direction = priceDiff >= 0 ? 'up' : 'down';

      setStocks((prev) =>
        prev.map((s, idx) => {
          if (idx !== randomStockIndex) return s;
          const updatedChangeAmount = +(s.changeAmount + priceDiff).toFixed(2);
          const updatedChangePercent = +(s.changePercent + deltaPercent).toFixed(2);
          return {
            ...s,
            price: newPrice,
            changeAmount: updatedChangeAmount,
            changePercent: updatedChangePercent,
            dayHigh: Math.max(s.dayHigh, newPrice),
            dayLow: Math.min(s.dayLow, newPrice),
          };
        })
      );

      // Flash highlight
      setFlashingStocks((prev) => ({ ...prev, [targetStock.ticker]: direction }));
      setTimeout(() => {
        setFlashingStocks((prev) => {
          const next = { ...prev };
          delete next[targetStock.ticker];
          return next;
        });
      }, 1000);

      // Also occasionally tick an index
      if (Math.random() > 0.4) {
        const randIdx = Math.floor(Math.random() * indices.length);
        const targetIdx = indices[randIdx];
        if (targetIdx) {
          const idxDelta = (Math.random() - 0.49) * 0.15;
          const newIdxPrice = +(targetIdx.price * (1 + idxDelta / 100)).toFixed(2);
          const idxDiff = +(newIdxPrice - targetIdx.price).toFixed(2);
          const idxDir = idxDiff >= 0 ? 'up' : 'down';

          setIndices((prev) =>
            prev.map((idx, i) => {
              if (i !== randIdx) return idx;
              return {
                ...idx,
                price: newIdxPrice,
                changeAmount: +(idx.changeAmount + idxDiff).toFixed(2),
                changePercent: +(idx.changePercent + idxDelta).toFixed(2),
              };
            })
          );

          setFlashingIndices((prev) => ({ ...prev, [targetIdx.id]: idxDir }));
          setTimeout(() => {
            setFlashingIndices((prev) => {
              const next = { ...prev };
              delete next[targetIdx.id];
              return next;
            });
          }, 1000);
        }
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveUpdating, stocks, indices]);

  // Keyboard shortcut listener for Ctrl+K / ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleWatchlist = useCallback((ticker: string) => {
    setWatchlist((prev) =>
      prev.includes(ticker) ? prev.filter((t) => t !== ticker) : [...prev, ticker]
    );
  }, []);

  const handleSimulateTrade = (
    ticker: string,
    side: 'BUY' | 'SELL',
    shares: number,
    price: number
  ) => {
    const totalCost = shares * price;
    setVirtualBalance((prev) => (side === 'BUY' ? prev - totalCost : prev + totalCost));
  };

  // Combine stocks for search & screener
  const combinedSearchStocks = [...ALL_STOCKS, ...CRYPTO_STOCKS, ...ETF_STOCKS];
  const combinedSearchIndices = [...INITIAL_INDICES, ...WORLD_INDICES, ...CRYPTO_INDICES];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-blue-100 text-[#131722]">
      {/* Main Header */}
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
        isLiveUpdating={isLiveUpdating}
        onToggleLive={() => setIsLiveUpdating((prev) => !prev)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      {/* Main Content Area */}
      {activeNav !== 'Markets' ? (
        <main className="max-w-[1440px] mx-auto px-4 lg:px-6 py-12 flex-grow w-full">
          <div className="border border-[#E0E3EB] rounded-2xl p-8 text-center max-w-xl mx-auto space-y-4 bg-white shadow-xs">
            <h2 className="text-2xl font-bold text-[#131722]">{activeNav} Workspace</h2>
            <p className="text-sm text-[#787B86]">
              Explore integrated charting tools, real-time news streams, social trading communities, and broker connectors.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveNav('Markets')}
                className="bg-[#2962FF] hover:bg-[#1E53E5] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors"
              >
                Return to Markets Overview
              </button>
            </div>
          </div>
        </main>
      ) : (
        <main className="max-w-[1440px] mx-auto px-4 lg:px-6 w-full flex-grow flex flex-col" data-purpose="market-overview-content">
          {/* Hero Title Section */}
          <HeroSection
            currentRegion={currentRegion}
            onSelectRegion={setCurrentRegion}
            onSelectCategory={setActiveCategory}
          />

          {/* Market Category Filter Pills */}
          <MarketCategoryFilters
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onIndicesClick={() => setActiveCategory('US stocks')}
          />

          {/* 4 Overview Index Cards */}
          <div className="mb-10">
            <IndicesCardsOverview
              indices={indices}
              onSelectIndex={(idx) => setSelectedIndex(idx)}
              flashingIndices={flashingIndices}
            />
          </div>

          {/* Top Movers & Active Stocks Table */}
          <TopMoversTable
            stocks={
              activeCategory === 'Crypto'
                ? CRYPTO_STOCKS
                : activeCategory === 'ETFs'
                ? ETF_STOCKS
                : stocks
            }
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onSelectStock={(stk) => setSelectedStock(stk)}
            onOpenScreener={() => setScreenerOpen(true)}
            flashingStocks={flashingStocks}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
          />
        </main>
      )}

      {/* Footer */}
      <Footer />

      {/* Stock Detail Modal / Drawer */}
      {selectedStock && (
        <StockDetailModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          isWatched={watchlist.includes(selectedStock.ticker)}
          onToggleWatchlist={handleToggleWatchlist}
          onSimulateTrade={handleSimulateTrade}
        />
      )}

      {/* Index Detail Modal */}
      {selectedIndex && (
        <IndexDetailModal
          index={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}

      {/* Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        stocks={combinedSearchStocks}
        indices={combinedSearchIndices}
        onSelectStock={(stk) => {
          setSelectedStock(stk);
          setSearchOpen(false);
        }}
        onSelectIndex={(idx) => {
          setSelectedIndex(idx);
          setSearchOpen(false);
        }}
      />

      {/* Stock Screener Full Modal */}
      <ScreenerModal
        isOpen={screenerOpen}
        onClose={() => setScreenerOpen(false)}
        stocks={combinedSearchStocks}
        onSelectStock={(stk) => {
          setSelectedStock(stk);
          setScreenerOpen(false);
        }}
      />

      {/* Account & Profile Modal */}
      <AccountModal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
        virtualBalance={virtualBalance}
        onResetBalance={() => setVirtualBalance(100000.0)}
      />
    </div>
  );
}
