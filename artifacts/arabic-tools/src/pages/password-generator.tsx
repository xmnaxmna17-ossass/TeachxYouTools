import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/layout/ToolLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Copy, RefreshCw, CheckCheck } from "lucide-react";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState([16]);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generatePassword = () => {
    let charset = "";
    if (options.lowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (options.uppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.numbers) charset += "0123456789";
    if (options.symbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (charset === "") {
      setPassword("");
      return;
    }

    let newPassword = "";
    for (let i = 0; i < length[0]; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }
    setPassword(newPassword);
  };

  useEffect(() => {
    generatePassword();
  }, [length, options]);

  const handleCopy = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      toast({ title: "تم النسخ", description: "تم نسخ كلمة المرور." });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStrengthLabel = () => {
    if (password.length === 0) return { text: "", color: "" };
    let score = 0;
    if (password.length > 8) score++;
    if (password.length >= 12) score++;
    if (options.uppercase) score++;
    if (options.numbers) score++;
    if (options.symbols) score++;

    if (score < 3) return { text: "ضعيفة", color: "text-red-500" };
    if (score < 5) return { text: "جيدة", color: "text-yellow-500" };
    return { text: "قوية جداً", color: "text-green-500" };
  };

  const strength = getStrengthLabel();

  return (
    <ToolLayout 
      title="مولد كلمات المرور" 
      description="قم بإنشاء كلمات مرور عشوائية وقوية لتعزيز أمان حساباتك."
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8">
          
          <div className="relative mb-10">
            <div className="bg-background border border-white/10 rounded-xl p-6 min-h-[100px] flex items-center justify-center break-all text-center">
              <span className="text-3xl tracking-widest font-mono text-white" dir="ltr">{password || "-"}</span>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <Button size="icon" className="rounded-full shadow-lg h-12 w-12" onClick={generatePassword} data-testid="button-pw-refresh">
                <RefreshCw className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="secondary" className="rounded-full shadow-lg h-12 w-12 bg-white text-black hover:bg-white/90" onClick={handleCopy} data-testid="button-pw-copy">
                {copied ? <CheckCheck className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-8 px-2">
            <span className="text-zinc-400 text-sm">قوة كلمة المرور:</span>
            <span className={`font-bold ${strength.color}`}>{strength.text}</span>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>طول كلمة المرور</Label>
                <span className="text-primary font-mono bg-primary/10 px-2 rounded">{length[0]}</span>
              </div>
              <Slider 
                value={length} 
                onValueChange={setLength} 
                max={64} 
                min={4} 
                step={1} 
                dir="rtl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <Label htmlFor="uppercase" className="cursor-pointer">حروف كبيرة (A-Z)</Label>
                <Switch 
                  id="uppercase" 
                  checked={options.uppercase} 
                  onCheckedChange={(c) => setOptions(p => ({ ...p, uppercase: c }))} 
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <Label htmlFor="lowercase" className="cursor-pointer">حروف صغيرة (a-z)</Label>
                <Switch 
                  id="lowercase" 
                  checked={options.lowercase} 
                  onCheckedChange={(c) => setOptions(p => ({ ...p, lowercase: c }))} 
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <Label htmlFor="numbers" className="cursor-pointer">أرقام (0-9)</Label>
                <Switch 
                  id="numbers" 
                  checked={options.numbers} 
                  onCheckedChange={(c) => setOptions(p => ({ ...p, numbers: c }))} 
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <Label htmlFor="symbols" className="cursor-pointer">رموز (!@#$)</Label>
                <Switch 
                  id="symbols" 
                  checked={options.symbols} 
                  onCheckedChange={(c) => setOptions(p => ({ ...p, symbols: c }))} 
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </ToolLayout>
  );
}