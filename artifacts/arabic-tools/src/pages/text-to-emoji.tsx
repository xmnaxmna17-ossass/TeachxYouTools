import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTextToEmoji } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, CheckCheck } from "lucide-react";

export default function TextToEmoji() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  
  const { toast } = useToast();
  const emojiMutation = useTextToEmoji();

  const handleConvert = () => {
    if (!text.trim()) {
      toast({ title: "خطأ", description: "يرجى إدخال النص", variant: "destructive" });
      return;
    }
    emojiMutation.mutate({ data: { text } });
  };

  const handleCopy = () => {
    if (emojiMutation.data?.result) {
      navigator.clipboard.writeText(emojiMutation.data.result);
      setCopied(true);
      toast({ title: "تم النسخ", description: "تم نسخ النص مع الإيموجي." });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ToolLayout 
      title="النص إلى إيموجي" 
      description="حوّل رسائلك ونصوصك العادية إلى قصة مليئة بالرموز التعبيرية المعبرة والممتعة."
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label className="text-base text-white">النص الأصلي</Label>
            <Textarea
              placeholder="اكتب ما تريد تحويله هنا..."
              className="min-h-[200px] bg-white/[0.02] border border-white/5 resize-none text-base"
              value={text}
              onChange={(e) => setText(e.target.value)}
              data-testid="input-emoji-text"
            />
            <Button 
              className="w-full h-12 text-lg" 
              onClick={handleConvert}
              disabled={emojiMutation.isPending || !text.trim()}
              data-testid="button-emoji-submit"
            >
              {emojiMutation.isPending && <Loader2 className="w-5 h-5 ml-2 animate-spin" />}
              {emojiMutation.isPending ? "جاري التحويل..." : "إضافة الإيموجي"}
            </Button>
          </div>

          <div className="space-y-4 flex flex-col">
            <div className="flex items-center justify-between">
              <Label className="text-base text-white">النتيجة</Label>
              {emojiMutation.data?.result && (
                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8" data-testid="button-copy-emoji">
                  {copied ? <CheckCheck className="w-4 h-4 ml-2 text-green-500" /> : <Copy className="w-4 h-4 ml-2 text-zinc-400" />}
                  نسخ
                </Button>
              )}
            </div>
            <div className="flex-grow bg-white/[0.02] border border-white/5 rounded-xl p-5 relative min-h-[200px]">
              {emojiMutation.isPending ? (
                <div className="absolute inset-0 flex items-center justify-center flex-col text-zinc-500">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-yellow-500" />
                </div>
              ) : emojiMutation.data?.result ? (
                <p className="text-xl leading-relaxed whitespace-pre-wrap font-sans">{emojiMutation.data.result}</p>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
                  <p>ستظهر النتيجة هنا</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}