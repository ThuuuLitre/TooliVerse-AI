import { AlertTriangle } from "lucide-react";

export function AiDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning-foreground/90 ${className}`}
    >
      <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-warning" />
      <p>
        AI-generated content may contain inaccuracies. Always review before using in
        professional contexts.
      </p>
    </div>
  );
}
