/**
 * Social Feed API
 */

import { fetchApi } from './client';

// ==================== Types & Enums ====================

export enum PostType {
  QUESTION = 'QUESTION',
  SHARE = 'SHARE',
  PROJECT = 'PROJECT',
  CHALLENGE_COMPLETED = 'CHALLENGE_COMPLETED',
  ACHIEVEMENT = 'ACHIEVEMENT',
  SNIPPET = 'SNIPPET',
  PAIR_REQUEST = 'PAIR_REQUEST',
  CODE_REVIEW = 'CODE_REVIEW',
}

export enum KudoType {
  FIRE = 'FIRE',
  ROCKET = 'ROCKET',
  LIGHTBULB = 'LIGHTBULB',
  CLEAN = 'CLEAN',
  TARGET = 'TARGET',
  PAIR = 'PAIR',
}

export const KUDO_CONFIG: Record<KudoType, { emoji: string; label: string; xp: number }> = {
  [KudoType.FIRE]: { emoji: '🔥', label: 'Código impressionante', xp: 5 },
  [KudoType.ROCKET]: { emoji: '🚀', label: 'Solução criativa', xp: 5 },
  [KudoType.LIGHTBULB]: { emoji: '💡', label: 'Me ensinei algo novo', xp: 3 },
  [KudoType.CLEAN]: { emoji: '✨', label: 'Código limpo', xp: 4 },
  [KudoType.TARGET]: { emoji: '🎯', label: 'Respondeu minha dúvida', xp: 3 },
  [KudoType.PAIR]: { emoji: '🤝', label: 'Vamos codar juntos', xp: 2 },
};

export const POST_TYPE_CONFIG: Record<PostType, { label: string; icon: string }> = {
  [PostType.QUESTION]: { label: 'Pergunta', icon: '❓' },
  [PostType.SHARE]: { label: 'Compartilhamento', icon: '📢' },
  [PostType.PROJECT]: { label: 'Projeto', icon: '🚀' },
  [PostType.CHALLENGE_COMPLETED]: { label: 'Desafio Completado', icon: '🏆' },
  [PostType.ACHIEVEMENT]: { label: 'Conquista', icon: '⭐' },
  [PostType.SNIPPET]: { label: 'Snippet de Código', icon: '💻' },
  [PostType.PAIR_REQUEST]: { label: 'Pair Programming', icon: '👥' },
  [PostType.CODE_REVIEW]: { label: 'Code Review', icon: '🔍' },
};

// ==================== Code Snippet ====================

export interface CodeSnippet {
  language: string;
  code: string;
  lineHighlight?: number[];
  description?: string;
}

// ==================== DTOs ====================

export interface CreatePostRequest {
  content: string;
  type: PostType;
  codeSnippet?: CodeSnippet;
  metadata?: Record<string, unknown>;
  challengeId?: string;
  badgeId?: string;
  imageUrl?: string;
}

export interface UpdatePostRequest {
  content: string;
  codeSnippet?: CodeSnippet;
  metadata?: Record<string, unknown>;
}

export interface FeedPostResponse {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  content: string;
  type: PostType;
  codeSnippet?: CodeSnippet;
  metadata?: Record<string, unknown>;
  fireCount: number;
  rocketCount: number;
  lightbulbCount: number;
  cleanCount: number;
  targetCount: number;
  pairCount: number;
  totalKudos: number;
  userKudo?: KudoType;
  commentCount: number;
  viewCount: number;
  solutionCommentId?: string;
  isSolved: boolean;
  createdAt: string;
  publishedAt?: string;
  timeAgo: string;
  imageUrl?: string;
  challengeId?: string;
  badgeId?: string;
}

export interface CommentRequest {
  content: string;
  codeSnippet?: CodeSnippet;
  parentId?: string;
}

export interface CommentResponse {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  postId: string;
  parentId?: string;
  content: string;
  codeSnippet?: CodeSnippet;
  isSolution: boolean;
  fireCount: number;
  acceptedAt?: string;
  createdAt: string;
  timeAgo: string;
  replyCount: number;
  isOwner: boolean;
  isDeleted: boolean;
}

export interface KudoResponse {
  active: boolean;
  postId: string;
  kudoType?: KudoType;
  message: string;
  fireCount: number;
  rocketCount: number;
  lightbulbCount: number;
  cleanCount: number;
  targetCount: number;
  pairCount: number;
  totalKudos: number;
}

export interface FollowResponse {
  following: boolean;
  followersCount: number;
  followingCount: number;
}

export interface SocialUserStats {
  id: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  totalKudosReceived: number;
  solutionsProvided: number;
  topTechnologies: string[];
  badges: string[];
}

// ==================== API Functions ====================

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

/**
 * Get main feed - combines followed users' posts and trending content
 */
export async function getFeed(
  page = 0,
  size = 20
): Promise<PaginatedResponse<FeedPostResponse>> {
  return fetchApi<PaginatedResponse<FeedPostResponse>>(`/feed?page=${page}&size=${size}`);
}

/**
 * Get trending posts
 */
export async function getTrending(
  page = 0,
  size = 20
): Promise<PaginatedResponse<FeedPostResponse>> {
  return fetchApi<PaginatedResponse<FeedPostResponse>>(`/feed/trending?page=${page}&size=${size}`);
}

/**
 * Get posts by type
 */
export async function getPostsByType(
  type: PostType,
  page = 0,
  size = 20
): Promise<PaginatedResponse<FeedPostResponse>> {
  return fetchApi<PaginatedResponse<FeedPostResponse>>(`/feed/type/${type}?page=${page}&size=${size}`);
}

/**
 * Get unsolved questions
 */
export async function getUnsolvedQuestions(
  page = 0,
  size = 20
): Promise<PaginatedResponse<FeedPostResponse>> {
  return fetchApi<PaginatedResponse<FeedPostResponse>>(`/feed/questions/unsolved?page=${page}&size=${size}`);
}

/**
 * Get posts with code snippets
 */
export async function getPostsWithSnippets(
  page = 0,
  size = 20
): Promise<PaginatedResponse<FeedPostResponse>> {
  return fetchApi<PaginatedResponse<FeedPostResponse>>(`/feed/snippets?page=${page}&size=${size}`);
}

/**
 * Search posts
 */
export async function searchPosts(
  query: string,
  page = 0,
  size = 20
): Promise<PaginatedResponse<FeedPostResponse>> {
  return fetchApi<PaginatedResponse<FeedPostResponse>>(
    `/feed/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`
  );
}

/**
 * Get a single post by ID
 */
export async function getPostById(postId: string): Promise<FeedPostResponse> {
  return fetchApi<FeedPostResponse>(`/feed/posts/${postId}`);
}

/**
 * Get posts by user
 */
export async function getPostsByUser(
  userId: string,
  page = 0,
  size = 20
): Promise<PaginatedResponse<FeedPostResponse>> {
  return fetchApi<PaginatedResponse<FeedPostResponse>>(
    `/feed/users/${userId}/posts?page=${page}&size=${size}`
  );
}

/**
 * Create a new post
 */
export async function createPost(request: CreatePostRequest): Promise<FeedPostResponse> {
  return fetchApi<FeedPostResponse>('/feed/posts', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Update a post
 */
export async function updatePost(
  postId: string,
  request: UpdatePostRequest
): Promise<FeedPostResponse> {
  return fetchApi<FeedPostResponse>(`/feed/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
}

/**
 * Delete a post (soft delete)
 */
export async function deletePost(postId: string): Promise<void> {
  return fetchApi<void>(`/feed/posts/${postId}`, {
    method: 'DELETE',
  });
}

/**
 * Toggle kudo on a post
 */
export async function toggleKudo(
  postId: string,
  kudoType: KudoType
): Promise<KudoResponse> {
  return fetchApi<KudoResponse>(`/feed/posts/${postId}/kudos?kudoType=${kudoType}`, {
    method: 'POST',
  });
}

/**
 * Get comments for a post
 */
export async function getComments(
  postId: string,
  page = 0,
  size = 20
): Promise<PaginatedResponse<CommentResponse>> {
  return fetchApi<PaginatedResponse<CommentResponse>>(
    `/feed/posts/${postId}/comments?page=${page}&size=${size}`
  );
}

/**
 * Add a comment to a post
 */
export async function addComment(
  postId: string,
  request: CommentRequest
): Promise<CommentResponse> {
  return fetchApi<CommentResponse>(`/feed/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Get replies to a comment
 */
export async function getCommentReplies(
  commentId: string,
  page = 0,
  size = 20
): Promise<PaginatedResponse<CommentResponse>> {
  return fetchApi<PaginatedResponse<CommentResponse>>(
    `/feed/comments/${commentId}/replies?page=${page}&size=${size}`
  );
}

/**
 * Mark a comment as the solution to a question post
 */
export async function markAsSolution(
  postId: string,
  commentId: string
): Promise<CommentResponse> {
  return fetchApi<CommentResponse>(
    `/feed/posts/${postId}/comments/${commentId}/solution`,
    {
      method: 'PUT',
    }
  );
}

/**
 * Toggle follow a user
 */
export async function toggleFollow(targetUserId: string): Promise<FollowResponse> {
  return fetchApi<FollowResponse>(`/feed/users/${targetUserId}/follow`, {
    method: 'POST',
  });
}

/**
 * Get followers of a user
 */
export async function getFollowers(userId: string): Promise<SocialUserStats[]> {
  return fetchApi<SocialUserStats[]>(`/feed/users/${userId}/followers`);
}

/**
 * Get users followed by a user
 */
export async function getFollowing(userId: string): Promise<SocialUserStats[]> {
  return fetchApi<SocialUserStats[]>(`/feed/users/${userId}/following`);
}

/**
 * Get user social stats
 */
export async function getUserSocialStats(userId: string): Promise<SocialUserStats> {
  return fetchApi<SocialUserStats>(`/feed/users/${userId}/stats`);
}
