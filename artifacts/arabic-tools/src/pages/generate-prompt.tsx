import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGeneratePrompt } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, CheckCheck } from "lucide-react";
import { PromptInputStyle } from "@workspace/api-client-react/src/generated/api.schemas";

export default function GeneratePrompt() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState<PromptInputStyle>("creative");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();
  
  const generateMutation = useGeneratePrompt();

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast({ title: "خطأ", description: "يرجى إدخال الموضوع أولاً", variant: "destructive" });
      return;
    }
    generateMutation.mutate({ data: { topic, style, count: 3 } });
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({ title: "تم النسخ", description: "تم نسخ الأمر بنجاح." });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <ToolLayout 
      title="مولد الأوامر (Prompts)" 
      description="احصل على أوامر احترافية لـ ChatGPT ونماذج الذكاء الاصطناعي الأخرى بمجرد إدخال فكرتك."
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 space-y-3">
              <Label htmlFor="topic">موضوع الأمر</Label>
              <Input
                id="topic"
                placeholder="عن ماذا تريد التحدث؟ (مثال: كتابة مقال عن التسويق، برمجة موقع ويب...)"
                className="h-12 bg-background"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                data-testid="input-prompt-topic"
              />
            </div>
            
            <div className="space-y-3">
              <Label>أسلوب الأمر</Label>
              <Select value={style} onValueChange={(v) => setStyle(v as PromptInputStyle)}>
                <SelectTrigger className="h-12 bg-background">
                  <SelectValue placeholder="اختر الأسلوب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="creative">إبداعي</SelectItem>
                  <SelectItem value="professional">احترافي</SelectItem>
                  <SelectItem value="educational">تعليمي</SelectItem>
                  <SelectItem value="marketing">تسويقي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            className="w-full h-12 text-lg" 
            onClick={handleGenerate}
            disabled={generateMutation.isPending || !topic.trim()}
            data-testid="button-prompt-submit"
          >
            {generateMutation.isPending && <Loader2 className="w-5 h-5 ml-2 animate-spin" />}
            {generateMutation.isPending ? "جاري التوليد..." : "توليد أوامر احترافية"}
          </Button>
        </div>

        {generateMutation.data?.prompts && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-semibold text-white mb-4">الأوامر المقترحة</h3>
            {generateMutation.data.prompts.map((prompt, index) => (
              <div key={index} className="bg-white/[0.02] border border-white/5 rounded-xl p-5 group relative pr-14">
                <div className="absolute top-5 right-5 text-zinc-500 font-mono text-lg">{index + 1}.</div>
                <p className="text-zinc-300 leading-relaxed" dir="ltr">{prompt}</p>
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => handleCopy(prompt, index)}
                    className="bg-white/5 hover:bg-white/10"
                    data-testid={`button-copy-prompt-${index}`}
                  >
                    {copiedIndex === index ? <CheckCheck className="w-4 h-4 ml-2 text-green-500" /> : <Copy className="w-4 h-4 ml-2" />}
                    نسخ الأمر
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}