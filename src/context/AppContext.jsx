import React, { createContext, useContext, useState, useMemo } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [auth, setAuth] = useState({ user: "admin", role: "ADMIN" });
  const [filtros, setFiltros] = useState({ busca: "", status: "TODOS" });

  const value = useMemo(() => ({ auth, setAuth, filtros, setFiltros }), [auth, filtros]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export const useApp = () => useContext(AppContext);
