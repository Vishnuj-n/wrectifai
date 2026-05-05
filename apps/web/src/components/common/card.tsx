import * as React from 'react';
import { cn } from '@/utils/cn';

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[14px] border border-white/80 bg-white shadow-[0_12px_32px_rgba(30,58,138,0.08)]',
        className
      )}
      {...props}
    />
  );
}
