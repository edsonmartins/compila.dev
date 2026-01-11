"""
Code Analyzer Service
=====================

AI-powered code analysis and feedback generation.
"""

from typing import Any

from src.api.routers.code_evaluation import CodeFeedback, TestResult
from src.logging import get_logger
from src.services.llm.factory import LLMFactory

logger = get_logger("CodeAnalyzer")


class CodeAnalyzer:
    """Analyze code quality and generate AI feedback"""

    # System prompts for different languages
    SYSTEM_PROMPTS = {
        "python": """Você é um especialista em Python que avalia código de alunos.
Forneça feedback construtivo em português brasileiro.
Analise: qualidade do código, boas práticas PEP 8, eficiência, e legibilidade。""",

        "javascript": """Você é um especialista em JavaScript/TypeScript que avalia código de alunos.
Forneça feedback construtivo em português brasileiro.
Analise: qualidade do código, ES6+ features, async/await, e padrões modernos.""",

        "java": """Você é um especialista em Java que avalia código de alunos.
Forneça feedback construtivo em português brasileiro.
Analise: orientação a objetos, convenções de nomenclatura, e boas práticas.""",

        "default": """Você é um especialista em programação que avalia código de alunos.
Forneça feedback construtivo em português brasileiro."""
    }

    def __init__(self, language: str):
        self.language = language.lower()
        self.system_prompt = self.SYSTEM_PROMPTS.get(
            self.language,
            self.SYSTEM_PROMPTS["default"]
        )

    async def analyze(
        self,
        code: str,
        problem_statement: str,
        test_results: list[TestResult]
    ) -> CodeFeedback:
        """
        Analyze code and generate AI feedback.

        Args:
            code: The source code to analyze
            problem_statement: Description of the problem
            test_results: Results from test execution

        Returns:
            CodeFeedback with AI-generated analysis
        """
        try:
            # Try to use LLM for analysis
            llm_factory = LLMFactory.get_instance()
            llm_client = llm_factory.get_default_client()

            if llm_client:
                return await self._analyze_with_llm(
                    llm_client,
                    code,
                    problem_statement,
                    test_results
                )
        except Exception as e:
            logger.warning(f"LLM analysis failed: {e}")

        # Fallback: rule-based analysis
        return self._rule_based_analysis(code, test_results)

    async def _analyze_with_llm(
        self,
        llm_client: Any,
        code: str,
        problem_statement: str,
        test_results: list[TestResult]
    ) -> CodeFeedback:
        """Generate feedback using LLM"""

        # Prepare analysis prompt
        passed = sum(1 for t in test_results if t.passed)
        total = len(test_results)

        prompt = f"""Analise o seguinte código em {self.language}:

## Problema:
{problem_statement}

## Código do Aluno:
```{self.language}
{code}
```

## Resultado dos Testes:
{passed}/{total} testes passaram

{self._format_test_results(test_results)}

## Instruções:
Forneça uma análise em JSON com este formato exato:
{{
    "overall_score": <0-100>,
    "strengths": ["<ponto forte 1>", "<ponto forte 2>"],
    "improvements": ["<melhoria 1>", "<melhoria 2>"],
    "best_practices": ["<prática 1>", "<prática 2>"],
    "complexity_analysis": "<análise da complexidade>",
    "hint": "<dica sutil sem dar a resposta direta>"
}}

Seja encorajador mas construtivo. Use no máximo 3 itens em cada lista.
O hint deve ser útil mas não revelar a solução completa."""

        try:
            response = await llm_client.ainvoke(prompt)
            return self._parse_llm_response(response)
        except Exception as e:
            logger.error(f"Error in LLM analysis: {e}")
            return self._rule_based_analysis(code, test_results)

    def _format_test_results(self, test_results: list[TestResult]) -> str:
        """Format test results for the prompt"""
        if not test_results:
            return "Nenhum teste executado."

        lines = []
        for result in test_results:
            if not result.is_hidden:
                status = "✓ PASSOU" if result.passed else "✗ FALHOU"
                lines.append(f"- {result.test_name}: {status}")
                if result.error_message:
                    lines.append(f"  Erro: {result.error_message}")

        return "\n".join(lines) if lines else "Todos os testes visíveis passaram."

    def _parse_llm_response(self, response: str) -> CodeFeedback:
        """Parse LLM response into CodeFeedback"""
        import json
        import re

        try:
            # Try to extract JSON from response
            json_match = re.search(r'\{[^{}]*\{.*\}[^{}]*\}|\{[^{}]*\}', response, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
                return CodeFeedback(**data)
        except (json.JSONDecodeError, TypeError) as e:
            logger.warning(f"Failed to parse LLM response as JSON: {e}")

        # Fallback: extract key information from text
        return self._extract_from_text(response)

    def _extract_from_text(self, text: str) -> CodeFeedback:
        """Extract feedback from unstructured text"""
        # Simple rule-based extraction
        return CodeFeedback(
            overall_score=70,  # Default score
            strengths=["Código submetido"],
            improvements=["Revise os requisitos do problema"],
            best_practices=[],
            complexity_analysis="Análise não disponível",
            hint="Leia atentamente o enunciado e tente novamente"
        )

    def _rule_based_analysis(
        self,
        code: str,
        test_results: list[TestResult]
    ) -> CodeFeedback:
        """Generate rule-based feedback without LLM"""
        strengths = []
        improvements = []
        best_practices = []

        # Basic code analysis
        lines = code.split('\n')
        non_empty_lines = [l for l in lines if l.strip()]

        # Check for basic patterns
        if len(non_empty_lines) > 10:
            strengths.append("Código bem estruturado")

        if any('def ' in l or 'function ' in l or 'class ' in l for l in lines):
            improvements.append("Considere adicionar docstrings/comentários")

        if 'TODO' in code or 'FIXME' in code:
            improvements.append("Há tarefas pendentes marcadas no código")

        # Language-specific checks
        if self.language == "python":
            if not any('import ' in l for l in lines):
                best_practices.append("Use imports explícitos")
            if code.count('print') > 3:
                improvements.append("Considere usar logging em vez de múltiplos prints")

        elif self.language == "javascript":
            if 'var ' in code:
                improvements.append("Use const/let em vez de var")
            if 'console.log' in code:
                best_practices.append("Remova console.logs antes de submeter")

        # Test-based feedback
        passed = sum(1 for t in test_results if t.passed)
        total = len(test_results)

        if total > 0:
            score = int((passed / total) * 100)
            if passed == total:
                strengths.append(f"Todos os {total} testes passaram!")
            elif passed > 0:
                improvements.append(f"{total - passed} teste(s) falharam - revise sua lógica")
            else:
                improvements.append("Nenhum teste passou - revise sua abordagem")
        else:
            score = 50  # Default when no tests

        # Generate hint based on failures
        hint = self._generate_hint(test_results)

        return CodeFeedback(
            overall_score=score,
            strengths=strengths or ["Código submetido para avaliação"],
            improvements=improvements or ["Continue praticando!"],
            best_practices=best_practices,
            complexity_analysis="Análise básica",
            hint=hint
        )

    def _generate_hint(self, test_results: list[TestResult]) -> str:
        """Generate a helpful hint based on test failures"""
        failures = [t for t in test_results if not t.passed and not t.is_hidden]

        if not failures:
            return "Ótimo trabalho! Continue explorando."

        if failures[0].error_message:
            error = failures[0].error_message
            if "NameError" in error or "ReferenceError" in error:
                return "Verifique se todas as variáveis estão definidas antes de usar."
            elif "SyntaxError" in error:
                return "Há um erro de sintaxe - verifique a pontuação e parênteses."
            elif "IndentationError" in error:
                return "Verifique a indentação do código."
            elif "IndexError" in error or "out of range" in error.lower():
                return "Cuidado com os índices - verifique se não está acessando posições inválidas."
            elif "TypeError" in error:
                return "Verifique os tipos de dados das variáveis."

        return "Revise a lógica e teste novamente com diferentes casos."
