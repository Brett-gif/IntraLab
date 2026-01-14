import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UpdateDetail, type UpdateDetailRecord } from "@/components/update-detail";
import { Button } from "@/components/ui/button";

export default async function UpdateDetailPage({
  params
}: {
  params: { updateId: string };
}) {
  const supabase = createSupabaseServerClient();
  const { data: update } = await supabase
    .from("updates")
    .select(
      "id, created_at, author_mode, messy_text, title, translation_for_wet, translation_for_dry, structured_json, followups, confidence, status, project_id"
    )
    .eq("id", params.updateId)
    .single();

  if (!update) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost">
        <Link href={`/app/projects/${update.project_id}`}>Back to project</Link>
      </Button>
      <UpdateDetail update={update as UpdateDetailRecord} />
    </div>
  );
}
