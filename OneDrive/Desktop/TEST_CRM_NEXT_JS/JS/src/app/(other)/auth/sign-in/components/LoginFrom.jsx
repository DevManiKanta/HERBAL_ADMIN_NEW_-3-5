// 'use client';

// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';

// import TextFormInput from '@/components/form/TextFormInput';
// import PasswordFormInput from '@/components/form/PasswordFormInput';
// import Link from 'next/link';
// import { Button, FormCheck } from 'react-bootstrap';

// import { useAuth } from '@/context/AuthContext'; // your updated AuthContext
// import useQueryParams from '@/hooks/useQueryParams';

// const LoginFrom = () => {
//   // auth context provides signIn and isLoading
//   const { signIn, isLoading } = useAuth();
//   const queryParams = useQueryParams();

//   // validation schema (same as before)
//   const loginSchema = yup.object({
//     email: yup.string().email('Please enter a valid email').required('Please enter your email'),
//     password: yup.string().required('Please enter your password')
//   });

//   const { control, handleSubmit } = useForm({
//     resolver: yupResolver(loginSchema),
//     defaultValues: {
//       email: 'user@demo.com',
//       password: '123456'
//     }
//   });

//   const onSubmit = async (values) => {
//     // ask AuthContext to sign in; pass redirectTo so context can redirect if desired
//     const redirectTo = queryParams['redirectTo'] ?? '/dashboard';
//     // signIn returns { ok, data?, error? } per the context implementation
//     await signIn(values, { redirect: redirectTo });
//     // context handles notifications and redirect (if provided)
//   };

//   return (
//     <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
//       <TextFormInput
//         control={control}
//         name="email"
//         containerClassName="mb-3"
//         label="Email"
//         id="email-id"
//         placeholder="Enter your email"
//       />

//       <PasswordFormInput
//         control={control}
//         name="password"
//         containerClassName="mb-3"
//         placeholder="Enter your password"
//         id="password-id"
//         label={
//           <>
//             <Link href="/auth/reset-pass" className="float-end text-muted text-unline-dashed ms-1">
//               Reset password
//             </Link>
//             <label className="form-label" htmlFor="example-password">
//               Password
//             </label>
//           </>
//         }
//       />

//       <div className="mb-3">
//         <FormCheck label="Remember me" id="sign-in" />
//       </div>

//       <div className="mb-1 text-center d-grid">
//         <Button variant="primary" type="submit" disabled={isLoading}>
//           {isLoading ? 'Signing in...' : 'Sign In'}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default LoginFrom;
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';
import { Button, FormCheck } from 'react-bootstrap';
import { useAuth } from '@/context/authContext'; // adjust path if needed
import useQueryParams from '@/hooks/useQueryParams';

const loginSchema = yup.object({
  username: yup.string().required('Please enter your username'),
  password: yup.string().required('Please enter your password')
});

const LoginFrom = () => {
  const { signIn, isLoading, clearAuthData } = useAuth();
  const queryParams = useQueryParams();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { username: '', password: '' }
  });

  const onSubmit = async (values) => {
    console.log('🔔 onSubmit fired with values:', values);
    if (isLoading) return;
    clearErrors();

    const redirectTo = queryParams['redirectTo'] ?? '/dashboard';

    try {
      // values = { username, password } — your AuthContext.signIn should accept this
      const res = await signIn(values, { redirect: redirectTo });
      console.log('🔔 signIn result:', res);

      if (!res?.ok) {
        const serverError = res?.error;
        if (serverError && typeof serverError === 'object') {
          // map field-level server errors to form fields (username/password/name)
          for (const key of Object.keys(serverError)) {
            if (['username', 'password', 'name'].includes(key)) {
              setError(key, { type: 'server', message: String(serverError[key]) });
            }
          }
          // generic server message -> set on username field
          if (!serverError.username && !serverError.password && serverError.message) {
            setError('username', { type: 'server', message: String(serverError.message) });
          }
        } else {
          // serverError is string or unknown -> show on username
          const message = typeof serverError === 'string' ? serverError : (res?.error ?? 'Login failed');
          setError('username', { type: 'server', message: String(message) });
        }
      }
      // on success, AuthContext handles persistence & redirect & notifications
    } catch (err) {
      console.error('LoginFrom.onSubmit error:', err);
      setError('username', { type: 'server', message: err?.message ?? 'An unexpected error occurred' });
    }
  };

  return (
    <form className="authentication-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* USERNAME */}
      <div className="mb-3">
        <label htmlFor="username-id" className="form-label">Username</label>
        <input
          id="username-id"
          type="text"
          placeholder="Enter your username"
          {...register('username')}
          className={`form-control ${errors.username ? 'is-invalid' : ''}`}
          autoComplete="username"
        />
        {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
      </div>

      {/* PASSWORD */}
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <label htmlFor="password-id" className="form-label mb-0">Password</label>
          <Link href="/auth/reset-pass" className="text-muted text-unline-dashed ms-1">Reset password</Link>
        </div>
        <input
          id="password-id"
          type="password"
          placeholder="Enter your password"
          {...register('password')}
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          autoComplete="current-password"
        />
        {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
      </div>

      {/* REMEMBER */}
      <div className="mb-3">
        <FormCheck label="Remember me" id="sign-in" />
      </div>

      {/* SUBMIT */}
      <div className="mb-1 text-center d-grid">
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </div>
    </form>
  );
};

export default LoginFrom;
