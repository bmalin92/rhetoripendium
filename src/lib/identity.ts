import { cookies } from "next/headers";

import { auth } from "@/auth";
import { SESSION_COOKIE } from "@/lib/session";

export type Identity = { type: "user"; id: string } | { type: "session"; id: string } | null;

export async function getIdentity(): Promise<Identity> {
  const session = await auth();
  if (session?.user?.id) {
    return { type: "user", id: session.user.id };
  }

  const store = await cookies();
  const sessionId = store.get(SESSION_COOKIE)?.value;
  return sessionId ? { type: "session", id: sessionId } : null;
}
