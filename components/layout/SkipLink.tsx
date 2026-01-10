/**
 * SkipLink - Link para acessibilidade (pular para o conteúdo)
 * Conforme WCAG 2.1 AA
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
    >
      Pular para o conteúdo
    </a>
  );
}
