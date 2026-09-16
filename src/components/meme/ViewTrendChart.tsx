/**
 * 浏览趋势图（mock 数据，纯 SVG 手绘，保持粗粝风格）
 */
import type { Meme } from '@/types';
import { formatNumber } from '@/utils/format';
import { viewTrend } from '@/utils/meme';

const CHART_HEIGHT = 72;

export function ViewTrendChart({ meme }: { meme: Meme }) {
  const series = viewTrend(meme);
  const max = Math.max(...series, 1);
  const barWidth = 100 / series.length;

  return (
    <div>
      <svg
        viewBox={`0 0 100 ${CHART_HEIGHT}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`${meme.title} 最近 7 天浏览趋势`}
        className="h-20 w-full border-2 border-nb-black bg-nb-bg"
      >
        {series.map((value, index) => {
          const height = Math.max(4, (value / max) * (CHART_HEIGHT - 6));
          return (
            <rect
              key={index}
              x={index * barWidth + barWidth * 0.15}
              y={CHART_HEIGHT - height}
              width={barWidth * 0.7}
              height={height}
              fill={index === series.length - 1 ? '#FF6B9D' : '#FFE500'}
              stroke="#000000"
              strokeWidth="1"
            />
          );
        })}
      </svg>
      <div className="mt-2 flex justify-between text-[11px] font-semibold text-nb-muted">
        <span>7 天前</span>
        <span>今日预计 {formatNumber(series[series.length - 1] ?? 0)} 次</span>
      </div>
    </div>
  );
}