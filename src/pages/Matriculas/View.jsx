import { useParams, Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  Grid,
  Link,
  Stack,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import LoadingState from "../../components/feedback/LoadingState";
import ErrorState from "../../components/feedback/ErrorState";
import { api, getErrorMsg } from "../../services/api";

const getMatricula = async (id) => {
  const { data } = await api.get(`/matriculas/${id}`);
  const [alunoRes, planoRes] = await Promise.all([
    api.get(`/alunos/${data.alunoId}`).catch(() => ({ data: null })),
    api.get(`/planos/${data.planoId}`).catch(() => ({ data: null })),
  ]);
  return { ...data, aluno: alunoRes.data, plano: planoRes.data };
};

export default function MatriculaDetail() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["matricula-detail", id],
    queryFn: () => getMatricula(id),
  });

  if (isLoading) return <LoadingState label="Carregando matrícula..." />;
  if (isError && error?.response?.status === 404) {
    return <ErrorState message="Matrícula não encontrada (404)." />;
  }
  if (isError) return <ErrorState message={getErrorMsg(error)} />;

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Detalhes da matrícula</Typography>
        <Button variant="contained" component={RouterLink} to={`/matriculas/nova`} state={{ base: data }}>
          Duplicar
        </Button>
      </Stack>

      <Card variant="outlined">
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Aluno
              </Typography>
              <Link component={RouterLink} to={`/alunos/${data.alunoId}/ver`}>
                {data.aluno?.nome || "Aluno removido"}
              </Link>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Plano
              </Typography>
              <Typography variant="body1">{data.plano?.nome || "Plano removido"}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Data início
              </Typography>
              <Typography variant="body1">{data.dataInicio}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Data fim
              </Typography>
              <Typography variant="body1">{data.dataFim}</Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" color="text.secondary">
            Situação
          </Typography>
          <Typography variant="body1">{data.situacao}</Typography>
        </CardContent>
      </Card>

      <Link component={RouterLink} to={`/matriculas/list`}>
        Voltar para lista
      </Link>
    </Stack>
  );
}
