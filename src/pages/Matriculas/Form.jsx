import { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { api, getErrorMsg } from "../../services/api";
import LoadingState from "../../components/feedback/LoadingState";

const fetchAll = async () => {
  const [alunos, planos] = await Promise.all([api.get("/alunos"), api.get("/planos")]);
  return { alunos: alunos.data, planos: planos.data };
};

function addMonths(dateStr, months) {
  const base = new Date(dateStr);
  base.setMonth(base.getMonth() + months);
  return base.toISOString().slice(0, 10);
}

export default function MatriculasForm() {
  const qc = useQueryClient();
  const location = useLocation();
  const [form, setForm] = useState({ alunoId: "", planoId: "", dataInicio: "" });
  const { data, isLoading } = useQuery({ queryKey: ["alunos-planos"], queryFn: fetchAll });
  const planoSelecionado = data?.planos?.find((plano) => String(plano.id) === String(form.planoId));
  const dataFim = form.dataInicio && planoSelecionado ? addMonths(form.dataInicio, planoSelecionado.duracaoMeses) : "";

  useEffect(() => {
    if (location.state?.base) {
      const base = location.state.base;
      setForm({
        alunoId: base.alunoId || "",
        planoId: base.planoId || "",
        dataInicio: base.dataInicio || "",
      });
    }
  }, [location.state]);

  const createMut = useMutation({
    mutationFn: (payload) => api.post("/matriculas", payload),
    onSuccess: () => {
      toast.success("Matrícula criada");
      qc.invalidateQueries({ queryKey: ["matriculas"] });
      setForm({ alunoId: "", planoId: "", dataInicio: "" });
    },
    onError: (err) => toast.error(getErrorMsg(err)),
  });

  const onSubmit = (event) => {
    event.preventDefault();
    if (!form.alunoId || !form.planoId || !form.dataInicio) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    createMut.mutate({ ...form, dataFim, situacao: "ATIVA" });
  };

  if (isLoading) return <LoadingState label="Carregando alunos e planos..." />;

  return (
    <Box component="form" onSubmit={onSubmit}>
      <Stack spacing={1} mb={3}>
        <Typography variant="h5">Nova matrícula</Typography>
        <Typography variant="body2" color="text.secondary">
          Escolha o aluno e plano para calcular automaticamente a data fim.
        </Typography>
      </Stack>
      <Stack spacing={2}>
        <TextField
          select
          label="Aluno"
          value={form.alunoId}
          onChange={(e) => setForm((prev) => ({ ...prev, alunoId: e.target.value }))}
        >
          <MenuItem value="">Selecione</MenuItem>
          {data?.alunos?.map((aluno) => (
            <MenuItem key={aluno.id} value={aluno.id}>
              {aluno.nome}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Plano"
          value={form.planoId}
          onChange={(e) => setForm((prev) => ({ ...prev, planoId: e.target.value }))}
        >
          <MenuItem value="">Selecione</MenuItem>
          {data?.planos?.map((plano) => (
            <MenuItem key={plano.id} value={plano.id}>
              {plano.nome} ({plano.duracaoMeses} meses)
            </MenuItem>
          ))}
        </TextField>
        <TextField
          type="date"
          label="Data de início"
          InputLabelProps={{ shrink: true }}
          value={form.dataInicio}
          onChange={(e) => setForm((prev) => ({ ...prev, dataInicio: e.target.value }))}
        />
        <TextField
          label="Data de término"
          value={dataFim}
          InputProps={{ readOnly: true }}
          helperText={planoSelecionado ? `Duração: ${planoSelecionado.duracaoMeses} meses` : "Selecione um plano"}
        />
        <Button type="submit" variant="contained" disabled={createMut.isPending}>
          Criar
        </Button>
      </Stack>
    </Box>
  );
}
