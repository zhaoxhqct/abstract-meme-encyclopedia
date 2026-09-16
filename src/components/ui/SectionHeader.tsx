/**
 * 区块标题：左侧黄色竖条 + 右侧操作区
 */
import type { ReactNode } from 'react';

export function SectionHeader({
  title,
  action,
  className,
}: {
  title: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-5 flex items-center justify-between gap-4 ${className ?? ''}`}>
      <h2 className="flex items-center gap-3 text-xl font-black sm:text-[26px]">
        <span aria-hidden="true" className="inline-block h-7 w-1.5 border-2 border-nb-black bg-nb-yellow" />
        {title}
      </h2>
      {action}
    </div>
  );
}