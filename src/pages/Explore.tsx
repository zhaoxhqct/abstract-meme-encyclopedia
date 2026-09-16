/**
 * 探索页：分类 + 关键词 + 排序，筛选条件同步到 URL
 */
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageContainer } from '@/components/layout';
import { CategoryNav, MemeGrid, MemeGridSkeleton } from '@/components/meme';
import { Button, Empty, Select } from '@/components/ui';
import { CATEGORIES } from '@/data/memes';
import { useLoading, useMemeResults } from '@/hooks/useMeme';
import type { CategoryFilter, SortKey } from '@/types';
import { SORT_OPTIONS } from '@/utils/meme';

const SORT_KEYS: SortKey[] = ['latest', 'hot', 'views', 'likes'];

function asSort(value: string | null): SortKey {
  return SORT_KEYS.includes(value as SortKey) ? (value as SortKey) : 'latest';
}

function asCategory(value: string | null): CategoryFilter {
  return CATEGORIES.some((category) => category.id === value) ? (value as CategoryFilter) : 'all';
}

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = asSort(searchParams.get('sort'));
  const category = asCategory(searchParams.get('category'));
  const keyword = searchParams.get('q') ?? '';
  const loading = useLoading();

  const results = useMemeResults({ category, sort, keyword });
  const filtered = category !== 'all' || Boolean(keyword) || sort !== 'latest';

  const activeCategoryName = useMemo(
    () => CATEGORIES.find((item) => item.id === category)?.name ?? '全部',
    [category],
  );

  const update = (next: { category?: CategoryFilter; sort?: SortKey; q?: string }) => {
    const params = new URLSearchParams(searchParams);
    if (next.category !== undefined) {
      if (next.category === 'all') params.delete('category');
      else params.set('category', next.category);
    }
    if (next.sort !== undefined) {
      if (next.sort === 'latest') params.delete('sort');
      else params.set('sort', next.sort);
    }
    if (next.q !== undefined) {
      if (next.q) params.set('q', next.q);
      else params.delete('q');
    }
    setSearchParams(params, { replace: true });
  };

  return (
    <PageContainer>
      <header className="mb-7">
        <h1 className="text-[28px] font-black sm:text-[34px]">🔍 探索全部梗</h1>
        <p className="mt-2 text-sm font-medium text-nb-muted">发现更多有趣的网络梗文化</p>
      </header>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <CategoryNav
          categories={CATEGORIES}
          value={category}
          onChange={(id) => update({ category: id })}
          className="mb-0"
        />
        <div className="w-full sm:w-[170px]">
          <Select
            aria-label="排序方式"
            value={sort}
            onChange={(event) => update({ sort: event.target.value as SortKey })}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3 border-b-3 border-nb-black pb-3">
        <p className="text-sm font-bold">
          共 <span className="text-nb-pink">{results.length}</span> 个梗
          <span className="ml-2 font-medium text-nb-muted">
            {activeCategoryName}
            {keyword ? ` · 关键词「${keyword}」` : ''}
          </span>
        </p>
        {filtered ? (
          <Button size="sm" variant="outline" onClick={() => setSearchParams({}, { replace: true })}>
            重置筛选
          </Button>
        ) : null}
      </div>

      {loading ? (
        <MemeGridSkeleton count={8} />
      ) : results.length > 0 ? (
        <MemeGrid memes={results} />
      ) : (
        <Empty
          kind="search"
          title="没有找到符合条件的梗"
          description="换个关键词或者切换分类试试看"
          action={
            <Button variant="primary" onClick={() => setSearchParams({}, { replace: true })}>
              重置筛选条件
            </Button>
          }
        />
      )}
    </PageContainer>
  );
}
