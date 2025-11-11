import { Alert, Button, Stack } from "@mui/material";

export default function ErrorState({ message = "Ocorreu um erro.", onRetry }) {
  return (
    <Stack spacing={2} sx={{ py: 4 }} data-testid="error-state">
      <Alert severity="error">{message}</Alert>
      {onRetry && (
        <Button variant="contained" color="error" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </Stack>
  );
}
