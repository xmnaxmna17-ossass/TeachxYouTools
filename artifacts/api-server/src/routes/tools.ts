import { Router, type IRouter } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import {
  SummarizeTextBody,
  GeneratePromptBody,
  GenerateCaptionBody,
  HomeworkHelpBody,
  TextToEmojiBody,
  GenerateResumeBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

// Track usage stats in memory (could be moved to DB later)
const toolUsage: Record<string, number> = {
  summarize: 0,
  "generate-prompt": 0,
  "generate-caption": 0,
  "homework-help": 0,
  "text-to-emoji": 0,
  "generate-resume": 0,
  "qr-generator": 0,
  "password-generator": 0,
  "free-fire-names": 0,
  "image-to-pdf": 0,
  "pdf-merge": 0,
  "remove-background": 0,
};

// Tool display names in Arabic
const toolNames: Record<string, string> = {
  summarize: "ملخص النص بالذكاء الاصطناعي",
  "generate-prompt": "مولد البرومبت",
  "generate-caption": "مولد التعليقات",
  "homework-help": "مساعد الواجبات",
  "text-to-emoji": "تحويل النص إلى إيموجي",
  "generate-resume": "مولد السيرة الذاتية",
  "qr-generator": "مولد QR Code",
  "password-generator": "مولد كلمة المرور",
  "free-fire-names": "أسماء فري فاير",
  "image-to-pdf": "تحويل الصور إلى PDF",
  "pdf-merge": "دمج ملفات PDF",
  "remove-background": "إزالة خلفية الصورة",
};

// GET /tools/stats
router.get("/tools/stats", async (_req, res): Promise<void> => {
  const totalUses = Object.values(toolUsage).reduce((a, b) => a + b, 0);
  const totalTools = Object.keys(toolUsage).length;

  const trending = Object.entries(toolUsage)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([toolId, uses]) => ({
      toolId,
      name: toolNames[toolId] ?? toolId,
      uses,
      trending: uses > 0,
    }));

  res.json({ totalUses, totalTools, trending });
});

// POST /tools/summarize
router.post("/tools/summarize", async (req, res): Promise<void> => {
  const parsed = SummarizeTextBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { text, length = "medium", language = "ar" } = parsed.data;

  const lengthInstruction =
    length === "short"
      ? "في 2-3 جمل قصيرة جداً"
      : length === "medium"
        ? "في فقرة متوسطة (5-7 جمل)"
        : "بشكل مفصل (10-15 جملة)";

  const langInstruction =
    language === "ar"
      ? "قدم الملخص باللغة العربية"
      : "قدم الملخص باللغة الإنجليزية";

  const prompt =
    language === "ar"
      ? `لخّص النص التالي ${lengthInstruction}. ${langInstruction}:\n\n${text}`
      : `Summarize the following text ${length === "short" ? "in 2-3 very short sentences" : length === "medium" ? "in a medium paragraph (5-7 sentences)" : "in detail (10-15 sentences)"}. Provide the summary in ${language === "ar" ? "Arabic" : "English"}:\n\n${text}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const result = response.choices[0]?.message?.content ?? "";
  toolUsage["summarize"] = (toolUsage["summarize"] ?? 0) + 1;

  res.json({ result, toolUsed: "summarize" });
});

// POST /tools/generate-prompt
router.post("/tools/generate-prompt", async (req, res): Promise<void> => {
  const parsed = GeneratePromptBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { topic, style = "creative", count = 5, language = "ar" } = parsed.data;

  const styleArabic: Record<string, string> = {
    creative: "إبداعي ومبتكر",
    professional: "احترافي ومهني",
    educational: "تعليمي وتثقيفي",
    marketing: "تسويقي وجذاب",
  };

  const prompt =
    language === "ar"
      ? `أنشئ ${count} برومبت (موجّه) ${styleArabic[style] ?? "إبداعي"} عن الموضوع: "${topic}". قدّم كل برومبت في سطر مستقل مرقّم. يجب أن تكون البرومبتات مفيدة ومناسبة للذكاء الاصطناعي.`
      : `Generate ${count} ${style} prompts about: "${topic}". Provide each prompt on a numbered separate line. Make them useful and AI-ready.`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = response.choices[0]?.message?.content ?? "";
  const prompts = rawText
    .split("\n")
    .filter((line) => line.trim().match(/^\d+[\.\-\)]/))
    .map((line) => line.replace(/^\d+[\.\-\)]\s*/, "").trim())
    .filter((line) => line.length > 0);

  toolUsage["generate-prompt"] = (toolUsage["generate-prompt"] ?? 0) + 1;

  res.json({ prompts: prompts.length > 0 ? prompts : [rawText], toolUsed: "generate-prompt" });
});

// POST /tools/generate-caption
router.post("/tools/generate-caption", async (req, res): Promise<void> => {
  const parsed = GenerateCaptionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { topic, platform = "general", tone = "casual", count = 3 } = parsed.data;

  const platformNames: Record<string, string> = {
    instagram: "إنستغرام",
    twitter: "تويتر/X",
    tiktok: "تيك توك",
    linkedin: "لينكدإن",
    general: "التواصل الاجتماعي",
  };

  const toneNames: Record<string, string> = {
    funny: "مضحك وخفيف",
    professional: "احترافي ورسمي",
    motivational: "تحفيزي وملهم",
    casual: "عادي وودي",
  };

  const prompt = `أنشئ ${count} تعليق (كابشن) عربي ${toneNames[tone] ?? "عادي"} لـ${platformNames[platform] ?? "التواصل الاجتماعي"} عن الموضوع: "${topic}".
  
ثم أضف قائمة من أفضل 8 هاشتاق مرتبطة.

الشكل المطلوب:
التعليقات:
1. [التعليق الأول]
2. [التعليق الثاني]
3. [التعليق الثالث]

الهاشتاقات:
#هاشتاق1 #هاشتاق2 ...`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = response.choices[0]?.message?.content ?? "";

  // Parse captions
  const captionSection = rawText.split(/الهاشتاقات:/i)[0] ?? rawText;
  const captions = captionSection
    .split("\n")
    .filter((line) => line.trim().match(/^\d+[\.\-\)]/))
    .map((line) => line.replace(/^\d+[\.\-\)]\s*/, "").trim())
    .filter((line) => line.length > 0);

  // Parse hashtags
  const hashtagSection = rawText.split(/الهاشتاقات:/i)[1] ?? "";
  const hashtags = hashtagSection
    .match(/#[\u0600-\u06FFa-zA-Z0-9_]+/g) ?? [];

  toolUsage["generate-caption"] = (toolUsage["generate-caption"] ?? 0) + 1;

  res.json({
    captions: captions.length > 0 ? captions : [rawText],
    hashtags,
    toolUsed: "generate-caption",
  });
});

