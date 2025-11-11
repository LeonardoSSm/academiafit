import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Pagination,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Table from "../../components/Table";
import LoadingState from "../../components/feedback/LoadingState";
import ErrorState from "../../components/feedback/ErrorState";
import { api, getErrorMsg, getWithAbort } from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { setFiltros } from "../../store/filtersSlice";

const PAGE_LIMIT = 5;

const fetchAlunos = async ({ queryKey }) => {
  const [_key, { page, search }] = queryKey;
  const response = await getWithAbort("alunos-list", "/alunos", {
    params: {
      _page: page,
      _limit: PAGE_LIMIT,
      q: search || undefined,
    },
  });
  return {
    items: response.data,
    total: Number(response.headers["x-total-count"] || response.data.length),
  };
};

export default function AlunosList() {
  const filtros = useSelector((state) => state.filters);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["alunos", { page, search: filtros.busca }],
    queryFn: fetchAlunos,
    keepPreviousData: true,
  });

  const delMut = useMutation({
    mutationFn: async (id) => api.delete(`/alunos/${id}`),
    onSuccess: () => {
      toast.success("Aluno excluído");
      qc.invalidateQueries({ queryKey: ["alunos"] });
    },
    onError: (err) => toast.error(getErrorMsg(err)),
  });

  const columns = useMemo(
    () => [
      { key: "nome", label: "Nome" },
      { key: "cpf", label: "CPF" },
      { key: "status", label: "Status" },
      {
        key: "acoes",
        label: "Ações",
        render: (row) => (
          <Stack direction="row" spacing={1}>
            <Button size="small" onClick={() => navigate(`/alunos/${row.id}/ver`)} variant="outlined">
              Ver
            </Button>
            <Button size="small" onClick={() => navigate(`/alunos/${row.id}`)}>
              Editar
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => {
                if (confirm(`Excluir ${row.nome}?`)) delMut.mutate(row.id);
              }}
            >
              Excluir
            </Button>
          </Stack>
        ),
      },
    ],
    [navigate, delMut]
  );

  if (isLoading) return <LoadingState label="Carregando alunos..." />;
  if (isError) return <ErrorState message={getErrorMsg(error)} onRetry={refetch} />;

  const totalPages = Math.max(1, Math.ceil((data?.total || 0) / PAGE_LIMIT));

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ md: "center" }}
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="h5">Alunos</Typography>
          <Typography variant="body2" color="text.secondary">
            Consulta com paginação e busca integrada ao JSON Server (_page, _limit, q).
          </Typography>
        </Box>
        <TextField
          label="Buscar por nome ou CPF"
          value={filtros.busca}
          onChange={(e) => {
            dispatch(setFiltros({ busca: e.target.value }));
            setPage(1);
          }}
          size="small"
        />
      </Stack>

      {isFetching && <LoadingState label="Atualizando lista..." />}

      <Table columns={columns} data={data?.items || []} />

      <Stack direction={{ xs: "column", md: "row" }} alignItems="center" justifyContent="space-between">
        <Typography variant="body2" color="text.secondary">
          Exibindo {(page - 1) * PAGE_LIMIT + 1}-
          {Math.min(page * PAGE_LIMIT, data?.total || 0)} de {data?.total || 0}
        </Typography>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Stack>
    </Stack>
  );
}
