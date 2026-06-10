import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageSquare, Send, Loader2, Sparkles, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { chatbot } from "@/lib/ai.functions";
import { PageHeader } from "@/components/page-header";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { PromptStrategy } from "@/components/prompt-strategy";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { logActivity } from "@/hooks/use-activity";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — TooliVerse" },
      { name: "description", content: "Chat with your AI workplace productivity assistant." },
    ],
  }),
  component: ChatPage,
});

interface Msg { role: "user" | "assistant"; content: string }

const STARTERS = [
  "Help me draft a status update to my manager",
  "How should I prioritize 12 tasks across 3 projects?",
  "Summarize best practices for running a kickoff meeting",
  "Explain OKRs in simple terms",
];

function ChatPage() {
  const fn = useServerFn(chatbot);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const newUser: Msg = { role: "user", content };
    const next = [...messages, newUser];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fn({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.text }]);
      logActivity("chat", content.slice(0, 60));
    } catch (e) {
      toast.error((e as Error).message);
      setMessages(next);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <PageHeader
        icon={<MessageSquare className="h-5 w-5" />}
        title="AI Workplace Chatbot"
        description="Conversational assistance for planning, writing, research and summarization."
      >
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => setMessages([])}>
            <RotateCcw className="h-3.5 w-3.5" /> New chat
          </Button>
        )}
      </PageHeader>

      <Card className="flex h-[65vh] flex-col shadow-card overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-elegant">
                <Sparkles className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">How can I help you today?</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try one of these to get started:</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 max-w-2xl w-full">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-lg border bg-card p-3 text-left text-sm hover:bg-muted/50 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "user" ? (
                <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                  {m.content}
                </div>
              ) : (
                <div className="max-w-[85%] text-sm prose-chat">
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-primary" /> TooliVerse
                  </div>
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.15s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.3s]" />
              </span>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t bg-background/60 backdrop-blur p-3">
          <div className="flex gap-2">
            <Textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask anything about your workday..."
              className="min-h-[44px] resize-none"
            />
            <Button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="gradient-primary self-end h-11 w-11 p-0"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </Card>

      <AiDisclaimer className="mt-4" />

      <div className="mt-6">
        <PromptStrategy
          systemPrompt={`You are TooliVerse Assistant, an AI workplace productivity helper.\nHelp with email writing, meeting summaries, task planning, research, and general workplace productivity questions.\nBe concise, friendly, and actionable. Use markdown for structure.`}
          userPromptTemplate={`{conversation_history}\nUser: {latest_message}`}
          technique="Persona priming + full conversation memory each turn maintains context. Markdown formatting is explicitly invited so multi-step answers render with structure rather than as a wall of text."
        />
      </div>
    </div>
  );
}
