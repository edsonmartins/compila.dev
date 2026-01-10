import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
        {
          'border-transparent bg-accent text-white hover:bg-accent/80': variant === 'default',
          'border-transparent bg-neutral-100 text-neutral-900 dark:bg-dark-border dark:text-dark-foreground hover:bg-neutral-200 dark:hover:bg-dark-border/80':
            variant === 'secondary',
          'border-transparent bg-red-500 text-white hover:bg-red-600':
            variant === 'destructive',
          'border-neutral-300 dark:border-dark-border text-neutral-700 dark:text-dark-foreground':
            variant === 'outline',
          'border-transparent bg-green-500 text-white hover:bg-green-600':
            variant === 'success',
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };
