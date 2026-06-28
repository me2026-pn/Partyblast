import { supabase } from './supabase.js';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function getToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
}

async function request(method, path, body) {
  const token = await getToken();
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

export const api = {
  auth: {
    me: () => request('GET', '/auth/me'),
    updateProfile: (body) => request('PATCH', '/auth/me', body),
  },
  events: {
    list: () => request('GET', '/events'),
    get: (id) => request('GET', `/events/${id}`),
    create: (body) => request('POST', '/events', body),
    update: (id, body) => request('PATCH', `/events/${id}`, body),
    cancel: (id) => request('DELETE', `/events/${id}`),
  },
  vendors: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request('GET', `/vendors${qs ? `?${qs}` : ''}`);
    },
    get: (id) => request('GET', `/vendors/${id}`),
    create: (body) => request('POST', '/vendors', body),
    update: (body) => request('PATCH', '/vendors/me', body),
    review: (id, body) => request('POST', `/vendors/${id}/reviews`, body),
  },
  messages: {
    send: (body) => request('POST', '/messages', body),
    thread: (withUserId) => request('GET', `/messages?with=${withUserId}`),
    all: () => request('GET', '/messages'),
  },
  posts: {
    forEvent: (eventId) => request('GET', `/posts/event/${eventId}`),
    analytics: (eventId) => request('GET', `/posts/analytics/${eventId}`),
  },
  social: {
    accounts: () => request('GET', '/social/accounts'),
    connectUrl: (platform) => `${BASE}/social/connect/${platform}`,
    disconnect: (platform) => request('DELETE', `/social/accounts/${platform}`),
  },
  ai: {
    caption: (body) => request('POST', '/ai/caption', body),
    vendorBio: (body) => request('POST', '/ai/vendor-bio', body),
  },
  flyers: {
    single: (eventId) => request('POST', `/flyers/${eventId}`),
    variants: (eventId) => request('POST', `/flyers/${eventId}/variants`),
  },
  checkout: {
    session: (planType, subRole) => request('POST', '/checkout/session', { planType, subRole }),
    portal: () => request('POST', '/checkout/portal'),
  },
};