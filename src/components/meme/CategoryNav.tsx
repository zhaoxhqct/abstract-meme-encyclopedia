/**
 * 分类筛选导航
 */
import type { Category, CategoryFilter } from '@/types';
import { cn } from '@/utils/cn';

export function CategoryNav({
  categories,
  value,
  onChange,
  className,
}: {
  categories: Category[];
  value: CategoryFilter;
  onChange: (id: CategoryFilter) => void;
  className?: string;
}) {
  return (
    <nav aria-label="梗分类" className={cn('mb-8 flex flex-wrap gap-2.5', className)}>
      {categories.map((category) => {
        const active = category.id === value;
        return (
          <button
            key={category.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(category.id)}
            className={cn(
              'flex items-center gap-2 border-3 border-nb-black px-5 py-2.5 text-sm font-bold shadow-nb transition-nb hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-nb-lg',
              active ? 'bg-nb-black text-nb-yellow' : 'bg-nb-white text-nb-black',
            )}
          >
            <span aria-hidden="true">{category.icon}</span>
            {category.name}
          </button>
        );
      })}
    </nav>
  );
}