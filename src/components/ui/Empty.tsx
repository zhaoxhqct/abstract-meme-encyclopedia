/**
 * 空状态：插画 + 文案 + 可选操作
 */
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import emptyComment from '@/assets/images/illustrations/empty-comment.svg';
import emptyList from '@/assets/images/illustrations/empty-list.svg';
import emptySearch from '@/assets/images/illustrations/empty-search.svg';
import notFoundImage from '@/assets/images/illustrations/not-found.svg';
import { cn } from '@/utils/cn';

export type EmptyKind = 'list' | 'search' | 'comment' | 'notfound';

const ILLUSTRATIONS: Record<EmptyKind, string> = {
  list: emptyList,
  search: emptySearch,
  comment: emptyComment,
  notfound: notFoundImage,
};

export function Empty({
  kind = 'list',
  title,
  description,
  action,
  className,
}: {
  kind?: EmptyKind;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn('flex flex-col items-center px-5 py-14 text-center', className)}
    >
      <motion.img
        src={ILLUSTRATIONS[kind]}
        alt=""
        aria-hidden="true"
        className="mb-5 w-40 max-w-[60%] sm:w-48"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <p className="text-base font-black sm:text-lg">{title}</p>
      {description ? <p className="mt-2 max-w-md text-sm font-medium text-nb-muted">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </motion.div>
  );
}