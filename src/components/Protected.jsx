import React from "react";
import { useApp } from "../context/AppContext";
import { Navigate } from "react-router-dom";

export default function Protected({ children }) {
  const { auth } = useApp();
  if (!auth?.user) return <Navigate to="/" replace />;

  return (
    <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white px-10 py-16 text-center shadow-inner">
      {children}
    </div>
  );
}
