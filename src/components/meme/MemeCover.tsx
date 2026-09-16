/**
 * 核心封面组件
 *
 * 渲染优先级：coverImage 真实图片 → 加载失败或未配置时降级为 cover 渐变 + coverEmoji。
 * 保证「没有图片素材」和「图片 404」两种情况下的视觉都不会崩。
 */
import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';

export interface MemeCoverProps {
  /** 渐变 fallback，形如 linear-gradient(135deg, #fff, #000) */
  cover: string;
  coverEmoji: string;
  /** 真实图片地址（import 的资源或上传的 dataURL） */
  coverImage?: string;
  /** 图片 alt 文案 */
  alt?: string;
  className?: string;
  /** emoji 的额外样式（尺寸、悬浮动画等） */
  emojiClassName?: string;
}

export function MemeCover({
  cover,
  coverEmoji,
  coverImage,
  alt = '',
  className,
  emojiClassName,
}: MemeCoverProps) {
  const [failed, setFailed] = useState(false);

  // 换图后重置失败状态，避免上一张图的错误影响新图
  useEffect(() => setFailed(false), [coverImage]);

  const showImage = Boolean(coverImage) && !failed;

  return (
    <div
      className={cn('relative flex items-center justify-center overflow-hidden', className)}
      style={{ background: cover }}
    >
      {showImage ? (
        <img
          src={coverImage}
          alt={alt}
          loading="lazy"
          draggable={false}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className={cn('drop-shadow-[3px_3px_0_rgba(0,0,0,0.2)]', emojiClassName)}
        >
          {coverEmoji}
        </span>
      )}
    </div>
  );
}