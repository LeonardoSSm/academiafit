import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useForm from "../../hooks/useForm";
import { api, getErrorMsg } from "../../services/api";
import { fetchCEP } from "../../services/viacep";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const getAluno = async (id) => (await api.get(`/alunos/${id}`)).data;

const inputClass =
  "rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";
const labelClass = "text-sm font-medium text-slate-600";

export default function AlunosForm(){
  const { id } = useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { values, onChange, setValues } = useForm({
    nome: "", cpf: "", email: "", telefone: "",
    cep: "", logradouro: "", bairro: "", cidade: "", uf: "",
    status: "ATIVO"
  });

  const { data, isFetching } = useQuery({
    enabled: !!id,
    queryKey: ["aluno", id],
    queryFn: () => getAluno(id)
  });

  useEffect(() => { if (data) setValues(data); }, [data, setValues]);

  const saveMut = useMutation({
    mutationFn: async (payload) => id
      ? api.put(`/alunos/${id}`, payload)
      : api.post(`/alunos`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alunos"] });
      alert("Salvo!");
      nav("/");
    },
    onError: (e) => alert(getErrorMsg(e))
  });

  // CEP: AbortController + Promise.race
  const abortRef = useRef();
  const [cepStatus, setCepStatus] = useState("");
  const handleCEP = async (cep) => {
    if (!cep || cep.replace(/\D/g,"").length < 8) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setCepStatus("Consultando CEP...");

    try {
      const winner = await Promise.race([
        fetchCEP(cep, controller.signal),
        new Promise((_, rej) => setTimeout(() => rej(new Error("Timeout CEP")), 5000))
      ]);
      setValues(v => ({ ...v, ...winner }));
      setCepStatus("Endereço preenchido.");
    } catch (e) {
      setCepStatus(e.message || "Falha no CEP");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { nome, cpf, cep, logradouro, bairro, cidade, uf, ...rest } = values;
    // destructuring + template literal para log
    console.log(`Salvando aluno: ${nome} | CPF: ${cpf}`);
    saveMut.mutate({ nome, cpf, cep, logradouro, bairro, cidade, uf, ...rest });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-3xl space-y-5"
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold text-slate-900">
          {id ? "Editar aluno" : "Novo aluno"}
        </h3>
        <p className="text-sm text-slate-500">
          Preencha os dados pessoais e endereço para manter o cadastro em dia.
        </p>
        {isFetching && (
          <small className="text-xs text-slate-500">Carregando dados...</small>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Nome completo</span>
          <input className={inputClass} name="nome" value={values.nome} onChange={onChange} required />
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelClass}>CPF</span>
          <input className={inputClass} name="cpf" value={values.cpf} onChange={onChange} required />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Email</span>
          <input className={inputClass} name="email" value={values.email} onChange={onChange} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Telefone</span>
          <input className={inputClass} name="telefone" value={values.telefone} onChange={onChange} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.5fr_0.5fr]">
        <label className="flex flex-col gap-1">
          <span className={labelClass}>CEP</span>
          <input
            className={inputClass}
            name="cep"
            value={values.cep}
            onChange={(e)=>{ onChange(e); handleCEP(e.target.value); }}
          />
          <small className="text-xs text-slate-500">{cepStatus}</small>
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelClass}>UF</span>
          <input className={inputClass} name="uf" value={values.uf} onChange={onChange} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Logradouro</span>
          <input className={inputClass} name="logradouro" value={values.logradouro} onChange={onChange} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Bairro</span>
          <input className={inputClass} name="bairro" value={values.bairro} onChange={onChange} />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Cidade</span>
        <input className={inputClass} name="cidade" value={values.cidade} onChange={onChange} />
      </label>

      <label className="flex w-full flex-col gap-1 md:w-48">
        <span className={labelClass}>Status</span>
        <select className={inputClass} name="status" value={values.status} onChange={onChange}>
          <option>ATIVO</option><option>INATIVO</option>
        </select>
      </label>

      <div className="flex flex-wrap gap-4">
        <button
          type="submit"
          disabled={saveMut.isPending}
          className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-brand-500 disabled:opacity-50"
        >
          {id ? "Salvar alterações" : "Criar cadastro"}
        </button>
        <button
          type="button"
          onClick={()=>nav(-1)}
          className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
