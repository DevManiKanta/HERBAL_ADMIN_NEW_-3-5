// import { useState } from "react";
// import { Outlet, Link, useLocation } from "react-router-dom";
// import { useAuth } from "../auth/AuthContext";
// import { useLogoSettings } from "../context/LogoSettingsContext";
// import { ChevronDown, Menu, X } from "lucide-react";

// export default function DashboardLayout() {
//   const { user, logout } = useAuth();
//   const { settings: logoSettings } = useLogoSettings();
//   const location = useLocation();

//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [timeoutId, setTimeoutId] = useState(null);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);

//   // 🔥 ALL MENU ITEMS (NO MISSING)
//   const menus = [
//     { label: "Dashboard", path: "/dashboard" },

//     {
//       label: "Products",
//       items: [
//         { label: "All Products", path: "/products" },
//         { label: "Bulk Variant Images", path: "/bulk-variant-images" },
//         { label: "Add Category", path: "/add-categories" },
//         { label: "Sort Category", path: "/category-sorter" },
//       ],
//     },

//     {
//       label: "Orders",
//       items: [
//         { label: "POS", path: "/pos" },
//         { label: "POS Orders", path: "/pos/orders" },
//         { label: "Online Orders", path: "/online-orders" },
//       ],
//     },

//     {
//       label: "Customers",
//       items: [
//         { label: "Customers", path: "/customers" },
//         { label: "Staff Attendance", path: "/staff-attendance" },
//       ],
//     },

//     {
//       label: "Management",
//       items: [
//         { label: "Roles", path: "/roles" },
//         { label: "Assign Role", path: "/assign-role" },
//       ],
//     },

//     {
//       label: "Settings",
//       items: [{ label: "Profile Settings", path: "/settings/profile" }],
//     },

//     {
//       label: "Other",
//       items: [{ label: "WhatsApp", path: "/my-whatsapp" }],
//     },
//   ];

//   // 🔥 Hover fix
//   const handleEnter = (menu) => {
//     if (timeoutId) clearTimeout(timeoutId);
//     setActiveDropdown(menu);
//   };

//   const handleLeave = () => {
//     const id = setTimeout(() => setActiveDropdown(null), 200);
//     setTimeoutId(id);
//   };

//   // 🔥 Active route
//   const isActive = (path) => location.pathname.startsWith(path);

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* 🔥 NAVBAR */}
//       <header className="h-16 bg-white border-b px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
//         {/* LEFT */}
//         <div className="flex items-center gap-3">
//           <button
//             className="md:hidden"
//             onClick={() => setMobileOpen(!mobileOpen)}
//           >
//             {mobileOpen ? <X /> : <Menu />}
//           </button>

//           <span className="font-bold text-green-700">
//             {logoSettings?.app_name || "Application"}
//           </span>
//         </div>

//         {/* 🔥 DESKTOP MENU */}
//         <div className="hidden md:flex items-center gap-6">
//           {menus.map((menu, i) => (
//             <div
//               key={i}
//               className="relative"
//               onMouseEnter={() => handleEnter(menu.label)}
//               onMouseLeave={handleLeave}
//             >
//               <div
//                 className={`flex items-center gap-1 cursor-pointer font-medium ${
//                   isActive(menu.path)
//                     ? "text-green-600"
//                     : "hover:text-green-600"
//                 }`}
//               >
//                 {menu.path ? (
//                   <Link to={menu.path}>{menu.label}</Link>
//                 ) : (
//                   <>
//                     {menu.label}
//                     <ChevronDown size={16} />
//                   </>
//                 )}
//               </div>

//               {/* DROPDOWN */}
//               {menu.items && activeDropdown === menu.label && (
//                 <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-xl p-2 min-w-[200px] z-50 border">
//                   {menu.items.map((item, idx) => (
//                     <Link
//                       key={idx}
//                       to={item.path}
//                       className={`block px-3 py-2 rounded text-sm ${
//                         isActive(item.path)
//                           ? "bg-green-100 text-green-700"
//                           : "hover:bg-gray-100"
//                       }`}
//                     >
//                       {item.label}
//                     </Link>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* 🔥 RIGHT (PROFILE) */}
//         <div className="relative">
//           <div
//             onClick={() => setProfileOpen(!profileOpen)}
//             className="cursor-pointer bg-green-600 text-white px-3 py-1 rounded-full text-sm"
//           >
//             {user?.name?.charAt(0) || "A"}
//           </div>

