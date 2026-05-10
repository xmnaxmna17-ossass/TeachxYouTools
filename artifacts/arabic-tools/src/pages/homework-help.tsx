import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHomeworkHelp } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, CheckCheck } from "lucide-react";
import { HomeworkInputSubject } from "@workspace/api-client-react/src/generated/api.schemas";

export default function HomeworkHelp() {
  const [question, setQuestion] = useState("");
  const [subject, setSubject] = useState<HomeworkInputSubject>("general");
  const [copied, setCopied] = useState(false);
  
  const { toast } = useToast();
  const homeworkMutation = useHomeworkHelp();

  const handleSolve = () => {
    if (!question.trim()) {
      toast({ title: "خطأ", description: "يرجى إدخال السؤال", variant: "destructive" });
      return;
    }
    homeworkMutation.mutate({ data: { question, subject } });
  };

  const handleCopy = () => {
    if (homeworkMutation.data?.result) {
      navigator.clipboard.writeText(homeworkMutation.data.result);
      setCopied(true);
      toast({ title: "تم النسخ", description: "تم نسخ الإجابة بنجاح." });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ToolLayout 
      title="مساعد الواجبات" 
      description="أداة تعليمية تساعدك في حل وفهم الواجبات المدرسية والجامعية مع شرح مبسط وواضح."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <div className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="question">السؤال أو المسألة</Label>
                <Textarea
                  id="question"
                  placeholder="اكتب سؤالك هنا..."
                  className="min-h-[200px] bg-background resize-none"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  data-testid="input-homework-question"
                />
              </div>

              <div className="space-y-3">
                <Label>المادة الدراسية</Label>
                <Select value={subject} onValueChange={(v) => setSubject(v as HomeworkInputSubject)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="اختر المادة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">عام</SelectItem>
                    <SelectItem value="math">الرياضيات</SelectItem>
                    <SelectItem value="science">العلوم</SelectItem>
                    <SelectItem value="arabic">اللغة العربية</SelectItem>
                    <SelectItem value="english">اللغة الإنجليزية</SelectItem>
                    <SelectItem value="history">التاريخ</SelectItem>
                    <SelectItem value="geography">الجغرافيا</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                className="w-full h-12 text-lg mt-4" 
                onClick={handleSolve}
                disabled={homeworkMutation.isPending || !question.trim()}
                data-testid="button-homework-submit"
              >
                {homeworkMutation.isPending && <Loader2 className="w-5 h-5 ml-2 animate-spin" />}
                {homeworkMutation.isPending ? "جاري الحل..." : "أوجد الحل والشرح"}
              </Button>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 h-full min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base text-white">الإجابة والشرح</Label>
              {homeworkMutation.data?.result && (
                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8" data-testid="button-copy-homework">
                  {copied ? <CheckCheck className="w-4 h-4 ml-2 text-green-500" /> : <Copy className="w-4 h-4 ml-2 text-zinc-400" />}
                  نسخ
                </Button>
              )}
            </div>
            
            <div className="flex-grow bg-background rounded-xl border border-white/10 p-5 relative">
              {homeworkMutation.isPending ? (
                <div className="absolute inset-0 flex items-center justify-center flex-col text-zinc-500">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                  <p>جاري التفكير في الحل...</p>
                </div>
              ) : homeworkMutation.data?.result ? (
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">{homeworkMutation.data.result}</p>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
                  <p>سيظهر الحل هنا</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}