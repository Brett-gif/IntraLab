"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export function NewProjectForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description })
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error || "Failed to create project.");
      }
      router.push(`/app/projects/${payload.id}`);
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/80">
      <CardContent className="space-y-4 p-6">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input
            placeholder="Project name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Textarea
            placeholder="Short description for collaborators"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <Button type="submit" disabled={!name || !description || loading}>
            {loading ? "Creating..." : "New Project"}
          </Button>
          {status && <p className="text-sm text-ink-700">{status}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
