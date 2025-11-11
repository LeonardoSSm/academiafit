import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3333",
  headers: { "Content-Type": "application/json" }
});

// helpers ES6
export const getErrorMsg = (e) =>
  e?.response?.data?.message || e?.message || "Erro inesperado";
