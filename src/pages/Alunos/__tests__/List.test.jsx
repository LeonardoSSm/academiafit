import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AlunosList from "../List";
import { renderWithProviders } from "../../../test/test-utils";
import { getWithAbort, api } from "../../../services/api";

vi.mock("react-hot-toast", () => {
  const toast = { success: vi.fn(), error: vi.fn() };
  return { __esModule: true, default: toast };
});

vi.mock("../../../services/api", async () => {
  const actual = await vi.importActual("../../../services/api");
  return {
    ...actual,
    api: { delete: vi.fn() },
    getWithAbort: vi.fn(),
  };
});

describe("AlunosList", () => {
  beforeEach(() => {
    getWithAbort.mockReset();
    api.delete.mockReset();
  });

  it("renderiza a lista de alunos", async () => {
    getWithAbort.mockResolvedValue({
      data: [{ id: 1, nome: "João Silva", cpf: "000" }],
      headers: { "x-total-count": "1" },
    });

    renderWithProviders(<AlunosList />);
    expect(await screen.findByText("João Silva")).toBeInTheDocument();
  });

  it("filtra pelo campo de busca chamando a API com q", async () => {
    getWithAbort.mockImplementation((_key, _url, config) => {
      const search = config?.params?.q || "";
      const dataset = search
        ? [{ id: 2, nome: "Ana Maria", cpf: "111" }]
        : [
            { id: 1, nome: "João Silva", cpf: "000" },
            { id: 2, nome: "Ana Maria", cpf: "111" },
          ];
      return Promise.resolve({
        data: dataset,
        headers: { "x-total-count": String(dataset.length) },
      });
    });

    renderWithProviders(<AlunosList />);
    await screen.findByText("João Silva");

    const input = screen.getByLabelText(/Buscar por nome/i);
    await userEvent.type(input, "Ana");

    await waitFor(() => {
      expect(getWithAbort).toHaveBeenLastCalledWith(
        "alunos-list",
        "/alunos",
        expect.objectContaining({
          params: expect.objectContaining({ q: "Ana" }),
        })
      );
    });
  });

  it("executa exclusão quando confirmado", async () => {
    getWithAbort.mockResolvedValue({
      data: [{ id: 1, nome: "João Silva", cpf: "000" }],
      headers: { "x-total-count": "1" },
    });

    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    renderWithProviders(<AlunosList />);
    await screen.findByText("João Silva");

    await userEvent.click(screen.getByText("Excluir"));

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith("/alunos/1");
    });
    confirmSpy.mockRestore();
  });
});
