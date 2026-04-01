# Dados (Drizzle), configs e testes

## Base de dados

- Conexão: `src/database/connection.ts` (`pg` `Pool`).
- Instância Drizzle: `src/database/index.ts` com `schema` registado.
- Tabelas e relações: `src/database/schema/`.
- Migrations: pasta gerida pelo drizzle-kit (`bunx drizzle-kit generate` / `migrate` — detalhes nos scripts do repositório).

**Regra:** o **service** chama o **repository**; o repository contém SQL/Drizzle. O service **não** importa `db` diretamente.

## Path aliases (exemplo TypeScript)

| Alias | Aponta para |
|-------|-------------|
| `@/*` | `src/*` |
| `@database/*` | `src/database/*` |
| `@schema/*` | `src/database/schema/*` |
| `@exceptions/*` | `src/exceptions/*` |
| `@configs/*` | `src/configs/*` |
| `@tests/*` | `src/tests/*` |
| `@factories/*` | `src/tests/factories/*` |

Ajustar ao `tsconfig.json` do projeto.

## Testes (resumo operacional)

- **Unit:** `src/tests/unit/...` — funções puras, sem HTTP nem banco; `bun:test`.
- **Integration:** `src/tests/integration/...` — `app.handle(new Request(...))` sem subir servidor real; transações `BEGIN`/`ROLLBACK` por teste quando há escrita; efeitos fire-and-forget (ex.: activity log) podem exigir limpeza ou helpers de espera.
- **Factories:** classes com `create(overrides?)`, `setCount(n)`, `definition()` com faker; tipos em `<entity>-factory.types.ts`.
- **Auth em testes:** helper para JWT válido (ex.: `authHelper.generateToken`) sem passar pelo login real quando o projeto expõe isso.

Convenções completas, ESLint/Prettier, scripts (`bun run dev`, `lint`, `format`) e checklist de PR: documento de agentes do repositório (ex.: `CLAUDE.md`).
