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

// WebSocket message types for real-time code evaluation
export type WebSocketMessageType =
  | 'task_id'
  | 'status'
  | 'test_result'
  | 'feedback'
  | 'result'
  | 'error';

export interface BaseWebSocketMessage {
  type: WebSocketMessageType;
}

export interface TaskIdMessage extends BaseWebSocketMessage {
  type: 'task_id';
  task_id: string;
}

export interface StatusMessage extends BaseWebSocketMessage {
  type: 'status';
  content: string;
}

export interface TestResultMessage extends BaseWebSocketMessage {
  type: 'test_result';
  test_name: string;
  passed: boolean;
  expected_output?: string | null;
  actual_output?: string | null;
  error_message?: string | null;
  is_hidden?: boolean;
}

export interface FeedbackMessage extends BaseWebSocketMessage {
  type: 'feedback';
  overall_score: number;
  strengths: string[];
  improvements: string[];
  best_practices?: string[];
  complexity_analysis?: string | null;
  hint: string | null;
}

export interface ResultMessage extends BaseWebSocketMessage {
  type: 'result';
  success: boolean;
  passed_tests: number;
  total_tests: number;
  execution_time_ms?: number;
}

export interface ErrorMessage extends BaseWebSocketMessage {
  type: 'error';
  content: string;
}

export type WebSocketMessage =
  | TaskIdMessage
  | StatusMessage
  | TestResultMessage
  | FeedbackMessage
  | ResultMessage
  | ErrorMessage;

/**
 * Callbacks for WebSocket evaluation events
 */
export interface EvaluationCallbacks {
  onTaskId?: (taskId: string) => void;
  onStatus?: (status: string) => void;
  onTestResult?: (result: TestResult) => void;
  onFeedback?: (feedback: CodeFeedback) => void;
  onResult?: (result: { success: boolean; passed_tests: number; total_tests: number }) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
}

/**
 * Evaluate code using WebSocket for real-time feedback
 *
 * @param request - Code evaluation request
 * @param callbacks - Event callbacks for streaming results
 * @returns WebSocket close promise
 */
export function evaluateCodeWebSocket(
  request: CodeEvaluationRequest,
  callbacks: EvaluationCallbacks
): { ws: WebSocket; close: () => void } {
  // Get AI service URL from env or use default
  const aiServiceUrl = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'ws://localhost:8000';

  const ws = new WebSocket(`${aiServiceUrl}/api/v1/compila/evaluate`);

  ws.onopen = () => {
    // Send evaluation request once connection is open
    ws.send(JSON.stringify(request));
  };

  ws.onmessage = (event: MessageEvent) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);

      switch (message.type) {
        case 'task_id':
          callbacks.onTaskId?.((message as TaskIdMessage).task_id);
          break;

        case 'status':
          callbacks.onStatus?.((message as StatusMessage).content);
          break;

        case 'test_result': {
          const result = message as TestResultMessage;
          callbacks.onTestResult?.({
            test_name: result.test_name,
            passed: result.passed,
            expected_output: result.expected_output ?? null,
            actual_output: result.actual_output ?? null,
            error_message: result.error_message ?? null,
            is_hidden: result.is_hidden ?? false,
          });
          break;
        }

        case 'feedback': {
          const feedback = message as FeedbackMessage;
          callbacks.onFeedback?.({
            overall_score: feedback.overall_score,
            strengths: feedback.strengths,
            improvements: feedback.improvements,
            best_practices: feedback.best_practices ?? [],
            complexity_analysis: feedback.complexity_analysis ?? null,
            hint: feedback.hint,
          });
          break;
        }

        case 'result': {
          const result = message as ResultMessage;
          callbacks.onResult?.({
            success: result.success,
            passed_tests: result.passed_tests,
            total_tests: result.total_tests,
          });
          break;
        }

        case 'error':
          callbacks.onError?.((message as ErrorMessage).content);
          break;
      }
    } catch (err) {
      console.error('Error parsing WebSocket message:', err);
      callbacks.onError?.('Failed to parse server response');
    }
  };

  ws.onerror = (event) => {
    console.error('WebSocket error:', event);
    callbacks.onError?.('Connection error');
  };

  ws.onclose = () => {
    callbacks.onClose?.();
  };

  return {
    ws,
    close: () => ws.close(),
  };
}
