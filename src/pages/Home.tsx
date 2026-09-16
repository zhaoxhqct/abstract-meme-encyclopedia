/**
 * 首页：轮播 + 分类筛选 + 热门梗 + 最新发布 + 热度榜 / 梗知识侧栏
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout';
import { Carousel, CategoryNav, MemeGrid, MemeGridSkeleton, RankList } from '@/components/meme';
import { ButtonLink, Card, Empty, PanelCard, SectionHeader } from '@/components/ui';
import { CATEGORIES } from '@/data/memes';
import { useLoading, usePublicMemes, useRankMemes } from '@/hooks/useMeme';
import type { CategoryFilter } from '@/types';
import { sortMemes } from '@/utils/meme';

const KNOWLEDGE =
  '"抽象梗"是网络亚文化的重要组成部分，通过夸张、荒诞、无厘头的方式表达情感。每一个流行梗背后，都反映了特定时期的社会心态和文化现象。';

export default function Home() {
  const memes = usePublicMemes();
  const rankMemes = useRankMemes(8);
  const loading = useLoading();
  const [category, setCategory] = useState<CategoryFilter>('all');

  const hotMemes = useMemo(() => memes.filter((meme) => meme.hot), [memes]);

  // 分类筛选同时作用于「热门梗」与「最新发布」两个区块
  const scoped = useMemo(
    () => (category === 'all' ? memes : memes.filter((meme) => meme.category === category)),
    [memes, category],
  );
  const hotList = useMemo(() => scoped.filter((meme) => meme.hot).slice(0, 4), [scoped]);
  const latestList = useMemo(() => sortMemes(scoped, 'latest').slice(0, 4), [scoped]);

  return (
    <PageContainer>
      {loading ? (
        <div className="mb-8 h-[300px] animate-stripes border-4 border-nb-black bg-nb-yellow motion-reduce:animate-none sm:h-[360px]" />
      ) : (
        <Carousel memes={hotMemes} />
      )}

      <CategoryNav categories={CATEGORIES} value={category} onChange={setCategory} />

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-7">
        <div className="min-w-0">
          <SectionHeader
            title="🔥 热门梗"
            action={
              <Link to="/explore?sort=hot" className="text-sm font-bold underline-offset-4 hover:underline">
                查看更多 →
              </Link>
            }
          />
          {loading ? (
            <MemeGridSkeleton className="mb-10" />
          ) : hotList.length > 0 ? (
            <MemeGrid memes={hotList} columns="wide" className="mb-10" />
          ) : (
            <Empty
              kind="list"
              title="这个分类下还没有热门梗"
              description="换一个分类看看，或者自己发一个"
              action={
                <ButtonLink to="/publish" variant="primary">
                  + 发布新梗
                </ButtonLink>
              }
              className="mb-10 border-3 border-dashed border-nb-black bg-nb-white"
            />
          )}

          <SectionHeader
            title="✨ 最新发布"
            action={
              <Link to="/explore" className="text-sm font-bold underline-offset-4 hover:underline">
                查看更多 →
              </Link>
            }
          />
          {loading ? <MemeGridSkeleton /> : <MemeGrid memes={latestList} columns="wide" />}
        </div>

        <aside className="mt-10 lg:mt-0">
          <PanelCard title="热度榜" icon="📊">
            <RankList memes={rankMemes} />
          </PanelCard>
          <PanelCard title="梗知识" icon="💡">
            <p className="text-sm font-medium leading-[1.9] text-nb-muted">{KNOWLEDGE}</p>
          </PanelCard>
          <Card className="p-5">
            <h3 className="text-[17px] font-black">🙌 一起来补梗</h3>
            <p className="mt-2 text-sm font-medium leading-relaxed text-nb-muted">
              发现有梗没被收录？登录后就能投稿，优质内容会出现在首页推荐。
            </p>
            <ButtonLink to="/publish" variant="yellow" size="sm" className="mt-4">
              我要投稿
            </ButtonLink>
          </Card>
        </aside>
      </div>
    </PageContainer>
  );
}
