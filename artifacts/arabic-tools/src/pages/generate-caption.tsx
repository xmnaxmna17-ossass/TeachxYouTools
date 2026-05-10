import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGenerateCaption } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, CheckCheck, Hash } from "lucide-react";
import { CaptionInputPlatform, CaptionInputTone } from "@workspace/api-client-react/src/generated/api.schemas";

export default function GenerateCaption() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<CaptionInputPlatform>("instagram");
  const [tone, setTone] = useState<CaptionInputTone>("casual");
  const [copiedCaptionIndex, setCopiedCaptionIndex] = useState<number | null>(null);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  
  const { toast } = useToast();
  const captionMutation = useGenerateCaption();

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast({ title: "خطأ", description: "يرجى إدخال وصف للصورة أو المنشور", variant: "destructive" });
      return;
    }
    captionMutation.mutate({ data: { topic, platform, tone, count: 3 } });
  };

  const handleCopyCaption = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCaptionIndex(index);
    toast({ title: "تم النسخ", description: "تم نسخ النص بنجاح." });
    setTimeout(() => setCopiedCaptionIndex(null), 2000);
  };

  const handleCopyHashtags = () => {
    if (captionMutation.data?.hashtags) {
      navigator.clipboard.writeText(captionMutation.data.hashtags.join(" "));
      setCopiedHashtags(true);
      toast({ title: "تم النسخ", description: "تم نسخ الهاشتاجات بنجاح." });
      setTimeout(() => setCopiedHashtags(false), 2000);
    }
  };

  return (
    <ToolLayout 
      title="كابشن السوشيال ميديا" 
      description="اكتب وصفاً جذاباً واحترافياً لصورك ومنشوراتك مع أفضل الهاشتاجات المناسبة."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <div className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="topic">عن ماذا يتحدث المنشور؟</Label>
                <Textarea
                  id="topic"
                  placeholder="مثال: صورة لي وأنا أشرب القهوة في الصباح بمدينة دبي، الجو جميل ومريح..."
                  className="min-h-[120px] bg-background resize-none"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  data-testid="input-caption-topic"
                />
              </div>

              <div className="space-y-3">
                <Label>المنصة</Label>
                <Select value={platform} onValueChange={(v) => setPlatform(v as CaptionInputPlatform)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="اختر المنصة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">انستجرام</SelectItem>
                    <SelectItem value="twitter">تويتر (X)</SelectItem>
                    <SelectItem value="linkedin">لينكد إن</SelectItem>
                    <SelectItem value="tiktok">تيك توك</SelectItem>
                    <SelectItem value="general">عام</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>نبرة الصوت</Label>
                <Select value={tone} onValueChange={(v) => setTone(v as CaptionInputTone)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="اختر النبرة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">عفوي وودي</SelectItem>
                    <SelectItem value="professional">احترافي ورسمي</SelectItem>
                    <SelectItem value="funny">مضحك ومرح</SelectItem>
                    <SelectItem value="motivational">تحفيزي وملهم</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full h-12 text-lg mt-4" 
                onClick={handleGenerate}
                disabled={captionMutation.isPending || !topic.trim()}
                data-testid="button-caption-submit"
              >
                {captionMutation.isPending && <Loader2 className="w-5 h-5 ml-2 animate-spin" />}
                {captionMutation.isPending ? "جاري التوليد..." : "كتابة الوصف"}
              </Button>
            </div>
          </div>
          
          <div className="h-24 bg-white/5 border border-white/10 border-dashed rounded-xl flex items-center justify-center text-zinc-500 text-sm">
            إعلان
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 min-h-[500px]">
            {captionMutation.isPending ? (
              <div className="h-full min-h-[400px] flex items-center justify-center flex-col text-zinc-500">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                <p>يتم الآن صياغة أفضل الكلمات لمنشورك...</p>
              </div>
            ) : captionMutation.data ? (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    النصوص المقترحة
                  </h3>
                  <div className="space-y-4">
                    {captionMutation.data.captions.map((caption, idx) => (
                      <div key={idx} className="bg-background border border-white/10 rounded-xl p-4">
                        <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap mb-4">{caption}</p>
                        <div className="flex justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleCopyCaption(caption, idx)}
                            className="h-8 hover:bg-white/5"
                            data-testid={`button-copy-caption-${idx}`}
                          >
                            {copiedCaptionIndex === idx ? <CheckCheck className="w-4 h-4 ml-2 text-green-500" /> : <Copy className="w-4 h-4 ml-2" />}
                            نسخ النص
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {captionMutation.data.hashtags && captionMutation.data.hashtags.length > 0 && (
                  <div className="bg-background border border-white/10 rounded-xl p-4 mt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-white flex items-center gap-2">
                        <Hash className="w-4 h-4 text-primary" />
                        هاشتاجات مقترحة
                      </h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleCopyHashtags}
                        className="h-8 hover:bg-white/5"
                        data-testid="button-copy-hashtags"
                      >
                        {copiedHashtags ? <CheckCheck className="w-4 h-4 ml-2 text-green-500" /> : <Copy className="w-4 h-4 ml-2" />}
                        نسخ الهاشتاجات
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {captionMutation.data.hashtags.map((tag, idx) => (
                        <span key={idx} className="text-primary bg-primary/10 px-2 py-1 rounded-md text-sm font-medium" dir="ltr">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex items-center justify-center text-zinc-500">
                <p>ستظهر النتائج هنا بعد التوليد</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}