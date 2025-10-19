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
import api from '@/lib/api'; // your api instance (axios-like)
import { useNotificationContext } from '@/context/useNotificationContext'; // you already use this elsewhere

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { push } = useRouter();
  const { showNotification } = useNotificationContext();


  // endpoints — change if different
  const LOGIN_API_URL = 'login'; // API base URL is already set in api.js
  const SIGNUP_API_URL = 'register';

  useEffect(() => {
    // run once on mount to restore session if any
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user_details');

      console.log('🔍 AuthContext initialization:');
      console.log('🔑 Token found:', !!token);
      console.log('👤 User data found:', !!userData);

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log('✅ Restoring user from localStorage:', parsedUser);
          setUser(parsedUser);
        } catch (e) {
          console.error('❌ AuthContext: failed to parse stored user', e);
          // Clear invalid data
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_details');
        }
      } else {
        console.log('⚠️ No stored authentication data found');
      }
    }
    setIsLoading(false);
  }, []);

  // signIn: calls API, stores token & user, updates state, shows notifications.
  // options: { values, redirect } where values = { email, password }, redirect = '/dashboard' default
  const signIn = async (values = {}, options = {}) => {
    const redirectTo = options.redirect ?? null;
    setIsLoading(true);
    
    console.log('🚀 Starting signIn process...');
    console.log('📧 Email:', values.email);
    console.log('🔐 Password length:', values.password?.length);
    console.log('🎯 Redirect to:', redirectTo);
    
    try {
      const body = {
        email: values.email,
        password: values.password
      };

      console.log('📤 Making API call to:', LOGIN_API_URL);
      console.log('📤 Request body:', { email: body.email, password: '[HIDDEN]' });
      
      const res = await api.post(LOGIN_API_URL, body);
      console.log('📥 Full response:', res);
      
      const data = res?.data ?? {};
      console.log('📥 Login response data:', data);

      // Handle different response structures
      if (res?.status >= 200 && res?.status < 300) {
        let token = null;
        let userData = null;
        
        // Extract token and user data from various possible response structures
        if (data?.token) {
          token = data.token;
        } else if (data?.access_token) {
          token = data.access_token;
        } else if (data?.data?.token) {
          token = data.data.token;
        }
        
        if (data?.user) {
          userData = data.user;
        } else if (data?.data?.user) {
          userData = data.data.user;
        } else if (data?.data) {
          userData = data.data;
        } else {
          // fallback: create minimal user object
          userData = { email: values.email, name: values.email };
        }
        
        // Store token and user details in localStorage
        if (typeof window !== 'undefined') {
          if (token) {
            localStorage.setItem('access_token', token);
            console.log('✅ Token stored:', token.substring(0, 20) + '...');
          }
          if (userData) {
            localStorage.setItem('user_details', JSON.stringify(userData));
            setUser(userData);
            console.log('✅ User data stored:', userData);
          }
        }

        showNotification({
          message: data?.message ?? 'Successfully logged in',
          variant: 'success'
        });

        // Redirect if requested by options
        if (redirectTo) {
          console.log('🔄 Redirecting to:', redirectTo);
          push(redirectTo);
        }

        return { ok: true, data, token, user: userData };
      } else {
        const message = data?.message ?? data?.error ?? 'Login failed';
        console.error('❌ Login failed:', message);
        showNotification({ message, variant: 'danger' });
        return { ok: false, error: message };
      }
    } catch (error) {
      console.error('🚨 AuthContext.signIn error:', error);
      console.error('🚨 Error response:', error?.response);
      
      // Enhanced error handling
      let message = 'An unexpected error occurred';
      
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.response?.data?.error) {
        message = error.response.data.error;
      } else if (error?.response?.status === 401) {
        message = 'Invalid email or password';
      } else if (error?.response?.status === 422) {
        message = 'Please check your email and password';
      } else if (error?.response?.status >= 500) {
        message = 'Server error. Please try again later.';
      } else if (error?.message) {
        message = error.message;
      }
      
      showNotification({ message, variant: 'danger' });
      return { ok: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // signUp: create user on backend, optionally auto-login
  // options: { autoLogin: true/false, redirect: '/...' }
  const signUp = async (values = {}, options = {}) => {
    const { autoLogin = true, redirect = null } = options;
    setIsLoading(true);
    
    try {
      const body = {
        name: values.name ?? values.fullName ?? '',
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation ?? values.password
        // attach other fields if needed
      };

      console.log('📝 Attempting signup with:', body);
      console.log('🌐 API URL:', SIGNUP_API_URL);
      
      const res = await api.post(SIGNUP_API_URL, body);
      console.log('📥 Full signup response:', res);
      
      const data = res?.data ?? {};
      console.log('📥 Signup response data:', data);

      if (res?.status >= 200 && res?.status < 300) {
        showNotification({
          message: data?.message ?? 'Account created successfully',
          variant: 'success'
        });

        // Optionally auto-login using returned token/user (common flows)
        if (autoLogin) {
          let token = null;
          let userData = null;
          
          // Extract token and user data from various possible response structures
          if (data?.token) {
            token = data.token;
          } else if (data?.access_token) {
            token = data.access_token;
          } else if (data?.data?.token) {
            token = data.data.token;
          }
          
          if (data?.user) {
            userData = data.user;
          } else if (data?.data?.user) {
            userData = data.data.user;
          } else if (data?.data) {
            userData = data.data;
          }
          
          // If signup response contains token/user, use them:
          if (token && userData) {
            if (typeof window !== 'undefined') {
              localStorage.setItem('access_token', token);
              localStorage.setItem('user_details', JSON.stringify(userData));
              console.log('✅ Signup auto-login: Token and user stored');
            }
            setUser(userData);
            if (redirect) {
              console.log('🔄 Signup redirecting to:', redirect);
              push(redirect);
            }
            return { ok: true, data, token, user: userData };
          }

          // Otherwise try to login using credentials we just created
          console.log('🔄 Signup: Attempting auto-login with credentials');
          const loginResult = await signIn({ email: values.email, password: values.password }, { redirect });
          return loginResult;
        }

        // If not autoLogin, return success
        return { ok: true, data };
      } else {
        const message = data?.message ?? data?.error ?? 'Sign up failed';
        console.error('❌ Signup failed:', message);
        showNotification({ message, variant: 'danger' });
        return { ok: false, error: message };
      }
    } catch (error) {
      console.error('🚨 AuthContext.signUp error:', error);
      console.error('🚨 Error response:', error?.response);
      
      // Enhanced error handling
      let message = 'An unexpected error occurred';
      
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.response?.data?.error) {
        message = error.response.data.error;
      } else if (error?.response?.status === 422) {
        message = 'Please check your input data';
      } else if (error?.response?.status === 409) {
        message = 'Email already exists';
      } else if (error?.response?.status >= 500) {
        message = 'Server error. Please try again later.';
      } else if (error?.message) {
        message = error.message;
      }
      
      showNotification({ message, variant: 'danger' });
      return { ok: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user...');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_details');
      console.log('✅ LocalStorage cleared');
    }
    setUser(null);
    showNotification({
      message: 'Successfully logged out',
      variant: 'success'
    });
    push('/auth/sign-in'); 
  };

  // Helper function to clear all auth data (for debugging)
  const clearAuthData = () => {
    console.log('🧹 Clearing all authentication data...');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_details');
      console.log('✅ All auth data cleared from localStorage');
    }
    setUser(null);
    setIsLoading(false);
  };

  // The context value exposes user, setUser, isLoading, signIn, signUp, logout, clearAuthData
  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, signIn, signUp, logout, clearAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

