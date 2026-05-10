import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSummarizeText } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, CheckCheck } from "lucide-react";
import { SummarizeInputLength } from "@workspace/api-client-react/src/generated/api.schemas";

export default function Summarize() {
  const [text, setText] = useState("");
  const [length, setLength] = useState<SummarizeInputLength>("medium");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const summarizeMutation = useSummarizeText();

  const handleSummarize = () => {
    if (!text.trim()) {
      toast({ title: "خطأ", description: "يرجى إدخال النص أولاً", variant: "destructive" });
      return;
    }
    
    summarizeMutation.mutate({ data: { text, length } });
  };

  const handleCopy = () => {
    if (summarizeMutation.data?.result) {
      navigator.clipboard.writeText(summarizeMutation.data.result);
      setCopied(true);
      toast({ title: "تم النسخ", description: "تم نسخ النص إلى الحافظة بنجاح." });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ToolLayout 
      title="تلخيص النصوص" 
      description="أداة ذكية لتلخيص المقالات والنصوص الطويلة بدقة عالية مع الحفاظ على الأفكار الرئيسية."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <Label htmlFor="text-input" className="text-base mb-4 block text-white">النص المراد تلخيصه</Label>
            <Textarea
              id="text-input"
              placeholder="الصق النص هنا..."
              className="min-h-[300px] bg-background border-white/10 resize-none mb-6 text-base"
              value={text}
              onChange={(e) => setText(e.target.value)}
              data-testid="input-summarize-text"
            />
            
            <div className="mb-6 space-y-3">
              <Label className="text-zinc-400">طول الملخص</Label>
              <RadioGroup value={length} onValueChange={(v) => setLength(v as SummarizeInputLength)} className="flex gap-4">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="short" id="short" />
                  <Label htmlFor="short">قصير</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">متوسط</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="long" id="long" />
                  <Label htmlFor="long">طويل</Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              className="w-full h-12 text-lg" 
              onClick={handleSummarize}
              disabled={summarizeMutation.isPending || !text.trim()}
              data-testid="button-summarize-submit"
            >
              {summarizeMutation.isPending && <Loader2 className="w-5 h-5 ml-2 animate-spin" />}
              {summarizeMutation.isPending ? "جاري التلخيص..." : "لخص النص الآن"}
            </Button>
          </div>
          
          {/* Ad Space */}
          <div className="h-24 bg-white/5 border border-white/10 border-dashed rounded-xl flex items-center justify-center text-zinc-500 text-sm">
            مساحة إعلانية
          </div>
        </div>

        <div>
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 h-full min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base text-white">النتيجة</Label>
              {summarizeMutation.data?.result && (
                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8" data-testid="button-copy-result">
                  {copied ? <CheckCheck className="w-4 h-4 ml-2 text-green-500" /> : <Copy className="w-4 h-4 ml-2 text-zinc-400" />}
                  نسخ
                </Button>
              )}
            </div>
            
            <div className="flex-grow bg-background rounded-xl border border-white/10 p-4 relative">
              {summarizeMutation.isPending ? (
                <div className="absolute inset-0 flex items-center justify-center flex-col text-zinc-500">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                  <p>الذكاء الاصطناعي يقوم بتحليل وتلخيص النص...</p>
                </div>
              ) : summarizeMutation.data?.result ? (
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">{summarizeMutation.data.result}</p>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
                  <p>سيظهر الملخص هنا</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}