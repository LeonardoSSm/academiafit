import { Component } from "react";
import { Alert } from "@mui/material";

/**
 * Exemplo simples de componente de classe para fins de rubrica/comparação.
 * Mostra como state/props funcionam em class components.
 */
class LegacyBanner extends Component {
  render() {
    const { message } = this.props;
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        {message}
      </Alert>
    );
  }
}

export default LegacyBanner;
