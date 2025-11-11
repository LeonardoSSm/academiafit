import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test/test-utils";
import AlunosForm from "../Form";
import { api } from "../../../services/api";
import { fetchCEP } from "../../../services/viacep";

vi.mock("react-hot-toast", () => {
  const toast = { success: vi.fn(), error: vi.fn() };
  return { __esModule: true, default: toast };
});

vi.mock("../../../services/api", async () => {
  const actual = await vi.importActual("../../../services/api");
  return {
    ...actual,
    api: { post: vi.fn(), put: vi.fn(), get: vi.fn() },
  };
});

vi.mock("../../../services/viacep", () => ({
  fetchCEP: vi.fn(),
}));

describe("AlunosForm", () => {
  beforeEach(() => {
    api.post.mockReset();
    fetchCEP.mockReset();
  });

  it("preenche endereço ao consultar CEP e envia dados normalizados", async () => {
    fetchCEP.mockResolvedValue({
      logradouro: "Rua Teste",
      bairro: "Centro",
      cidade: "Fortaleza",
      uf: "CE",
    });
    api.post.mockResolvedValue({});

    renderWithProviders(<AlunosForm />, { route: "/alunos/novo" });

    await userEvent.type(screen.getByLabelText(/Nome completo/i), "Ana Souza");
    await userEvent.type(screen.getByLabelText(/CPF/i), "00000000191");
    await userEvent.type(screen.getByLabelText(/CEP/i), "60115070");

    await waitFor(() => {
      expect(fetchCEP).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(screen.getByDisplayValue("Rua Teste")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /Criar aluno/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/alunos",
        expect.objectContaining({
          nome: "Ana Souza",
          cpf: "00000000191",
          cep: "60115070",
        })
      );
    });
  });
});
