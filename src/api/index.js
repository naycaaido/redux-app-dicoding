import axios from 'axios';

const BASE_URL = 'https://forum-api.dicoding.dev/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const getToken = () => localStorage.getItem('token');

const authConfig = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

// Auth
export const apiRegister = ({ name, email, password }) =>
  api.post('/register', { name, email, password });
export const apiLogin = ({ email, password }) =>
  api.post('/login', { email, password });
export const apiGetOwnProfile = () => api.get('/users/me', authConfig());

// Users
export const apiGetAllUsers = () => api.get('/users');

// Threads
export const apiGetAllThreads = () => api.get('/threads');
export const apiCreateThread = ({ title, body, category }) =>
  api.post('/threads', { title, body, category }, authConfig());
export const apiGetThreadDetail = (threadId) => api.get(`/threads/${threadId}`);

// Thread Votes
export const apiUpVoteThread = (threadId) =>
  api.post(`/threads/${threadId}/up-vote`, {}, authConfig());
export const apiDownVoteThread = (threadId) =>
  api.post(`/threads/${threadId}/down-vote`, {}, authConfig());
export const apiNeutralVoteThread = (threadId) =>
  api.post(`/threads/${threadId}/neutral-vote`, {}, authConfig());

// Comments
export const apiCreateComment = (threadId, content) =>
  api.post(`/threads/${threadId}/comments`, { content }, authConfig());

// Comment Votes
export const apiUpVoteComment = (threadId, commentId) =>
  api.post(
    `/threads/${threadId}/comments/${commentId}/up-vote`,
    {},
    authConfig(),
  );
export const apiDownVoteComment = (threadId, commentId) =>
  api.post(
    `/threads/${threadId}/comments/${commentId}/down-vote`,
    {},
    authConfig(),
  );
export const apiNeutralVoteComment = (threadId, commentId) =>
  api.post(
    `/threads/${threadId}/comments/${commentId}/neutral-vote`,
    {},
    authConfig(),
  );

// Leaderboard
export const apiGetLeaderboards = () => api.get('/leaderboards');
