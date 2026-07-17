"use server";

import { cookies } from "next/headers";

export async function loginAction(email: string, password: string, rememberMe: boolean) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://vnmb-identity-api.onrender.com/api";
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, client_id: "vnmb-air" }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return { success: false, error: errData.message || "E-mail ou senha incorretos." };
    }

    const data = await response.json();
    const cookieStore = await cookies();
    
    // Configurações base para os cookies sensíveis
    const sensitiveCookieOptions = {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      httpOnly: true, // Protege contra XSS
      maxAge: rememberMe ? 60 * 60 * 24 * 7 : undefined, // 7 dias se "Lembrar de mim"
    };

    // Configurações para cookies acessíveis pelo client-side (se necessário)
    const publicCookieOptions = {
      ...sensitiveCookieOptions,
      httpOnly: false,
    };

    cookieStore.set("auth_token", data.access_token, sensitiveCookieOptions);
    cookieStore.set("refresh_token", data.refresh_token, sensitiveCookieOptions);
    
    // Dados não sensíveis podem ficar expostos caso o front-end precise ler
    cookieStore.set("user_name", data.user.name, publicCookieOptions);
    cookieStore.set("user_email", data.user.email, publicCookieOptions);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erro de rede" };
  }
}
