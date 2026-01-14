"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const VIEWER_KEY = "labbridge.viewerMode";

export type UpdateDetailRecord = {
  id: string;
  created_at: string;
  author_mode: "wet" | "dry";
  messy_text: string;
  title: string | null;
  translation_for_wet: string | null;
  translation_for_dry: string | null;
  structured_json: any;
  followups: string[] | null;
  confidence: number | null;
  status: "processing" | "ready" | "error";
};

export function UpdateDetail({ update }: { update: UpdateDetailRecord }) {
  const [viewerMode, setViewerMode] = useState<"wet" | "dry">("wet");
  const [copied, setCopied] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(VIEWER_KEY);
    if (stored === "wet" || stored === "dry") {
      setViewerMode(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(VIEWER_KEY, viewerMode);
  }, [viewerMode]);

  const translation =
    viewerMode === "wet"
      ? update.translation_for_wet
      : update.translation_for_dry;

  const handleCopy = async () => {
    if (!translation) return;
    await navigator.clipboard.writeText(translation);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-ink-900">
            {update.title || "Untitled update"}
          </h2>
          <p className="text-xs text-ink-600">
            {new Date(update.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={update.author_mode === "wet" ? "wet" : "dry"}>
            {update.author_mode}
          </Badge>
          <Badge tone="status">{update.status}</Badge>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <ToggleGroup
          type="single"
          value={viewerMode}
          onValueChange={(value) => {
            if (value === "wet" || value === "dry") {
              setViewerMode(value);
            }
          }}
          className="flex gap-2"
        >
          <ToggleGroupItem value="wet">Wet View</ToggleGroupItem>
          <ToggleGroupItem value="dry">Dry View</ToggleGroupItem>
        </ToggleGroup>
        <Button variant="secondary" onClick={handleCopy} disabled={!translation}>
          {copied ? "Copied" : "Copy handoff message"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white/80">
          <CardContent className="space-y-3 p-6">
            <p className="text-sm font-semibold text-ink-700">
              Wet-lab translation
            </p>
            <p className="text-sm text-ink-700">
              {update.translation_for_wet ||
                "Translation is processing. Check back shortly."}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/80">
          <CardContent className="space-y-3 p-6">
            <p className="text-sm font-semibold text-ink-700">
              Dry-lab translation
            </p>
            <p className="text-sm text-ink-700">
              {update.translation_for_dry ||
                "Translation is processing. Check back shortly."}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/80">
        <CardContent className="space-y-3 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink-700">Messy update</p>
            <Button variant="ghost" size="sm" onClick={() => setShowRaw(!showRaw)}>
              {showRaw ? "Hide" : "Show"}
            </Button>
          </div>
          {showRaw && <p className="text-sm text-ink-700">{update.messy_text}</p>}
        </CardContent>
      </Card>

      <Card className="bg-white/80">
        <CardContent className="space-y-4 p-6">
          <p className="text-sm font-semibold text-ink-700">Structured fields</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-ink-600">Objective</p>
              <p className="text-sm text-ink-700">
                {update.structured_json?.objective || ""}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-600">Tags</p>
              <p className="text-sm text-ink-700">
                {update.structured_json?.tags?.join(", ") || ""}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-600">Samples</p>
              <p className="text-sm text-ink-700">
                {update.structured_json?.inputs?.samples?.join(", ") || ""}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-600">Files</p>
              <p className="text-sm text-ink-700">
                {update.structured_json?.inputs?.files?.join(", ") || ""}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-600">Reagents / Strains</p>
              <p className="text-sm text-ink-700">
                {update.structured_json?.inputs?.reagents_or_strains?.join(", ") || ""}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-600">Results</p>
              <p className="text-sm text-ink-700">
                {update.structured_json?.results?.notes || ""}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {update.followups?.length ? (
        <Card className="bg-white/80">
          <CardContent className="space-y-2 p-6">
            <p className="text-sm font-semibold text-ink-700">Followups</p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-ink-700">
              {update.followups.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <div className="text-xs text-ink-600">
        Confidence: {update.confidence?.toFixed(2) ?? "n/a"}
      </div>
    </div>
  );
}
