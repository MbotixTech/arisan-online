"use server";

import { login, logout } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  try {
    await login(formData);
  } catch (error) {
    return { error: "Username atau password salah" };
  }
  redirect("/");
}

export async function logoutAction() {
  await logout();
  redirect("/login");
}
