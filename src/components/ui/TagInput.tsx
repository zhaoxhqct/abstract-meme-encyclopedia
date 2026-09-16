/**
 * 标签输入：回车添加，最多 5 个
 */
import { useState } from 'react';
import { useToast } from '@/hooks/useToast';

export function TagInput({
  value,
  onChange,
  max = 5,
  placeholder = '输入标签后按回车',
}: {
  value: string[];
  onChange: (tags: string[]) => void;
  max?: number;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');
  const { showToast } = useToast();

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag) return;
    if (value.length >= max) {
      showToast(`最多添加 ${max} 个标签`);
      return;
    }
    if (value.includes(tag)) {
      showToast('标签已存在');
      return;
    }
    onChange([...value, tag]);
  };

  const removeTag = (tag: string) => onChange(value.filter((item) => item !== tag));

  return (
    <div className="flex min-h-[52px] flex-wrap items-center gap-2 border-3 border-nb-black bg-nb-bg p-2.5 transition-nb focus-within:bg-nb-white focus-within:shadow-nb">
      {value.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1.5 border-2 border-nb-black bg-nb-yellow px-3 py-1 text-[13px] font-bold"
        >
          {tag}
          <button
            type="button"
            aria-label={`删除标签 ${tag}`}
            onClick={() => removeTag(tag)}
            className="text-base font-black leading-none hover:text-nb-pink"
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            addTag(draft);
            setDraft('');
          }
        }}
        placeholder={value.length >= max ? `最多 ${max} 个标签` : placeholder}
        disabled={value.length >= max}
        className="min-w-[120px] flex-1 border-none bg-transparent text-sm font-medium outline-none placeholder:text-nb-muted/70"
      />
    </div>
  );
}