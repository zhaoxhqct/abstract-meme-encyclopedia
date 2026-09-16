/**
 * 个人主页：资料头部 + 我发布的 / 我点赞的 / 我收藏的 三个 Tab
 */
import { useMemo, useState } from 'react';
import { PageContainer } from '@/components/layout';
import { MemeGrid } from '@/components/meme';
import { ProfileEditModal, ProfileHeader } from '@/components/profile';
import { Button, ButtonLink, Card, Empty, Modal } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useMemeStore } from '@/store/useMemeStore';
import { useUiStore } from '@/store/useUiStore';
import type { ProfileTab } from '@/types';
import { cn } from '@/utils/cn';

const TABS: { id: ProfileTab; label: string; empty: string }[] = [
  { id: 'published', label: '📝 我发布的', empty: '还没有发布过梗' },
  { id: 'liked', label: '❤️ 我点赞的', empty: '还没有点赞过任何梗' },
  { id: 'favorite', label: '⭐ 我收藏的', empty: '还没有收藏任何梗' },
];

export default function Profile() {
  const { user } = useAuth();
  const openLogin = useUiStore((state) => state.openLogin);
  const memes = useMemeStore((state) => state.memes);
  const resetData = useMemeStore((state) => state.resetData);
  const { showToast } = useToast();
  const [tab, setTab] = useState<ProfileTab>('published');
  const [editOpen, setEditOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  // 个人主页直接读原始列表，作者自己的私密梗也要能看到
  const lists = useMemo(() => {
    if (!user) return { published: [], liked: [], favorite: [] };
    const pick = (ids: number[]) => memes.filter((meme) => ids.includes(meme.id));
    return {
      published: pick(user.publishedMemes),
      liked: pick(user.likedMemes),
      favorite: pick(user.favoriteMemes),
    };
  }, [memes, user]);

  if (!user) {
    return (
      <PageContainer>
        <Card className="mx-auto max-w-[520px] p-8 text-center">
          <div aria-hidden="true" className="text-[64px] leading-none">
            👤
          </div>
          <h1 className="mt-4 text-[22px] font-black">登录后查看个人主页</h1>
          <p className="mt-2 text-sm font-medium leading-relaxed text-nb-muted">
            登录后可以发布梗、收藏内容、参与评论互动
          </p>
          <Button variant="primary" className="mt-6" onClick={openLogin}>
            立即登录
          </Button>
          <p className="mt-4 text-xs font-medium text-nb-muted">
            也可以直接体验演示账号，自带点赞与收藏数据
          </p>
        </Card>
      </PageContainer>
    );
  }

  const activeTab = TABS.find((item) => item.id === tab) ?? TABS[0];
  const list = lists[tab];

  return (
    <PageContainer>
      <ProfileHeader
        user={user}
        stats={{
          published: lists.published.length,
          liked: lists.liked.length,
          favorite: lists.favorite.length,
        }}
        onEdit={() => setEditOpen(true)}
        onReset={() => setResetOpen(true)}
      />

      <div role="tablist" aria-label="个人内容分类" className="mb-6 flex flex-wrap gap-2.5">
        {TABS.map((item) => {
          const active = item.id === tab;
          const count = lists[item.id].length;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.id)}
              className={cn(
                'border-3 border-nb-black px-5 py-2.5 text-sm font-bold shadow-nb transition-nb hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-nb-lg',
                active ? 'bg-nb-black text-nb-yellow' : 'bg-nb-white',
              )}
            >
              {item.label} ({count})
            </button>
          );
        })}
      </div>

      {list.length > 0 ? (
        <MemeGrid memes={list} columns="wide" showPrivate />
      ) : (
        <Empty
          kind="list"
          title={activeTab?.empty ?? '这里还是空的'}
          description="去探索页逛逛，遇到喜欢的梗就收藏起来"
          action={
            <ButtonLink to="/explore" variant="primary">
              去探索
            </ButtonLink>
          }
        />
      )}

      <ProfileEditModal open={editOpen} onClose={() => setEditOpen(false)} />

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="♻️ 重置数据"
        footer={
          <>
            <Button variant="white" className="flex-1" onClick={() => setResetOpen(false)}>
              取消
            </Button>
            <Button
              variant="pink"
              className="flex-1"
              onClick={() => {
                resetData();
                setResetOpen(false);
                showToast('已恢复到初始数据');
              }}
            >
              确认重置
            </Button>
          </>
        }
      >
        <p className="text-sm font-medium leading-relaxed text-nb-muted">
          重置会把所有梗和评论恢复到初始的 Mock 数据，你自己发布、编辑、删除的内容都会丢失。此操作无法撤销。
        </p>
      </Modal>
    </PageContainer>
  );
}