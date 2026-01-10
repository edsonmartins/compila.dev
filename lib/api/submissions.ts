/**
 * Submissions API
 */

import { fetchApi } from './client';

export type SubmissionStatus = 'PENDING' | 'PASSED' | 'FAILED' | 'PARTIAL' | 'ERROR';

export type ProgrammingLanguage =
  | 'JAVASCRIPT'
  | 'TYPESCRIPT'
  | 'PYTHON'
  | 'JAVA'
  | 'C_SHARP'
  | 'GO'
  | 'RUST'
  | 'PHP'
  | 'CPLUSPLUS'
  | 'KOTLIN'
  | 'SWIFT'
  | 'DART'
  | 'RUBY'
  | 'OTHER';

export interface SubmitRequest {
  challengeId: string;
  code: string;
  language: ProgrammingLanguage;
  files?: Record<string, unknown>;
}

export interface Submission {
  id: string;
  userId: string;
  challengeId: string;
  code: string;
  language: ProgrammingLanguage;
  status: SubmissionStatus;
  score?: number;
  xpGained: number;
  testResults?: Record<string, unknown>;
  aiFeedback?: Record<string, unknown>;
  executionTimeMs?: number;
  attemptNumber: number;
  submittedAt: string;
  createdAt: string;
}

export interface SubmissionResponse {
  id: string;
  userId: string;
  challengeId: string;
  code: string;
  language: ProgrammingLanguage;
  files?: Record<string, unknown>;
  status: SubmissionStatus;
  testResults?: Record<string, unknown>;
  score?: number;
  xpGained?: number;
  aiFeedback?: {
    message?: string;
    suggestions?: string[];
    score?: number;
  };
  executionTimeMs?: number;
  attemptNumber: number;
  submittedAt: string;
  createdAt: string;
}

export async function submitCode(data: SubmitRequest): Promise<SubmissionResponse> {
  return fetchApi<SubmissionResponse>('/submissions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getSubmission(id: string): Promise<SubmissionResponse> {
  return fetchApi<SubmissionResponse>(`/submissions/${id}`);
}

export async function getUserSubmissions(
  userId: string,
  page = 0,
  size = 20
): Promise<{ content: SubmissionResponse[]; totalElements: number }> {
  return fetchApi<{ content: SubmissionResponse[]; totalElements: number }>(
    `/submissions/user/${userId}?page=${page}&size=${size}`
  );
}

export async function getChallengeSubmissions(
  challengeId: string,
  page = 0,
  size = 20
): Promise<{ content: SubmissionResponse[]; totalElements: number }> {
  return fetchApi<{ content: SubmissionResponse[]; totalElements: number }>(
    `/submissions/challenge/${challengeId}?page=${page}&size=${size}`
  );
}
