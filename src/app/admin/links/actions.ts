"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, passwordMatches, sessionValue } from "./auth";

export async function login(formData: FormData) {
  const input = String(formData.get("password") ?? "");
  // A fixed pause on every attempt makes guessing slow without any extra storage.
  await new Promise((r) => setTimeout(r, 600));
  if (!passwordMatches(input)) redirect("/admin/links?error=1");
  (await cookies()).set(COOKIE, sessionValue(), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 90,
  });
  redirect("/admin/links");
}

export async function logout() {
  (await cookies()).set(COOKIE, "", { path: "/admin", maxAge: 0 });
  redirect("/admin/links");
}
