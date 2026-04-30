export const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE}/${endpoint.replace(/^\//, '')}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP Error ${response.status}`);
  }
  
  if (response.status !== 204) {
    return response.json();
  }
};
