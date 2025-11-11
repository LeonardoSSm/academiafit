import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AlunosList from "../pages/Alunos/List";
import AlunosForm from "../pages/Alunos/Form";
import AlunoDetail from "../pages/Alunos/View";
import PlanosList from "../pages/Planos/List";
import MatriculasForm from "../pages/Matriculas/Form";
import MatriculasList from "../pages/Matriculas/List";
import MatriculaDetail from "../pages/Matriculas/View";
import Protected from "../components/Protected";

export default function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<AlunosList />} />
      <Route path="/alunos/novo" element={<AlunosForm />} />
      <Route path="/alunos/:id" element={<AlunosForm />} />
      <Route path="/alunos/:id/ver" element={<AlunoDetail />} />

      <Route path="/planos" element={<PlanosList />} />

      <Route path="/matriculas" element={<Navigate to="/matriculas/list" replace />} />
      <Route path="/matriculas/list" element={<MatriculasList />} />
      <Route path="/matriculas/nova" element={<MatriculasForm />} />
      <Route path="/matriculas/:id/ver" element={<MatriculaDetail />} />

      <Route
        path="/painel"
        element={
          <Protected requiredRole="ADMIN">
            <div>Área protegida (admin fake)</div>
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
