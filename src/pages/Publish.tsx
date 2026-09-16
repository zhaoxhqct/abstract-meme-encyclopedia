/**
 * 发布 / 编辑页：左侧表单 + 右侧实时预览与投稿须知
 * 编辑模式复用同一组件，仅他人发布的梗不可编辑
 */
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageContainer } from '@/components/layout';
import { MemeCover, MemeCoverPicker, type CoverPickerValue } from '@/components/meme';
import { Button, ButtonLink, Card, FormRow, Input, Modal, Select, Tag, TagInput, Textarea } from '@/components/ui';
import { CATEGORIES, COVERS } from '@/data/memes';
import { useAuth } from '@/hooks/useAuth';
import { useMeme } from '@/hooks/useMeme';
import { useToast } from '@/hooks/useToast';
import { useMemeStore } from '@/store/useMemeStore';
import { useUserStore } from '@/store/useUserStore';
import type { CategoryId } from '@/types';

const TIPS = [
  '内容需客观中立，避免人身攻击',
  '注明梗的来源和流行时间',
  '优质内容将获得首页推荐',
  '禁止发布违法违规内容',
];

const DEFAULT_COVER: CoverPickerValue = {
  cover: COVERS[0]?.gradient ?? 'linear-gradient(135deg, #FFE500, #FF8C42)',
  coverEmoji: COVERS[0]?.emoji ?? '📚',
};

