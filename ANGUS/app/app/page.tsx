import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewProjectForm } from "@/components/new-project-form";

export default async function AppHomePage() {
  const supabase = createSupabaseServerClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, description, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="grid gap-10">
      <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <Card className="bg-white/80">
          <CardHeader>
            <CardTitle>Your projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!projects?.length && (
              <p className="text-sm text-ink-600">
                No projects yet. Create your first LabBridge project.
              </p>
            )}
            <div className="grid gap-4">
              {projects?.map((project) => (
                <Link
                  key={project.id}
                  href={`/app/projects/${project.id}`}
                  className="rounded-2xl border border-mist-200 bg-white/70 p-4 transition hover:border-ink-900"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-ink-900">
                      {project.name}
                    </h3>
                    <Badge tone="status">Active</Badge>
                  </div>
                  <p className="mt-2 text-sm text-ink-600">
                    {project.description}
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
        <NewProjectForm />
      </section>
    </div>
  );
}
