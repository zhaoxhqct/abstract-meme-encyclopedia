/**
 * 封面选择器：可选预设渐变 + emoji，也可上传本地图片
 */
import { useRef, useState } from 'react';
import { Button } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import type { CoverOption } from '@/types';
import { cn } from '@/utils/cn';
import { readImageAsDataUrl } from '@/utils/image';

export interface CoverPickerValue {
  cover: string;
  coverEmoji: string;
  coverImage?: string;
}

export function MemeCoverPicker({
  value,
  options,
  onChange,
}: {
  value: CoverPickerValue;
  options: CoverOption[];
  onChange: (next: CoverPickerValue) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件');
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await readImageAsDataUrl(file);
      onChange({ ...value, coverImage: dataUrl });
      showToast('封面图片已更新');
    } catch {
      showToast('图片处理失败，请换一张试试');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const selected = !value.coverImage && option.gradient === value.cover;
          return (
            <button
              key={option.gradient}
              type="button"
              aria-label={`选择封面样式 ${option.emoji}`}
              aria-pressed={selected}
              onClick={() => onChange({ cover: option.gradient, coverEmoji: option.emoji })}
              style={{ background: option.gradient }}
              className={cn(
                'flex h-16 w-16 items-center justify-center border-3 border-nb-black text-2xl transition-nb hover:scale-110 hover:-rotate-6',
                selected && 'scale-110 shadow-nb outline outline-3 outline-offset-2 outline-nb-black',
              )}
            >
              {option.emoji}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => void handleFile(event.target.files?.[0])}
        />
        <Button size="sm" variant="yellow" disabled={uploading} onClick={() => fileRef.current?.click()}>
          {uploading ? '处理中…' : '🖼 上传图片'}
        </Button>
        {value.coverImage ? (
          <>
            <span className="text-xs font-medium text-nb-muted">
              已使用上传的图片，图片加载失败会自动降级为渐变
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onChange({ ...value, coverImage: undefined })}
            >
              移除图片
            </Button>
          </>
        ) : (
          <span className="text-xs font-medium text-nb-muted">
            也可以放入 <code className="font-bold">src/assets/images/covers/</code> 后填入 coverImage 字段
          </span>
        )}
      </div>
    </div>
  );
}