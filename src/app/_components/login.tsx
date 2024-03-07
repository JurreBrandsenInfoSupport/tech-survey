"use client";

import { type Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

export function Login({ session }: { session?: Session | null }) {
  if (!session) {
    return (
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={() => signIn("azure-ad")}
          className="rounded-full bg-white/10 px-8 py-3 font-semibold transition hover:bg-white/20"
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-xl">Logged in as {session.user?.name}</p>
      <button
        onClick={() => signOut()}
        className="rounded-full bg-white/10 px-8 py-3 font-semibold transition hover:bg-white/20"
      >
        Sign out
      </button>
    </div>
  );
}
