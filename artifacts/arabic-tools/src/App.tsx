import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/i18n";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Summarize from "@/pages/summarize";
import GeneratePrompt from "@/pages/generate-prompt";
import GenerateCaption from "@/pages/generate-caption";
import HomeworkHelp from "@/pages/homework-help";
import TextToEmoji from "@/pages/text-to-emoji";
import GenerateResume from "@/pages/generate-resume";
import QrGenerator from "@/pages/qr-generator";
import PasswordGenerator from "@/pages/password-generator";
import FreeFireNames from "@/pages/free-fire-names";
import ImageToPdf from "@/pages/image-to-pdf";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/summarize" component={Summarize} />
      <Route path="/generate-prompt" component={GeneratePrompt} />
      <Route path="/generate-caption" component={GenerateCaption} />
      <Route path="/homework-help" component={HomeworkHelp} />
      <Route path="/text-to-emoji" component={TextToEmoji} />
      <Route path="/generate-resume" component={GenerateResume} />
      <Route path="/qr-generator" component={QrGenerator} />
      <Route path="/password-generator" component={PasswordGenerator} />
      <Route path="/free-fire-names" component={FreeFireNames} />
      <Route path="/image-to-pdf" component={ImageToPdf} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;
