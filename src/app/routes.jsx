import React from "react";
import { Routes, Route } from "react-router-dom";
import AlunosList from "../pages/Alunos/List";
import AlunosForm from "../pages/Alunos/Form";
import PlanosList from "../pages/Planos/List";
import MatriculasForm from "../pages/Matriculas/Form";
import Protected from "../components/Protected";

export default function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<AlunosList />} />
      <Route path="/alunos/novo" element={<AlunosForm />} />
      <Route path="/alunos/:id" element={<AlunosForm />} />

      <Route path="/planos" element={<PlanosList />} />
      <Route path="/matriculas" element={<MatrículasLanding />} />
      <Route path="/matriculas/nova" element={<MatriculasForm />} />

      <Route
        path="/painel"
        element={
          <Protected>
            <div>Área protegida (admin fake)</div>
          </Protected>
        }
      />
    </Routes>
  );
}

function MatrículasLanding(){
  return (
    <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/50 px-6 py-10 text-center text-sm text-brand-700">
      Use o botão “Criar Matrícula” para iniciar o cadastro.
    </div>
  );
}
