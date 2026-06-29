import * as React from 'react';
import { cn } from '@/utils/cn';

const badgeTones = {
  blue: 'bg-[#1a56db] text-white',
  green: 'bg-[#1e9b5f] text-white',
  orange: 'bg-[#f28c28] text-white',
  red: 'bg-[#ff4d5f] text-white',
  slate: 'bg-[#eef4ff] text-[#17307a]',
  lightGreen: 'bg-[#e7f8ee] text-[#238453]',
} as const;

type BadgeTone = keyof typeof badgeTones;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({
  className,
  tone = 'slate',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[10px] font-semibold leading-none',
        badgeTones[tone],
        className
      )}
      {...props}
    />
  );
}
