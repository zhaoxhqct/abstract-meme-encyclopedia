/**
 * 评论输入框：支持 Ctrl / Cmd + Enter 快捷提交
 */
import { useState } from 'react';
import { Avatar, Button } from '@/components/ui';
import { cn } from '@/utils/cn';

const MAX_LENGTH = 500;

export function CommentInput({
  avatar,
  placeholder = '说点什么吧... 理性讨论，友善交流',
  submitLabel = '发表评论',
  autoFocus = false,
  compact = false,
  onSubmit,
  onCancel,
}: {
  avatar: string;
  placeholder?: string;
  submitLabel?: string;
  autoFocus?: boolean;
  /** 紧凑模式：用于二级回复 */
  compact?: boolean;
  /** 返回 true 表示提交成功，输入框会清空 */
  onSubmit: (content: string) => boolean;
  onCancel?: () => void;
}) {
  const [draft, setDraft] = useState('');
  const limitReached = draft.length >= MAX_LENGTH;

  const submit = () => {
    const content = draft.trim();
    if (!content) return;
    if (onSubmit(content)) setDraft('');
  };

  return (
    <div className="flex gap-3">
      <Avatar
        value={avatar}
        className={cn(compact ? 'h-9 w-9' : 'h-11 w-11')}
        textClassName={compact ? 'text-base' : 'text-lg'}
      />
      <div className="min-w-0 flex-1">
        <textarea
          value={draft}
          autoFocus={autoFocus}
          rows={compact ? 2 : 3}
          maxLength={MAX_LENGTH}
          aria-label={placeholder}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();
              submit();
            }
            if (event.key === 'Escape' && onCancel) onCancel();
          }}
          className="w-full resize-y border-3 border-nb-black bg-nb-bg px-4 py-3 text-sm font-medium leading-relaxed transition-nb placeholder:text-nb-muted/70 focus:-translate-x-0.5 focus:-translate-y-0.5 focus:bg-nb-white focus:shadow-nb focus:outline-none"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <span className={cn('text-xs font-medium', limitReached ? 'text-nb-pink' : 'text-nb-muted')}>
            {draft.length}/{MAX_LENGTH} · Ctrl + Enter 发送
          </span>
          <div className="flex gap-2">
            {onCancel ? (
              <Button size="sm" variant="white" onClick={onCancel}>
                取消
              </Button>
            ) : null}
            <Button size="sm" variant="primary" disabled={!draft.trim()} onClick={submit}>
              {submitLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}