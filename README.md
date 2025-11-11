# AcademiaFit

CRUD React com Vite que consome o `json-server` local para gerenciar alunos, planos e matrículas. A interface usa Material UI, React Query e toast notifications (react-hot-toast).

## Pré-requisitos

- Node.js 20.19+ ou 22.12+ (necessário para Vite/Vitest)
- npm 10+

## Variáveis de ambiente

Crie um `.env` na raiz se quiser apontar para outra API:

```
VITE_API_URL=http://localhost:3333
```

Se não definir, `http://localhost:3333` será usado por padrão.

## Scripts

| Comando          | Descrição                                                                 |
| ---------------- | ------------------------------------------------------------------------- |
| `npm install`    | Instala dependências                                                      |
| `npm run api`    | Sobe o JSON Server em `http://localhost:3333` lendo `db.json`             |
| `npm run dev`    | Inicia a aplicação Vite                                                   |
| `npm run dev:all`| Executa API e app em paralelo via `concurrently`                          |
| `npm run build`  | Build de produção                                                         |
| `npm run preview`| Pré-visualiza o build                                                     |
| `npm run test`   | Executa Vitest + Testing Library                                          |

## Técnicas e decisões

- **Material UI** em todo o layout (AppBar, Container, Buttons, TextFields, Selects e Tables) para remover estilos inline/Tailwind anteriores.
- **Redux Toolkit + react-redux** para gerenciar autenticação e filtros globais, utilizando `configureStore`, `useSelector` e `useDispatch`.
- **React Query + AbortController centralizado** em `services/api.js` para buscas com `_page`, `_limit` e `q`, garantindo cancelamento ao digitar.
- **React Hot Toast** para feedback de sucesso/erro em todas as mutações (alunos, planos, matrículas).
- **Componentes de estado reutilizáveis** (`LoadingState`, `EmptyState`, `ErrorState`) padronizam UX.
- **Validações/máscaras**: CPF (11 dígitos + checksum), CEP (8 dígitos), nome ≥ 3, com máscaras on-the-fly no formulário de alunos.
- **Rotas**: listagem de matrículas (`/matriculas/list`), detalhes somente leitura (`/alunos/:id/ver`, `/matriculas/:id/ver`) com links cruzados e fallback 404 simples. `/painel` exige `role === ADMIN` e redireciona com toast se negado.
- **Planos**: CRUD com tabela e diálogo de edição validando números (sem preço negativo).
- **Testes**: Vitest + RTL cobrindo `AlunosList` (render/busca/exclusão), `AlunosForm` (autofill de CEP) e `MatriculasForm` (cálculo de `dataFim`).

## Limitações atuais

- O JSON Server não tem autenticação real; a role fica mockada no contexto.
- As listagens usam `_page/_limit`, porém JSON Server não ordena por padrão — ajuste os parâmetros conforme necessidade.
- As páginas de detalhes fazem múltiplas requisições (join manual); para grandes volumes considere um backend consolidado.
- As máscaras são simples e não cobrem todos os formatos (telefone, etc.).

Sinta-se à vontade para evoluir o schema do `db.json`, adicionar mais testes e ajustar o tema do Material UI conforme o branding da sua academia.
