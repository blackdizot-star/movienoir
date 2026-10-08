import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const SERVICES: { name: string; tag: string; hue: number }[] = [
  { name: "Netflix", tag: "Originals", hue: 357 },
  { name: "Disney+", tag: "Family", hue: 220 },
  { name: "Max", tag: "HBO", hue: 265 },
  { name: "Prime Video", tag: "Amazon", hue: 198 },
  { name: "Apple TV+", tag: "Originals", hue: 0 },
  { name: "Paramount+", tag: "Mountain", hue: 215 },
  { name: "Hulu", tag: "Next-day TV", hue: 145 },
  { name: "Peacock", tag: "NBCU", hue: 45 },
  { name: "Crunchyroll", tag: "Anime", hue: 25 },
  { name: "Starz", tag: "Premium", hue: 0 },
  { name: "BBC iPlayer", tag: "British", hue: 330 },
  { name: "Discovery+", tag: "Real life", hue: 205 },
  { name: "AMC+", tag: "Drama", hue: 50 },
];

/** Home row of 13 streaming service names, text-only branded tiles. */
const StreamingUniverse = () => (
  <section className="mt-6 md:mt-10 px-[5%]">
    <div className="mb-2 flex items-end justify-between md:mb-4">
      <h2 className="text-base font-bold text-foreground md:text-2xl flex items-center gap-2">
        <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-primary" /> Streaming Universe
      </h2>
    </div>
    <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
      {SERVICES.map((s) => (
        <Link
          key={s.name}
          to={`/search?q=${encodeURIComponent(s.name)}`}
          className="group relative flex-shrink-0 w-[120px] sm:w-[140px] md:w-[160px] aspect-video overflow-hidden rounded-lg ring-1 ring-border bg-card transition-transform duration-200 hover:-translate-y-1"
          style={{ backgroundImage: `radial-gradient(circle at 20% 0%, hsl(${s.hue} 85% 50% / 0.45), transparent 65%)` }}
        >
          <div className="absolute inset-0 flex flex-col justify-end p-2.5">
            <span className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">{s.tag}</span>
            <span className="text-[15px] md:text-lg font-extrabold leading-tight tracking-tight text-foreground group-hover:text-primary">
              {s.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  </section>
);

export default StreamingUniverse;
