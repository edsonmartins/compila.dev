import { ReactNode } from "react";

/**
 * TerminalWindow - Container estilo janela de terminal
 *
 * @param title - Título da janela (ex: "user@compila:~/challenges")
 * @param children - Conteúdo da janela
 * @param className - Classes adicionais
 */
interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function TerminalWindow({
  title = "user@compila:~",
  children,
  className = "",
}: TerminalWindowProps) {
  return (
    <div className={`rounded-lg overflow-hidden bg-terminal-bg border border-gray-800 ${className}`}>
      {/* Window controls */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-900/50 border-b border-gray-800">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-terminal-red" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-terminal-green" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs text-terminal-gray font-mono">{title}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 font-mono text-sm">
        {children}
      </div>
    </div>
  );
}
