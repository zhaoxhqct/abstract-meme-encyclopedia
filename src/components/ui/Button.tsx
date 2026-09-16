/**
 * NeoBrutalism 按钮：粗黑边 + 硬阴影，hover 上浮、按下回弹
 */
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '@/utils/cn';

export type ButtonVariant = 'primary' | 'yellow' | 'pink' | 'green' | 'white' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

const BASE =
  'inline-flex select-none items-center justify-center gap-1.5 border-3 border-nb-black font-bold shadow-nb transition-nb hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-nb-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-nb-none disabled:pointer-events-none disabled:opacity-50';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-nb-black text-nb-yellow',
  yellow: 'bg-nb-yellow text-nb-black',
  pink: 'bg-nb-pink text-nb-black',
  green: 'bg-nb-green text-nb-black',
  white: 'bg-nb-white text-nb-black',
  outline: 'bg-transparent text-nb-black',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

export function buttonClasses(options: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  const { variant = 'white', size = 'md', className } = options;
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'white', size = 'md', className, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={buttonClasses({ variant, size, className })} {...rest} />
  );
});

export interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/** 与 Button 同样式的路由链接 */
export function ButtonLink({ variant = 'white', size = 'md', className, ...rest }: ButtonLinkProps) {
  return <Link className={buttonClasses({ variant, size, className })} {...rest} />;
}