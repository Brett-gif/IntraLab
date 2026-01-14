import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProjectTimeline, type UpdateSummary } from "@/components/project-timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProjectDetailPage({
  params
}: {
  params: { projectId: string };
}) {
  const supabase = createSupabaseServerClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, name, description")
    .eq("id", params.projectId)
    .single();

  if (!project) {
    notFound();
  }

  const { data: updates } = await supabase
    .from("updates")
    .select(
      "id, created_at, author_mode, title, messy_text, translation_for_wet, translation_for_dry, status, followups"
    )
    .eq("project_id", params.projectId)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <Card className="bg-white/80">
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-ink-600">{project.description}</p>
        </CardContent>
      </Card>

      <ProjectTimeline
        updates={(updates ?? []) as UpdateSummary[]}
        projectId={project.id}
      />
    </div>
  );
}
