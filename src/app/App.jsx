import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Stack,
  Button,
  Box,
  Paper,
} from "@mui/material";
import RoutesApp from "./routes";
import LegacyBanner from "../components/LegacyBanner";

const navLinks = [
  { to: "/", label: "Alunos" },
  { to: "/planos", label: "Planos" },
  { to: "/matriculas/list", label: "Matrículas" },
  { to: "/painel", label: "Painel" },
];

export default function App() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="transparent">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ letterSpacing: 4 }}>
              GESTÃO FITNESS
            </Typography>
            <Typography variant="h5" color="text.primary">
              AcademiaFit
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            {navLinks.map((link) => (
              <Button
                key={link.to}
                component={NavLink}
                to={link.to}
                variant="text"
                sx={{
                  "&.active": {
                    bgcolor: "primary.light",
                    color: "primary.main",
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
            <Button variant="contained" onClick={() => navigate("/alunos/novo")}>
              Novo aluno
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <LegacyBanner message="Aplicação demonstrativa: combinação de componentes funcionais e de classe." />
        <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
          <Stack direction={{ xs: "column", md: "row" }} alignItems="center" spacing={2}>
            <Box flex={1}>
              <Typography variant="h4" gutterBottom>
                Visão geral
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Administre alunos, planos e matrículas com consistência em um único painel.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={() => navigate("/matriculas/nova")}>
                Nova matrícula
              </Button>
              <Button variant="outlined" onClick={() => navigate("/matriculas/list")}>
                Ver matrículas
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Paper elevation={1} sx={{ p: 3 }}>
          <RoutesApp />
        </Paper>
      </Container>
    </Box>
  );
}
