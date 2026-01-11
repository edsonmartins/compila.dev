'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SelectContextValue {
  value: string;
  onChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextValue | undefined>(undefined);

const useSelectContext = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('Select components must be used within <Select>');
  }
  return context;
};

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ value, onChange: onValueChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps {
  className?: string;
  children: React.ReactNode;
}

export function SelectTrigger({ className, children }: SelectTriggerProps) {
  const { setOpen, open } = useSelectContext();
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        'flex items-center justify-between w-full px-3 py-2 text-sm bg-white dark:bg-dark-card',
        'border border-neutral-300 dark:border-dark-border rounded-lg',
        'focus:outline-none focus:ring-2 focus:ring-accent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {children}
      <svg
        className={cn('w-4 h-4 ml-2 transition-transform', open && 'rotate-180')}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

interface SelectValueProps {
  placeholder?: string;
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const { value } = useSelectContext();

  return (
    <span className={cn(!value && 'text-neutral-500 dark:text-dark-muted')}>
      {value || placeholder}
    </span>
  );
}

interface SelectContentProps {
  children: React.ReactNode;
}

export function SelectContent({ children }: SelectContentProps) {
  const { open, setOpen } = useSelectContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      className="absolute z-50 w-full mt-1 bg-white dark:bg-dark-card border border-neutral-200 dark:border-dark-border rounded-lg shadow-lg max-h-60 overflow-auto"
    >
      <div className="py-1">{children}</div>
    </div>
  );
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

export function SelectItem({ value, children }: SelectItemProps) {
  const { value: selectedValue, onChange, setOpen } = useSelectContext();

  const isSelected = value === selectedValue;

  return (
    <button
      type="button"
      onClick={() => {
        onChange(value);
        setOpen(false);
      }}
      className={cn(
        'w-full text-left px-3 py-2 text-sm',
        'hover:bg-neutral-100 dark:hover:bg-dark-border',
        'focus:bg-neutral-100 dark:focus:bg-dark-border focus:outline-none',
        isSelected && 'bg-accent/10 text-accent'
      )}
    >
      {children}
    </button>
  );
}
