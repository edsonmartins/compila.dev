"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * TerminalTyping - Efeito de digitação letra por letra
 *
 * @param text - Texto a ser digitado
 * @param speed - Velocidade de digitação em ms (default: 50)
 * @param cursor - Se deve mostrar cursor piscando (default: true)
 * @param className - Classes adicionais
 * @param delay - Delay antes de começar (default: 0)
 */
interface TerminalTypingProps {
  text: string;
  speed?: number;
  cursor?: boolean;
  className?: string;
  delay?: number;
  onComplete?: () => void;
}

export function TerminalTyping({
  text,
  speed = 50,
  cursor = true,
  className = "",
  delay = 0,
  onComplete,
}: TerminalTypingProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay, onComplete]);

  return (
    <span className={`inline-block ${className}`}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {displayedText}
      </motion.span>
      {cursor && !isComplete && (
        <span className="inline-block w-2 h-5 bg-terminal-cyan ml-1 cursor-blink align-middle" />
      )}
    </span>
  );
}
