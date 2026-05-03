import { useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Leaf } from "lucide-react";
import { useAppSettings } from "../context/AppSettingsContext";
import defaultimage from "../assets/profile.jpg";
import LoginHerbalHero from "./login/LoginHerbalHero";

const FALLBACK_LOGO = defaultimage;

export default function Login1() {
  const { settings } = useAppSettings();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const pageRef = useRef(null);
  const formRef = useRef(null);
  const heroBgRef = useRef(null);
  const heroParallaxRef = useRef(null);

  const logo =
    settings?.logo && settings.logo.trim() !== ""
      ? settings.logo
      : FALLBACK_LOGO;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginValue.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const success = await login(loginValue.trim(), password.trim());
      if (success) navigate("/dashboard");
    } catch (err) {
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else {
        setError(err.response?.data?.message || "Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const page = pageRef.current;
    const formEl = formRef.current;
    const bg = heroBgRef.current;
    const parallax = heroParallaxRef.current;

    const ctx = gsap.context(() => {
      if (formEl) {
        gsap.fromTo(
          formEl,
          { opacity: 0, x: 56 },
          {
            opacity: 1,
            x: 0,
            duration: 0.85,
            ease: "power3.out",
            delay: 0.08,
          }
        );
      }

      if (!page) return;

      ScrollTrigger.create({
        trigger: page,
        start: "top top",
        end: () =>
          "+=" +
          Math.max(8, (page.scrollHeight || 0) - window.innerHeight),
        scrub: 0.65,
        onUpdate: (self) => {
          const p = self.progress;
          if (bg) {
            gsap.set(bg, {
              y: (p - 0.5) * 48,
              scale: 1.12 - p * 0.12,
            });
          }
          if (parallax) {
            gsap.set(parallax, {
              y: (p - 0.5) * 56,
              scale: 1.04 - p * 0.05,
            });
          }
        },
      });
    }, page);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="flex min-h-[108dvh] flex-col overflow-x-hidden bg-slate-100 dark:bg-neutral-950 lg:min-h-screen lg:flex-row"
    >
      <LoginHerbalHero
        bgRef={heroBgRef}
        parallaxRef={heroParallaxRef}
      />

      <section className="relative z-10 order-2 flex min-h-0 flex-1 flex-col justify-center bg-white px-5 py-10 sm:px-8 lg:rounded-tl-[clamp(1.75rem,3vw,2.75rem)] lg:px-10 lg:py-12 xl:px-14 dark:bg-neutral-950">
        <div
          ref={formRef}
          className="mx-auto w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-8 shadow-lg shadow-slate-200/30 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/30"
        >
          <div className="mb-6 flex justify-center">
            <img
              src={logo}
              alt="App Logo"
              className="h-16 object-contain sm:h-20 md:h-24"
            />
          </div>

          <h2 className="mb-1 text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mb-6 text-center text-sm text-slate-500 dark:text-neutral-400">
            Sign in with your email or phone
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="login-email-phone"
                className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-neutral-400"
              >
                Email or Phone
              </label>
              <div className="relative mt-1.5">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
                  aria-hidden
                />
                <input
                  id="login-email-phone"
                  type="text"
                  value={loginValue}
                  onChange={(e) => setLoginValue(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-emerald-500"
                  placeholder="Enter email or phone"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-neutral-400"
              >
                Password
              </label>
              <div className="relative mt-1.5">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-neutral-500"
                  aria-hidden
                />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-emerald-500"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:from-emerald-500 hover:to-teal-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 border-t border-slate-100 pt-6 dark:border-neutral-800">
            <div className="flex gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                <Leaf className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-neutral-100">
                  Need help accessing your account?
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-neutral-400">
                  Your credentials are the same as before—only this sign-in
                  experience has been refreshed.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500 dark:text-neutral-500">
            © {new Date().getFullYear()} Your Company
          </p>
        </div>
      </section>
    </div>
  );
}
