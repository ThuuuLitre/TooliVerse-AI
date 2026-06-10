import { useState } from "react";
import { ChevronDown, Lightbulb } from "lucide-react";

interface Props {
  systemPrompt: string;
  userPromptTemplate: string;
  technique: string;
}

export function PromptStrategy({ systemPrompt, userPromptTemplate, technique }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium hover:bg-muted/40 rounded-xl"
      >
        <span className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          Prompt Strategy
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="space-y-4 border-t px-4 py-4 text-xs">
          <div>
            <div className="mb-1 font-semibold uppercase tracking-wider text-muted-foreground">
              System Prompt
            </div>
            <pre className="whitespace-pre-wrap rounded-lg bg-muted p-3 font-mono text-[11px] leading-relaxed">
              {systemPrompt}
            </pre>
          </div>
          <div>
            <div className="mb-1 font-semibold uppercase tracking-wider text-muted-foreground">
              User Prompt Template
            </div>
            <pre className="whitespace-pre-wrap rounded-lg bg-muted p-3 font-mono text-[11px] leading-relaxed">
              {userPromptTemplate}
            </pre>
          </div>
          <div>
            <div className="mb-1 font-semibold uppercase tracking-wider text-muted-foreground">
              Refinement Technique
            </div>
            <p className="text-muted-foreground">{technique}</p>
          </div>
        </div>
      )}
    </div>
  );
}
