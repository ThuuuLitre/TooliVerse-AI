import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Search, Loader2, Wand2, BookOpen, Star, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { researchTopic } from "@/lib/ai.functions";
import { PageHeader } from "@/components/page-header";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { PromptStrategy } from "@/components/prompt-strategy";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { logActivity } from "@/hooks/use-activity";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Assistant — TooliVerse" },
      { name: "description", content: "AI-powered research briefs from topics or pasted content." },
    ],
  }),
  component: ResearchPage,
});

interface Result {
  executiveSummary: string;
  keyInsights: string[];
  recommendations: string[];
  simplifiedExplanation: string;
  importantFindings: string[];
}

function ResearchPage() {
  const fn = useServerFn(researchTopic);
  const [content, setContent] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!content.trim()) return toast.error("Enter a topic or paste content.");
    setLoading(true);
    try {
      const r = await fn({ data: { content } });
      setResult(r as Result);
      logActivity("research", content.slice(0, 60));
      toast.success("Brief ready");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <PageHeader
        icon={<Search className="h-5 w-5" />}
        title="AI Research Assistant"
        description="Turn topics, articles or reports into an executive brief with insights and recommendations."
      />

      <Card className="p-5 shadow-card space-y-3">
        <Label>Topic, article, or pasted text</Label>
        <Textarea
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="e.g. 'Impact of generative AI on enterprise customer support in 2025' — or paste an article."
        />
        <Button onClick={submit} disabled={loading} className="gradient-primary">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          {loading ? "Researching..." : "Generate Brief"}
        </Button>
        <AiDisclaimer />
      </Card>

      {result && (
        <div className="mt-6 space-y-4">
          <Card className="p-5 shadow-card">
            <h3 className="mb-2 flex items-center gap-2 font-semibold">
              <BookOpen className="h-4 w-4 text-primary" /> Executive Summary
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{result.executiveSummary}</p>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-5 shadow-card">
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <Star className="h-4 w-4 text-warning" /> Key Insights
              </h3>
              <ul className="space-y-2 text-sm">
                {result.keyInsights.map((p, i) => (
                  <li key={i} className="flex gap-2"><span className="text-primary">•</span>{p}</li>
                ))}
              </ul>
            </Card>
            <Card className="p-5 shadow-card">
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <TrendingUp className="h-4 w-4 text-success" /> Recommendations
              </h3>
              <ul className="space-y-2 text-sm">
                {result.recommendations.map((p, i) => (
                  <li key={i} className="flex gap-2"><span className="text-success">→</span>{p}</li>
                ))}
              </ul>
            </Card>
          </div>

          {result.importantFindings?.length > 0 && (
            <Card className="p-5 shadow-card border-primary/30 bg-primary/5">
              <h3 className="mb-3 font-semibold">Important Findings</h3>
              <ul className="space-y-2 text-sm">
                {result.importantFindings.map((p, i) => (
                  <li key={i} className="flex gap-2"><span className="text-primary font-semibold">{i + 1}.</span>{p}</li>
                ))}
              </ul>
            </Card>
          )}

          {result.simplifiedExplanation && (
            <Card className="p-5 shadow-card">
              <h3 className="mb-2 font-semibold">In Simple Terms</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{result.simplifiedExplanation}</p>
            </Card>
          )}
        </div>
      )}

      <div className="mt-6">
        <PromptStrategy
          systemPrompt={`You are a research analyst. Produce a structured brief from a topic or pasted content.\nReturn JSON: { executiveSummary, keyInsights[], recommendations[], simplifiedExplanation, importantFindings[] }`}
          userPromptTemplate={`Topic / content:\n{user_input}`}
          technique="Layered output: TL;DR, insights, recommendations and a plain-language explanation. The schema forces multi-perspective coverage rather than a single paragraph dump."
        />
      </div>
    </div>
  );
}
