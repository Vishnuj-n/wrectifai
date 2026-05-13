import * as React from 'react';
import { cn } from '@/utils/cn';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'h-11 w-full rounded-[12px] border border-[#dbe4f5] bg-white px-4 text-[13px] text-[#0f172a] shadow-sm outline-none placeholder:text-[#6b7aa5] focus:border-[#94b3ff] focus:ring-2 focus:ring-[#dbeafe]',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
