import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createUpdateSchema } from "@/lib/schemas";
import { translateUpdate } from "@/lib/gemini";

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data: inserted, error: insertError } = await supabase
    .from("updates")
    .insert({
      project_id: parsed.data.project_id,
      author_id: user.id,
      author_mode: parsed.data.author_mode,
      project_description: parsed.data.project_description,
      messy_text: parsed.data.messy_text,
      attachments: parsed.data.attachments,
      status: "processing"
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    return NextResponse.json({ error: insertError?.message || "Insert failed" }, { status: 500 });
  }

  try {
    const gemini = await translateUpdate({
      author_mode: parsed.data.author_mode,
      project_description: parsed.data.project_description,
      messy_text: parsed.data.messy_text,
      attachments: parsed.data.attachments
    });

    const { error: updateError } = await supabase
      .from("updates")
      .update({
        title: gemini.title,
        structured_json: gemini.structured,
        translation_for_wet: gemini.translated.for_wet,
        translation_for_dry: gemini.translated.for_dry,
        confidence: gemini.confidence,
        followups: gemini.followups,
        status: "ready"
      })
      .eq("id", inserted.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return NextResponse.json({ id: inserted.id, status: "ready" }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gemini processing failed";
    await supabase
      .from("updates")
      .update({ status: "error", error_message: message })
      .eq("id", inserted.id);
    return NextResponse.json({ id: inserted.id, status: "error", error: message }, { status: 201 });
  }
}
