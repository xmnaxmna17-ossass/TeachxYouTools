import { useState } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGenerateResume } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Download } from "lucide-react";

export default function GenerateResume() {
  const [formData, setFormData] = useState({
    name: "",
    jobTitle: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
  });
  
  const { toast } = useToast();
  const resumeMutation = useGenerateResume();

  const handleGenerate = () => {
    if (!formData.name || !formData.jobTitle) {
      toast({ title: "معلومات ناقصة", description: "الاسم والمسمى الوظيفي متطلبات أساسية.", variant: "destructive" });
      return;
    }
    resumeMutation.mutate({ data: formData });
  };

  const handleDownloadHtml = () => {
    if (resumeMutation.data?.html) {
      const blob = new Blob([resumeMutation.data.html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume-${formData.name || 'document'}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ToolLayout 
      title="صانع السيرة الذاتية" 
      description="أدخل بياناتك المهنية وسيقوم الذكاء الاصطناعي بصياغة سيرة ذاتية احترافية باللغة العربية وجاهزة للطباعة."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input
                  id="name"
                  placeholder="محمد أحمد"
                  className="bg-background"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  data-testid="input-resume-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">المسمى الوظيفي</Label>
                <Input
                  id="jobTitle"
                  placeholder="مهندس برمجيات"
                  className="bg-background"
                  value={formData.jobTitle}
                  onChange={(e) => handleChange("jobTitle", e.target.value)}
                  data-testid="input-resume-job"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">نبذة عنك (اختياري)</Label>
              <Textarea
                id="summary"
                placeholder="تحدث باختصار عن أهدافك وطموحاتك..."
                className="h-24 bg-background resize-none"
                value={formData.summary}
                onChange={(e) => handleChange("summary", e.target.value)}
                data-testid="input-resume-summary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">الخبرات العملية (اختياري)</Label>
              <Textarea
                id="experience"
                placeholder="- مبرمج في شركة كذا (2020-2023)
- مطور واجهات في شركة كذا..."
                className="h-32 bg-background resize-none"
                value={formData.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
                data-testid="input-resume-exp"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">التعليم (اختياري)</Label>
              <Textarea
                id="education"
                placeholder="- بكالوريوس هندسة حاسوب، جامعة كذا..."
                className="h-24 bg-background resize-none"
                value={formData.education}
                onChange={(e) => handleChange("education", e.target.value)}
                data-testid="input-resume-edu"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">المهارات (اختياري)</Label>
              <Textarea
                id="skills"
                placeholder="برمجة، تصميم، إدارة مشاريع، تواصل..."
                className="h-24 bg-background resize-none"
                value={formData.skills}
                onChange={(e) => handleChange("skills", e.target.value)}
                data-testid="input-resume-skills"
              />
            </div>

            <Button 
              className="w-full h-12 text-lg mt-4" 
              onClick={handleGenerate}
              disabled={resumeMutation.isPending}
              data-testid="button-resume-submit"
            >
              {resumeMutation.isPending && <Loader2 className="w-5 h-5 ml-2 animate-spin" />}
              {resumeMutation.isPending ? "جاري الإنشاء..." : "إنشاء السيرة الذاتية"}
            </Button>
          </div>
        </div>

        <div>
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 h-full min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base text-white">المعاينة</Label>
              {resumeMutation.data?.html && (
                <Button variant="outline" size="sm" onClick={handleDownloadHtml} className="h-8 border-white/10" data-testid="button-download-resume">
                  <Download className="w-4 h-4 ml-2" />
                  تحميل HTML
                </Button>
              )}
            </div>
            
            <div className="flex-grow bg-white rounded-xl overflow-hidden relative">
              {resumeMutation.isPending ? (
                <div className="absolute inset-0 flex items-center justify-center flex-col text-zinc-500 bg-background">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                  <p>الذكاء الاصطناعي يقوم بصياغة السيرة الذاتية...</p>
                </div>
              ) : resumeMutation.data?.html ? (
                <iframe 
                  srcDoc={resumeMutation.data.html} 
                  className="w-full h-full border-0 bg-white"
                  title="Resume Preview"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-500 bg-background border border-white/10 rounded-xl">
                  <p>ستظهر المعاينة هنا</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}