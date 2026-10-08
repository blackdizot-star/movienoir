import { Home, Film, Drama, Bookmark, type LucideProps } from "lucide-react";

/** TikTok-style explore icon: four small circles. */
const DotsExplore = ({ strokeWidth = 1.8, className }: LucideProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={className as string}>
    <circle cx="7" cy="7" r="3.2" />
    <circle cx="17" cy="7" r="3.2" />
    <circle cx="7" cy="17" r="3.2" />
    <circle cx="17" cy="17" r="3.2" />
  </svg>
);
import { Link, useLocation } from "react-router-dom";

const tabs = [
  { to: "/home", icon: Home, label: "Home", match: (p: string) => p === "/" || p === "/home" },
  { to: "/search", icon: DotsExplore, label: "Explore", match: (p: string) => p.startsWith("/search") },
  { to: "/movies", icon: Film, label: "Movies", match: (p: string) => p.startsWith("/movies") || p.startsWith("/tv") },
  { to: "/anime", icon: Drama, label: "Anime", match: (p: string) => p.startsWith("/anime") },
  { to: "/my-list", icon: Bookmark, label: "Watchlist", match: (p: string) => p.startsWith("/my-list") || p.startsWith("/my-downloads") },
];

const BottomNav = () => {
  const { pathname } = useLocation();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 shadow-2xl backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2 py-1">
        {tabs.map((t) => {
          const active = t.match(pathname);
          const Icon = t.icon;
          return (
            <li key={t.to} className="flex-1 min-w-0">
              <Link
                to={t.to}
                className={`flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-md px-1 py-1.5 text-[10.5px] font-medium transition-colors duration-200 ${
                   active ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-[21px] w-[21px]" strokeWidth={active ? 2.2 : 1.7} />
                <span className="truncate max-w-full tracking-tight">{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
