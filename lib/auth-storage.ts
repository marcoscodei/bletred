export const USER_KEY = 'community_user';
export const AUTH_EVENT = 'community-auth-change';

export interface StoredUser {
  id?: string;
  username: string;
  avatar?: string;
  motto?: string;
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUser(user: StoredUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}