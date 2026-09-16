/**
 * 分类专属页：每个分类有自己的主题色与排序方式
 */
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageContainer } from '@/components/layout';
import { CategoryNav, MemeGrid } from '@/components/meme';
import { ButtonLink, Card, Empty, Select } from '@/components/ui';
import { CATEGORIES } from '@/data/memes';
import { useMemeResults } from '@/hooks/useMeme';
import type { CategoryFilter, SortKey } from '@/types';
import { SORT_OPTIONS, getCategory } from '@/utils/meme';

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sort, setSort] = useState<SortKey>('hot');
  const category = useMemo(() => getCategory((id ?? 'all') as CategoryFilter), [id]);
  const results = useMemeResults({ category: category?.id ?? 'all', sort });

  if (!category || category.id === 'all') {
    return (
      <PageContainer>
        <Empty
          kind="notfound"
          title="没有这个分类"
          description="分类链接可能已经失效"
          action={
            <ButtonLink to="/explore" variant="primary">
              去探索页
            </ButtonLink>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Card className="mb-7 overflow-hidden p-0">
        <div aria-hidden="true" className="h-3 border-b-3 border-nb-black" style={{ background: category.accent }} />
        <div className="flex flex-wrap items-center justify-between gap-5 p-5 sm:p-7">
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="flex h-16 w-16 shrink-0 items-center justify-center border-3 border-nb-black text-3xl shadow-nb"
              style={{ background: category.accent }}
            >
              {category.icon}
            </span>
            <div>
              <h1 className="text-[26px] font-black sm:text-[32px]">{category.name}</h1>
              <p className="mt-1.5 text-sm font-medium text-nb-muted">{category.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-nb-muted">共 {results.length} 个梗</span>
            <div className="w-[150px]">
              <Select
                aria-label="排序方式"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </Card>

      <CategoryNav
        categories={CATEGORIES}
        value={category.id}
        onChange={(next) => navigate(next === 'all' ? '/explore' : `/category/${next}`)}
      />

      {results.length > 0 ? (
        <MemeGrid memes={results} />
      ) : (
        <Empty
          kind="list"
          title={`${category.name}还没有收录内容`}
          description="换个分类看看，或者自己发一个"
          action={
            <ButtonLink to="/publish" variant="primary">
              + 发布新梗
            </ButtonLink>
          }
        />
      )}
    </PageContainer>
  );
}