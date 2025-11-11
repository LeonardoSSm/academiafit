import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import toast from "react-hot-toast";
import Table from "../../components/Table";
import LoadingState from "../../components/feedback/LoadingState";
import ErrorState from "../../components/feedback/ErrorState";
import { api, getErrorMsg } from "../../services/api";

const fetchMatriculas = async () => {
  const [matriculasRes, alunosRes, planosRes] = await Promise.all([
    api.get("/matriculas"),
    api.get("/alunos"),
    api.get("/planos"),
  ]);
  const alunosMap = new Map(alunosRes.data.map((aluno) => [String(aluno.id), aluno]));
  const planosMap = new Map(planosRes.data.map((plano) => [String(plano.id), plano]));
  return matriculasRes.data.map((matricula) => ({
    ...matricula,
    aluno: alunosMap.get(String(matricula.alunoId)),
    plano: planosMap.get(String(matricula.planoId)),
  }));
};

export default function MatriculasList() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState("");
  const filterAlunoId = params.get("alunoId");
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["matriculas"],
    queryFn: fetchMatriculas,
  });

  const delMut = useMutation({
    mutationFn: (id) => api.delete(`/matriculas/${id}`),
    onSuccess: () => {
      toast.success("Matrícula excluída");
      qc.invalidateQueries({ queryKey: ["matriculas"] });
    },
    onError: (err) => toast.error(getErrorMsg(err)),
  });

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const matchesNome = item.aluno?.nome?.toLowerCase().includes(search.toLowerCase());
      const matchesId = filterAlunoId ? String(item.alunoId) === filterAlunoId : true;
      return matchesNome && matchesId;
    });
  }, [data, search, filterAlunoId]);

  const columns = [
    { key: "aluno", label: "Aluno", render: (row) => row.aluno?.nome || "—" },
    { key: "plano", label: "Plano", render: (row) => row.plano?.nome || "—" },
    { key: "dataInicio", label: "Início" },
    { key: "dataFim", label: "Fim" },
    { key: "situacao", label: "Situação" },
    {
      key: "acoes",
      label: "Ações",
      render: (row) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" onClick={() => navigate(`/matriculas/${row.id}/ver`)}>
            Ver
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => {
              if (confirm("Deseja excluir?")) delMut.mutate(row.id);
            }}
          >
            Excluir
          </Button>
        </Stack>
      ),
    },
  ];

  if (isLoading) return <LoadingState label="Carregando matrículas..." />;
  if (isError) return <ErrorState message={getErrorMsg(error)} onRetry={refetch} />;

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h5">Matrículas</Typography>
          <Typography variant="body2" color="text.secondary">
            Visualize todas as matrículas e filtre por nome do aluno.
          </Typography>
        </Box>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <TextField
            size="small"
            label="Buscar aluno"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="contained" onClick={() => navigate("/matriculas/nova")}>
            Nova
          </Button>
        </Stack>
      </Stack>

      <Table columns={columns} data={filtered} />
    </Stack>
  );
}
