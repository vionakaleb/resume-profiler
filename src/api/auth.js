import { request } from "./client.js";
import { setTokens, clearTokens } from "./tokens.js";

export async function register({ username, email, password, fullName }) {
  return request("/auth/register", {
    method: "POST",
    body: { username, email, password, full_name: fullName },
  });
}

export async function login({ email, password }) {
  const tokens = await request("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  setTokens(tokens.access_token, tokens.refresh_token);
  return tokens;
}

export async function fetchCurrentUser() {
  return request("/auth/me", { method: "GET", auth: true });
}

export async function deleteAccount() {
  await request("/auth/me", { method: "DELETE", auth: true });
  clearTokens();
}

export function logout() {
  clearTokens();
}
