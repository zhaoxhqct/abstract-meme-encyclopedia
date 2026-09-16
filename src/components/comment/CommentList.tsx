/**
 * 评论列表：二级回复、评论点赞、删除自己的评论
 */
import { AnimatePresence, motion } from 'framer-motion';
import { CommentInput } from '@/components/comment/CommentInput';
import { Avatar, Empty, Tag } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import type { Comment } from '@/types';
import { cn } from '@/utils/cn';

export interface CommentListProps {
  comments: Comment[];
  /** 正在回复的评论 id，二级回复只挂在顶层评论下 */
  replyingTo: number | null;
  onReply: (comment: Comment | null) => void;
  onSubmitReply: (content: string) => boolean;
  onLike: (comment: Comment) => void;
  onDelete: (comment: Comment) => void;
}

export function CommentList({
  comments,
  replyingTo,
  onReply,
  onSubmitReply,
  onLike,
  onDelete,
}: CommentListProps) {
  const { user } = useAuth();
  const roots = comments.filter((comment) => !comment.parentId);
  const repliesOf = (id: number) => comments.filter((comment) => comment.parentId === id);
  const isOwn = (comment: Comment) => Boolean(user) && comment.user === user?.username;

  if (comments.length === 0) {
    return <Empty kind="comment" title="还没有评论，来抢沙发吧" description="第一条评论往往最有梗" />;
  }

  return (
    <ul className="list-none">
      <AnimatePresence initial={false}>
        {roots.map((comment) => {
          const replies = repliesOf(comment.id);
          return (
            <motion.li
              key={comment.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.22 }}
              className="border-b-2 border-dashed border-nb-black py-4 last:border-b-0"
            >
              <CommentRow
                comment={comment}
                isOwn={isOwn(comment)}
                replying={replyingTo === comment.id}
                onLike={onLike}
                onDelete={onDelete}
                onReply={() => onReply(replyingTo === comment.id ? null : comment)}
              />

              {replyingTo === comment.id ? (
                <div className="mt-3 sm:pl-14">
                  <CommentInput
                    compact
                    autoFocus
                    avatar={user?.avatar ?? '👤'}
                    placeholder={`回复 @${comment.user}...`}
                    submitLabel="回复"
                    onSubmit={onSubmitReply}
                    onCancel={() => onReply(null)}
                  />
                </div>
              ) : null}

              {replies.length > 0 ? (
                <ul className="mt-3 list-none space-y-3 sm:pl-14">
                  {replies.map((reply) => (
                    <li key={reply.id} className="border-l-3 border-nb-black bg-nb-bg p-3">
                      <CommentRow
                        compact
                        comment={reply}
                        isOwn={isOwn(reply)}
                        onLike={onLike}
                        onDelete={onDelete}
                        onReply={() => onReply(comment)}
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}

function CommentRow({
  comment,
  isOwn,
  compact = false,
  replying = false,
  onLike,
  onDelete,
  onReply,
}: {
  comment: Comment;
  isOwn: boolean;
  compact?: boolean;
  replying?: boolean;
  onLike: (comment: Comment) => void;
  onDelete: (comment: Comment) => void;
  onReply: () => void;
}) {
  return (
    <div className="flex gap-3">
      <Avatar
        value={comment.avatar}
        className={cn(compact ? 'h-9 w-9' : 'h-11 w-11')}
        textClassName={compact ? 'text-base' : 'text-lg'}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-sm font-black">{comment.user}</span>
          <span className="text-xs font-medium text-nb-muted">{comment.time}</span>
          {isOwn ? <Tag variant="plain" className="bg-nb-yellow">我</Tag> : null}
        </div>
        <p className="mt-1.5 break-words text-sm font-medium leading-relaxed">{comment.content}</p>
        <div className="mt-2 flex items-center gap-4 text-xs font-bold text-nb-muted">
          <button
            type="button"
            onClick={() => onLike(comment)}
            aria-label={`给 ${comment.user} 的评论点赞`}
            className="transition-nb hover:text-nb-pink"
          >
            👍 {comment.likes}
          </button>
          <button
            type="button"
            onClick={onReply}
            aria-expanded={replying}
            className="transition-nb hover:text-nb-black"
          >
            💬 回复
          </button>
          {isOwn ? (
            <button
              type="button"
              onClick={() => onDelete(comment)}
              className="transition-nb hover:text-nb-pink"
            >
              🗑 删除
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}