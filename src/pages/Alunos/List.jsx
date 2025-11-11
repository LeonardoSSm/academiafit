import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../components/Table";
import { api, getErrorMsg } from "../../services/api";
import { useApp } from "../../context/AppContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchAlunos = async () => (await api.get("/alunos")).data;

const buttonBase =
  "rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors";

export default function AlunosList() {
  const { filtros, setFiltros } = useApp();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data = [], isLoading, isError, error } = useQuery({ queryKey: ["alunos"], queryFn: fetchAlunos });

  const delMut = useMutation({
    mutationFn: async (id) => api.delete(`/alunos/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alunos"] })
  });

  const filtered = useMemo(() => {
    const q = filtros.busca.toLowerCase();
    return data.filter(a =>
      a.nome.toLowerCase().includes(q) || a.cpf?.includes(q)
    );
  }, [data, filtros.busca]);

  const columns = [
    { key: "nome", label: "Nome" },
    { key: "cpf", label: "CPF" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            row.status === "ATIVO"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-200 text-slate-600"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "acoes",
      label: "Ações",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <button
            className={`${buttonBase} border-slate-200 text-slate-700 hover:bg-slate-100`}
            onClick={() => nav(`/alunos/${row.id}`)}
          >
            Editar
          </button>
          <button
            className={`${buttonBase} border-red-200 text-red-600 hover:bg-red-50`}
            onClick={() => {
              if (confirm(`Excluir ${row.nome}?`)) delMut.mutate(row.id);
            }}
          >
            Excluir
          </button>
        </div>
      ),
    },
  ];

  if (isLoading)
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 px-4 py-3 text-sm text-brand-700">
        <span className="h-3 w-3 animate-ping rounded-full bg-brand-500" />
        Carregando alunos...
      </div>
    );
  if (isError)
    return (
      <div className="rounded-2xl border border-red-200/60 bg-red-50 px-4 py-3 text-sm text-red-700">
        Erro: {getErrorMsg(error)}
      </div>
    );

  const total = data.length;
  const ativos = data.filter((a) => a.status === "ATIVO").length;
  const inativos = total - ativos;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
            Visão geral
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">Alunos</h2>
          <p className="text-sm text-slate-500">
            Consulte, cadastre e gerencie seus alunos ativos.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            placeholder="Buscar por nome ou CPF"
            value={filtros.busca}
            onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
          />
          <Link
            to="/alunos/novo"
            className="rounded-lg bg-brand-600 px-4 py-2 text-center text-sm font-medium text-white shadow hover:bg-brand-500"
          >
            Novo aluno
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total", value: total, tone: "text-slate-900", bg: "from-slate-100/70 to-white" },
          { label: "Ativos", value: ativos, tone: "text-emerald-700", bg: "from-emerald-50 to-white" },
          { label: "Inativos", value: inativos, tone: "text-amber-600", bg: "from-amber-50 to-white" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl border border-slate-100 bg-gradient-to-br ${stat.bg} p-4 shadow-sm`}
          >
            <p className="text-xs uppercase tracking-wide text-slate-500">{stat.label}</p>
            <p className={`text-3xl font-semibold ${stat.tone}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <Table columns={columns} data={filtered} />
    </div>
  );
}
