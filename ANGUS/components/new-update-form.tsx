"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Attachment = { type: string; url: string };

export function NewUpdateForm({
  projectId,
  projectDescription
}: {
  projectId: string;
  projectDescription: string;
}) {
  const router = useRouter();
  const [authorMode, setAuthorMode] = useState<"wet" | "dry">("wet");
  const [messyText, setMessyText] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const updateAttachment = (index: number, key: keyof Attachment, value: string) => {
    setAttachments((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const addAttachment = () => {
    setAttachments((prev) => [...prev, { type: "", url: "" }]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          author_mode: authorMode,
          project_description: projectDescription,
          messy_text: messyText,
          attachments: attachments.filter((item) => item.type && item.url)
        })
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error || "Failed to create update.");
      }
      router.push(`/app/updates/${payload.id}`);
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/80">
      <CardContent className="space-y-6 p-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-ink-700">Author mode</p>
            <div className="flex gap-2">
              {["wet", "dry"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    authorMode === mode
                      ? "border-ink-900 bg-ink-900 text-mist-50"
                      : "border-mist-200 bg-white/70 text-ink-700"
                  }`}
                  onClick={() => setAuthorMode(mode as "wet" | "dry")}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-ink-700">Project context</p>
            <div className="rounded-2xl border border-mist-200 bg-white/60 p-4 text-sm text-ink-700">
              {projectDescription}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-ink-700">Messy update</p>
            <Textarea
              placeholder="Paste bench notes, analysis summaries, or Slack-style updates"
              value={messyText}
              onChange={(event) => setMessyText(event.target.value)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink-700">Attachments</p>
              <Button type="button" variant="secondary" size="sm" onClick={addAttachment}>
                Add attachment
              </Button>
            </div>
            {!attachments.length && (
              <p className="text-xs text-ink-600">No attachments yet.</p>
            )}
            {attachments.map((attachment, index) => (
              <div key={index} className="grid gap-2 md:grid-cols-[1fr_2fr_auto]">
                <Input
                  placeholder="type (e.g. fastq, microscopy)"
                  value={attachment.type}
                  onChange={(event) => updateAttachment(index, "type", event.target.value)}
                />
                <Input
                  placeholder="https://..."
                  value={attachment.url}
                  onChange={(event) => updateAttachment(index, "url", event.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <Button type="submit" disabled={!messyText || loading}>
            {loading ? "Sending to Gemini..." : "Submit update"}
          </Button>
          <div className="flex items-center gap-2 text-xs text-ink-600">
            <Badge tone="status">Auto-translate</Badge>
            <span>Translation runs on the server and saves a structured record.</span>
          </div>
          {status && <p className="text-sm text-ink-700">{status}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
