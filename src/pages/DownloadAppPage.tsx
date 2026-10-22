import { ArrowLeft, ExternalLink, Headset, MessageCircle, Send } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

const options = [
  {
    title: "WhatsApp Channel",
    description: "Join our BingBloom WhatsApp channel for the MovieNoir APK and updates.",
    label: "Get APK on WhatsApp",
    href: "https://whatsapp.com/channel/0029VbD2CdHEwEjtJ5Utbo2n",
    Icon: MessageCircle,
  },
  {
    title: "Telegram",
    description: "Get the MovieNoir APK through our BingBloom Telegram community.",
    label: "Get APK on Telegram",
    href: "https://t.me/bingbloom",
    Icon: Send,
  },
];

const DownloadAppPage = () => (
  <main className="relative isolate flex min-h-screen flex-col items-center overflow-hidden bg-background px-4 py-10 text-foreground sm:justify-center sm:py-14">
    <SEO
      title="Get the MovieNoir App"
      description="Join our BingBloom WhatsApp or Telegram community to get the MovieNoir APK, installation instructions, and updates."
      canonicalPath="/download-app"
    />
    <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsla(344,60%,60%,0.12),transparent_58%)]" />

    <div className="w-full max-w-xl">
      <header className="mb-7 flex flex-col items-center text-center">
        <img
          src="/logo-compact.png"
          alt="MovieNoir"
          className="mb-4 h-16 w-16 rounded-2xl shadow-[0_0_32px_rgba(255,45,143,0.2)]"
        />
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">MovieNoir for Android</p>
        <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Get the MovieNoir App</h1>
        <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
          Ready to take your movie experience with you? Join our community to get the MovieNoir APK, installation instructions, and the latest app updates. Choose your preferred option below.
        </p>
      </header>

      <section
        aria-label="APK and support options"
        className="rounded-3xl border border-border/70 bg-card/90 p-4 shadow-2xl shadow-black/30 backdrop-blur sm:p-6"
      >
        <div className="mb-5 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm leading-6 text-foreground/80">
          <span className="font-semibold text-foreground">A quick note:</span> MovieNoir is the app you want to install. The WhatsApp and Telegram channels you’ll join are managed under BingBloom.
        </div>

        <div className="space-y-3">
          {options.map(({ title, description, label, href, Icon }) => (
            <article key={title} className="rounded-2xl border border-border/70 bg-background/60 p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 rounded-xl bg-primary/10 p-2.5 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold">{title}</h2>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
                  >
                    {label}
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </article>
          ))}

          <article className="rounded-2xl border border-border/70 bg-background/60 p-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 rounded-xl bg-primary/10 p-2.5 text-primary">
                <Headset className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold">Direct WhatsApp Support</h2>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  Contact our support team directly at +254733541119 to request the MovieNoir APK.
                </p>
                <a
                  href="https://wa.me/254733541119?text=Hi%2C%20I%20would%20like%20to%20get%20the%20MovieNoir%20APK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary/50 px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
                >
                  Request APK via WhatsApp
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>

      <footer className="mt-6 text-center">
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Headset className="h-4 w-4 flex-shrink-0 text-primary" aria-hidden="true" />
          Need help installing MovieNoir? Message our support team and we’ll be happy to help.
        </p>
        <Link
          to="/home"
          className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium text-foreground/80 transition hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to MovieNoir
        </Link>
      </footer>
    </div>
  </main>
);

export default DownloadAppPage;