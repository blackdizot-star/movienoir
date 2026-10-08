import { useMemo } from "react";

/** Fixed-size iframe banner (300x250 or 468x60) scaled to fit a given width. */
const UNITS = {
  rect: { key: "d191d80ff21bffdcf9fada4d1e7a8675", w: 300, h: 250 },
  banner: { key: "8714e379252a6ae9d5fcc91359f39b5b", w: 468, h: 60 },
} as const;

const ScaledBannerAd = ({ unit, width }: { unit: keyof typeof UNITS; width: number }) => {
  const { key, w, h } = UNITS[unit];
  const scale = Math.min(1, width / w);
  const srcDoc = useMemo(
    () => `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body>
<script>atOptions={'key':'${key}','format':'iframe','height':${h},'width':${w},'params':{}};<\/script>
<script src="https://bancadeltempoidea.org/22/${key}"><\/script></body></html>`,
    [key, w, h],
  );
  return (
    <div role="complementary" aria-label="Advertisement" className="w-full overflow-hidden">
      <span className="block text-center text-[9px] uppercase tracking-widest text-muted-foreground/60 mb-1">Sponsored</span>
      <div className="mx-auto" style={{ width: w * scale, height: h * scale }}>
        <iframe
          title="Sponsored"
          srcDoc={srcDoc}
          scrolling="no"
          loading="lazy"
          width={w}
          height={h}
          className="block border-0 rounded-md"
          style={{ transform: `scale(${scale})`, transformOrigin: "left top" }}
        />
      </div>
    </div>
  );
};

export default ScaledBannerAd;
