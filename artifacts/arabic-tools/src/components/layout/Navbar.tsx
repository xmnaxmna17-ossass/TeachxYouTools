import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, TrendingUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useI18n, LANGUAGES, type Lang } from "@/lib/i18n";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { lang, setLang, t, isRTL } = useI18n();
  const langRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === lang)!;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo + Brand */}
        <div className={`flex items-center gap-6 ${isRTL ? "" : "flex-row"}`}>
          <Link href="/" className="flex items-center gap-3 group" data-testid="link-home">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-[2px] rounded-full blur-[1px] group-hover:blur-[2px] transition-all" />
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-primary/50 transition-all">
                <img
                  src="/teachtools-avatar.png"
                  alt="TeachTools"
                  className="w-full h-full object-cover object-top scale-[1.6] translate-y-[-10%]"
                />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black tracking-tight text-white">TeachTools</span>
              <span className="text-[10px] text-primary font-medium tracking-widest uppercase">@teachyou000</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location === "/" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
            >
              {t("home")}
            </Link>
            <Link
              href="/summarize"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location !== "/" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
            >
              {t("tools")}
            </Link>
            <a
              href="https://www.tiktok.com/@teachyou000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              TikTok
            </a>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {/* Language Switcher */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium"
            >
              <span>{currentLang.flag}</span>
              <span className="text-zinc-300">{currentLang.code.toUpperCase()}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
            </button>

            {isLangOpen && (
              <div className={`absolute top-full mt-2 w-44 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 ${isRTL ? "right-0" : "left-0"}`}>
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code as Lang); setIsLangOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${lang === l.code ? "bg-primary/20 text-primary" : "text-zinc-300 hover:bg-white/5 hover:text-white"}`}
                  >
                    <span className="text-base">{l.flag}</span>
                    <span>{l.label}</span>
                    {lang === l.code && <span className="mr-auto text-xs text-primary">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button variant="outline" className="border-white/10 text-sm h-9">
            {t("login")}
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm h-9">
            {t("startFree")}
          </Button>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile Language */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-sm"
            >
              <span>{currentLang.flag}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>
            {isLangOpen && (
              <div className="absolute top-full mt-2 right-0 w-40 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code as Lang); setIsLangOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${lang === l.code ? "bg-primary/20 text-primary" : "text-zinc-300 hover:bg-white/5"}`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className="p-2 text-zinc-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-background/95 backdrop-blur-xl absolute top-16 left-0 w-full p-4 flex flex-col gap-3 shadow-xl z-40">
          <Link href="/" className="px-4 py-3 rounded-xl font-medium bg-white/5 text-center" onClick={() => setIsMobileMenuOpen(false)}>
            {t("home")}
          </Link>
          <Link href="/summarize" className="px-4 py-3 rounded-xl font-medium hover:bg-white/5 text-center" onClick={() => setIsMobileMenuOpen(false)}>
            {t("tools")}
          </Link>
          <a
            href="https://www.tiktok.com/@teachyou000"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-xl font-medium hover:bg-white/5 text-center text-zinc-400 flex items-center justify-center gap-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <TrendingUp className="w-4 h-4" /> TikTok @teachyou000
          </a>
          <div className="h-px bg-white/10" />
          <Button variant="outline" className="w-full justify-center">{t("login")}</Button>
          <Button className="w-full justify-center bg-primary text-primary-foreground">{t("startFree")}</Button>
        </div>
      )}
    </nav>
  );
}
