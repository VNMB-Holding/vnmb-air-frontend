export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
  
  let token = "";

  if (typeof window === "undefined") {
    // Server-side execution (e.g., Server Components or Server Actions)
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    token = cookieStore.get("auth_token")?.value || "";
  } else {
    // Client-side execution
    // The auth_token cookie is currently HttpOnly (as seen in auth.ts)
    // To access the token on the client-side, consider one of these strategies:
    // 1. Fetch data through Server Actions / Server Components
    // 2. Fetch data through Next.js API Routes (which append the token internally)
    // 3. Make the auth_token cookie NOT HttpOnly (if you accept the XSS risk)
    // Here we try reading it if it was not HttpOnly, or it will be empty.
    const name = "auth_token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        token = c.substring(name.length, c.length);
      }
    }
  }

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  return fetch(`${backendUrl}${endpoint}`, config);
}
