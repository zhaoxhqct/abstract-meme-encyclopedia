/**
 * 详情页评论区：发表评论、二级回复、点赞、删除
 */
import { useState } from 'react';
import { CommentInput } from '@/components/comment/CommentInput';
import { CommentList } from '@/components/comment/CommentList';
import { Card } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useComments } from '@/hooks/useMeme';
import { useToast } from '@/hooks/useToast';
import { useMemeStore } from '@/store/useMemeStore';
import type { Comment, Meme } from '@/types';
import { formatNumber } from '@/utils/format';

export function CommentSection({ meme }: { meme: Meme }) {
  const comments = useComments(meme.id);
  const addComment = useMemeStore((state) => state.addComment);
  const deleteComment = useMemeStore((state) => state.deleteComment);
  const likeComment = useMemeStore((state) => state.likeComment);
  const { user, requireLogin } = useAuth();
  const { showToast } = useToast();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const submit = (content: string): boolean => {
    if (!requireLogin() || !user) return false;
    addComment(meme.id, content, { username: user.username, avatar: user.avatar });
    showToast('评论发布成功');
    return true;
  };

  const submitReply = (content: string): boolean => {
    if (replyingTo === null || !requireLogin() || !user) return false;
    addComment(meme.id, content, { username: user.username, avatar: user.avatar }, replyingTo);
    setReplyingTo(null);
    showToast('回复成功');
    return true;
  };

  const handleLike = (comment: Comment) => {
    if (!requireLogin()) return;
    likeComment(meme.id, comment.id);
  };

  const handleDelete = (comment: Comment) => {
    deleteComment(meme.id, comment.id);
    showToast('评论已删除');
  };

  return (
    <Card className="mt-6 p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3 border-b-3 border-nb-black pb-3">
        <h3 className="text-[19px] font-black">💬 评论区</h3>
        <span className="text-sm font-bold text-nb-muted">{formatNumber(comments.length)} 条评论</span>
      </div>

      <CommentInput avatar={user?.avatar ?? '👤'} onSubmit={submit} />

      <div className="mt-4">
        <CommentList
          comments={comments}
          replyingTo={replyingTo}
          onReply={(comment) => setReplyingTo(comment ? comment.id : null)}
          onSubmitReply={submitReply}
          onLike={handleLike}
          onDelete={handleDelete}
        />
      </div>
    </Card>
  );
}