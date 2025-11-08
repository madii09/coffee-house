// utils/auth.ts

/**
 * Checks if the user is logged in by verifying the access token in localStorage
 */
export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem('access_token');
  return !!token;
};

/**
 * Optionally get the current user info from localStorage
 */
export const getCurrentUser = (): { id?: string; name?: string } | null => {
  const user = localStorage.getItem('current_user');
  return user ? JSON.parse(user) : null;
};

/**
 * Save user info to localStorage
 */
export const saveUser = (user: { id: string; name: string }) => {
  localStorage.setItem('current_user', JSON.stringify(user));
};

/**
 * Log out the user
 */
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('current_user');
  window.location.href = '/signin';
};
