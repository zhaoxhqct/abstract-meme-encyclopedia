/**
 * 头像：既支持 emoji（原型数据），也支持图片地址 / dataURL（用户上传）
 */
import { cn } from '@/utils/cn';

const IMAGE_PATTERN = /^(data:|blob:|https?:|\/|\.)/;

export function Avatar({
  value,
  className,
  textClassName,
}: {
  /** emoji 或图片地址 */
  value: string;
  className?: string;
  textClassName?: string;
}) {
  const isImage = IMAGE_PATTERN.test(value);

  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden border-3 border-nb-black bg-nb-pink',
        className,
      )}
    >
      {isImage ? (
        <img src={value} alt="" className="h-full w-full object-cover" draggable={false} />
      ) : (
        <span aria-hidden="true" className={textClassName}>
          {value}
        </span>
      )}
    </span>
  );
}