"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/app`
        }
      });
      if (error) {
        throw error;
      }
      setStatus("Check your email for a magic link.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl items-center px-6">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Welcome back to LabBridge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-ink-600">
            Use your email to receive a secure magic link.
          </p>
          <Input
            type="email"
            placeholder="you@lab.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button onClick={handleSignIn} disabled={!email || loading}>
            {loading ? "Sending..." : "Send magic link"}
          </Button>
          {status && <p className="text-sm text-ink-700">{status}</p>}
          <Link className="text-xs text-ink-600 underline" href="/">
            Back to landing
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
