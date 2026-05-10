import { Link } from "wouter";
import { Twitter, Github, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-white/10 bg-black/20 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/40">
                <img
                  src="/teachtools-avatar.png"
                  alt="TeachTools"
                  className="w-full h-full object-cover object-top scale-[1.6] translate-y-[-10%]"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black text-white">TeachTools</span>
                <span className="text-xs text-primary font-medium">@teachyou000</span>
              </div>
            </div>
            <p className="text-zinc-400 leading-relaxed max-w-md mb-6 text-sm">
              {t("footerDesc")}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.tiktok.com/@teachyou000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#010101] to-[#69C9D0] border border-white/10 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.53V6.77a4.85 4.85 0 01-1.01-.08z" />
                </svg>
                {t("followTikTok")}
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider opacity-60">{t("footerPopular")}</h3>
            <ul className="space-y-3">
              <li><Link href="/summarize" className="text-zinc-400 hover:text-primary transition-colors text-sm">{t("toolSummarize")}</Link></li>
              <li><Link href="/generate-prompt" className="text-zinc-400 hover:text-primary transition-colors text-sm">{t("toolPrompt")}</Link></li>
              <li><Link href="/homework-help" className="text-zinc-400 hover:text-primary transition-colors text-sm">{t("toolHomework")}</Link></li>
              <li><Link href="/generate-resume" className="text-zinc-400 hover:text-primary transition-colors text-sm">{t("toolResume")}</Link></li>
              <li><Link href="/generate-caption" className="text-zinc-400 hover:text-primary transition-colors text-sm">{t("toolCaption")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider opacity-60">{t("footerLinks")}</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-zinc-400 hover:text-white transition-colors text-sm">{t("footerAbout")}</Link></li>
              <li><Link href="/" className="text-zinc-400 hover:text-white transition-colors text-sm">{t("footerTerms")}</Link></li>
              <li><Link href="/" className="text-zinc-400 hover:text-white transition-colors text-sm">{t("footerPrivacy")}</Link></li>
              <li>
                <Link href="/" className="text-zinc-400 hover:text-white transition-colors text-sm">
                  {t("footerContact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} TeachTools. {t("footerRights")}.
          </p>
          <p className="text-zinc-500 text-sm">{t("footerMadeWith")}</p>
        </div>
      </div>
    </footer>
  );
}
