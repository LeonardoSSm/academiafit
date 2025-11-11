import { createAbortController, releaseAbortController } from "./api";

export async function fetchCEP(cep) {
  const onlyDigits = String(cep).replace(/\D/g, "");
  const controller = createAbortController("cep");
  try {
    const res = await fetch(`https://viacep.com.br/ws/${onlyDigits}/json/`, {
      signal: controller.signal,
    });
    if (!res.ok) throw new Error("Falha ao consultar CEP");
    const data = await res.json();
    if (data?.erro) throw new Error("CEP não encontrado");
    const { logradouro, bairro, localidade: cidade, uf } = data;
    return { logradouro, bairro, cidade, uf };
  } finally {
    releaseAbortController("cep", controller);
  }
}
