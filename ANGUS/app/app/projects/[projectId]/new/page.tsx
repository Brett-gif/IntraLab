import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NewUpdateForm } from "@/components/new-update-form";
import { Button } from "@/components/ui/button";

export default async function NewUpdatePage({
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-ink-900">New update</h2>
          <p className="text-sm text-ink-600">{project.name}</p>
        </div>
        <Button asChild variant="ghost">
          <Link href={`/app/projects/${project.id}`}>Back to timeline</Link>
        </Button>
      </div>

      <NewUpdateForm projectId={project.id} projectDescription={project.description} />
    </div>
  );
}
