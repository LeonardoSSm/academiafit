import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3333";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

const abortControllers = new Map();

export function createAbortController(key) {
  abortControllers.get(key)?.abort();
  const controller = new AbortController();
  abortControllers.set(key, controller);
  return controller;
}

export function releaseAbortController(key, controller) {
  if (abortControllers.get(key) === controller) {
    abortControllers.delete(key);
  }
}

export async function getWithAbort(key, url, config = {}) {
  const controller = createAbortController(key);
  try {
    const response = await api.get(url, { ...config, signal: controller.signal });
    return response;
  } finally {
    releaseAbortController(key, controller);
  }
}

export const getErrorMsg = (e) =>
  e?.response?.data?.message || e?.message || "Erro inesperado";
