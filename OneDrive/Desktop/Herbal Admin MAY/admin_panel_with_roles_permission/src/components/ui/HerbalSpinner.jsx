/**
 * Organic-themed spinner — use inline or inside loaders.
 */
export default function HerbalSpinner({ size = "md", className = "" }) {
  const sizes = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-[3px]",
    lg: "h-14 w-14 border-4",
  };
  return (
    <div
      className={`animate-herbal-spin rounded-full border-amber-200/40 border-t-emerald-600 border-r-amber-600/80 ${sizes[size] || sizes.md} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
