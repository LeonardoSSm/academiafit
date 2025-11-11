import React from "react";
import { NavLink, Link } from "react-router-dom";
import RoutesApp from "./routes";

const navLinks = [
  { to: "/", label: "Alunos" },
  { to: "/planos", label: "Planos" },
  { to: "/matriculas", label: "Matrículas" },
  { to: "/painel", label: "Painel" },
];

const navLinkClass = ({ isActive }) =>
  [
    "rounded-full px-4 py-2 text-sm font-semibold transition-all",
    isActive
      ? "bg-white/90 text-brand-600 shadow ring-2 ring-white/40"
      : "text-white/70 hover:text-white hover:bg-white/10",
  ].join(" ");

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -left-20 top-12 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-10 lg:px-8">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-2xl shadow-emerald-500/5 backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
                Gestão Fitness
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </p>
              <h1 className="text-4xl font-semibold text-white drop-shadow">
                AcademiaFit Dashboard
              </h1>
              <p className="text-sm text-white/80">
                Administre alunos, planos e matrículas com uma interface moderna e responsiva.
              </p>
            </div>

            <nav className="flex flex-wrap justify-end gap-3">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className={navLinkClass}>
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/alunos/novo"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow hover:bg-slate-100"
            >
              + Novo aluno
            </Link>
            <Link
              to="/matriculas/nova"
              className="rounded-2xl border border-white/30 px-5 py-3 text-sm font-semibold text-white/90 hover:border-white/60"
            >
              Criar matrícula
            </Link>
          </div>
        </header>

        <main className="flex-1 rounded-[32px] border border-white/10 bg-white p-6 text-slate-900 shadow-2xl shadow-emerald-500/5 sm:p-8">
          <RoutesApp />
        </main>

        <footer className="text-center text-xs text-white/60">
          © {new Date().getFullYear()} AcademiaFit — desempenho e cuidado com o seu box.
        </footer>
      </div>
    </div>
  );
}
