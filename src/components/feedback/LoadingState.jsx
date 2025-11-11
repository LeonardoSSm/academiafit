import { CircularProgress, Stack, Typography } from "@mui/material";

export default function LoadingState({ label = "Carregando..." }) {
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{ py: 4 }}
      data-testid="loading-state"
    >
      <CircularProgress size={24} color="secondary" />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Stack>
  );
}
