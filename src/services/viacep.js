export async function fetchCEP(cep, signal) {
  const onlyDigits = String(cep).replace(/\D/g, "");
  const res = await fetch(`https://viacep.com.br/ws/${onlyDigits}/json/`, { signal });
  if (!res.ok) throw new Error("Falha ao consultar CEP");
  const data = await res.json();
  if (data?.erro) throw new Error("CEP não encontrado");
  // normaliza
  const { logradouro, bairro, localidade: cidade, uf } = data;
  return { logradouro, bairro, cidade, uf };
}
