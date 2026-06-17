import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./tokens.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function parseResponse(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractMessage(body, fallback) {
  if (!body) return fallback;
  if (typeof body === "string") return body;
  if (typeof body.detail === "string") return body.detail;
  if (Array.isArray(body.detail) && body.detail[0]?.msg) return body.detail[0].msg;
  return fallback;
}

let refreshPromise = null;

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new ApiError("No refresh token", 401, null);

  if (!refreshPromise) {
    refreshPromise = (async () => {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      const body = await parseResponse(response);
      if (!response.ok) {
        clearTokens();
        throw new ApiError(
          extractMessage(body, "Session expired"),
          response.status,
          body,
        );
      }
      setTokens(body.access_token, body.refresh_token);
      return body.access_token;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

async function doFetch(path, options, token) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const body = await parseResponse(response);
  return { response, body };
}

export async function request(path, options = {}) {
  const { auth = false, ...rest } = options;
  const init = { ...rest };
  if (init.body && typeof init.body !== "string") {
    init.body = JSON.stringify(init.body);
  }

  let token = auth ? getAccessToken() : null;
  let { response, body } = await doFetch(path, init, token);

  if (response.status === 401 && auth && getRefreshToken()) {
    try {
      token = await refreshAccessToken();
    } catch (error) {
      clearTokens();
      throw error;
    }
    ({ response, body } = await doFetch(path, init, token));
  }

  if (!response.ok) {
    throw new ApiError(
      extractMessage(body, `Request failed (${response.status})`),
      response.status,
      body,
    );
  }

  return body;
}
