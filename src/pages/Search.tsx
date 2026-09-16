/**
 * 搜索结果页：支持搜索历史、热门搜索词，命中标题 / 简介 / 标签
 */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageContainer } from '@/components/layout';
import { MemeGrid } from '@/components/meme';
import { Button, Card, Empty, Input } from '@/components/ui';
import { HOT_SEARCHES } from '@/data/memes';
import { useMemeResults } from '@/hooks/useMeme';
import { useSearchHistory } from '@/hooks/useSearchHistory';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = (searchParams.get('q') ?? '').trim();
  const results = useMemeResults({ keyword, sort: 'hot' });
  const { history, addHistory, clearHistory } = useSearchHistory();
  const [draft, setDraft] = useState(keyword);

  // URL 变化时同步输入框，并记录搜索历史
  useEffect(() => {
    setDraft(keyword);
    if (keyword) addHistory(keyword);
  }, [keyword, addHistory]);

  const submit = (value: string) => {
    const next = value.trim();
    setSearchParams(next ? { q: next } : {}, { replace: true });
  };

  return (
    <PageContainer>
      <header className="mb-7">
        <h1 className="text-[28px] font-black sm:text-[34px]">🔍 搜索</h1>
        <p className="mt-2 text-sm font-medium text-nb-muted">
          {keyword ? `关键词「${keyword}」共找到 ${results.length} 个梗` : '输入关键词，找到你想看的梗'}
        </p>
      </header>

      <Card className="mb-6 p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            value={draft}
            aria-label="搜索关键词"
            placeholder="搜点什么梗..."
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submit(draft);
            }}
          />
          <Button variant="primary" className="shrink-0" onClick={() => submit(draft)}>
            搜索
          </Button>
        </div>

        {history.length > 0 ? (
          <div className="mt-5">
            <div className="mb-2.5 flex items-center gap-3">
              <h2 className="text-sm font-black">🕘 搜索历史</h2>
              <button
                type="button"
                onClick={clearHistory}
                className="text-xs font-bold text-nb-muted underline-offset-4 hover:text-nb-pink hover:underline"
              >
                清空
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => submit(item)}
                  className="border-2 border-nb-black bg-nb-white px-3 py-1 text-[13px] font-bold transition-nb hover:-translate-y-0.5 hover:bg-nb-yellow hover:shadow-nb"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-5">
          <h2 className="mb-2.5 text-sm font-black">🔥 热门搜索</h2>
          <div className="flex flex-wrap gap-2">
            {HOT_SEARCHES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => submit(item)}
                className="border-2 border-nb-black bg-nb-yellow px-3 py-1 text-[13px] font-bold transition-nb hover:-translate-y-0.5 hover:bg-nb-pink hover:shadow-nb"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {keyword ? (
        results.length > 0 ? (
          <MemeGrid memes={results} />
        ) : (
          <Empty
            kind="search"
            title={`没有找到和「${keyword}」相关的梗`}
            description="换个关键词试试，或者去探索页看看全部分类"
            action={
              <Button variant="primary" onClick={() => submit('')}>
                清空搜索
              </Button>
            }
          />
        )
      ) : null}
    </PageContainer>
  );
}