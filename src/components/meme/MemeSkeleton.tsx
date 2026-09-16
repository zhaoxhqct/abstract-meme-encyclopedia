/**
 * 卡片骨架屏
 */
import { Skeleton } from '@/components/ui';

export function MemeCardSkeleton() {
  return (
    <div className="border-3 border-nb-black bg-nb-white shadow-nb">
      <Skeleton className="h-[130px] border-0 border-b-3" />
      <div className="space-y-3 p-3.5">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-4/5" />
        <div className="flex justify-between pt-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </div>
  );
}

export function MemeGridSkeleton({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className ?? ''}`}>
      {Array.from({ length: count }, (_, index) => (
        <MemeCardSkeleton key={index} />
      ))}
    </div>
  );
}