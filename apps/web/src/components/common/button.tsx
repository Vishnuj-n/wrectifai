import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-[0_10px_20px_rgba(26,86,219,0.22)] hover:bg-[#174cc1]',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-slate-200/90',
        outline:
          'border border-[#dbe6ff] bg-white text-[#17307a] hover:border-[#bfd1ff] hover:bg-[#f8fbff]',
        ghost: 'bg-transparent text-[#17307a] hover:bg-[#eef4ff]',
        subtle: 'bg-[#eef4ff] text-[#17307a] hover:bg-[#e4edff]',
      },
      size: {
        default: 'h-10 px-4 py-2.5',
        sm: 'h-9 px-3.5 text-[13px]',
        lg: 'h-11 px-6 text-[15px]',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
