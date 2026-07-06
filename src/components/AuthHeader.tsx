import { auth, signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/Button";

export async function AuthHeader() {
  const session = await auth();

  if (!session?.user) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <Button type="submit" variant="trevi">
          Sign in
        </Button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted">{session.user.name ?? session.user.email}</span>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button type="submit" variant="secondary">
          Sign out
        </Button>
      </form>
    </div>
  );
}
