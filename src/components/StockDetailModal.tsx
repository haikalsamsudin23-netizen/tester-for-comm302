import React, { useState } from 'react';
import { X, Star, TrendingUp, TrendingDown, BarChart2, DollarSign, Activity, Info, Check } from 'lucide-react';
import { StockItem, TechnicalRating } from '../types/market';

interface StockDetailModalProps {
  stock: StockItem | null;
  onClose: () => void;
  isWatched: boolean;
  onToggleWatchlist: (ticker: string) => void;
  onSimulateTrade?: (ticker: string, side: 'BUY' | 'SELL', shares: number, price: number) => void;
}

type Timeframe = '1D' | '5D' | '1M' | '6M' | '1Y' | '5Y' | 'ALL';
type ChartStyle = 'area' | 'candle';

export const StockDetailModal: React.FC<StockDetailModalProps> = ({
  stock,
  onClose,
  isWatched,
  onToggleWatchlist,
  onSimulateTrade,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('candle');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [tradeShares, setTradeShares] = useState<number>(10);
  const [tradeSuccessMsg, setTradeSuccessMsg] = useState<string | null>(null);

  if (!stock) return null;

  const isPositive = stock.changePercent >= 0;
  const candles = stock.candles || [];
  const currentHoverCandle = hoverIndex !== null ? candles[hoverIndex] : null;

  // Compute min and max for chart bounds
  const minPrice = Math.min(...candles.map((c) => c.low));
  const maxPrice = Math.max(...candles.map((c) => c.high));
  const priceRange = maxPrice - minPrice || 1;

  const maxVolume = Math.max(...candles.map((c) => c.volume));

  const chartWidth = 720;
  const chartHeight = 240;
  const volumeHeight = 60;

  // Generate SVG path for area chart
  const points = candles.map((c, i) => {
    const x = (i / (candles.length - 1 || 1)) * chartWidth;
    const y = chartHeight - ((c.close - minPrice) / priceRange) * (chartHeight - 20) - 10;
    return `${x},${y}`;
  });

  const areaD = candles.length > 0
    ? `M0,${chartHeight} L${points.join(' L')} L${chartWidth},${chartHeight} Z`
    : '';
  const lineD = candles.length > 0 ? `M${points.join(' L')}` : '';

  const handleTrade = (side: 'BUY' | 'SELL') => {
    if (onSimulateTrade) {
      onSimulateTrade(stock.ticker, side, tradeShares, stock.price);
    }
    setTradeSuccessMsg(
      `Executed simulated ${side} for ${tradeShares} shares of ${stock.ticker} at $${stock.price.toFixed(2)}!`
    );
    setTimeout(() => setTradeSuccessMsg(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-[#E0E3EB] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-[#E0E3EB] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center space-x-3.5">
            <div
              className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0"
              style={{ backgroundColor: stock.logoBg }}
            >
              {stock.logoSvg === 'apple' ? (
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.6-.73 1.01-1.75.9-2.77-.87.04-1.92.58-2.54 1.31-.55.64-.99 1.66-.86 2.65.98.08 1.92-.51 2.5-1.19z" />
                </svg>
              ) : (
                stock.logoLetter
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-[#131722]">{stock.ticker}</span>
                <span className="text-xs font-semibold text-[#787B86] px-2 py-0.5 rounded bg-[#F0F3FA]">
                  {stock.exchange}
                </span>
                <button
                  onClick={() => onToggleWatchlist(stock.ticker)}
                  title={isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  className="p-1 text-[#787B86] hover:text-amber-500 transition-colors"
                >
                  <Star className={`w-4 h-4 ${isWatched ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
              </div>
              <div className="text-xs text-[#787B86] font-medium">{stock.name}</div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-2xl font-bold tabular-nums text-[#131722]">
                ${stock.price.toFixed(2)}
              </div>
              <div
                className={`text-xs font-semibold tabular-nums flex items-center justify-end gap-1 ${
                  isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                }`}
              >
                {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>
                  {isPositive ? `+$${stock.changeAmount.toFixed(2)}` : `-$${Math.abs(stock.changeAmount).toFixed(2)}`}
                </span>
                <span>({isPositive ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`})</span>
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

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Chart Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Timeframe buttons */}
            <div className="flex items-center space-x-1 bg-[#F0F3FA] p-1 rounded-lg text-xs font-semibold">
              {(['1D', '5D', '1M', '6M', '1Y', '5Y', 'ALL'] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    timeframe === tf
                      ? 'bg-white text-[#131722] shadow-xs font-bold'
                      : 'text-[#787B86] hover:text-[#2962FF]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Chart Style Toggle */}
            <div className="flex items-center space-x-1 bg-[#F0F3FA] p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setChartStyle('candle')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1 ${
                  chartStyle === 'candle' ? 'bg-white text-[#131722] shadow-xs' : 'text-[#787B86]'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Candles</span>
              </button>
              <button
                onClick={() => setChartStyle('area')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1 ${
                  chartStyle === 'area' ? 'bg-white text-[#131722] shadow-xs' : 'text-[#787B86]'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Line / Area</span>
              </button>
            </div>
          </div>

          {/* Interactive Chart Canvas */}
          <div className="border border-[#E0E3EB] rounded-2xl p-4 bg-white relative">
            {/* Hover details badge */}
            <div className="h-6 flex items-center space-x-4 text-xs font-semibold tabular-nums text-[#787B86] mb-2">
              {currentHoverCandle ? (
                <>
                  <span className="text-[#131722] font-bold">Time: {currentHoverCandle.time}</span>
                  <span>O: ${currentHoverCandle.open.toFixed(2)}</span>
                  <span>H: ${currentHoverCandle.high.toFixed(2)}</span>
                  <span>L: ${currentHoverCandle.low.toFixed(2)}</span>
                  <span className={currentHoverCandle.close >= currentHoverCandle.open ? 'text-[#089981]' : 'text-[#F23645]'}>
                    C: ${currentHoverCandle.close.toFixed(2)}
                  </span>
                  <span>Vol: {(currentHoverCandle.volume / 1000000).toFixed(2)}M</span>
                </>
              ) : (
                <span className="text-[#787B86]">Hover over chart to inspect candle values and volume</span>
              )}
            </div>

            {/* SVG Chart */}
            <div className="relative w-full overflow-hidden select-none">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight + volumeHeight}`}
                className="w-full h-64 sm:h-72"
                onMouseLeave={() => setHoverIndex(null)}
              >
                <defs>
                  <linearGradient id="detailGradGreen" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#089981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#089981" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="detailGradRed" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#F23645" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#F23645" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grid lines */}
                {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
                  const y = chartHeight * ratio;
                  const priceAtY = maxPrice - ratio * priceRange;
                  return (
                    <g key={ratio}>
                      <line
                        x1="0"
                        y1={y}
                        x2={chartWidth}
                        y2={y}
                        stroke="#E0E3EB"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                      <text
                        x={chartWidth - 4}
                        y={y - 4}
                        textAnchor="end"
                        fontSize="9"
                        fill="#787B86"
                        className="tabular-nums"
                      >
                        ${priceAtY.toFixed(2)}
                      </text>
                    </g>
                  );
                })}

                {/* Main chart rendering */}
                {chartStyle === 'area' ? (
                  <>
                    <path
                      d={areaD}
                      fill={isPositive ? 'url(#detailGradGreen)' : 'url(#detailGradRed)'}
                    />
                    <path
                      d={lineD}
                      fill="none"
                      stroke={isPositive ? '#089981' : '#F23645'}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </>
                ) : (
                  /* Candlestick bars */
                  candles.map((candle, idx) => {
                    const x = (idx / (candles.length - 1 || 1)) * (chartWidth - 40) + 20;
                    const candleIsGreen = candle.close >= candle.open;
                    const color = candleIsGreen ? '#089981' : '#F23645';

                    const highY = chartHeight - ((candle.high - minPrice) / priceRange) * (chartHeight - 30) - 15;
                    const lowY = chartHeight - ((candle.low - minPrice) / priceRange) * (chartHeight - 30) - 15;
                    const openY = chartHeight - ((candle.open - minPrice) / priceRange) * (chartHeight - 30) - 15;
                    const closeY = chartHeight - ((candle.close - minPrice) / priceRange) * (chartHeight - 30) - 15;

                    const bodyTop = Math.min(openY, closeY);
                    const bodyHeight = Math.max(Math.abs(closeY - openY), 2);
                    const candleWidth = Math.max(chartWidth / candles.length - 12, 6);

                    return (
                      <g key={candle.time}>
                        {/* High-Low Wick */}
                        <line
                          x1={x}
                          y1={highY}
                          x2={x}
                          y2={lowY}
                          stroke={color}
                          strokeWidth="1.5"
                        />
                        {/* Real Body */}
                        <rect
                          x={x - candleWidth / 2}
                          y={bodyTop}
                          width={candleWidth}
                          height={bodyHeight}
                          fill={candleIsGreen ? '#089981' : '#F23645'}
                          rx="1"
                        />
                      </g>
                    );
                  })
                )}

                {/* Volume Histogram at bottom */}
                <line
                  x1="0"
                  y1={chartHeight}
                  x2={chartWidth}
                  y2={chartHeight}
                  stroke="#E0E3EB"
                  strokeWidth="1"
                />
                {candles.map((candle, idx) => {
                  const x = (idx / (candles.length - 1 || 1)) * (chartWidth - 40) + 20;
                  const candleIsGreen = candle.close >= candle.open;
                  const h = (candle.volume / maxVolume) * (volumeHeight - 10);
                  const barWidth = Math.max(chartWidth / candles.length - 12, 6);
                  return (
                    <rect
                      key={`vol-${idx}`}
                      x={x - barWidth / 2}
                      y={chartHeight + volumeHeight - h}
                      width={barWidth}
                      height={h}
                      fill={candleIsGreen ? '#089981' : '#F23645'}
                      opacity={hoverIndex === idx ? 0.9 : 0.4}
                      rx="1"
                    />
                  );
                })}

                {/* Interactive Crosshair & Cursor Hit Areas */}
                {candles.map((_, idx) => {
                  const x = (idx / (candles.length - 1 || 1)) * (chartWidth - 40) + 20;
                  const width = chartWidth / candles.length;
                  return (
                    <rect
                      key={`hit-${idx}`}
                      x={x - width / 2}
                      y="0"
                      width={width}
                      height={chartHeight + volumeHeight}
                      fill="transparent"
                      className="cursor-crosshair"
                      onMouseEnter={() => setHoverIndex(idx)}
                    />
                  );
                })}

                {/* Vertical cursor guide line */}
                {hoverIndex !== null && (
                  <line
                    x1={(hoverIndex / (candles.length - 1 || 1)) * (chartWidth - 40) + 20}
                    y1="0"
                    x2={(hoverIndex / (candles.length - 1 || 1)) * (chartWidth - 40) + 20}
                    y2={chartHeight + volumeHeight}
                    stroke="#2962FF"
                    strokeDasharray="2 2"
                    strokeWidth="1"
                  />
                )}
              </svg>
            </div>
          </div>

          {/* Technical Rating & Speedometer Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Technical Analysis Overview */}
            <div className="border border-[#E0E3EB] rounded-2xl p-5 bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-[#131722]">Technical Rating Summary</h4>
                  <span className="text-xs text-[#787B86]">Daily Interval</span>
                </div>

                {/* Speedometer Gauge Visual */}
                <div className="py-2 text-center">
                  <div className="inline-block relative w-48 h-24">
                    <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                      <path
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke="#F0F3FA"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      {/* Strong Sell Red */}
                      <path
                        d="M10,50 A40,40 0 0,1 26,22"
                        fill="none"
                        stroke="#F23645"
                        strokeWidth="8"
                      />
                      {/* Sell Coral */}
                      <path
                        d="M26,22 A40,40 0 0,1 42,11"
                        fill="none"
                        stroke="#FF8A80"
                        strokeWidth="8"
                      />
                      {/* Neutral Gray */}
                      <path
                        d="M42,11 A40,40 0 0,1 58,11"
                        fill="none"
                        stroke="#B0BEC5"
                        strokeWidth="8"
                      />
                      {/* Buy Light Green */}
                      <path
                        d="M58,11 A40,40 0 0,1 74,22"
                        fill="none"
                        stroke="#80CBC4"
                        strokeWidth="8"
                      />
                      {/* Strong Buy Green */}
                      <path
                        d="M74,22 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke="#089981"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />

                      {/* Needle */}
                      {stock.technicalRating === 'Strong Buy' && (
                        <polygon points="50,48 82,30 50,52" fill="#089981" />
                      )}
                      {stock.technicalRating === 'Buy' && (
                        <polygon points="50,48 68,18 50,52" fill="#089981" />
                      )}
                      {stock.technicalRating === 'Neutral' && (
                        <polygon points="50,48 50,12 50,52" fill="#787B86" />
                      )}
                      {stock.technicalRating === 'Sell' && (
                        <polygon points="50,48 32,18 50,52" fill="#F23645" />
                      )}
                      {stock.technicalRating === 'Strong Sell' && (
                        <polygon points="50,48 18,30 50,52" fill="#F23645" />
                      )}
                      <circle cx="50" cy="50" r="4" fill="#131722" />
                    </svg>
                  </div>
                  <div className="mt-1">
                    <span
                      className={`text-sm font-extrabold uppercase tracking-wide px-3 py-1 rounded-full ${
                        stock.technicalRating.includes('Buy')
                          ? 'bg-[#E8F6F3] text-[#089981]'
                          : stock.technicalRating.includes('Sell')
                          ? 'bg-[#FDECEE] text-[#F23645]'
                          : 'bg-[#F0F3FA] text-[#787B86]'
                      }`}
                    >
                      {stock.technicalRating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Indicator metrics breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E0E3EB] text-center text-xs">
                <div>
                  <div className="text-[#089981] font-bold">14</div>
                  <div className="text-[#787B86] text-[11px]">Buy</div>
                </div>
                <div>
                  <div className="text-[#787B86] font-bold">8</div>
                  <div className="text-[#787B86] text-[11px]">Neutral</div>
                </div>
                <div>
                  <div className="text-[#F23645] font-bold">2</div>
                  <div className="text-[#787B86] text-[11px]">Sell</div>
                </div>
              </div>
            </div>

            {/* Simulated Paper Trading Box */}
            <div className="border border-[#E0E3EB] rounded-2xl p-5 bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-[#131722] flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-[#2962FF]" />
                    <span>Simulated Paper Trade</span>
                  </h4>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Zero Risk Sandbox
                  </span>
                </div>

                <p className="text-xs text-[#787B86] mb-4">
                  Simulate immediate execution at current market quote to evaluate trade dynamics.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#787B86] font-medium">Quantity (Shares)</span>
                    <div className="flex items-center space-x-2">
                      {[5, 10, 25, 50].map((qty) => (
                        <button
                          key={qty}
                          onClick={() => setTradeShares(qty)}
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            tradeShares === qty
                              ? 'bg-[#131722] text-white'
                              : 'bg-[#F0F3FA] text-[#131722] hover:bg-[#e4e8f0]'
                          }`}
                        >
                          {qty}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-[#F7F9FC] border border-[#E0E3EB]">
                    <span className="text-[#787B86]">Total Estimated Cost:</span>
                    <span className="font-bold text-[#131722] tabular-nums">
                      ${(tradeShares * stock.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {tradeSuccessMsg && (
                    <div className="text-xs p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
                      <Check className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                      <span>{tradeSuccessMsg}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  onClick={() => handleTrade('BUY')}
                  className="bg-[#089981] hover:bg-[#078570] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-xs"
                >
                  Buy {stock.ticker}
                </button>
                <button
                  onClick={() => handleTrade('SELL')}
                  className="bg-[#F23645] hover:bg-[#d92c3a] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-xs"
                >
                  Sell {stock.ticker}
                </button>
              </div>
            </div>
          </div>

          {/* Key Fundamentals & Statistics */}
          <div className="border border-[#E0E3EB] rounded-2xl p-5 bg-white">
            <h4 className="text-sm font-bold text-[#131722] mb-4">Key Financial Statistics</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[#787B86] block">Day Range</span>
                <span className="font-bold text-[#131722] tabular-nums">
                  ${stock.dayLow.toFixed(2)} - ${stock.dayHigh.toFixed(2)}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[#787B86] block">52-Week Range</span>
                <span className="font-bold text-[#131722] tabular-nums">
                  ${stock.low52.toFixed(2)} - ${stock.high52.toFixed(2)}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[#787B86] block">Market Capitalization</span>
                <span className="font-bold text-[#131722] tabular-nums">{stock.marketCap}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[#787B86] block">P/E Ratio (TTM)</span>
                <span className="font-bold text-[#131722] tabular-nums">{stock.peRatio ? stock.peRatio.toFixed(1) : 'N/A'}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[#787B86] block">Volume</span>
                <span className="font-bold text-[#131722] tabular-nums">{stock.volume}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[#787B86] block">Open</span>
                <span className="font-bold text-[#131722] tabular-nums">${stock.open.toFixed(2)}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[#787B86] block">Sector</span>
                <span className="font-bold text-[#131722]">{stock.sector || 'Equities'}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[#787B86] block">Dividend Yield</span>
                <span className="font-bold text-[#131722] tabular-nums">
                  {stock.dividendYield ? `${stock.dividendYield}%` : '—'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#E0E3EB] text-xs text-[#787B86] leading-relaxed">
              <span className="font-bold text-[#131722] block mb-1">Company Profile</span>
              {stock.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
