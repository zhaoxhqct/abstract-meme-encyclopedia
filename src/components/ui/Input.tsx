/**
 * 表单控件：3px 黑边，focus 时上浮 + 硬阴影
 */
import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

const FIELD =
  'w-full border-3 border-nb-black bg-nb-bg px-4 py-3 text-sm font-medium text-nb-black transition-nb placeholder:text-nb-muted/70 focus:-translate-x-0.5 focus:-translate-y-0.5 focus:bg-nb-white focus:shadow-nb focus:outline-none';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={cn(FIELD, className)} {...rest} />;
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...rest }, ref) {
    return <textarea ref={ref} className={cn(FIELD, 'resize-y leading-relaxed', className)} {...rest} />;
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, ...rest }, ref) {
    return (
      <select ref={ref} className={cn(FIELD, 'cursor-pointer pr-8', className)} {...rest} />
    );
  },
);

/** 表单行：标题 + 必填星号 + 控件 */
export function FormRow({
  label,
  required = false,
  hint,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-5', className)}>
      <label className="mb-2 block text-sm font-black">
        {label}
        {required ? <span className="ml-1 text-nb-pink">*</span> : null}
        {hint ? <span className="ml-2 text-xs font-medium text-nb-muted">{hint}</span> : null}
      </label>
      {children}
    </div>
  );
}