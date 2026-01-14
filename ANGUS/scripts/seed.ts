import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  throw new Error("Missing Supabase env vars for seeding");
}

const supabase = createClient(url, serviceKey);

async function seed() {
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: "demo@labbridge.ai",
    email_confirm: true,
    user_metadata: { name: "Demo Researcher" }
  });

  if (authError) {
    throw authError;
  }

  const userId = authUser.user?.id;
  if (!userId) {
    throw new Error("Failed to create demo user");
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      owner_id: userId,
      name: "Genome editing pilot",
      description: "CRISPR pipeline to validate gRNA efficiency across three strains."
    })
    .select("id")
    .single();

  if (projectError || !project) {
    throw projectError || new Error("Failed to create project");
  }

  await supabase.from("updates").insert({
    project_id: project.id,
    author_id: userId,
    author_mode: "wet",
    project_description: "CRISPR pipeline to validate gRNA efficiency across three strains.",
    messy_text: "Ran two plates, observed partial knockout in strain B. Need dry lab to verify alignment of reads and confirm off-targets.",
    status: "processing"
  });

  console.log("Seed complete. Demo user: demo@labbridge.ai");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
