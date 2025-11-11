import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function Protected({ children, requiredRole = "ADMIN" }) {
  const auth = useSelector((state) => state.auth);
  const allowed = auth?.user && (!requiredRole || auth?.role === requiredRole);

  useEffect(() => {
    if (!allowed) toast.error("Acesso negado");
  }, [allowed]);

  return allowed ? children : <Navigate to="/" replace />;
}
