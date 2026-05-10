import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, CheckCheck } from "lucide-react";

export default function FreeFireNames() {
  const [name, setName] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const generateVariations = (base: string) => {
    if (!base) return [];
    return [
      `꧁༺${base}༻꧂`,
      `★${base}★`,
      `๖ۣۜ${base}★`,
      `『${base}』`,
      `乂${base}乂`,
      `【${base}】`,
      `❖${base}❖`,
      `☠︎${base}☠︎`,
      `♛${base}♛`,
      `彡${base}彡`,
      `☆${base}☆`,
      `♔${base}♔`
    ];
  };

  const variations = generateVariations(name);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({ title: "تم النسخ", description: "تم نسخ الاسم المزخرف بنجاح." });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <ToolLayout 
      title="زخرفة أسماء فري فاير وببجي" 
      description="اكتب اسمك واحصل على عشرات الأشكال المزخرفة الجاهزة للاستخدام في الألعاب."
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 text-center">
          <Label htmlFor="name-input" className="text-xl mb-4 block">اكتب الاسم المراد زخرفته</Label>
          <Input
            id="name-input"
            placeholder="مثال: القناص، الأسطورة، احمد..."
            className="h-14 text-xl text-center bg-background max-w-lg mx-auto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-testid="input-name"
          />
        </div>

        {variations.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {variations.map((v, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/50 transition-colors">
                <span className="text-lg font-medium text-white px-2 truncate" dir="ltr">{v}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleCopy(v, idx)}
                  className="shrink-0 text-zinc-400 hover:text-white"
                >
                  {copiedIndex === idx ? <CheckCheck className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}