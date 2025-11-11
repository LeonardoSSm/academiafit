import { useParams, Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import LoadingState from "../../components/feedback/LoadingState";
import ErrorState from "../../components/feedback/ErrorState";
import { api, getErrorMsg } from "../../services/api";

const getAluno = async (id) => (await api.get(`/alunos/${id}`)).data;

export default function AlunoDetail() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["aluno-detail", id],
    queryFn: () => getAluno(id),
  });

  if (isLoading) return <LoadingState label="Carregando aluno..." />;
  if (isError && error?.response?.status === 404) {
    return <ErrorState message="Aluno não encontrado (404)." />;
  }
  if (isError) return <ErrorState message={getErrorMsg(error)} />;

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Detalhes do aluno</Typography>
        <Button variant="contained" component={RouterLink} to={`/alunos/${id}`}>
          Editar
        </Button>
      </Stack>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle2" gutterBottom color="text.secondary">
            Dados gerais
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Nome
              </Typography>
              <Typography variant="body1">{data.nome}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                CPF
              </Typography>
              <Typography variant="body1">{data.cpf}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{data.email || "-"}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Telefone
              </Typography>
              <Typography variant="body1">{data.telefone || "-"}</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle2" gutterBottom color="text.secondary">
            Endereço
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                CEP
              </Typography>
              <Typography variant="body1">{data.cep}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Cidade/UF
              </Typography>
              <Typography variant="body1">
                {data.cidade} / {data.uf}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Logradouro
              </Typography>
              <Typography variant="body1">
                {data.logradouro} - {data.bairro}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Link component={RouterLink} to={`/matriculas/list?alunoId=${data.id}`}>
        Ver matrículas deste aluno
      </Link>
    </Stack>
  );
}
