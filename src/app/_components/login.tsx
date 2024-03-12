"use client";

import { type Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";

export function Login({ session }: { session?: Session | null }) {
  if (!session) {
    return (
      <div className="flex flex-col items-center gap-6">
        <Button onClick={() => signIn("azure-ad")}>Sign in</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <p>Logged in as {session.user?.name}</p>
      <Button
        className="ml-2 bg-slate-500"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Sign out
      </Button>
    </div>
  );
}
