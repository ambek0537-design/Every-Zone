import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { TrendingDown, TrendingUp, DollarSign, Activity } from 'lucide-react';

// Seeded pseudo-random generator to ensure stable price history for each product ID
function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return function() {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

interface PriceHistoryChartProps {
  productId: string;
  originalPrice: number;
  discountPrice: number | null;
  currency: string;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({
  productId,
  originalPrice,
  discountPrice,
  currency
}) => {
  const chartData = useMemo(() => {
    const rand = seededRandom(productId);
    const data = [];
    const currentPrice = discountPrice || originalPrice;
    const basePrice = originalPrice;
    
    // Start price 30 days ago: slightly fluctuating around originalPrice
    let price = basePrice * (0.95 + rand() * 0.1); 
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      if (discountPrice && i < 5) {
        // Transition down to discount price over the last 5 days to simulate promo drop
        const ratio = (5 - i) / 5;
        price = originalPrice * (1 - ratio) + discountPrice * ratio;
      } else {
        // Normal minor fluctuation around originalPrice (-1.5% to +1.5% daily)
        const changePercent = (rand() - 0.5) * 0.03;
        price = price * (1 + changePercent);
        
        // Boundaries to keep it realistic
        if (price > originalPrice * 1.12) price = originalPrice * 1.12;
        if (price < originalPrice * 0.88) price = originalPrice * 0.88;
      }
      
      if (i === 0) {
        price = currentPrice;
      }
      
      data.push({
        date: dateStr,
        price: Math.round(price)
      });
    }
    return data;
  }, [productId, originalPrice, discountPrice]);

  const stats = useMemo(() => {
    const prices = chartData.map(d => d.price);
    const low = Math.min(...prices);
    const high = Math.max(...prices);
    const avg = Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length);
    const startPrice = prices[0];
    const endPrice = prices[prices.length - 1];
    const changePct = ((endPrice - startPrice) / startPrice) * 100;
    
    return { low, high, avg, changePct };
  }, [chartData]);

  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return value.toString();
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div id="price-history-tooltip" className="bg-neutral-900/95 border border-neutral-800 rounded-xl px-3 py-2 shadow-xl backdrop-blur-sm">
          <p className="text-[10px] text-stone-400 font-medium font-sans mb-0.5">{payload[0].payload.date}</p>
          <p className="text-xs font-bold text-amber-400 font-mono">
            {payload[0].value.toLocaleString()} {currency}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div id={`price-history-${productId}`} className="bg-neutral-950/60 border border-neutral-900 rounded-2xl p-4 space-y-4">
      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <h3 className="text-xs font-bold text-stone-200 uppercase tracking-wider font-sans">
              30-Day Price Fluctuations
            </h3>
          </div>
          <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5">
            Deterministic history indicating optimal purchasing windows.
          </p>
        </div>
        
        {/* Trend Indicator */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
            stats.changePct < 0 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : stats.changePct > 0 
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              : 'bg-stone-500/10 border-stone-500/20 text-stone-400'
          }`}>
            {stats.changePct < 0 ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <TrendingUp className="w-3 h-3" />
            )}
            <span>
              {stats.changePct < 0 ? '' : '+'}{stats.changePct.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-3 gap-2 bg-neutral-900/40 p-2.5 rounded-xl border border-neutral-900">
        <div className="text-center">
          <span className="text-[9px] font-mono font-semibold text-stone-500 uppercase tracking-wider block">30D Low</span>
          <span className="text-xs font-bold text-emerald-400 font-mono mt-0.5 block">
            {stats.low.toLocaleString()} {currency}
          </span>
        </div>
        <div className="text-center border-x border-neutral-900">
          <span className="text-[9px] font-mono font-semibold text-stone-500 uppercase tracking-wider block">30D High</span>
          <span className="text-xs font-bold text-red-400 font-mono mt-0.5 block">
            {stats.high.toLocaleString()} {currency}
          </span>
        </div>
        <div className="text-center">
          <span className="text-[9px] font-mono font-semibold text-stone-500 uppercase tracking-wider block">30D Avg</span>
          <span className="text-xs font-bold text-stone-300 font-mono mt-0.5 block">
            {stats.avg.toLocaleString()} {currency}
          </span>
        </div>
      </div>

      {/* Area Chart visualization */}
      <div className="h-[140px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#525252" 
              fontSize={9}
              tickLine={false}
              axisLine={false}
              dy={8}
            />
            <YAxis 
              stroke="#525252" 
              fontSize={9}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
              dx={-4}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#f59e0b" 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#colorPrice)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Advisory Text */}
      <div className="flex items-start gap-1.5 text-[10px] text-stone-500 leading-relaxed bg-neutral-900/20 p-2 rounded-lg border border-neutral-900/40">
        <DollarSign className="w-3.5 h-3.5 text-amber-500/70 shrink-0 mt-0.5" />
        <span>
          {stats.changePct < 0 ? (
            <><strong>Buying Advice:</strong> Price is currently at or near a 30-day low. Excellent time to complete your purchase.</>
          ) : discountPrice ? (
            <><strong>Deal Active:</strong> Promo price has dropped below the 30-day average, locking in maximum value right now!</>
          ) : (
            <><strong>Buying Advice:</strong> Minor positive fluctuation detected. Consider ordering if stock quantities are limited.</>
          )}
        </span>
      </div>
    </div>
  );
};
