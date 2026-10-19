import { useEffect, useMemo, useRef, useState } from "react";

const AD_KEY = "8714e379252a6ae9d5fcc91359f39b5b";
const AD_WIDTH = 468;
const AD_HEIGHT = 60;

const ResponsiveScriptAd = ({ className = "" }: { className?: string }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const updateScale = () => setScale(Math.min(1, host.clientWidth / AD_WIDTH));
    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const srcDoc = useMemo(
    () => `<!doctype html>
<html><head><meta charset="utf-8"><style>
html,body{width:${AD_WIDTH}px;height:${AD_HEIGHT}px;margin:0;padding:0;overflow:hidden;background:transparent}
</style></head><body>
<script>atOptions={'key':'${AD_KEY}','format':'iframe','height':${AD_HEIGHT},'width':${AD_WIDTH},'params':{}};<\/script>
<script src="https://bancadeltempoidea.org/22/${AD_KEY}"><\/script>
</body></html>`,
    [],
  );

  return (
    <aside
      role="complementary"
      aria-label="Advertisement"
      className={`w-full px-3 py-2 ${className}`}
    >
      <span className="mb-1 block text-center text-[8px] uppercase text-muted-foreground/60">
        Advertisement
      </span>
      <div
        ref={hostRef}
        className="relative mx-auto w-full max-w-[468px] overflow-hidden"
        style={{ height: AD_HEIGHT * scale }}
      >
        <iframe
          title="Advertisement"
          srcDoc={srcDoc}
          width={AD_WIDTH}
          height={AD_HEIGHT}
          scrolling="no"
          loading="lazy"
          className="absolute left-1/2 top-0 border-0"
          style={{ transform: `translateX(-50%) scale(${scale})`, transformOrigin: "top center" }}
        />
      </div>
    </aside>
  );
};

export default ResponsiveScriptAd;