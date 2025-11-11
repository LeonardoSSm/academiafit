import { Box, Typography } from "@mui/material";

export default function EmptyState({ message = "Nenhum dado disponível." }) {
  return (
    <Box
      sx={{
        py: 6,
        textAlign: "center",
        color: "text.secondary",
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 3,
      }}
      data-testid="empty-state"
    >
      <Typography variant="body2">{message}</Typography>
    </Box>
  );
}
