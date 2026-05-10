import { useState, useRef } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, FileDown, Trash2 } from "lucide-react";
import jsPDF from "jspdf";

export default function ImageToPdf() {
  const [images, setImages] = useState<{ url: string; file: File }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map(file => ({
        url: URL.createObjectURL(file),
        file
      }));
      setImages(prev => [...prev, ...newImages]);
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].url);
      updated.splice(index, 1);
      return updated;
    });
  };

  const generatePDF = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);
    try {
      const pdf = new jsPDF();
      for (let i = 0; i < images.length; i++) {
        if (i > 0) pdf.addPage();
        const img = new Image();
        img.src = images[i].url;
        await new Promise((resolve) => {
          img.onload = () => resolve(true);
        });
        
        // Calculate dimensions to fit the page maintaining aspect ratio
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgRatio = img.width / img.height;
        const pdfRatio = pdfWidth / pdfHeight;
        
        let finalWidth, finalHeight;
        if (imgRatio > pdfRatio) {
          finalWidth = pdfWidth;
          finalHeight = pdfWidth / imgRatio;
        } else {
          finalHeight = pdfHeight;
          finalWidth = pdfHeight * imgRatio;
        }
        
        const x = (pdfWidth - finalWidth) / 2;
        const y = (pdfHeight - finalHeight) / 2;
        
        pdf.addImage(img, 'JPEG', x, y, finalWidth, finalHeight);
      }
      pdf.save("document.pdf");
      toast({ title: "تم التنزيل", description: "تم تنزيل ملف PDF بنجاح." });
    } catch (error) {
      toast({ title: "خطأ", description: "حدث خطأ أثناء إنشاء الملف.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ToolLayout 
      title="الصور إلى PDF" 
      description="قم برفع صورك وسنقوم بتجميعها في ملف PDF واحد جاهز للمشاركة والطباعة."
    >
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="bg-white/[0.02] border border-white/5 border-dashed rounded-2xl p-12 text-center relative hover:bg-white/[0.04] transition-colors">
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 text-primary pointer-events-none">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 pointer-events-none">اضغط هنا لرفع الصور</h3>
          <p className="text-zinc-500 pointer-events-none">أو قم بسحب الصور وإفلاتها هنا (JPG, PNG)</p>
        </div>

        {images.length > 0 && (
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">الصور المرفوعة ({images.length})</h3>
              <Button onClick={generatePDF} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <FileDown className="w-4 h-4 ml-2" />}
                تحميل PDF
              </Button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-background">
                  <img src={img.url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="destructive" size="icon" onClick={() => removeImage(idx)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                    {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}