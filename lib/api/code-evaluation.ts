import { fetchApi } from './client';

export interface TestCase {
  input_data: string;
  expected_output: string;
  is_hidden?: boolean;
}

export interface CodeEvaluationRequest {
  code: string;
  language: string;
  problem_statement: string;
  test_cases?: TestCase[];
  constraints?: Record<string, unknown>;
}

export interface TestResult {
  test_name: string;
  passed: boolean;
  expected_output: string | null;
  actual_output: string | null;
  error_message: string | null;
  is_hidden: boolean;
}

export interface CodeFeedback {
  overall_score: number;
  strengths: string[];
  improvements: string[];
  best_practices: string[];
  complexity_analysis: string | null;
  hint: string | null;
}

export interface CodeEvaluationResponse {
  success: boolean;
  passed_tests: number;
  total_tests: number;
  test_results: TestResult[];
  feedback: CodeFeedback;
  execution_time_ms: number | null;
  error: string | null;
}

export interface CodeAnalysisRequest {
  code: string;
  language: string;
  analysis_type?: 'QUALITY' | 'SECURITY' | 'PERFORMANCE' | 'BEST_PRACTICES' | 'COMPLETENESS';
}

export interface CodeAnalysisResponse {
  score: number;
  summary: string;
  issues: Array<{
    severity: string;
    category: string;
    message: string;
    line: number | null;
    column: number | null;
  }>;
  suggestions: Array<{
    type: string;
    message: string;
    improved_code: string | null;
  }>;
  complexity_metrics: {
    cyclomatic_complexity: number;
    lines_of_code: number;
    cognitive_complexity: number;
  };
}

/**
 * Evaluate code submission against test cases
 */
export async function evaluateCode(request: CodeEvaluationRequest): Promise<CodeEvaluationResponse> {
  return fetchApi<CodeEvaluationResponse>('/ai/evaluate', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Analyze code quality without running tests
 */
export async function analyzeCode(request: CodeAnalysisRequest): Promise<CodeAnalysisResponse> {
  return fetchApi<CodeAnalysisResponse>('/ai/analyze', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Check AI service health
 */
export async function checkHealth(): Promise<{ status: string; enabled: boolean }> {
  return fetchApi<{ status: string; enabled: boolean }>('/ai/health');
}