//           {profileOpen && (
//             <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-2 w-40">
//               <div className="px-3 py-2 text-sm">{user?.name}</div>
//               <button
//                 onClick={logout}
//                 className="w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100 rounded"
//               >
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </header>

//       {/* 🔥 MOBILE MENU */}
//       {mobileOpen && (
//         <div className="md:hidden bg-white border-b p-4 space-y-3">
//           {menus.map((menu, i) => (
//             <div key={i}>
//               {menu.path ? (
//                 <Link to={menu.path} onClick={() => setMobileOpen(false)}>
//                   {menu.label}
//                 </Link>
//               ) : (
//                 <div>
//                   <p className="font-semibold">{menu.label}</p>
//                   <div className="ml-3 mt-1 space-y-1">
//                     {menu.items.map((item, idx) => (
//                       <Link
//                         key={idx}
//                         to={item.path}
//                         onClick={() => setMobileOpen(false)}
//                         className="block text-sm text-gray-600"
//                       >
//                         {item.label}
//                       </Link>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* 🔥 CONTENT */}
//       <main className="p-4 md:p-6">
//         <Outlet />
//       </main>
//     </div>
//   );
// }

import { useState, useRef } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useLogoSettings } from "../context/LogoSettingsContext";
import { ChevronDown, Menu, X, Search, Bell } from "lucide-react";
import BrandRibbon from "../components/shell/BrandRibbon";
import ThemeToggle from "../components/shell/ThemeToggle";
import NotificationsDrawer from "../components/shell/NotificationsDrawer";
import AnimatedMain from "../components/shell/AnimatedMain";
import { useShellEntrance } from "../hooks/useShellEntrance";
import { resolveAppDisplayName } from "../config/brand";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { settings: logoSettings } = useLogoSettings();
  const location = useLocation();

  const headerRef = useRef(null);
  const ribbonRef = useRef(null);
  const mainRef = useRef(null);
  useShellEntrance({ headerRef, ribbonRef, mainRef });

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  /** Replace with API-driven list when available */
  const [notifications] = useState([]);

  const menus = [
    { label: "Dashboard", path: "/dashboard" },
    {
      label: "Products",
      items: [
        { label: "All Products", path: "/products" },
        { label: "Bulk Images", path: "/bulk-variant-images" },
        { label: "Categories", path: "/add-categories" },
        { label: "Sort Category", path: "/category-sorter" },
      ],
    },
    {
      label: "Orders",
      items: [
        { label: "POS", path: "/pos" },
        { label: "POS Orders", path: "/pos/orders" },
        { label: "Online Orders", path: "/online-orders" },
      ],
    },
    {
      label: "Customers",
      items: [
        { label: "Customers", path: "/customers" },
        { label: "Attendance", path: "/staff-attendance" },
      ],
    },
    {
      label: "Management",
      items: [
        { label: "Roles", path: "/roles" },
        { label: "Assign Role", path: "/assign-role" },
      ],
    },
    {
      label: "Settings",
      items: [
        { label: "Profile", path: "/settings/profile" },
        { label: "WhatsApp", path: "/my-whatsapp" },
      ],
    },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  const displayName = resolveAppDisplayName(logoSettings?.app_name);

  return (
    <div className="admin-app-shell min-h-screen font-sans text-slate-900 dark:text-neutral-100">
      <header
        ref={headerRef}
        className="sticky top-0 z-50 flex h-[4.25rem] items-center justify-between bg-white px-4 shadow-[0_1px_0_rgba(15,23,42,0.08),0_8px_24px_-4px_rgba(15,23,42,0.08)] dark:bg-neutral-950 dark:shadow-[0_1px_0_rgba(255,255,255,0.06)] md:px-8"
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-800 shadow-sm transition hover:bg-slate-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link
            to="/dashboard"
            className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white md:text-xl"
          >
            {displayName}
          </Link>
        </div>

        <div className="hidden items-center gap-1 md:flex">
          {menus.map((menu, i) => (
            <div key={i} className="group relative px-1">
              {menu.path ? (
                <Link
                  to={menu.path}
                  className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    isActive(menu.path)
                      ? "bg-emerald-100 text-slate-900 shadow-inner dark:bg-neutral-800 dark:text-white"
                      : "text-slate-900 hover:bg-slate-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {menu.label}
                </Link>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveDropdown(
                        activeDropdown === menu.label ? null : menu.label,
                      );
                    }
                  }}
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === menu.label ? null : menu.label,
                    )
                  }
                  className="flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
                >
                  <span>{menu.label}</span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-600 transition-transform duration-200 dark:text-neutral-400 ${
                      activeDropdown === menu.label ? "rotate-180" : ""
                    }`}
                  />
                </div>
              )}

              {menu.items && activeDropdown === menu.label && (
                <div className="animate-fadeIn absolute left-0 top-full z-50 mt-2 w-60 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-200/80 dark:bg-neutral-900 dark:ring-neutral-700">
                  {menu.items.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.path}
                      onClick={() => setActiveDropdown(null)}
                      className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                        isActive(item.path)
                          ? "bg-gradient-to-r from-brand-mist to-brand-sand text-brand-forest shadow-sm dark:from-neutral-800 dark:to-neutral-800 dark:text-white"
                          : "text-slate-600 hover:bg-slate-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-2 shadow-inner dark:bg-neutral-800 md:flex">
            <Search size={16} className="text-slate-500 dark:text-neutral-400" />
            <input
              placeholder="Search…"
              className="w-36 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-neutral-100 dark:placeholder:text-neutral-500 lg:w-44"
              type="search"
            />
          </div>

          <button
            type="button"
            className="relative hidden rounded-full p-2 text-slate-600 transition hover:bg-slate-100 dark:text-neutral-300 dark:hover:bg-neutral-800 md:inline-flex"
            aria-label="Open notifications"
            aria-expanded={notificationsOpen}
            onClick={() => {
              setNotificationsOpen((v) => !v);
              setProfileOpen(false);
              setActiveDropdown(null);
            }}
          >
            <Bell className="h-5 w-5" strokeWidth={2} />
            {notifications.length > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-neutral-950" />
            )}
          </button>

          <ThemeToggle className="hidden md:inline-flex" />

          <button
            type="button"
            className="relative inline-flex rounded-full p-2 text-slate-600 transition hover:bg-slate-100 dark:text-neutral-300 dark:hover:bg-neutral-800 md:hidden"
            aria-label="Open notifications"
            aria-expanded={notificationsOpen}
            onClick={() => {
              setNotificationsOpen((v) => !v);
              setProfileOpen(false);
              setActiveDropdown(null);
            }}
          >
            <Bell className="h-5 w-5" strokeWidth={2} />
            {notifications.length > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-neutral-950" />
            )}
          </button>
          <ThemeToggle className="md:hidden" />

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((v) => !v);
                setNotificationsOpen(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-amber-600 text-sm font-bold text-white shadow-md transition hover:scale-[1.03] active:scale-[0.98]"
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              {user?.name?.charAt(0) || "A"}
            </button>

            {profileOpen && (
              <div className="animate-scaleIn absolute right-0 mt-3 w-48 overflow-hidden rounded-2xl bg-white py-1 shadow-xl ring-1 ring-slate-200/80 dark:bg-neutral-900 dark:ring-neutral-700">
                <div className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-neutral-100">
                  {user?.name}
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-neutral-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div ref={ribbonRef}>
        <BrandRibbon appName={logoSettings?.app_name} />
      </div>

      {mobileOpen && (
        <div className="animate-fadeIn bg-white p-4 shadow-lg dark:bg-neutral-900 md:hidden">
          {menus.map((menu, i) => (
            <div key={i} className="py-3">
              {menu.path ? (
                <Link
                  to={menu.path}
                  className="font-semibold text-slate-900 dark:text-neutral-100"
                  onClick={() => setMobileOpen(false)}
                >
                  {menu.label}
                </Link>
              ) : (
                <>
                  <p className="font-semibold text-slate-900 dark:text-neutral-100">
                    {menu.label}
                  </p>
                  <div className="ml-2 mt-2 space-y-1">
                    {menu.items.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-lg py-1.5 text-sm text-slate-900 hover:text-emerald-800 dark:text-neutral-200 dark:hover:text-white"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <main
        ref={mainRef}
        className="mx-auto max-w-[1600px] px-4 py-6 md:px-8 md:py-8"
      >
        <div className="rounded-2xl bg-white/92 p-4 text-slate-800 shadow-lg shadow-black/10 backdrop-blur-sm dark:bg-neutral-900/95 dark:text-neutral-100 dark:shadow-black/40 md:p-6">
          <AnimatedMain>
            <Outlet />
          </AnimatedMain>
        </div>
      </main>

      <NotificationsDrawer
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        items={notifications}
      />
    </div>
  );
}
