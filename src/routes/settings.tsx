import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, Moon, Sun, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { clearActivity, useActivity } from "@/hooks/use-activity";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — TooliVerse" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggle } = useTheme();
  const { counts } = useActivity();
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      <PageHeader icon={<SettingsIcon className="h-5 w-5" />} title="Settings" />
      <div className="space-y-4">
        <Card className="p-5 shadow-card flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Appearance</h3>
            <p className="text-sm text-muted-foreground">Switch between light and dark mode.</p>
          </div>
          <Button variant="outline" onClick={toggle}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </Button>
        </Card>

        <Card className="p-5 shadow-card">
          <h3 className="font-semibold">Activity history</h3>
          <p className="text-sm text-muted-foreground">
            Stored locally in your browser. Total events: {counts.total}.
          </p>
          <Button
            variant="outline"
            className="mt-3"
            onClick={() => { clearActivity(); toast.success("Activity cleared"); }}
          >
            <Trash2 className="h-4 w-4" /> Clear activity
          </Button>
        </Card>

        <Card className="p-5 shadow-card">
          <h3 className="font-semibold">AI Provider</h3>
          <p className="text-sm text-muted-foreground">
            TooliVerse uses Lovable AI Gateway with Google Gemini for fast, low-latency responses.
            All AI calls are made server-side; your input never goes to a third party from the browser.
          </p>
        </Card>
      </div>
    </div>
  );
}
