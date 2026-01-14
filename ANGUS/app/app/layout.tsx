import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/sign-out-button";

export default async function AppLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-semibold text-ink-900">
            LabBridge
          </Link>
          <span className="text-xs text-ink-600">Project hub</span>
        </div>
        <SignOutButton />
      </nav>
      <main className="mx-auto max-w-6xl px-6 pb-16">{children}</main>
    </div>
  );
}
