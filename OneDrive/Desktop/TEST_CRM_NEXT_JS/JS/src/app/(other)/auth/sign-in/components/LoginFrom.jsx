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

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import TextFormInput from '@/components/form/TextFormInput';
import PasswordFormInput from '@/components/form/PasswordFormInput';
import Link from 'next/link';
import { Button, FormCheck } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

import { useAuth } from '../../../../../context/authContext';
import useQueryParams from '@/hooks/useQueryParams';

const LoginFrom = () => {
  const router = useRouter();
  const { signIn, isLoading, clearAuthData } = useAuth();
  const queryParams = useQueryParams();
  const loginSchema = yup.object({
    email: yup.string().email('Please enter a valid email').required('Please enter your email'),
    password: yup.string().required('Please enter your password')
  });
  const {
    control,
    handleSubmit,
    setError,
    clearErrors
  } = useForm({
    resolver: yupResolver(loginSchema),
    // defaultValues: {
    //   email: 'user@demo.com',
    //   password: '123456'
    // }
  });

  const onSubmit = async (values) => {
    // clear previous server errors
    clearErrors();

    const redirectTo = queryParams['redirectTo'] ?? '/dashboard';

    console.log('🎯 LoginForm: Starting login process');
    console.log('📧 Email:', values.email);
    console.log('🎯 Redirect to:', redirectTo);

    try {
      // call your auth context signIn which should return a structured result
      // expected shape: { ok: boolean, data?: any, error?: string | object }
      console.log('📞 LoginForm: Calling signIn function...');
      const res = await signIn(values, { redirect: redirectTo });
      console.log('📞 LoginForm: signIn response:', res);

      if (!res?.ok) {
        const serverError = res?.error;

        // handle object-shaped field errors (e.g. { email: 'Invalid', password: '...' })
        if (serverError && typeof serverError === 'object') {
          for (const key of Object.keys(serverError)) {
            if (['email', 'password', 'name'].includes(key)) {
              setError(key, { type: 'server', message: String(serverError[key]) });
            }
          }

          // if a general message exists and no field-specific errors, show it on email
          if (!serverError.email && !serverError.password && serverError.message) {
            setError('email', { type: 'server', message: String(serverError.message) });
          }
        } else {
          // serverError is string or unknown
          const message = typeof serverError === 'string' ? serverError : (res?.error ?? 'Login failed');
          setError('email', { type: 'server', message: String(message) });
        }
        return;
      }

      // success -> redirect is handled by the auth context
      // No need for manual redirect here since signIn handles it
    } catch (err) {
      setError('email', { type: 'server', message: err?.message ?? 'An unexpected error occurred' });
      console.error('LoginForm.signIn error:', err);
    }
  };

  return (
    <form className="authentication-form" onSubmit={handleSubmit(onSubmit)}>
      <TextFormInput
        control={control}
        name="email"
        containerClassName="mb-3"
        label="Email"
        id="email-id"
        placeholder="Enter your email"
      />

      <PasswordFormInput
        control={control}
        name="password"
        containerClassName="mb-3"
        placeholder="Enter your password"
        id="password-id"
        label={
          <>
            <Link href="/auth/reset-pass" className="float-end text-muted text-unline-dashed ms-1">
              Reset password
            </Link>
            <label className="form-label" htmlFor="example-password">
              Password
            </label>
          </>
        }
      />

      <div className="mb-3">
        <FormCheck label="Remember me" id="sign-in" />
      </div>

      <div className="mb-1 text-center d-grid">
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </div>
      
      {/* Debug button - remove in production */}
      <div className="mb-1 text-center d-grid">
        <Button 
          variant="outline-danger" 
          size="sm" 
          onClick={() => {
            clearAuthData();
            console.log('🧹 Auth data cleared for testing');
          }}
          type="button"
        >
          Clear Auth Data (Debug)
        </Button>
      </div>
    </form>
  );
};

export default LoginFrom;
