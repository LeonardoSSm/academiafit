import {
  Box,
  Button,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useForm from "../../hooks/useForm";
import { api, getErrorMsg } from "../../services/api";
import { fetchCEP } from "../../services/viacep";
import LoadingState from "../../components/feedback/LoadingState";
import {
  maskCEP,
  maskCPF,
  onlyDigits,
  validateCEP,
  validateCPF,
  validateNome,
} from "../../utils/validators";

const getAluno = async (id) => (await api.get(`/alunos/${id}`)).data;

export default function AlunosForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { values, onChange, setValues } = useForm({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    cep: "",
    logradouro: "",
    bairro: "",
    cidade: "",
    uf: "",
    status: "ATIVO",
  });
  const [errors, setErrors] = useState({});
  const [cepStatus, setCepStatus] = useState("");

  const { data, isFetching } = useQuery({
    enabled: isEdit,
    queryKey: ["aluno", id],
    queryFn: () => getAluno(id),
  });

  useEffect(() => {
    if (data) {
      setValues({
        ...data,
        cpf: maskCPF(data.cpf),
        cep: maskCEP(data.cep),
      });
    }
  }, [data, setValues]);

  const saveMut = useMutation({
    mutationFn: async (payload) =>
      isEdit ? api.put(`/alunos/${id}`, payload) : api.post(`/alunos`, payload),
    onSuccess: () => {
      toast.success("Aluno salvo com sucesso");
      qc.invalidateQueries({ queryKey: ["alunos"] });
      navigate("/");
    },
    onError: (err) => toast.error(getErrorMsg(err)),
  });

  const maskedHandlers = useMemo(
    () => ({
      cpf: (event) => {
        onChange({ target: { name: "cpf", value: maskCPF(event.target.value) } });
      },
      cep: (event) => {
        const masked = maskCEP(event.target.value);
        onChange({ target: { name: "cep", value: masked } });
        if (validateCEP(masked)) {
          handleCEP(masked);
        }
      },
    }),
    [onChange]
  );

  const validate = () => {
    const nextErrors = {};
    if (!validateNome(values.nome)) nextErrors.nome = "Informe um nome com ao menos 3 caracteres.";
    if (!validateCPF(values.cpf)) nextErrors.cpf = "CPF inválido.";
    if (!validateCEP(values.cep)) nextErrors.cep = "CEP deve ter 8 dígitos.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCEP = async (cep) => {
    setCepStatus("Consultando CEP...");
    try {
      const address = await fetchCEP(cep);
      setValues((prev) => ({ ...prev, ...address }));
      setCepStatus("Endereço preenchido automaticamente.");
    } catch (err) {
      setCepStatus(err.message);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    const payload = {
      ...values,
      cpf: onlyDigits(values.cpf),
      cep: onlyDigits(values.cep),
    };
    saveMut.mutate(payload);
  };

  if (isEdit && isFetching) return <LoadingState label="Carregando aluno..." />;

  return (
    <Box component="form" onSubmit={onSubmit}>
      <Stack spacing={1} mb={3}>
        <Typography variant="h5">{isEdit ? "Editar aluno" : "Novo aluno"}</Typography>
        <Typography variant="body2" color="text.secondary">
          Campos com máscaras e validações básicas de CPF/CEP.
        </Typography>
        {cepStatus && (
          <Typography variant="caption" color="text.secondary">
            {cepStatus}
          </Typography>
        )}
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Nome completo"
            name="nome"
            value={values.nome}
            onChange={onChange}
            fullWidth
            error={Boolean(errors.nome)}
            helperText={errors.nome}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="CPF"
            name="cpf"
            value={values.cpf}
            onChange={maskedHandlers.cpf}
            fullWidth
            error={Boolean(errors.cpf)}
            helperText={errors.cpf}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Email" name="email" value={values.email} onChange={onChange} fullWidth />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Telefone"
            name="telefone"
            value={values.telefone}
            onChange={onChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="CEP"
            name="cep"
            value={values.cep}
            onChange={maskedHandlers.cep}
            fullWidth
            error={Boolean(errors.cep)}
            helperText={errors.cep}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField
            label="Logradouro"
            name="logradouro"
            value={values.logradouro}
            onChange={onChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Bairro" name="bairro" value={values.bairro} onChange={onChange} fullWidth />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Cidade" name="cidade" value={values.cidade} onChange={onChange} fullWidth />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField label="UF" name="uf" value={values.uf} onChange={onChange} fullWidth />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            select
            label="Status"
            name="status"
            value={values.status}
            onChange={onChange}
            fullWidth
          >
            <MenuItem value="ATIVO">Ativo</MenuItem>
            <MenuItem value="INATIVO">Inativo</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Stack direction="row" spacing={2} mt={4}>
        <Button type="submit" variant="contained" disabled={saveMut.isPending}>
          {isEdit ? "Salvar alterações" : "Criar aluno"}
        </Button>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
      </Stack>
    </Box>
  );
}