export default function Publish() {
  const { id } = useParams<{ id: string }>();
  const editingId = id ? Number(id) : undefined;
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { user } = useAuth();
  const existing = useMeme(editingId);
  const addMeme = useMemeStore((state) => state.addMeme);
  const updateMeme = useMemeStore((state) => state.updateMeme);
  const deleteMeme = useMemeStore((state) => state.deleteMeme);
  const addPublished = useUserStore((state) => state.addPublished);
  const removePublished = useUserStore((state) => state.removePublished);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId | ''>('');
  const [cover, setCover] = useState<CoverPickerValue>(DEFAULT_COVER);
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const loadedId = useRef<number | null>(null);

  const owned = Boolean(editingId !== undefined && user?.publishedMemes.includes(editingId));
  const isEditing = editingId !== undefined;

  // 未登录直接回到首页
  useEffect(() => {
    if (user) return;
    showToast('请先登录后再发布');
    navigate('/', { replace: true });
  }, [user, navigate, showToast]);

  // 只能编辑自己的梗
  useEffect(() => {
    if (!isEditing || !user || owned) return;
    showToast('只能编辑自己发布的梗');
    navigate(`/meme/${editingId}`, { replace: true });
  }, [isEditing, owned, user, editingId, navigate, showToast]);

  // 编辑模式回填表单（只在首次载入该 id 时执行）
  useEffect(() => {
    if (!existing || loadedId.current === existing.id) return;
    loadedId.current = existing.id;
    setTitle(existing.title);
    setCategory(existing.category);
    setCover({
      cover: existing.cover,
      coverEmoji: existing.coverEmoji,
      ...(existing.coverImage ? { coverImage: existing.coverImage } : {}),
    });
    setSummary(existing.summary);
    setContent(existing.content);
    setTags(existing.tags);
    setIsPrivate(Boolean(existing.isPrivate));
  }, [existing]);

  if (!user) return null;

  const submit = () => {
    const name = title.trim();
    if (!name) {
      showToast('请填写梗名称');
      return;
    }
    if (!category) {
      showToast('请选择分类');
      return;
    }
    const brief = summary.trim();
    if (!brief) {
      showToast('请填写一句话简介');
      return;
    }
    const body = content.trim();
    if (!body) {
      showToast('请填写详细内容');
      return;
    }

    const draft = {
      title: name,
      category,
      author: user.username,
      authorAvatar: user.avatar,
      cover: cover.cover,
      coverEmoji: cover.coverEmoji,
      summary: brief,
      content: body,
      tags,
      hot: existing?.hot ?? false,
      isPrivate,
      ...(cover.coverImage ? { coverImage: cover.coverImage } : {}),
    };

    if (isEditing && editingId !== undefined) {
      updateMeme(editingId, draft);
      showToast('修改已保存 ✅');
      navigate(`/meme/${editingId}`);
      return;
    }

    const created = addMeme(draft);
    addPublished(created.id);
    showToast('发布成功，感谢投稿 🎉');
    navigate(`/meme/${created.id}`);
  };

  const confirmDelete = () => {
    if (editingId === undefined) return;
    deleteMeme(editingId);
    removePublished(editingId);
    setDeleteOpen(false);
    showToast('梗已删除');
    navigate('/profile', { replace: true });
  };

  return (
    <PageContainer>
      <header className="mb-7">
        <h1 className="text-[28px] font-black sm:text-[34px]">
          {isEditing ? '✏️ 编辑梗' : '✏️ 发布新梗'}
        </h1>
        <p className="mt-2 text-sm font-medium text-nb-muted">
          把你的发现写下来，让更多人看懂这个梗
        </p>
      </header>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-7">
        <Card className="p-5 sm:p-7">
          <FormRow label="梗名称" required hint="最多 30 字">
            <Input
              value={title}
              maxLength={30}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="例如：张雪峰牢师"
            />
          </FormRow>

          <FormRow label="分类" required>
            <Select value={category} onChange={(event) => setCategory(event.target.value as CategoryId)}>
              <option value="">请选择分类</option>
              {CATEGORIES.filter((item) => item.id !== 'all').map((item) => (
                <option key={item.id} value={item.id}>
                  {item.icon} {item.name}
                </option>
              ))}
            </Select>
          </FormRow>

          <FormRow label="封面风格" hint="可选预设渐变，也可上传自己的图片">
            <MemeCoverPicker value={cover} options={COVERS} onChange={setCover} />
          </FormRow>

          <FormRow label="一句话简介" required hint="最多 100 字">
            <Textarea
              value={summary}
              rows={2}
              maxLength={100}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="用一句话概括这个梗的含义"
            />
          </FormRow>

          <FormRow label="详细内容" required>
            <Textarea
              value={content}
              rows={12}
              onChange={(event) => setContent(event.target.value)}
              placeholder={'详细介绍这个梗的由来、发展、经典用法...\n\n建议结构：\n1. 梗的来源和背景\n2. 发展过程和流行原因\n3. 经典用法和衍生梗'}
            />
          </FormRow>

          <FormRow label="标签" hint="回车添加，最多 5 个">
            <TagInput value={tags} onChange={setTags} max={5} />
          </FormRow>

          <label className="mb-6 flex cursor-pointer items-start gap-3 border-3 border-dashed border-nb-black bg-nb-bg p-4">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(event) => setIsPrivate(event.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-nb-black"
            />
            <span>
              <span className="block text-sm font-black">🔒 设为私密</span>
              <span className="mt-1 block text-xs font-medium text-nb-muted">
                私密梗只有你自己能在个人主页看到，不会出现在首页、探索页和搜索结果里
              </span>
            </span>
          </label>

          <div className="flex flex-wrap gap-2.5">
            <Button variant="white" onClick={() => navigate(-1)}>
              取消
            </Button>
            <Button variant="primary" onClick={submit}>
              {isEditing ? '💾 保存修改' : '🚀 发布'}
            </Button>
            {isEditing ? (
              <Button variant="pink" onClick={() => setDeleteOpen(true)}>
                🗑 删除这个梗
              </Button>
            ) : null}
            {isEditing ? (
              <ButtonLink to={`/meme/${editingId}`} variant="outline">
                查看详情
              </ButtonLink>
            ) : null}
          </div>
        </Card>

        <aside className="mt-7 lg:mt-0">
          <Card className="mb-5 p-5">
            <h3 className="mb-4 border-b-3 border-nb-black pb-2.5 text-[17px] font-black">👁 实时预览</h3>
            <div className="flex gap-3">
              <MemeCover
                cover={cover.cover}
                coverImage={cover.coverImage}
                coverEmoji={cover.coverEmoji}
                className="h-[72px] w-[72px] shrink-0 border-3 border-nb-black"
                emojiClassName="text-[34px]"
              />
              <div className="min-w-0">
                <div className="truncate text-[17px] font-black">{title.trim() || '梗名称预览'}</div>
                <p className="mt-1.5 line-clamp-3 text-[13px] font-medium leading-normal text-nb-muted">
                  {summary.trim() || '一句话简介将显示在这里...'}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
              {isPrivate ? <Tag variant="plain">🔒 私密</Tag> : null}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-[17px] font-black">📝 投稿须知</h3>
            <ul className="list-none space-y-2">
              {TIPS.map((tip) => (
                <li key={tip} className="flex gap-2 text-sm font-medium leading-relaxed text-nb-muted">
                  <span aria-hidden="true">▪</span>
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="🗑 删除确认"
        footer={
          <>
            <Button variant="white" className="flex-1" onClick={() => setDeleteOpen(false)}>
              取消
            </Button>
            <Button variant="pink" className="flex-1" onClick={confirmDelete}>
              确认删除
            </Button>
          </>
        }
      >
        <p className="text-sm font-medium leading-relaxed text-nb-muted">
          删除后这条梗和它的评论都会消失，且无法恢复。确定要删除「{title.trim() || '这条梗'}」吗？
        </p>
      </Modal>
    </PageContainer>
  );
}
