import { ReactNode } from "react";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useI18n } from "@/lib/i18n";

interface ToolLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export function ToolLayout({ children, title, description }: ToolLayoutProps) {
  const { t, isRTL } = useI18n();

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow">
        <div className="border-b border-white/5 bg-white/[0.02]">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center gap-2 text-sm text-zinc-400 mb-6">
              <Link href="/" className="hover:text-white transition-colors">
                {t("home")}
              </Link>
              <ChevronRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              <span className="text-primary">{title}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">{title}</h1>
            <p className="text-zinc-400 max-w-2xl text-lg">{description}</p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
