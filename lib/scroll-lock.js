// ── Counter-based body scroll lock (handles nested modals) ──
let scrollLockCount = 0;
let scrollY = 0;

export function lockBodyScroll() {
  if (scrollLockCount === 0) {
    scrollY = window.scrollY;
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.position = "fixed";
    document.documentElement.style.top = `-${scrollY}px`;
    document.documentElement.style.width = "100%";
  }
  scrollLockCount++;
  return () => {
    scrollLockCount--;
    if (scrollLockCount === 0) {
      document.documentElement.style.overflow = "";
      document.documentElement.style.position = "";
      document.documentElement.style.top = "";
      document.documentElement.style.width = "";
      window.scrollTo(0, scrollY);
    }
  };
}