// POST /tools/homework-help
router.post("/tools/homework-help", async (req, res): Promise<void> => {
  const parsed = HomeworkHelpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { question, subject = "general", grade, language = "ar" } = parsed.data;

  const subjectNames: Record<string, string> = {
    math: "الرياضيات",
    science: "العلوم",
    arabic: "اللغة العربية",
    english: "اللغة الإنجليزية",
    history: "التاريخ",
    geography: "الجغرافيا",
    general: "عام",
  };

  const gradeText = grade ? ` للصف ${grade}` : "";
  const langText = language === "ar" ? "باللغة العربية" : "in English";

  const prompt =
    language === "ar"
      ? `أنت مدرس متخصص في مادة ${subjectNames[subject] ?? "عام"}${gradeText}. ساعد الطالب في حل السؤال التالي بشكل واضح ومفصّل ${langText}. اشرح الخطوات واذكر القاعدة أو المعلومة المهمة:\n\n${question}`
      : `You are an expert teacher in ${subject}${gradeText}. Help the student solve the following question clearly and in detail ${langText}. Explain the steps and mention the important rule or concept:\n\n${question}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const result = response.choices[0]?.message?.content ?? "";
  toolUsage["homework-help"] = (toolUsage["homework-help"] ?? 0) + 1;

  res.json({ result, toolUsed: "homework-help" });
});

// POST /tools/text-to-emoji
router.post("/tools/text-to-emoji", async (req, res): Promise<void> => {
  const parsed = TextToEmojiBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { text } = parsed.data;

  const prompt = `حوّل النص التالي إلى قصة من الإيموجي والرموز التعبيرية. استخدم إيموجيات تعبّر عن معنى كل كلمة أو جملة. يمكنك إضافة بعض النص العربي المختصر بين الإيموجيات إذا لزم الأمر. اجعلها ممتعة ومعبّرة:\n\n${text}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });

  const result = response.choices[0]?.message?.content ?? "";
  toolUsage["text-to-emoji"] = (toolUsage["text-to-emoji"] ?? 0) + 1;

  res.json({ result, toolUsed: "text-to-emoji" });
});

// POST /tools/generate-resume
router.post("/tools/generate-resume", async (req, res): Promise<void> => {
  const parsed = GenerateResumeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const {
    name,
    jobTitle,
    summary,
    experience,
    education,
    skills,
    language = "ar",
  } = parsed.data;

  const isArabic = language === "ar";

  const prompt = isArabic
    ? `أنشئ سيرة ذاتية احترافية باللغة العربية بصيغة HTML للشخص التالي:
الاسم: ${name}
المسمى الوظيفي: ${jobTitle}
${summary ? `الملخص الشخصي: ${summary}` : ""}
${experience ? `الخبرات العملية: ${experience}` : ""}
${education ? `التعليم: ${education}` : ""}
${skills ? `المهارات: ${skills}` : ""}

أنشئ HTML احترافي جميل للسيرة الذاتية مع CSS مدمج. استخدم ألوان احترافية (أزرق داكن وأبيض). اجعلها RTL وجاهزة للطباعة. لا تضف أي markdown خارج HTML.`
    : `Create a professional resume in English in HTML format for:
Name: ${name}
Job Title: ${jobTitle}
${summary ? `Summary: ${summary}` : ""}
${experience ? `Experience: ${experience}` : ""}
${education ? `Education: ${education}` : ""}
${skills ? `Skills: ${skills}` : ""}

Create beautiful professional HTML with embedded CSS. Use professional colors (dark blue and white). Make it print-ready. No markdown outside HTML.`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const html = response.choices[0]?.message?.content ?? "";
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

  toolUsage["generate-resume"] = (toolUsage["generate-resume"] ?? 0) + 1;

  res.json({ html, text, toolUsed: "generate-resume" });
});

export default router;
