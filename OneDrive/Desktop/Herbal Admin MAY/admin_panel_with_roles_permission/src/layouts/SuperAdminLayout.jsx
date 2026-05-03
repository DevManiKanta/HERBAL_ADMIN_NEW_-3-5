import { useLayoutEffect, useRef, useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import gsap from "gsap";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Settings,
  Layers,
  LogOut,
  Search,
  Bell,
} from "lucide-react";

import { useSuperAdminAuth } from "../auth/SuperAdminAuthContext";
import AnimatedMain from "../components/shell/AnimatedMain";
import ThemeToggle from "../components/shell/ThemeToggle";
import NotificationsDrawer from "../components/shell/NotificationsDrawer";

export default function SuperAdminLayout() {
  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/super-admin" },
    { name: "Admins", icon: Users, path: "/super-admin/admins" },
    { name: "Roles", icon: ShieldCheck, path: "/super-admin/roles" },
    { name: "Modules", icon: Layers, path: "/super-admin/modules" },
    { name: "Settings", icon: Settings, path: "/super-admin/settings" },
  ];

  const { logout } = useSuperAdminAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications] = useState([]);
  const rootRef = useRef(null);
  const asideRef = useRef(null);
  const headerRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const aside = asideRef.current;
    const header = headerRef.current;
    if (!root || !aside || !header) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.from(aside, {
        x: -28,
        opacity: 0,
        duration: 0.55,
        ease: "power3.out",
      });
      gsap.from(header, {
        y: -14,
        opacity: 0,
        duration: 0.45,
        ease: "power2.out",
        delay: 0.05,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="flex min-h-screen bg-slate-100 text-slate-900 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-brand-forest dark:text-slate-100"
    >
      <aside
        ref={asideRef}
        className="flex w-64 flex-col justify-between bg-white p-5 font-sans shadow-[4px_0_24px_rgba(0,0,0,0.08)] dark:bg-gradient-to-b dark:from-slate-950/95 dark:via-slate-900/95 dark:to-brand-forest/90 dark:shadow-[4px_0_24px_rgba(0,0,0,0.35)] dark:backdrop-blur-xl"
      >
        <div>
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-jade via-brand-honey to-amber-500 text-sm font-bold text-white shadow-md dark:shadow-glow">
              SA
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Super Admin
              </h2>
              <p className="text-xs font-medium text-slate-500 dark:text-emerald-200/80">
                Control Panel
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            {menu.map((item, i) => (
              <NavLink
                key={i}
                to={item.path}
                end={item.path === "/super-admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl p-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-slate-900 text-white shadow-lg dark:bg-gradient-to-r dark:from-brand-jade/90 dark:to-brand-honey/85 dark:text-white"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                  }`
                }
              >
                <item.icon size={18} />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-100 p-2.5 dark:bg-white/5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-jade to-brand-honey text-sm font-bold text-white">
              SA
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Super Admin
              </p>
              <p className="text-xs text-slate-500 dark:text-emerald-200/70">
                Secure session
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-xl p-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-500/15"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header
          ref={headerRef}
          className="flex items-center justify-between bg-white px-5 py-4 shadow-sm dark:bg-slate-950/50 dark:shadow-none dark:backdrop-blur-xl"
        >
          <h1 className="font-display text-lg font-bold text-slate-900 dark:text-white md:text-xl">
            Super Admin Panel
          </h1>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-2 dark:bg-white/5 md:flex">
              <Search size={16} className="text-slate-500 dark:text-emerald-200/60" />
              <input
                type="text"
                placeholder="Search…"
                className="w-36 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500 lg:w-44"
              />
            </div>

            <button
              type="button"
              className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100 dark:text-emerald-200/70 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Open notifications"
              aria-expanded={notificationsOpen}
              onClick={() => setNotificationsOpen((v) => !v)}
            >
              <Bell size={20} strokeWidth={2} />
              {notifications.length > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950" />
              )}
            </button>

            <ThemeToggle />

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-jade to-brand-honey text-sm font-bold text-white shadow-md">
              SA
            </div>
          </div>
        </header>

        <main className="flex-1 bg-slate-50 p-6 font-sans dark:bg-gradient-to-br dark:from-slate-950/80 dark:via-slate-900/40 dark:to-brand-forest/20">
          <div className="rounded-2xl bg-white p-5 shadow-md dark:bg-slate-900/40 dark:shadow-panel dark:backdrop-blur-md md:p-6">
            <AnimatedMain>
              <Outlet />
            </AnimatedMain>
          </div>
        </main>
      </div>

      <NotificationsDrawer
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        items={notifications}
      />
    </div>
  );
}
