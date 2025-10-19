// 'use client';

// import { signIn } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import * as yup from 'yup';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { useNotificationContext } from '@/context/useNotificationContext';
// import useQueryParams from '@/hooks/useQueryParams';
// const useSignIn = () => {
//   const [loading, setLoading] = useState(false);
//   const {
//     push
//   } = useRouter();
//   const {
//     showNotification
//   } = useNotificationContext();
//   const queryParams = useQueryParams();
//   const loginFormSchema = yup.object({
//     email: yup.string().email('Please enter a valid email').required('Please enter your email'),
//     password: yup.string().required('Please enter your password')
//   });
//   const {
//     control,
//     handleSubmit
//   } = useForm({
//     resolver: yupResolver(loginFormSchema),
//     defaultValues: {
//       email: 'user@demo.com',
//       password: '123456'
//     }
//   });
//   const login = handleSubmit(async values => {
//     setLoading(true);
//     signIn('credentials', {
//       redirect: false,
//       email: values?.email,
//       password: values?.password
//     }).then(res => {
//       if (res?.ok) {
//         push(queryParams['redirectTo'] ?? '/dashboard');
//         showNotification({
//           message: 'Successfully logged in. Redirecting....',
//           variant: 'success'
//         });
//       } else {
//         showNotification({
//           message: res?.error ?? '',
//           variant: 'danger'
//         });
//       }
//     });
//     setLoading(false);
//   });
//   return {
//     loading,
//     login,
//     control
//   };
// };
// export default useSignIn;

// 'use client';

// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import * as yup from 'yup';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { useNotificationContext } from '@/context/useNotificationContext';
// import useQueryParams from '@/hooks/useQueryParams';
// import api from '@/lib/api';

// const LOGIN_API_URL = '/api/auth/login'; // <-- change if your API path differs

// const useSignIn = () => {
//   const [loading, setLoading] = useState(false);
//   const { push } = useRouter();
//   const { showNotification } = useNotificationContext();
//   const queryParams = useQueryParams();

//   const loginFormSchema = yup.object({
//     email: yup.string().email('Please enter a valid email').required('Please enter your email'),
//     password: yup.string().required('Please enter your password')
//   });

//   const { control, handleSubmit } = useForm({
//     resolver: yupResolver(loginFormSchema),
//     defaultValues: {
//       email: 'user@demo.com',
//       password: '123456'
//     }
//   });

//   const login = handleSubmit(async (values) => {
//     setLoading(true);

//     try {
//       const body = {
//         email: values?.email,
//         password: values?.password
//       };

//       // Use your api instance (axios-style)
//       const res = await api.post(LOGIN_API_URL, body);
//       // axios-style: response payload is in res.data
//       const data = res?.data ?? null;

//       // Treat HTTP 2xx as success
//       if (res?.status >= 200 && res?.status < 300) {
//         // Optional: store token if backend returns one
//         // if (data?.token) localStorage.setItem('auth_token', data.token);

//         showNotification({
//           message: data?.message ?? 'Successfully logged in. Redirecting....',
//           variant: 'success'
//         });

//         const redirectTo = queryParams['redirectTo'] ?? '/dashboard';
//         push(redirectTo);
//       } else {
//         // Non-2xx (unlikely to reach here with axios, since axios throws for non-2xx)
//         const errorMessage = data?.message ?? data?.error ?? res?.statusText ?? 'Login failed';
//         showNotification({
//           message: errorMessage,
//           variant: 'danger'
//         });
//       }
//     } catch (error) {
//       // Axios throws on network and non-2xx responses.
//       // Prefer server-provided error message if available.
//       const serverMessage = error?.response?.data?.message ?? error?.response?.data?.error;
//       const message = serverMessage ?? error?.message ?? 'An unexpected error occurred. Please try again.';
//       showNotification({
//         message,
//         variant: 'danger'
//       });
//       console.error('Login error:', error);
//     } finally {
//       setLoading(false);
//     }
//   });

//   return {
//     loading,
//     login,
//     control
//   };
// };

// export default useSignIn;
