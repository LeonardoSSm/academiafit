import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../test/test-utils";
import MatriculasForm from "../Form";
import { api } from "../../../services/api";

vi.mock("react-hot-toast", () => {
  const toast = { success: vi.fn(), error: vi.fn() };
  return { __esModule: true, default: toast };
});

vi.mock("../../../services/api", async () => {
  const actual = await vi.importActual("../../../services/api");
  return {
    ...actual,
    api: { get: vi.fn(), post: vi.fn() },
  };
});

describe("MatriculasForm", () => {
  beforeEach(() => {
    api.get.mockReset();
    api.post.mockReset();
    api.get.mockImplementation((url) => {
      if (url === "/alunos") {
        return Promise.resolve({ data: [{ id: 1, nome: "Ana" }] });
      }
      if (url === "/planos") {
        return Promise.resolve({ data: [{ id: 10, nome: "Mensal", duracaoMeses: 1 }] });
      }
      return Promise.resolve({ data: [] });
    });
  });

  it("calcula data fim com base no plano selecionado", async () => {
    renderWithProviders(<MatriculasForm />, { route: "/matriculas/nova" });

    await userEvent.selectOptions(screen.getByLabelText(/Aluno/i), "1");
    await userEvent.selectOptions(screen.getByLabelText(/Plano/i), "10");
    await userEvent.type(screen.getByLabelText(/Data de início/i), "2025-01-01");

    await userEvent.click(screen.getByRole("button", { name: /Criar/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/matriculas",
        expect.objectContaining({
          alunoId: "1",
          planoId: "10",
          dataInicio: "2025-01-01",
          dataFim: "2025-02-01",
        })
      );
    });
  });
});
