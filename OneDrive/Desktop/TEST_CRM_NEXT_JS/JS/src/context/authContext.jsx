// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     console.log("🔍 AuthContext initializing...");

//     const token = localStorage.getItem("access_token");
//     const userData = localStorage.getItem("user_details");

//     console.log("🪣 LocalStorage token:", token);
//     console.log("🧾 LocalStorage user_details:", userData);

//     if (token && userData) {
//       try {
//         const parsedUser = JSON.parse(userData);
//         setUser(parsedUser);
//         console.log("✅ Restored user from localStorage:", parsedUser);
//       } catch (e) {
//         console.error("❌ Error parsing stored user JSON:", e);
//       }
//     } else {
//       console.warn("⚠️ No user found in localStorage");
//     }

//     setIsLoading(false);
//   }, []);

//    const logout = () => {
//     console.log("🚪 Logging out user...");
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("user_details");
//     setUser(null);
//     // redirect to login
//     window.location.href = "/login";
//   };

//   useEffect(() => {
//     console.log("👤 Auth state changed:", { user, isLoading });
//   }, [user, isLoading]);

//   return (
//     <AuthContext.Provider value={{ user, setUser, isLoading,logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api'; // axios-like instance
import { useNotificationContext } from '@/context/useNotificationContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { push } = useRouter();
  const { showNotification } = useNotificationContext();

  // API endpoints (relative to api.baseURL in your api instance)
  const LOGIN_API_URL = 'login';
  const SIGNUP_API_URL = 'register';

  useEffect(() => {
    // Restore from localStorage on mount (client-only)
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_details');

    if (token) {
      api.defaults.headers.common = api.defaults.headers.common || {};
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('AuthContext: failed to parse user_details', e);
        localStorage.removeItem('user_details');
        localStorage.removeItem('access_token');
      }
    }
    setIsLoading(false);
  }, []);

  // Helper to persist token + user and set api auth header and cookie fallback
  const persistAuth = (token, userObj) => {
    if (typeof window === 'undefined') return;

    // 1) store in localStorage
    if (token) {
      localStorage.setItem('access_token', token);
    }
    if (userObj) {
      localStorage.setItem('user_details', JSON.stringify(userObj));
      setUser(userObj);
    }

    // 2) set axios default Authorization header
    api.defaults.headers.common = api.defaults.headers.common || {};
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }

    // 3) set a cookie named 'access_token' so middleware can read it
    //    This is a client-side fallback only — server-set httpOnly cookie is preferred.
    if (token) {
      const days = 7; // lifetime in days for cookie fallback
      const maxAge = 60 * 60 * 24 * days; // seconds
      const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
      // SameSite=Lax allows middleware redirect to work while offering some CSRF protection
      document.cookie = `access_token=${token}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
      console.log('AuthContext: cookie set (client-side) access_token (visible to JS).');
    } else {
      // remove cookie
      document.cookie = 'access_token=; Path=/; Max-Age=0; SameSite=Lax';
    }
  };

  // signIn: validate response contains token or user before redirecting
  // Now expects values = { username, password }
  const signIn = async (values = {}, options = {}) => {
    const redirectTo = options.redirect ?? null;
    if (!values?.username || !values?.password) {
      showNotification({ message: 'Username and password are required', variant: 'danger' });
      return { ok: false, error: 'Missing credentials' };
    }

    setIsLoading(true);

    try {
      // send username instead of email
      const payload = { username: values.username, password: values.password };
      console.log('AuthContext.signIn: calling API', payload);

      const res = await api.post(LOGIN_API_URL, payload);
      const data = res?.data ?? {};

      console.log('AuthContext.signIn: raw response data', data);

      // Try to extract token & user in common shapes
      const token =
        data?.token ||
        data?.access_token ||
        data?.data?.token ||
        null;

      const userData =
        data?.user ||
        data?.data?.user ||
        (data?.data && typeof data.data === 'object' ? data.data : null) ||
        null;

      // If no token AND no userData, treat as failure (prevents redirect)
      if (!token && !userData) {
        const msg = data?.message ?? 'Invalid credentials or empty server response';
        console.warn('AuthContext.signIn: missing token/user, aborting redirect:', data);
        showNotification({ message: msg, variant: 'danger' });
        return { ok: false, error: msg, data };
      }

      // Persist auth and set header & cookie fallback
      persistAuth(token, userData ?? { username: values.username });

      showNotification({ message: data?.message ?? 'Successfully logged in', variant: 'success' });

      // Redirect only after persistence
      if (redirectTo) {
        console.log('AuthContext.signIn: redirecting to', redirectTo);
        push(redirectTo);
      }

      return { ok: true, data, token, user: userData };
    } catch (error) {
      console.error('AuthContext.signIn error:', error, error?.response?.data);
      const resp = error?.response?.data;
      let message = 'An unexpected error occurred';

      if (resp?.message) message = resp.message;
      else if (resp?.error) message = resp.error;
      else if (error?.response?.status === 401) message = 'Invalid username or password';
      else if (error?.response?.status >= 500) message = 'Server error. Try again later.';
      else if (error?.message) message = error.message;

      showNotification({ message, variant: 'danger' });
      return { ok: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // signUp - create account and optionally auto-login
  const signUp = async (values = {}, options = {}) => {
    const { autoLogin = true, redirect = null } = options;
    setIsLoading(true);
    try {
      const body = {
        name: values.name ?? values.fullName ?? '',
        // accept username and/or email for signup
        username: values.username ?? undefined,
        email: values.email ?? undefined,
        password: values.password,
        password_confirmation: values.password_confirmation ?? values.password
      };

      // Remove undefined keys for cleanliness
      Object.keys(body).forEach((k) => body[k] === undefined && delete body[k]);

      console.log('AuthContext.signUp: calling API', body);
      const res = await api.post(SIGNUP_API_URL, body);
      const data = res?.data ?? {};

      if (!(res?.status >= 200 && res?.status < 300)) {
        const msg = data?.message ?? data?.error ?? 'Sign up failed';
        showNotification({ message: msg, variant: 'danger' });
        return { ok: false, error: msg };
      }

      showNotification({ message: data?.message ?? 'Account created', variant: 'success' });

      // Auto-login if requested and returned token/user present
      if (autoLogin) {
        const token =
          data?.token ||
          data?.access_token ||
          data?.data?.token ||
          null;
        const userData =
          data?.user ||
          data?.data?.user ||
          (data?.data && typeof data.data === 'object' ? data.data : null);

        if (token || userData) {
          persistAuth(token, userData);
          if (redirect) push(redirect);
          return { ok: true, data, token, user: userData };
        }

        // fallback to explicit sign-in attempt
        const identifier = values.username ?? values.email;
        return await signIn({ username: identifier, password: values.password }, { redirect });
      }

      return { ok: true, data };
    } catch (error) {
      console.error('AuthContext.signUp error:', error);
      const resp = error?.response?.data;
      let message = 'An unexpected error occurred';
      if (resp?.message) message = resp.message;
      else if (resp?.error) message = resp.error;
      else if (error?.response?.status >= 500) message = 'Server error';
      else if (error?.message) message = error.message;

      showNotification({ message, variant: 'danger' });
      return { ok: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.clear()
    } catch (e) {
      console.warn('AuthContext.logout: server logout failed', e);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_details');
      }
      api.defaults.headers.common = api.defaults.headers.common || {};
      delete api.defaults.headers.common['Authorization'];
      // remove cookie
      if (typeof document !== 'undefined') {
        document.cookie = 'access_token=; Path=/; Max-Age=0; SameSite=Lax';
      }
      setUser(null);
      setIsLoading(false);
      showNotification({ message: 'Logged out', variant: 'success' });
      push('/auth/sign-in');
    }
  };

  const clearAuthData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_details');
    }
    api.defaults.headers.common = api.defaults.headers.common || {};
    delete api.defaults.headers.common['Authorization'];
    if (typeof document !== 'undefined') {
      document.cookie = 'access_token=; Path=/; Max-Age=0; SameSite=Lax';
    }
    setUser(null);
    setIsLoading(false);
    console.log('AuthContext: cleared auth data');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, signIn, signUp, logout, clearAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);



