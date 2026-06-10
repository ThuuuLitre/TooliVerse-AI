import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, Search, MessageSquare, Clock, Sparkles, ArrowRight, Activity as ActivityIcon } from "lucide-react";
import { useActivity, type ActivityType } from "@/hooks/use-activity";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — TooliVerse" },
      { name: "description", content: "Your AI productivity dashboard." },
    ],
  }),
  component: Dashboard,
});

const tools = [
  { url: "/email", title: "Smart Email Generator", desc: "Craft on-brand emails in seconds.", icon: Mail },
  { url: "/summarizer", title: "Meeting Summarizer", desc: "Extract decisions, actions, owners.", icon: FileText },
  { url: "/planner", title: "Task Planner", desc: "Prioritize using the Eisenhower Matrix.", icon: ListChecks },
  { url: "/research", title: "Research Assistant", desc: "Turn information into insight.", icon: Search },
  { url: "/chat", title: "AI Chatbot", desc: "Ask anything about your workday.", icon: MessageSquare },
];

const typeIcon: Record<ActivityType, typeof Mail> = {
  email: Mail, summary: FileText, plan: ListChecks, research: Search, chat: MessageSquare,
};

const typeLabel: Record<ActivityType, string> = {
  email: "Email", summary: "Summary", plan: "Plan", research: "Research", chat: "Chat",
};

function Stat({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof Mail }) {
  return (
    <Card className="p-4 shadow-card border-border/60">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
    </Card>
  );
}

function Dashboard() {
  const { items, counts, hoursSaved } = useActivity();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <section className="gradient-hero relative overflow-hidden rounded-2xl border bg-card p-8 shadow-card">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 backdrop-blur px-3 py-1 text-xs">
            <Sparkles className="h-3 w-3 text-primary" />
            <span>AI Workplace Productivity Suite</span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
            Welcome to <span className="gradient-text">TooliVerse</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Automate the busywork — emails, meeting notes, planning and research —
            with a single AI-powered toolkit built for modern professionals.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/email" className="inline-flex items-center gap-2 rounded-md gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elegant">
              Generate an Email <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/chat" className="inline-flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium">
              Open Assistant
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <Stat label="Emails" value={counts.email} icon={Mail} />
        <Stat label="Summaries" value={counts.summary} icon={FileText} />
        <Stat label="Plans" value={counts.plan} icon={ListChecks} />
        <Stat label="Research" value={counts.research} icon={Search} />
        <Stat label="Hours Saved" value={`${hoursSaved}h`} icon={Clock} />
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Your tools</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link
              key={t.url}
              to={t.url}
              className="group rounded-xl border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-elegant"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-semibold tracking-tight">{t.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition group-hover:opacity-100">
                Open <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <ActivityIcon className="h-4 w-4" /> Recent activity
        </h2>
        <Card className="divide-y border-border/60">
          {items.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No activity yet. Try a tool to get started.
            </div>
          )}
          {items.slice(0, 8).map((a) => {
            const Icon = typeIcon[a.type];
            return (
              <div key={a.id} className="flex items-center gap-3 p-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {typeLabel[a.type]} · {new Date(a.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </Card>
      </section>
    </div>
  );
}
