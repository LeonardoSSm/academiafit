import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Table from "../../components/Table";
import { api, getErrorMsg } from "../../services/api";
import LoadingState from "../../components/feedback/LoadingState";
import ErrorState from "../../components/feedback/ErrorState";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const fetchPlanos = async () => (await api.get("/planos")).data;

export default function PlanosList() {
  const [novo, setNovo] = useState({ nome: "", duracaoMeses: 1, preco: 0, status: "ATIVO" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const qc = useQueryClient();
  const { data = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["planos"],
    queryFn: fetchPlanos,
  });

  const createMut = useMutation({
    mutationFn: (payload) => api.post("/planos", payload),
    onSuccess: () => {
      toast.success("Plano criado");
      qc.invalidateQueries({ queryKey: ["planos"] });
      setNovo({ nome: "", duracaoMeses: 1, preco: 0, status: "ATIVO" });
    },
    onError: (err) => toast.error(getErrorMsg(err)),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, ...payload }) => api.put(`/planos/${id}`, payload),
    onSuccess: () => {
      toast.success("Plano atualizado");
      qc.invalidateQueries({ queryKey: ["planos"] });
      setDialogOpen(false);
    },
    onError: (err) => toast.error(getErrorMsg(err)),
  });

  const delMut = useMutation({
    mutationFn: (id) => api.delete(`/planos/${id}`),
    onSuccess: () => {
      toast.success("Plano excluído");
      qc.invalidateQueries({ queryKey: ["planos"] });
    },
    onError: (err) => toast.error(getErrorMsg(err)),
  });

  const handleCreate = (event) => {
    event.preventDefault();
    if (!novo.nome || novo.duracaoMeses <= 0 || novo.preco < 0) {
      toast.error("Preencha corretamente os campos.");
      return;
    }
    createMut.mutate(novo);
  };

  const openDialog = (plan) => {
    setSelectedPlan(plan);
    setDialogOpen(true);
  };

  const columns = [
    { key: "nome", label: "Nome" },
    { key: "duracaoMeses", label: "Meses" },
    {
      key: "preco",
      label: "Preço",
      render: (row) => currency.format(row.preco || 0),
    },
    { key: "status", label: "Status" },
    {
      key: "acoes",
      label: "Ações",
      render: (row) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" onClick={() => openDialog(row)}>
            Editar
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => {
              if (confirm("Excluir plano?")) delMut.mutate(row.id);
            }}
          >
            Excluir
          </Button>
        </Stack>
      ),
    },
  ];

  if (isLoading) return <LoadingState label="Carregando planos..." />;
  if (isError) return <ErrorState message={getErrorMsg(error)} onRetry={refetch} />;

  return (
    <Stack spacing={3}>
      <Typography variant="h5">Planos</Typography>
      <form onSubmit={handleCreate}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Nome"
              value={novo.nome}
              onChange={(e) => setNovo((prev) => ({ ...prev, nome: e.target.value }))}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              type="number"
              label="Meses"
              value={novo.duracaoMeses}
              onChange={(e) => setNovo((prev) => ({ ...prev, duracaoMeses: Number(e.target.value) }))}
              inputProps={{ min: 1 }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              type="number"
              label="Preço"
              value={novo.preco}
              onChange={(e) => setNovo((prev) => ({ ...prev, preco: Number(e.target.value) }))}
              inputProps={{ min: 0, step: 0.01 }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              select
              label="Status"
              value={novo.status}
              onChange={(e) => setNovo((prev) => ({ ...prev, status: e.target.value }))}
              fullWidth
            >
              <MenuItem value="ATIVO">Ativo</MenuItem>
              <MenuItem value="INATIVO">Inativo</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={1}>
            <Button type="submit" variant="contained" fullWidth sx={{ height: "100%" }}>
              Adicionar
            </Button>
          </Grid>
        </Grid>
      </form>

      <Table columns={columns} data={data} />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar plano</DialogTitle>
        <DialogContent dividers>
          {selectedPlan && (
            <Stack spacing={2} mt={1}>
              <TextField
                label="Nome"
                value={selectedPlan.nome}
                onChange={(e) => setSelectedPlan((prev) => ({ ...prev, nome: e.target.value }))}
              />
              <TextField
                type="number"
                label="Meses"
                value={selectedPlan.duracaoMeses}
                onChange={(e) =>
                  setSelectedPlan((prev) => ({ ...prev, duracaoMeses: Number(e.target.value) }))
                }
                inputProps={{ min: 1 }}
              />
              <TextField
                type="number"
                label="Preço"
                value={selectedPlan.preco}
                onChange={(e) =>
                  setSelectedPlan((prev) => ({ ...prev, preco: Math.max(0, Number(e.target.value)) }))
                }
                inputProps={{ min: 0, step: 0.01 }}
              />
              <TextField
                select
                label="Status"
                value={selectedPlan.status}
                onChange={(e) => setSelectedPlan((prev) => ({ ...prev, status: e.target.value }))}
              >
                <MenuItem value="ATIVO">Ativo</MenuItem>
                <MenuItem value="INATIVO">Inativo</MenuItem>
              </TextField>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!selectedPlan.nome || selectedPlan.duracaoMeses <= 0 || selectedPlan.preco < 0) {
                toast.error("Preencha corretamente os campos.");
                return;
              }
              updateMut.mutate(selectedPlan);
            }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
