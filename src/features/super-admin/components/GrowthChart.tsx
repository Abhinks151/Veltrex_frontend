import { useMemo } from 'react';
import { Calendar } from 'lucide-react';

interface ChartPoint {
  label: string;
  count: number;
}

interface GrowthDynamicsChartProps {
  loading: boolean;
  chartData: ChartPoint[];
}

/**
 * Computes a "nice", evenly-spaced set of axis ticks for a given max value —
 * the classic D3 / Excel style nice-number algorithm, constrained to WHOLE
 * NUMBERS only. Tenant counts are always integers, so the step is never
 * allowed to drop below 1 (e.g. 0.5). Without this constraint a small max
 * like 2 would produce ticks [2, 1.5, 1, 0.5, 0], which get rounded for
 * display and collide into duplicate labels like "2, 2, 1, 1, 0".
 */
function getNiceTicks(maxValue: number, targetTickCount = 4): number[] {
  if (!isFinite(maxValue) || maxValue <= 0) {
    return [4, 3, 2, 1, 0];
  }

  const rawStep = maxValue / targetTickCount;

  // Round up to the nearest whole number first — step can never be < 1.
  const wholeStep = Math.max(1, Math.ceil(rawStep));

  // Then snap that whole step to a "nice" multiplier (1, 2, 5, 10 × 10^n)
  // while staying an integer, so steps read like 1, 2, 5, 10, 20... not 3, 7, 13.
  const magnitude = Math.pow(10, Math.floor(Math.log10(wholeStep)));
  const normalizedStep = wholeStep / magnitude;

  let niceStepMultiplier: number;
  if (normalizedStep <= 1) niceStepMultiplier = 1;
  else if (normalizedStep <= 2) niceStepMultiplier = 2;
  else if (normalizedStep <= 5) niceStepMultiplier = 5;
  else niceStepMultiplier = 10;

  const step = Math.max(1, Math.round(niceStepMultiplier * magnitude));
  const niceMax = Math.ceil(maxValue / step) * step;

  const ticks: number[] = [];
  for (let value = 0; value <= niceMax; value += step) {
    ticks.push(value);
  }

  // Render largest-first (top of the y-axis down to 0)
  return ticks.reverse();
}

const GrowthDynamicsChart = ({
  loading,
  chartData,
}: GrowthDynamicsChartProps) => {
  const { yTicks, bars } = useMemo(() => {
    const rawMax =
      chartData.length > 0 ? Math.max(...chartData.map((d) => d.count)) : 0;
    const ticks = getNiceTicks(rawMax, 4);
    const scaleMax = ticks[0] || 1; // largest tick, always > 0

    const computedBars = chartData.map((d) => ({
      ...d,
      // Bars with a real count get a minimum 4% height so they stay visible
      // even when tiny relative to the scale; zero-count bars render flat.
      heightPercent: d.count > 0 ? Math.max((d.count / scaleMax) * 100, 4) : 0,
    }));

    return { yTicks: ticks, bars: computedBars };
  }, [chartData]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50/30 rounded-xl border border-dashed border-gray-200">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4f46e5]"></div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200 text-gray-400">
        <Calendar className="w-8 h-8 mb-2 stroke-1" />
        <p className="text-xs font-semibold">
          No registration data found for this range.
        </p>
      </div>
    );
  }

  const midIndex = Math.floor((bars.length - 1) / 2);

  return (
    <div className="space-y-4">
      <div className="h-64 mt-2 flex gap-3 shadow-inner bg-gray-50/30 p-4 rounded-xl border border-gray-100 select-none">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between text-right text-[10px] text-gray-400 font-bold py-0.5 shrink-0">
          {yTicks.map((tick, i) => (
            <span key={i}>{tick}</span>
          ))}
        </div>

        {/* Bars + gridlines */}
        <div className="relative flex-1 overflow-x-auto">
          {/* Horizontal gridlines — one per tick, now evenly spaced */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {yTicks.map((_, i) => (
              <div
                key={i}
                className="border-t border-gray-200/70 first:border-t-0"
              />
            ))}
          </div>

          <div className="relative h-full flex items-end justify-between gap-1 min-w-full">
            {bars.map((d, index) => (
              <div
                key={index}
                className="group flex flex-col items-center flex-1 min-w-[20px] max-w-[40px] h-full justify-end relative cursor-pointer"
              >
                {/* Floating tooltip */}
                <div className="absolute z-20 bottom-full mb-2 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 translate-y-1 scale-95 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-150 ease-out">
                  <div className="bg-slate-900 text-white text-[10px] leading-tight py-1.5 px-2.5 rounded-lg shadow-lg whitespace-nowrap text-center">
                    <div className="font-extrabold text-xs">
                      {d.count} {d.count === 1 ? 'Tenant' : 'Tenants'}
                    </div>
                    <div className="text-slate-300 font-semibold uppercase tracking-wider text-[9px] mt-0.5">
                      {d.label}
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1"></div>
                </div>

                <div
                  className={`w-full rounded-t-sm relative transition-all duration-500 ease-out origin-bottom ${
                    d.count > 0
                      ? 'bg-[#4f46e5] group-hover:bg-[#4338ca]'
                      : 'bg-gray-200/50'
                  }`}
                  style={{ height: `${d.heightPercent}%` }}
                >
                  {d.count > 0 && (
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Axis labels: first, middle, last (avoids overcrowding dense datasets) */}
      <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase py-1 pl-10 pr-4 leading-none">
        <span>{bars[0]?.label}</span>
        {bars.length > 2 && <span>{bars[midIndex]?.label}</span>}
        <span>{bars[bars.length - 1]?.label}</span>
      </div>
    </div>
  );
};

export default GrowthDynamicsChart;
