/**
 * 基础卡片：3px 黑边 + 4px 硬阴影
 */
import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** 是否启用 hover 上浮效果 */
  interactive?: boolean;
}

export function Card({ interactive = false, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'border-3 border-nb-black bg-nb-white shadow-nb',
        interactive && 'transition-nb hover:-translate-x-1 hover:-translate-y-1 hover:shadow-nb-xl',
        className,
      )}
      {...rest}
    />
  );
}

/** 侧边栏 / 详情页的小卡片，带标题下划线 */
export function PanelCard({
  title,
  icon,
  children,
  className,
}: {
  title: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn('mb-5 p-5', className)}>
      <h3 className="mb-4 flex items-center gap-2 border-b-3 border-nb-black pb-2.5 text-[17px] font-black">
        {icon ? <span aria-hidden="true">{icon}</span> : null}
        {title}
      </h3>
      {children}
    </Card>
  );
}