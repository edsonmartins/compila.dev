'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CodeSnippetProps {
  code: string;
  language?: string;
  lineHighlight?: number[];
  description?: string;
  maxHeight?: string;
  showLineNumbers?: boolean;
  className?: string;
}

// Simple syntax highlighting for common languages
const SYNTAX_PATTERNS: Record<string, { pattern: RegExp; className: string }[]> = {
  javascript: [
    { pattern: /(\/\/.*$)/gm, className: 'text-green-500 dark:text-green-400' }, // comments
    { pattern: /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|import|export|from|default|async|await|try|catch|finally|throw|typeof|instanceof)\b/g, className: 'text-purple-600 dark:text-purple-400' }, // keywords
    { pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g, className: 'text-blue-600 dark:text-blue-400' }, // literals
    { pattern: /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, className: 'text-amber-600 dark:text-amber-400' }, // strings
    { pattern: /\b(\d+\.?\d*)\b/g, className: 'text-orange-600 dark:text-orange-400' }, // numbers
    { pattern: /(\w+)(?=\s*\()/g, className: 'text-cyan-600 dark:text-cyan-400' }, // function calls
  ],
  typescript: [
    { pattern: /(\/\/.*$)/gm, className: 'text-green-500 dark:text-green-400' },
    { pattern: /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|import|export|from|default|async|await|try|catch|finally|throw|typeof|instanceof|interface|type|enum|implements|public|private|protected|readonly|as)\b/g, className: 'text-purple-600 dark:text-purple-400' },
    { pattern: /\b(true|false|null|undefined|NaN|Infinity)\b/g, className: 'text-blue-600 dark:text-blue-400' },
    { pattern: /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, className: 'text-amber-600 dark:text-amber-400' },
    { pattern: /\b(\d+\.?\d*)\b/g, className: 'text-orange-600 dark:text-orange-400' },
    { pattern: /(\w+)(?=\s*[\(<])/g, className: 'text-cyan-600 dark:text-cyan-400' },
    { pattern: /:\s*(\w+)(?=[\s,})])/g, className: 'text-emerald-600 dark:text-emerald-400' }, // type annotations
  ],
  python: [
    { pattern: /(#.*$)/gm, className: 'text-green-500 dark:text-green-400' },
    { pattern: /\b(def|return|if|else|elif|for|while|class|import|from|as|try|except|finally|raise|with|lambda|yield|global|nonlocal|assert|pass|break|continue|and|or|not|in|is)\b/g, className: 'text-purple-600 dark:text-purple-400' },
    { pattern: /\b(True|False|None)\b/g, className: 'text-blue-600 dark:text-blue-400' },
    { pattern: /("""[\s\S]*?"""|'''[\s\S]*?'''|"[^"]*"|'[^']*')/g, className: 'text-amber-600 dark:text-amber-400' },
    { pattern: /\b(\d+\.?\d*)\b/g, className: 'text-orange-600 dark:text-orange-400' },
    { pattern: /(\w+)(?=\s*\()/g, className: 'text-cyan-600 dark:text-cyan-400' },
  ],
  java: [
    { pattern: /(\/\/.*$|\/\*[\s\S]*?\*\/)/g, className: 'text-green-500 dark:text-green-400' },
    { pattern: /\b(public|private|protected|static|final|abstract|class|interface|extends|implements|new|return|if|else|for|while|do|switch|case|break|continue|throw|throws|try|catch|finally|import|package|void|int|boolean|char|String|System|out)\b/g, className: 'text-purple-600 dark:text-purple-400' },
    { pattern: /\b(true|false|null)\b/g, className: 'text-blue-600 dark:text-blue-400' },
    { pattern: /("[^"]*")/g, className: 'text-amber-600 dark:text-amber-400' },
    { pattern: /\b(\d+\.?\d*[lLfF]?)\b/g, className: 'text-orange-600 dark:text-orange-400' },
    { pattern: /(\w+)(?=\s*\()/g, className: 'text-cyan-600 dark:text-cyan-400' },
  ],
  html: [
    { pattern: /(&lt;!--[\s\S]*?--&gt;)/g, className: 'text-green-500 dark:text-green-400' },
    { pattern: /(&lt;\/?)([\w-]+)/g, className: 'text-purple-600 dark:text-purple-400' },
    { pattern: /\s([\w-]+)(?==)/g, className: 'text-blue-600 dark:text-blue-400' },
    { pattern: /("[^"]*")(?=[&gt;])/g, className: 'text-amber-600 dark:text-amber-400' },
  ],
  css: [
    { pattern: /(\/\*[\s\S]*?\*\/)/g, className: 'text-green-500 dark:text-green-400' },
    { pattern: /([.#]?[\w-]+)(?=\s*\{)/g, className: 'text-purple-600 dark:text-purple-400' },
    { pattern: /([\w-]+)(?=\s*:)/g, className: 'text-blue-600 dark:text-blue-400' },
    { pattern: /:\s*([^;{}]+)/g, className: 'text-amber-600 dark:text-amber-400' },
  ],
};

// Language label mapping
const LANGUAGE_LABELS: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  html: 'HTML',
  css: 'CSS',
  js: 'JavaScript',
  ts: 'TypeScript',
  py: 'Python',
  jsx: 'React JSX',
  tsx: 'React TSX',
  json: 'JSON',
  sql: 'SQL',
  shell: 'Shell',
  bash: 'Bash',
};

function highlightCode(code: string, language: string): React.ReactNode {
  const normalizedLanguage = language.toLowerCase();
  const patterns = SYNTAX_PATTERNS[normalizedLanguage];

  if (!patterns) {
    return code;
  }

  let result = code;
  const matches: Array<{ text: string; className: string; start: number }> = [];

  // Find all matches
  patterns.forEach(({ pattern, className }) => {
    let match;
    const regex = new RegExp(pattern.source, pattern.flags);
    while ((match = regex.exec(code)) !== null) {
      matches.push({
        text: match[0] || match[1] || match[2] || '',
        className,
        start: match.index,
      });
    }
  });

  // Sort by start position and remove overlaps
  matches.sort((a, b) => a.start - b.start);
  const nonOverlappingMatches: typeof matches = [];
  let lastEnd = 0;

  matches.forEach((match) => {
    if (match.start >= lastEnd) {
      nonOverlappingMatches.push(match);
      lastEnd = match.start + match.text.length;
    }
  });

  // Build highlighted result
  if (nonOverlappingMatches.length === 0) {
    return code;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  nonOverlappingMatches.forEach((match) => {
    if (match.start > lastIndex) {
      parts.push(code.slice(lastIndex, match.start));
    }
    parts.push(
      <span key={`${match.start}-${match.text}`} className={match.className}>
        {match.text}
      </span>
    );
    lastIndex = match.start + match.text.length;
  });

  if (lastIndex < code.length) {
    parts.push(code.slice(lastIndex));
  }

  return parts;
}

export function CodeSnippet({
  code,
  language = 'javascript',
  lineHighlight,
  description,
  maxHeight = '400px',
  showLineNumbers = true,
  className,
}: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.split('\n');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHighlighted = (index: number) => {
    return lineHighlight?.includes(index + 1);
  };

  const highlightedCode = highlightCode(code, language);

  return (
    <div className={cn('rounded-xl overflow-hidden border border-neutral-200 dark:border-dark-border', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-100 dark:bg-dark-card border-b border-neutral-200 dark:border-dark-border">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-neutral-600 dark:text-dark-muted uppercase tracking-wide">
            {LANGUAGE_LABELS[language.toLowerCase()] || language}
          </span>
          {description && (
            <span className="text-xs text-neutral-500 dark:text-dark-muted">
              • {description}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors hover:bg-neutral-200 dark:hover:bg-dark-border text-neutral-600 dark:text-dark-foreground"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copiar
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div
        className="relative overflow-auto bg-neutral-50 dark:bg-dark-background"
        style={{ maxHeight }}
      >
        <pre className="p-4 m-0">
          <code className="font-mono text-sm">
            {showLineNumbers ? (
              <div className="table">
                {lines.map((line, index) => (
                  <div
                    key={index}
                    className={cn(
                      'table-row',
                      isHighlighted(index) &&
                        'bg-amber-100 dark:bg-amber-900/20 -mx-4 px-4'
                    )}
                  >
                    <span className="table-cell text-right pr-4 select-none text-neutral-400 dark:text-dark-muted w-8 text-xs leading-6">
                      {index + 1}
                    </span>
                    <span className="table-cell text-neutral-700 dark:text-dark-foreground leading-6 whitespace-pre">
                      {line}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-neutral-700 dark:text-dark-foreground">
                {highlightedCode}
              </span>
            )}
          </code>
        </pre>
      </div>

      {/* Footer with line count */}
      <div className="px-4 py-1.5 bg-neutral-100 dark:bg-dark-card border-t border-neutral-200 dark:border-dark-border">
        <span className="text-xs text-neutral-500 dark:text-dark-muted">
          {lines.length} {lines.length === 1 ? 'linha' : 'linhas'}
        </span>
      </div>
    </div>
  );
}

export default CodeSnippet;
