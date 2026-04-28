export const ADMIN_PASSWORD = 'dreams@123';
export const ADMIN_SESSION_KEY = 'dreamyclouds-admin-authenticated';

export const isAdminAuthenticated = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
};

export const setAdminAuthenticated = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
};

export const clearAdminAuthenticated = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
};
