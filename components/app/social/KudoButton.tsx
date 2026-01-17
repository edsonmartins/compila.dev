'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  KudoType,
  KUDO_CONFIG,
  toggleKudo,
} from '@/lib/api/social';

interface KudoButtonProps {
  postId: string;
  userKudo?: KudoType;
  fireCount: number;
  rocketCount: number;
  lightbulbCount: number;
  cleanCount: number;
  targetCount: number;
  pairCount: number;
  onKudoChange?: (response: Awaited<ReturnType<typeof toggleKudo>>) => void;
  disabled?: boolean;
  compact?: boolean;
}

export function KudoButton({
  postId,
  userKudo,
  fireCount,
  rocketCount,
  lightbulbCount,
  cleanCount,
  targetCount,
  pairCount,
  onKudoChange,
  disabled = false,
  compact = false,
}: KudoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pendingKudo, setPendingKudo] = useState<KudoType | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const totalKudos = fireCount + rocketCount + lightbulbCount + cleanCount + targetCount + pairCount;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleKudoClick = async (kudoType: KudoType) => {
    if (disabled) return;

    // If clicking the same kudo type that's already active, remove it
    if (userKudo === kudoType) {
      setPendingKudo(null);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
      setIsOpen(false);

      try {
        const response = await toggleKudo(postId, kudoType);
        onKudoChange?.(response);
      } catch (error) {
        console.error('Failed to remove kudo:', error);
        toast.error('Não foi possível remover o kudo');
        // Revert state on error
        setPendingKudo(userKudo ?? null);
      }
      return;
    }

    // Otherwise, add/change kudo
    setPendingKudo(kudoType);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    setIsOpen(false);

    try {
      const response = await toggleKudo(postId, kudoType);
      onKudoChange?.(response);
    } catch (error) {
      console.error('Failed to give kudo:', error);
      toast.error('Não foi possível dar o kudo');
      // Revert state on error
      setPendingKudo(userKudo ?? null);
    }
  };

  const displayKudo = userKudo || pendingKudo;

  const getKudoCounts = () => {
    const counts = [
      { type: KudoType.FIRE, count: fireCount, ...KUDO_CONFIG[KudoType.FIRE] },
      { type: KudoType.ROCKET, count: rocketCount, ...KUDO_CONFIG[KudoType.ROCKET] },
      { type: KudoType.LIGHTBULB, count: lightbulbCount, ...KUDO_CONFIG[KudoType.LIGHTBULB] },
      { type: KudoType.CLEAN, count: cleanCount, ...KUDO_CONFIG[KudoType.CLEAN] },
      { type: KudoType.TARGET, count: targetCount, ...KUDO_CONFIG[KudoType.TARGET] },
      { type: KudoType.PAIR, count: pairCount, ...KUDO_CONFIG[KudoType.PAIR] },
    ];
    return counts.filter((k) => k.count > 0).sort((a, b) => b.count - a.count);
  };

  const topKudos = getKudoCounts();

  if (compact) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          ref={buttonRef}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200',
            'text-sm font-medium',
            displayKudo
              ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800'
              : 'bg-neutral-100 dark:bg-dark-border border border-transparent hover:border-neutral-300 dark:hover:border-neutral-600',
            isAnimating && 'scale-110',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <span className="text-base" style={{ fontSize: '16px' }}>
            {displayKudo ? KUDO_CONFIG[displayKudo].emoji : '👏'}
          </span>
          <span className="text-neutral-700 dark:text-dark-foreground">
            {totalKudos > 0 ? totalKudos : 'Kudo'}
          </span>
        </button>

        {/* Kudos Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute bottom-full left-0 mb-2 z-50">
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg border border-neutral-200 dark:border-dark-border p-2 min-w-[200px]">
              <p className="text-xs text-neutral-500 dark:text-dark-muted px-2 py-1 mb-1">
                Dê um Kudo!
              </p>
              <div className="grid grid-cols-2 gap-1">
                {(Object.keys(KUDO_CONFIG) as KudoType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleKudoClick(type)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all',
                      'hover:bg-neutral-100 dark:hover:bg-dark-border',
                      userKudo === type && 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
                    )}
                  >
                    <span className="text-lg">{KUDO_CONFIG[type].emoji}</span>
                    <div className="text-left">
                      <div className="font-medium text-neutral-700 dark:text-dark-foreground text-xs">
                        {type}
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-dark-muted">
                        {KUDO_CONFIG[type].label}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Kudo Button */}
      <button
        ref={buttonRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
          displayKudo
            ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400'
            : 'text-neutral-600 dark:text-dark-muted hover:bg-neutral-100 dark:hover:bg-dark-border',
          isAnimating && 'scale-110',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span className={cn('text-xl transition-transform', isAnimating && 'scale-125')}>
          {displayKudo ? KUDO_CONFIG[displayKudo].emoji : '👏'}
        </span>
        <span className="font-medium">
          {totalKudos > 0 ? totalKudos : 'Dar Kudo'}
        </span>
        {displayKudo && (
          <span className="text-xs opacity-70">
            {KUDO_CONFIG[displayKudo].label}
          </span>
        )}
      </button>

      {/* Kudos Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute bottom-full left-0 mb-2 z-50">
          <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg border border-neutral-200 dark:border-dark-border p-3 min-w-[280px]">
            <p className="text-sm text-neutral-600 dark:text-dark-foreground font-medium mb-2">
              Reconheça este post! 🎉
            </p>
            <div className="space-y-1">
              {(Object.keys(KUDO_CONFIG) as KudoType[]).map((type) => {
                const count =
                  type === KudoType.FIRE
                    ? fireCount
                    : type === KudoType.ROCKET
                      ? rocketCount
                      : type === KudoType.LIGHTBULB
                        ? lightbulbCount
                        : type === KudoType.CLEAN
                          ? cleanCount
                          : type === KudoType.TARGET
                            ? targetCount
                            : pairCount;

                return (
                  <button
                    key={type}
                    onClick={() => handleKudoClick(type)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all',
                      'hover:bg-neutral-100 dark:hover:bg-dark-border',
                      userKudo === type &&
                        'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{KUDO_CONFIG[type].emoji}</span>
                      <div className="text-left">
                        <div className="font-medium text-neutral-700 dark:text-dark-foreground">
                          {KUDO_CONFIG[type].label}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-dark-muted">
                          +{KUDO_CONFIG[type].xp} XP
                        </div>
                      </div>
                    </div>
                    {count > 0 && (
                      <span className="text-sm font-medium text-neutral-600 dark:text-dark-muted">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Top Kudos Pills (when not open) */}
      {!isOpen && topKudos.length > 0 && (
        <div className="flex items-center gap-1 mt-2 ml-2 flex-wrap">
          {topKudos.slice(0, 4).map((kudo) => (
            <button
              key={kudo.type}
              onClick={() => !disabled && handleKudoClick(kudo.type)}
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all',
                'hover:scale-105',
                userKudo === kudo.type
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                  : 'bg-neutral-100 dark:bg-dark-border text-neutral-600 dark:text-dark-muted'
              )}
              disabled={disabled}
            >
              <span>{kudo.emoji}</span>
              <span className="font-medium">{kudo.count}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default KudoButton;
