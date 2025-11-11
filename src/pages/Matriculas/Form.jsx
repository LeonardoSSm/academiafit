import React, { useState } from "react";
import { api } from "../../services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchAll = async () => {
  const [alunos, planos] = await Promise.all([
    api.get("/alunos"), api.get("/planos")
  ]);
  return { alunos: alunos.data, planos: planos.data };
};

function addMonths(dateStr, m) {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + m);
  return d.toISOString().slice(0,10);
}

const inputClass =
  "rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

export default function MatriculasForm(){
  const { data } = useQuery({ queryKey:["alunos-planos"], queryFn: fetchAll });
  const qc = useQueryClient();
  const [form, setForm] = useState({ alunoId:"", planoId:"", dataInicio:"" });
  const plano = data?.planos?.find(p => String(p.id) === String(form.planoId));
  const dataFim = form.dataInicio && plano ? addMonths(form.dataInicio, plano.duracaoMeses) : "";

  const createMut = useMutation({
    mutationFn: (payload) => api.post("/matriculas", payload),
    onSuccess: () => { alert("Matrícula criada"); qc.invalidateQueries({ queryKey:["matriculas"] }); }
  });

  const onSubmit = (e) => {
    e.preventDefault();
    createMut.mutate({ ...form, dataFim, situacao: "ATIVA" });
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Nova matrícula</h2>
        <p className="text-sm text-slate-500">
          Escolha o aluno, defina um plano e acompanhe a data de renovação.
        </p>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-600">Aluno</span>
        <select
          className={inputClass}
          value={form.alunoId}
          onChange={e=>setForm(s=>({ ...s, alunoId:e.target.value }))}
        >
          <option value="">Selecione um aluno</option>
          {data?.alunos?.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-600">Plano</span>
        <select
          className={inputClass}
          value={form.planoId}
          onChange={e=>setForm(s=>({ ...s, planoId:e.target.value }))}
        >
          <option value="">Selecione um plano</option>
          {data?.planos?.map(p => <option key={p.id} value={p.id}>{p.nome} ({p.duracaoMeses} meses)</option>)}
        </select>
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-600">Data de início</span>
          <input
            type="date"
            className={inputClass}
            value={form.dataInicio}
            onChange={e=>setForm(s=>({ ...s, dataInicio:e.target.value }))}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-600">Data de término</span>
          <input
            className={`${inputClass} bg-slate-100`}
            value={dataFim}
            readOnly
            placeholder="Calculado automaticamente"
          />
        </label>
      </div>

      <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        {plano && dataFim
          ? `Este plano expira em ${new Date(dataFim).toLocaleDateString("pt-BR")} (${plano.duracaoMeses} meses).`
          : "Selecione um plano e uma data para ver a previsão de término."}
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-brand-500"
      >
        Criar matrícula
      </button>
    </form>
  );
}
