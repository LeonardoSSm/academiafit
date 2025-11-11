import React, { useState } from "react";
import Table from "../../components/Table";
import { api, getErrorMsg } from "../../services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchPlanos = async () => (await api.get("/planos")).data;
const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const inputClass =
  "rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

export default function PlanosList(){
  const [novo, setNovo] = useState({ nome:"", duracaoMeses:1, preco: 0, status:"ATIVO" });
  const { data = [], isLoading, isError, error } = useQuery({ queryKey:["planos"], queryFn: fetchPlanos });
  const qc = useQueryClient();

  const createMut = useMutation({
    mutationFn: (p) => api.post("/planos", p),
    onSuccess: () => { qc.invalidateQueries({ queryKey:["planos"] }); setNovo({ nome:"", duracaoMeses:1, preco:0, status:"ATIVO" }); }
  });
  const delMut = useMutation({ mutationFn: (id)=>api.delete(`/planos/${id}`), onSuccess: ()=> qc.invalidateQueries({ queryKey:["planos"] }) });

  const columns = [
    { key:"nome", label:"Nome" },
    { key:"duracaoMeses", label:"Meses" },
    { key:"preco", label:"Preço", render:(row)=> currency.format(row.preco || 0) },
    { key:"status", label:"Status", render:(row)=> (
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
        row.status === "ATIVO" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
      }`}>
        {row.status}
      </span>
    ) },
    { key:"acoes", label:"Ações", render:(row)=>
      <button
        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
        onClick={()=> delMut.mutate(row.id)}
      >
        Excluir
      </button>
    }
  ];

  if (isLoading)
    return (
      <div className="flex items-center gap-3 text-slate-500">
        <span className="h-3 w-3 animate-ping rounded-full bg-brand-500" />
        Carregando planos...
      </div>
    );
  if (isError)
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Erro: {getErrorMsg(error)}
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Planos</h2>
        <p className="text-sm text-slate-500">Crie diferentes ofertas e mantenha a tabela organizada.</p>
      </div>
      <form
        onSubmit={(e)=>{ e.preventDefault(); createMut.mutate(novo); }}
        className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm sm:flex-row sm:items-end"
      >
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nome</span>
          <input className={inputClass} placeholder="Mensal VIP" value={novo.nome} onChange={e=>setNovo(s=>({ ...s, nome:e.target.value }))}/>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Meses</span>
          <input type="number" className={inputClass} min={1} placeholder="1" value={novo.duracaoMeses} onChange={e=>setNovo(s=>({ ...s, duracaoMeses:+e.target.value }))}/>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Preço</span>
          <input type="number" className={inputClass} step="0.01" placeholder="99.90" value={novo.preco} onChange={e=>setNovo(s=>({ ...s, preco:+e.target.value }))}/>
        </label>
        <button
          type="submit"
          className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-brand-500 disabled:opacity-50"
        >
          Adicionar
        </button>
      </form>
      <Table columns={columns} data={data}/>
    </div>
  );
}
