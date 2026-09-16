/**
 * 统计小方块
 */
import { cn } from '@/utils/cn';

export function StatBox({
  value,
  label,
  className,
}: {
  value: string | number;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn('border-2 border-nb-black bg-nb-bg px-2 py-3.5 text-center', className)}>
      <div className="text-2xl font-black leading-none">{value}</div>
      <div className="mt-1 text-xs font-semibold text-nb-muted">{label}</div>
    </div>
  );
}