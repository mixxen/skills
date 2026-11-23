// Old promo banner, replaced by src/features/promo/Banner.tsx in v2.
export function OldBanner() {
  setTimeout(() => console.log("banner shown"), 1000);
  return <div className="old-banner">Try the new version!</div>;
}
