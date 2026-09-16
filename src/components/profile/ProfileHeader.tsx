/**
 * 个人主页头部：斜条纹横幅 + 头像 + 数据统计 + 操作区
 */
import { Avatar, Button, ButtonLink, StatBox } from '@/components/ui';
import type { User } from '@/types';
import { formatDate } from '@/utils/format';

export function ProfileHeader({
  user,
  stats,
  onEdit,
  onReset,
}: {
  user: User;
  stats: { published: number; liked: number; favorite: number };
  onEdit: () => void;
  onReset: () => void;
}) {
  return (
    <section className="mb-8 border-3 border-nb-black bg-nb-white shadow-nb-lg">
      <div aria-hidden="true" className="nb-stripes h-20 border-b-3 border-nb-black" />

      <div className="flex flex-col gap-6 p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
          <Avatar
            value={user.avatar}
            className="-mt-16 h-24 w-24 shrink-0 shadow-nb-lg sm:-mt-20 sm:h-28 sm:w-28"
            textClassName="text-5xl"
          />

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-black sm:text-3xl">{user.username}</h1>
            <p className="mt-2 text-sm font-medium leading-relaxed text-nb-muted">{user.bio}</p>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-nb-muted">
              <span>📧 {user.email}</span>
              <span>📅 加入于 {formatDate(user.joinDate)}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <ButtonLink to="/publish" variant="primary">
              + 发布新梗
            </ButtonLink>
            <Button variant="white" onClick={onEdit}>
              ✏️ 编辑资料
            </Button>
            <Button variant="outline" onClick={onReset}>
              ♻️ 重置数据
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:max-w-[420px]">
          <StatBox value={stats.published} label="发布" className="border-3" />
          <StatBox value={stats.liked} label="点赞" className="border-3" />
          <StatBox value={stats.favorite} label="收藏" className="border-3" />
        </div>
      </div>
    </section>
  );
}