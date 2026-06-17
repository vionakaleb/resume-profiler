import { request } from "./client.js";

export async function listResumes() {
  return request("/resumes", { method: "GET", auth: true });
}

export async function createResume({ title, content }) {
  return request("/resumes", {
    method: "POST",
    auth: true,
    body: { title, content },
  });
}

export async function getResume(id) {
  return request(`/resumes/${id}`, { method: "GET", auth: true });
}

export async function updateResume(id, patch) {
  return request(`/resumes/${id}`, {
    method: "PATCH",
    auth: true,
    body: patch,
  });
}

export async function deleteResume(id) {
  return request(`/resumes/${id}`, { method: "DELETE", auth: true });
}

export async function getPublicResume(username) {
  return request(`/users/${encodeURIComponent(username)}/public`, {
    method: "GET",
  });
}
