import { useState, useEffect, useRef } from "react";
import { RefreshCw, Maximize, WifiOff, CloudDownload, Plus, Check, Download, Share2, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { isDownloaded } from "@/lib/offlineDownloads";
import PlayerBrandLoader from "@/components/PlayerBrandLoader";
import PreRollAd from "@/components/PreRollAd";
import { isInMyList, toggleMyList } from "@/hooks/useMyList";

export type ServerId =
  | "cinesrc" | "nova" | "vale" | "smashystreams" | "dumpo"
  | "vidbolt" | "vidcore" | "vidnest" | "vidlink" | "vidsrcme" | "filmu";

type ServerDef = {
  id: ServerId; label: string; protected?: boolean;
  url: (id: string, type: "movie" | "tv", s: number, e: number) => string;
};
const path = (origin: string) => (id: string, type: "movie" | "tv", s: number, e: number) =>
  type === "tv" ? `${origin}/tv/${id}/${s}/${e}` : `${origin}/movie/${id}`;

export const PLAYER_SERVERS: ServerDef[] = [
  { id: "cinesrc", label: "CineSrc (Protected)", protected: true, url: path("https://cinesrc.st") },
  { id: "nova", label: "Nova (Protected)", protected: true, url: path("https://vidsrc.cc/v2/embed") },
  { id: "vale", label: "Vale (Protected)", protected: true, url: path("https://vidgod.site") },
  { id: "smashystreams", label: "SmashyStreams (Protected)", protected: true,
    url: (id, t, s, e) => t === "tv" ? `https://player.smashy.stream/tv/${id}?s=${s}&e=${e}` : `https://player.smashy.stream/movie/${id}` },
  { id: "dumpo", label: "Dumpo (Protected)", protected: true, url: path("https://vidsrc.to/embed") },
  { id: "vidbolt", label: "VidBolt", url: path("https://vidbolt.xyz") },
  { id: "vidcore", label: "Crimson", url: path("https://vidcore.io") },
  { id: "vidnest", label: "Helix", url: path("https://vidnest.fun") },
  { id: "vidlink", label: "Astra", url: path("https://vidlink.pro") },
  { id: "vidsrcme", label: "Ironclad", url: path("https://vidsrcme.ru") },
  { id: "filmu", label: "Lumen", url: path("https://embed.filmu.in") },
];

const embedUrl = (server: ServerId, tmdbId: string, type: "movie" | "tv", season: number, episode: number) =>
  (PLAYER_SERVERS.find((s) => s.id === server) || PLAYER_SERVERS[0]).url(tmdbId, type, season, episode);

interface Props {
  tmdbId: string;
  type?: "movie" | "tv";
  season?: number;
  episode?: number;
  serverId?: ServerId;
  onServerChange?: (id: ServerId) => void;
  title?: string;
  year?: string;
  poster?: string | null;
  backdrop?: string | null;
  onPrev?: () => void;
  onNext?: () => void;
  nextItem?: { title: string; poster?: string | null; subtitle?: string } | null;
}

const MoviePlayer = ({
  tmdbId,
  type = "movie",
  season = 1,
  episode = 1,
  serverId,
  onServerChange,
  title,
  year,
  poster,
  backdrop,
}: Props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [internalServer, setInternalServer] = useState<ServerId>("cinesrc");
  const server = serverId ?? internalServer;
  const containerRef = useRef<HTMLDivElement>(null);
  const online = useOnlineStatus();
  const [savedOffline, setSavedOffline] = useState(false);
  const [adDone, setAdDone] = useState(false);
  const watchlistId = `${type}-${tmdbId}`;
  const [noAds, setNoAds] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(() => isInMyList(watchlistId));

  useEffect(() => {
    setAdDone(false);
    setInWatchlist(isInMyList(`${type}-${tmdbId}`));
  }, [tmdbId, type, season, episode]);

  const isProtected = !!PLAYER_SERVERS.find((x) => x.id === server)?.protected;
  const sandboxed = noAds || isProtected;
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: title || "Watch", url });
      else await navigator.clipboard.writeText(url);
    } catch { /* ignore */ }
  };
  const goDownload = () => { window.location.href = `/download/${type}/${tmdbId}${type === "tv" ? `/${season}/${episode}` : ""}`; };
  const src = embedUrl(server, tmdbId, type, season, episode);

  const pickServer = (id: ServerId) => {
    setInternalServer(id);
    onServerChange?.(id);
  };

  const toggleWatchlist = () => {
    if (!title) return;
    const added = toggleMyList({
      id: watchlistId,
      title,
      thumbnail: poster || backdrop || "",
      channel: year || (type === "tv" ? "TV Show" : "Movie"),
      views: "",
      duration: "",
    });
    setInWatchlist(added);
  };

  useEffect(() => {
    let active = true;
    isDownloaded(`${type}-${tmdbId}`).then((d) => active && setSavedOffline(d));
    return () => {
      active = false;
    };
  }, [type, tmdbId]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const t = setTimeout(() => setLoading(false), 6000);
    return () => clearTimeout(t);
  }, [src, attempt]);

  const toggleFullscreen = async () => {
    const el = containerRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen?.();
        try {
          const o = (screen as any).orientation;
          if (o?.lock) await o.lock("landscape").catch(() => {});
        } catch {
          /* ignore */
        }
      } else {
        try {
          (screen as any).orientation?.unlock?.();
        } catch {
          /* ignore */
        }
        await document.exitFullscreen?.();
      }
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!online && !savedOffline) {
    return (
      <div className="w-full bg-background">
        <div className="relative w-full aspect-video overflow-hidden flex flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground/5">
            <WifiOff className="h-6 w-6 text-foreground/70" />
          </div>
          <p className="text-foreground text-sm font-semibold">You're offline</p>
          <p className="text-muted-foreground text-xs max-w-xs leading-relaxed">
            Connect to the internet to stream this title — or download titles while
            online to watch them anytime.
          </p>
          <Link
            to="/my-downloads"
            className="mt-1 inline-flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-[11px] font-semibold text-primary-foreground bg-primary"
          >
            <CloudDownload className="h-3.5 w-3.5" /> Go to Downloads
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background">
      <div
        ref={containerRef}
        tabIndex={-1}
        className="relative w-full aspect-video overflow-hidden bb-player-shell outline-none bg-black"
      >
        {adDone && (
          <iframe
            key={`${src}-${attempt}`}
            src={src}
            title={title || "Player"}
            className="absolute inset-0 w-full h-full border-0 bg-black"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            {...(sandboxed ? { sandbox: "allow-scripts allow-same-origin allow-forms allow-presentation" } : {})}
            allowFullScreen
            referrerPolicy="origin"
            onLoad={() => setLoading(false)}
            onError={() => setError(true)}
          />
        )}

        {!adDone && <PreRollAd seed={`${type}-${tmdbId}-${season}-${episode}`} onFinish={() => setAdDone(true)} />}

        {adDone && loading && !error && <PlayerBrandLoader variant="loading" label="Loading stream…" />}

        {error && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 px-6 text-center bg-black">
            <img src={`${import.meta.env.BASE_URL}logo-compact.png`} alt="MovieNoir" className="h-14 w-14 rounded-xl" />
            <p className="text-white text-sm font-semibold tracking-wide">Stream unavailable</p>
            <p className="text-white/55 text-[10.5px] max-w-xs leading-relaxed">
              Try another source below.
            </p>
            <button
              onClick={() => setAttempt((a) => a + 1)}
              className="flex items-center gap-1.5 text-white text-[11px] px-3 py-1.5 rounded-md font-semibold bg-primary"
            >
              <RefreshCw className="w-3 h-3" /> Try again
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 bg-card border-t border-border/60 flex-nowrap overflow-x-auto scrollbar-hide">
        <div className="relative shrink-0">
          <label className="sr-only" htmlFor="bb-server-select">Server</label>
          <select
            id="bb-server-select"
            value={server}
            onChange={(event) => pickServer(event.target.value as ServerId)}
            className="h-9 max-w-[120px] sm:max-w-none appearance-none rounded-md border border-border/60 bg-foreground/5 pl-2 sm:pl-3 pr-7 sm:pr-8 text-[12px] font-semibold text-foreground"
          >
            {PLAYER_SERVERS.map((source) => (
              <option key={source.id} value={source.id} className="bg-background text-foreground">{source.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground/70" />
        </div>
        <button
          type="button"
          aria-pressed={noAds}
          onClick={() => setNoAds((v) => !v)}
          className={`h-8 shrink-0 whitespace-nowrap rounded-full px-2.5 sm:px-3 text-[11px] font-semibold transition ${noAds ? "bg-primary text-primary-foreground" : "bg-primary/15 text-primary ring-1 ring-primary/50 animate-pulse shadow-[0_0_14px_hsl(var(--primary)/0.7)]"}`}
        >
          {noAds ? "Ads off" : "Turn off ads"}
        </button>
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5">
          <button type="button" title="Download" aria-label="Download" onClick={goDownload} className="group flex shrink-0 flex-row items-center text-[10px] font-medium text-muted-foreground transition active:scale-95 sm:w-auto sm:h-9 sm:flex-row sm:gap-1.5 sm:rounded-full sm:bg-secondary sm:px-3 sm:text-[12px] sm:font-semibold sm:text-foreground sm:ring-1 sm:ring-border/60 sm:hover:bg-primary sm:hover:text-primary-foreground sm:hover:ring-primary">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30 group-active:bg-primary group-active:text-primary-foreground sm:h-auto sm:w-auto sm:rounded-none sm:bg-transparent sm:text-current sm:ring-0"><Download className="h-4 w-4" /></span>
            <span className="hidden sm:inline">Download</span>
          </button>
          <button type="button" title="Full screen" aria-label="Full screen" onClick={toggleFullscreen} className="group flex shrink-0 flex-row items-center text-[10px] font-medium text-muted-foreground transition active:scale-95 sm:w-auto sm:h-9 sm:flex-row sm:gap-1.5 sm:rounded-full sm:bg-secondary sm:px-3 sm:text-[12px] sm:font-semibold sm:text-foreground sm:ring-1 sm:ring-border/60 sm:hover:bg-primary sm:hover:text-primary-foreground sm:hover:ring-primary">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30 group-active:bg-primary group-active:text-primary-foreground sm:h-auto sm:w-auto sm:rounded-none sm:bg-transparent sm:text-current sm:ring-0"><Maximize className="h-4 w-4" /></span>
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
          <button type="button" title="Share" aria-label="Share" onClick={share} className="group flex shrink-0 flex-row items-center text-[10px] font-medium text-muted-foreground transition active:scale-95 sm:w-auto sm:h-9 sm:flex-row sm:gap-1.5 sm:rounded-full sm:bg-secondary sm:px-3 sm:text-[12px] sm:font-semibold sm:text-foreground sm:ring-1 sm:ring-border/60 sm:hover:bg-primary sm:hover:text-primary-foreground sm:hover:ring-primary">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30 group-active:bg-primary group-active:text-primary-foreground sm:h-auto sm:w-auto sm:rounded-none sm:bg-transparent sm:text-current sm:ring-0"><Share2 className="h-4 w-4" /></span>
            <span className="hidden sm:inline">Share</span>
          </button>
          <button type="button" title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"} aria-label={inWatchlist ? "Remove from watchlist" : "Add to watchlist"} onClick={toggleWatchlist} className="group flex shrink-0 flex-row items-center text-[10px] font-medium text-muted-foreground transition active:scale-95 sm:w-auto sm:h-9 sm:flex-row sm:gap-1.5 sm:rounded-full sm:bg-secondary sm:px-3 sm:text-[12px] sm:font-semibold sm:text-foreground sm:ring-1 sm:ring-border/60 sm:hover:bg-primary sm:hover:text-primary-foreground sm:hover:ring-primary">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30 group-active:bg-primary group-active:text-primary-foreground sm:h-auto sm:w-auto sm:rounded-none sm:bg-transparent sm:text-current sm:ring-0">{inWatchlist ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}</span>
            <span className="hidden sm:inline">Watchlist</span>
          </button>
        </div>
      </div>
      <p className="px-3 pb-2 bg-card text-[10.5px] leading-snug text-muted-foreground">For no redirects, turn on "Turn off ads". If the video doesn't play, turn it off to keep enjoying your show.</p>
    </div>
  );
};

export default MoviePlayer;
