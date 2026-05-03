import heroImage from "../../assets/sridevi-herbal-login-hero.png";

/**
 * Decorative hero only — no auth logic.
 * Static hero image with brand overlay; background motion is driven by GSAP in Login1 (bgRef).
 */
export default function LoginHerbalHero({ bgRef, parallaxRef }) {
  return (
    <aside
      className="relative order-1 min-h-[40vh] w-full shrink-0 overflow-hidden bg-amber-950/90 lg:order-none lg:min-h-screen lg:min-w-0 lg:flex-1 lg:rounded-br-[clamp(2rem,4vw,3.5rem)] lg:shadow-[16px_0_48px_-12px_rgba(120,53,15,0.25)]"
      aria-hidden
    >
      <img
        ref={bgRef}
        src={heroImage}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover object-center"
        decoding="async"
        fetchPriority="high"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-stone-900/75 via-stone-900/35 to-amber-950/65" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-stone-900/40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(254,243,199,0.12),transparent_50%)]" />

      <div
        ref={parallaxRef}
        className="relative z-[1] flex min-h-[40vh] flex-col justify-end px-6 pb-10 pt-16 sm:px-10 sm:pb-12 lg:min-h-screen lg:justify-center lg:px-12 lg:pb-16 lg:pt-12 xl:px-16"
      >
        <p className="mb-3 font-serif text-4xl font-semibold tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-[2.75rem] xl:text-6xl">
          Sridevi Herbal
        </p>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-100/90">
          Admin
        </p>
        <h1 className="max-w-lg text-xl font-semibold leading-snug tracking-tight text-white/95 sm:text-2xl lg:text-[1.35rem] lg:leading-snug">
          Natural care for your catalog, orders, and everyday operations.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-amber-50/90 sm:text-base">
          Sign in to manage products and wellness with the same warmth as the
          ingredients you stand behind.
        </p>

        <div className="mt-8 hidden items-center gap-3 sm:flex">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-lg text-amber-100">
            ✦
          </span>
          <div className="text-xs font-medium uppercase tracking-wider text-amber-100/85">
            Pure · Traditional · Trusted
          </div>
        </div>
      </div>

      <svg
        className="pointer-events-none absolute -bottom-6 -right-6 h-48 w-48 text-white/[0.06] sm:h-64 sm:w-64 lg:bottom-8 lg:right-8 lg:h-80 lg:w-80"
        viewBox="0 0 200 200"
        fill="currentColor"
        aria-hidden
      >
        <path d="M100 20c25 35 45 70 50 100-30-15-65-25-95-30 5-30 25-55 45-70zM40 120c20 8 40 12 60 12-8 25-20 48-35 68-15-25-25-52-25-80z" />
      </svg>
    </aside>
  );
}
