import { useState } from "react";
import { Link } from "wouter";
import { Search, TrendingUp, Zap, Shield, Sparkles, Activity, ArrowLeft, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TOOLS, TOOL_CATEGORY_KEYS } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";
import { useGetToolStats } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { data: stats, isLoading: statsLoading } = useGetToolStats();
  const { t, isRTL } = useI18n();

  const filteredTools = TOOLS.filter((tool) => {
    const title = t(tool.titleKey).toLowerCase();
    const desc = t(tool.descKey).toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = title.includes(q) || desc.includes(q);
    const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-28 pb-36 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-primary/15 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute top-40 right-0 w-[600px] h-[600px] bg-purple-500/8 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/6 blur-[120px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10 text-center">
            {/* TikTok badge */}
            <a
              href="https://www.tiktok.com/@teachyou000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary mb-10 hover:bg-white/10 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.53V6.77a4.85 4.85 0 01-1.01-.08z" />
              </svg>
              <span className="text-sm font-medium">{t("badge")}</span>
              <TrendingUp className="w-3.5 h-3.5 opacity-70" />
            </a>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.15] mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              {t("heroLine1")} <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-400 to-cyan-400">
                {t("heroLine2")}
              </span>
            </h1>

            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              {t("heroSub")}
            </p>

            <div className="max-w-2xl mx-auto relative animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:bg-primary/30 transition-colors" />
                <div className="relative bg-background/50 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center shadow-2xl">
                  <Search className="w-5 h-5 text-zinc-400 mx-3 flex-shrink-0" />
                  <Input
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    className="border-0 bg-transparent text-base shadow-none focus-visible:ring-0 px-2 h-12 flex-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-search-tools"
                  />
                  <Button size="default" className="rounded-xl px-6 h-10" data-testid="button-search-submit">
                    {t("searchBtn")}
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto animate-in fade-in duration-1000 delay-500">
              {[
                { labelKey: "statTools" as const, value: stats?.totalTools?.toString() || "15+", icon: Activity },
                { labelKey: "statUses" as const, value: stats?.totalUses ? `+${stats.totalUses}` : "+25,000", icon: Zap },
                { labelKey: "statUsers" as const, value: "+10,000", icon: TrendingUp },
                { labelKey: "statSecurity" as const, value: "100%", icon: Shield },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center p-6 rounded-2xl bg-white/[0.025] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-3xl font-bold text-white mb-1">
                    {statsLoading ? <Skeleton className="h-8 w-16" /> : stat.value}
                  </span>
                  <span className="text-xs text-zinc-500 text-center">{t(stat.labelKey)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ad Placeholder */}
        <div className="container mx-auto px-6 mb-16">
          <div className="w-full h-24 bg-white/[0.02] border border-white/10 border-dashed rounded-2xl flex items-center justify-center text-zinc-600 text-sm">
            {t("adSpace")}
          </div>
        </div>

        {/* Categories */}
        <section className="container mx-auto px-6 mb-12">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {TOOL_CATEGORY_KEYS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                }`}
                data-testid={`button-category-${cat.id}`}
              >
                {t(cat.labelKey)}
              </button>
            ))}
          </div>
        </section>

        {/* Tools Grid */}
        <section className="container mx-auto px-6 mb-32" id="tools">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className="group relative flex flex-col p-6 rounded-2xl bg-white/[0.025] border border-white/5 hover:border-white/15 hover:bg-white/[0.04] transition-all overflow-hidden"
                data-testid={`card-tool-${tool.id}`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${tool.bg} rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700`} />

                <div className="relative z-10 flex flex-col flex-grow">
                  <div className={`w-12 h-12 rounded-xl ${tool.bg} flex items-center justify-center mb-5`}>
                    <tool.icon className={`w-6 h-6 ${tool.color}`} />
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{t(tool.titleKey)}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-5 flex-grow">{t(tool.descKey)}</p>

                  <div className={`flex items-center gap-1 text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition-all ${isRTL ? "translate-x-2 group-hover:translate-x-0" : "-translate-x-2 group-hover:translate-x-0"}`}>
                    <span>{t("useTool")}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-24">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-zinc-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{t("noResults")}</h3>
              <p className="text-zinc-400">{t("noResultsDesc")}</p>
            </div>
          )}
        </section>

        {/* Benefits Section */}
        <section className="border-t border-white/5 bg-black/40 py-28">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t("benefitsTitle")}</h2>
              <p className="text-zinc-400">{t("benefitsSub")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { titleKey: "ben1Title" as const, descKey: "ben1Desc" as const, icon: Sparkles, gradient: "from-blue-500/20 to-cyan-500/10" },
                { titleKey: "ben2Title" as const, descKey: "ben2Desc" as const, icon: Zap, gradient: "from-purple-500/20 to-pink-500/10" },
                { titleKey: "ben3Title" as const, descKey: "ben3Desc" as const, icon: Shield, gradient: "from-emerald-500/20 to-teal-500/10" },
              ].map((b, i) => (
                <div key={i} className={`text-center p-10 rounded-2xl bg-gradient-to-br ${b.gradient} border border-white/5`}>
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 text-primary">
                    <b.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{t(b.titleKey)}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{t(b.descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TikTok CTA */}
        <section className="py-20 container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto p-10 rounded-3xl bg-gradient-to-br from-primary/10 via-purple-500/5 to-cyan-500/10 border border-white/10">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-primary/30 ring-offset-4 ring-offset-background">
                <img
                  src="/teachtools-avatar.png"
                  alt="TeachYou00"
                  className="w-full h-full object-cover object-top scale-[1.6] translate-y-[-10%]"
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">TeachYou00</h2>
            <p className="text-zinc-400 mb-2 text-sm">@teachyou000</p>
            <p className="text-zinc-300 mb-6 text-sm leading-relaxed">
              المحتوى | أعلمك اشياء لن يعلمك إياها أي احد 🎯
            </p>
            <div className="flex items-center justify-center gap-6 mb-8 text-center">
              <div>
                <p className="text-2xl font-bold text-white">40.8K</p>
                <p className="text-xs text-zinc-500">Followers</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <p className="text-2xl font-bold text-white">201.6K</p>
                <p className="text-xs text-zinc-500">J'aime</p>
              </div>
            </div>
            <a
              href="https://www.tiktok.com/@teachyou000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black font-bold text-sm hover:bg-white/90 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-black">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.53V6.77a4.85 4.85 0 01-1.01-.08z" />
              </svg>
              {t("followTikTok")}
            </a>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">{t("faqTitle")}</h2>
            <p className="text-zinc-400">{t("faqSub")}</p>
          </div>

          <div className="space-y-3">
            {[
              { q: "هل استخدام المنصة مجاني؟", a: "نعم، معظم الأدوات الأساسية في المنصة مجانية للاستخدام مع وجود خطط مدفوعة للميزات المتقدمة." },
              { q: "كيف تعمل أدوات الذكاء الاصطناعي؟", a: "نستخدم أحدث نماذج الذكاء الاصطناعي لمعالجة طلباتك وتقديم نتائج دقيقة ومخصصة." },
              { q: "هل بياناتي آمنة؟", a: "نعم، نحن نولي اهتماماً كبيراً بخصوصية مستخدمينا. لا نقوم بتخزين النصوص التي تقوم بمعالجتها." },
              { q: "هل يمكنني استخدام النتائج لأغراض تجارية؟", a: "نعم، يمكنك استخدام النتائج التي تحصل عليها من أدواتنا في أعمالك التجارية." },
              { q: "كيف يمكنني الإبلاغ عن مشكلة؟", a: "يمكنك التواصل معنا عبر TikTok @teachyou000 أو نموذج اتصل بنا." },
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.025] border border-white/5 hover:border-white/10 transition-colors">
                <h4 className="text-base font-semibold text-white mb-2">{faq.q}</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
