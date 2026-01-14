import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-16 px-6 py-16">
      <header className="flex flex-col gap-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-creek-600">
          LabBridge
        </p>
        <h1 className="text-4xl font-semibold text-ink-900 md:text-6xl">
          Translate wet and dry lab updates & keep a shared lab timeline.
        </h1>
        <p className="max-w-2xl text-lg text-ink-700">
          Turn messy bench notes and analysis summaries into clean, dual-audience updates.
          LabBridge keeps every project aligned with structured handoffs, followups, and
          a clear history.
        </p>
        <div className="flex items-center gap-4">
          <Button asChild size="lg">
            <Link href="/login">Login to LabBridge</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/app">View dashboard</Link>
          </Button>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Dual translations",
            body: "Generate wet-lab and dry-lab ready handoffs with a single update."
          },
          {
            title: "Structured memory",
            body: "Capture objectives, inputs, methods, and results in a uniform schema."
          },
          {
            title: "Timeline clarity",
            body: "See every update, status, and followup in one searchable feed."
          }
        ].map((item) => (
          <Card key={item.title} className="bg-white/80">
            <CardContent className="space-y-2 p-6">
              <p className="text-lg font-semibold text-ink-900">{item.title}</p>
              <p className="text-sm text-ink-600">{item.body}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
