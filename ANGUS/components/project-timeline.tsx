"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export type UpdateSummary = {
  id: string;
  created_at: string;
  author_mode: "wet" | "dry";
  title: string | null;
  messy_text: string;
  translation_for_wet: string | null;
  translation_for_dry: string | null;
  status: "processing" | "ready" | "error";
  followups: string[] | null;
};

const VIEWER_KEY = "labbridge.viewerMode";

export function ProjectTimeline({
  updates,
  projectId
}: {
  updates: UpdateSummary[];
  projectId: string;
}) {
  const [viewerMode, setViewerMode] = useState<"wet" | "dry">("wet");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(VIEWER_KEY);
    if (stored === "wet" || stored === "dry") {
      setViewerMode(stored);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(VIEWER_KEY, viewerMode);
  }, [viewerMode]);

  const filtered = useMemo(() => {
    if (!query.trim()) return updates;
    const q = query.toLowerCase();
    return updates.filter((update) => {
      return [
        update.title,
        update.messy_text,
        update.translation_for_wet,
        update.translation_for_dry
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(q));
    });
  }, [updates, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
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
        <Input
          placeholder="Search updates"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="max-w-xs"
        />
      </div>

      {!filtered.length && (
        <Card className="bg-white/70">
          <CardContent className="p-6 text-sm text-ink-600">
            No updates match this search yet.
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filtered.map((update) => {
          const translation =
            viewerMode === "wet"
              ? update.translation_for_wet
              : update.translation_for_dry;
          const followupsCount = update.followups?.length || 0;

          return (
            <Link
              key={update.id}
              href={`/app/updates/${update.id}`}
              className="block"
            >
              <Card className="bg-white/80 transition hover:-translate-y-0.5 hover:border-ink-900">
                <CardContent className="space-y-3 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-ink-900">
                        {update.title || "Untitled update"}
                      </p>
                      <p className="text-xs text-ink-600">
                        {new Date(update.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={update.author_mode === "wet" ? "wet" : "dry"}>
                        {update.author_mode}
                      </Badge>
                      <Badge tone="status">{update.status}</Badge>
                      {followupsCount > 0 && (
                        <Badge tone="neutral">{followupsCount} followups</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-ink-700">
                    {translation ||
                      "Translation is processing. Check back in a moment."}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Link
        href={`/app/projects/${projectId}/new`}
        className="inline-flex items-center text-sm font-semibold text-ink-900 underline"
      >
        New Update
      </Link>
    </div>
  );
}
