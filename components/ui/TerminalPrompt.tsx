import { ReactNode } from "react";

/**
 * TerminalPrompt - Linha de comando com prompt
 *
 * @param command - Comando a exibir
 * @param output - Output do comando (opcional)
 * @param user - Usuário do prompt (default: "user")
 * @param host - Host do prompt (default: "compila")
 * @param path - Caminho do prompt (default: "~")
 * @param showCursor - Se deve mostrar cursor piscando
 */
interface TerminalPromptProps {
  command: string;
  output?: ReactNode | string;
  user?: string;
  host?: string;
  path?: string;
  showCursor?: boolean;
  className?: string;
}

export function TerminalPrompt({
  command,
  output,
  user = "user",
  host = "compila",
  path = "~",
  showCursor = false,
  className = "",
}: TerminalPromptProps) {
  return (
    <div className={`mb-4 ${className}`}>
      {/* Prompt line */}
      <div className="flex items-center gap-2 text-terminal-fg">
        <span className="text-terminal-green font-semibold">
          {user}@{host}
        </span>
        <span className="text-terminal-gray">:</span>
        <span className="text-terminal-blue font-semibold">{path}</span>
        <span className="text-terminal-gray">$</span>
        <span className="text-terminal-cyan">{command}</span>
        {showCursor && (
          <span className="inline-block w-2 h-5 bg-terminal-cyan ml-1 cursor-blink" />
        )}
      </div>

      {/* Output */}
      {output && (
        <div className="mt-2 text-terminal-gray-light pl-4 border-l-2 border-terminal-gray/30">
          {typeof output === "string" ? (
            <pre className="whitespace-pre-wrap">{output}</pre>
          ) : (
            output
          )}
        </div>
      )}
    </div>
  );
}
