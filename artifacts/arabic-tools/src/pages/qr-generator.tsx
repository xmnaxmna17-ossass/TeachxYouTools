import { useState, useRef } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import QRCode from "qrcode";
import { Download } from "lucide-react";

export default function QrGenerator() {
  const [text, setText] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = async () => {
    if (!text.trim() || !canvasRef.current) return;
    try {
      await QRCode.toCanvas(canvasRef.current, text, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      setQrUrl(canvasRef.current.toDataURL("image/png"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = "qrcode.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ToolLayout 
      title="مولد باركود QR" 
      description="أداة سريعة لإنشاء رموز الاستجابة السريعة (QR Code) للروابط، النصوص، وأرقام الهواتف وتنزيلها كصورة."
    >
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="qr-input">الرابط أو النص</Label>
              <Input
                id="qr-input"
                placeholder="https://example.com"
                className="h-14 text-lg bg-background"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setTimeout(generateQR, 50);
                }}
                dir="ltr"
                data-testid="input-qr-text"
              />
            </div>

            <div className="flex flex-col items-center pt-8">
              <div className="bg-white p-4 rounded-xl shadow-lg border border-white/20 mb-6">
                <canvas ref={canvasRef} width="300" height="300" className={qrUrl ? 'block' : 'hidden'} />
                {!qrUrl && (
                  <div className="w-[300px] h-[300px] flex items-center justify-center text-zinc-400 bg-zinc-100 rounded-lg">
                    الباركود سيظهر هنا
                  </div>
                )}
              </div>

              {qrUrl && (
                <Button 
                  size="lg" 
                  onClick={handleDownload}
                  className="px-8"
                  data-testid="button-qr-download"
                >
                  <Download className="w-5 h-5 ml-2" />
                  تنزيل كصورة PNG
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}