
export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem('access_token');
  return !!token;
};

export const getCurrentUser = (): { id?: string; name?: string } | null => {
  const user = localStorage.getItem('current_user');
  return user ? JSON.parse(user) : null;
};


export const saveUser = (user: { id: string; name: string }) => {
  localStorage.setItem('current_user', JSON.stringify(user));
};


export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('current_user');
  window.location.href = '/signin';
};
