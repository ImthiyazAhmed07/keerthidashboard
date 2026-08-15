export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Clean up any old persistent localStorage tokens
if (typeof window !== 'undefined') {
  localStorage.removeItem('keerthika_auth_token');
}

let sessionToken: string | null = typeof window !== 'undefined' ? sessionStorage.getItem('keerthika_session_token') : null;

export function setAuthToken(token: string | null) {
  sessionToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      sessionStorage.setItem('keerthika_session_token', token);
    } else {
      sessionStorage.removeItem('keerthika_session_token');
    }
  }
}

export function getAuthToken(): string | null {
  return sessionToken;
}

export async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (sessionToken) {
    headers['Authorization'] = `Bearer ${sessionToken}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (response.status === 401) {
    // If unauthorized, trigger event to show login screen
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.error || 'Something went wrong. 🌻', response.status);
  }

  return data;
}

export const api = {
  // Auth
  login: (username: string, password: string) =>
    request<{ success: boolean; user: any; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  logout: () =>
    request('/api/auth/logout', {
      method: 'POST',
    }),

  getMe: () => request<{ authenticated: boolean; user: any }>('/api/auth/me'),

  // Full dashboard
  getDashboard: () => request<{ success: boolean; data: any }>('/api/dashboard'),

  // Notes
  createNote: (payload: { title: string; category?: string; content?: string; pinned?: boolean; color?: string }) =>
    request('/api/notes', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateNote: (id: string, payload: any) =>
    request(`/api/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  togglePinNote: (id: string) =>
    request(`/api/notes/${id}/pin`, {
      method: 'PATCH',
    }),

  deleteNote: (id: string) =>
    request(`/api/notes/${id}`, {
      method: 'DELETE',
    }),

  // Tasks
  createTask: (payload: { title: string; priority?: string; dueDate?: string; category?: string }) =>
    request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateTask: (id: string, payload: any) =>
    request(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  toggleTask: (id: string) =>
    request(`/api/tasks/${id}/toggle`, {
      method: 'PATCH',
    }),

  deleteTask: (id: string) =>
    request(`/api/tasks/${id}`, {
      method: 'DELETE',
    }),

  // Dates
  createDate: (payload: { title: string; date: string; category?: string; description?: string; reminder?: boolean }) =>
    request('/api/dates', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateDate: (id: string, payload: any) =>
    request(`/api/dates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteDate: (id: string) =>
    request(`/api/dates/${id}`, {
      method: 'DELETE',
    }),

  // Links
  createLink: (payload: { title: string; url: string; category?: string; icon?: string }) =>
    request('/api/links', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateLink: (id: string, payload: any) =>
    request(`/api/links/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  deleteLink: (id: string) =>
    request(`/api/links/${id}`, {
      method: 'DELETE',
    }),

  // Favourite song
  updateSong: (payload: { song: string; artist: string; image?: string; url?: string; note?: string }) =>
    request('/api/song', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  // Settings
  updateSettings: (payload: any) =>
    request('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  updateProfile: (name: string) =>
    request('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify({ name }),
    }),

  // Backup & Stats
  getStats: () => request('/api/backup/stats'),

  restoreBackup: (rawContent: string) =>
    request('/api/backup/restore', {
      method: 'POST',
      body: JSON.stringify({ rawContent }),
    }),

  syncJson: (fullData: any) =>
    request('/api/backup/sync-json', {
      method: 'POST',
      body: JSON.stringify({ fullData }),
    }),
};
