"use server"

import { AuthError } from "next-auth"
import { signIn } from "@/auth"

export type LoginState = { error?: string } | null

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    })
  } catch (e) {
    if (e instanceof AuthError) {
      return { error: "Usuario o contraseña incorrectos." }
    }
    throw e
  }
  return null
}
