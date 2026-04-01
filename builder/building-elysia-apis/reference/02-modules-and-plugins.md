# Módulos (features) e árvore de plugins

## Pastas de plugins (`src/plugins/`)

Organização por categoria (sem `index.ts` genérico em pastas de plugin — ficheiros explícitos `.plugin.ts`, `.constants.ts`, etc.):

| Categoria | Exemplos |
|-----------|----------|
| `core/` | error-handler (plugin + `http-error` + `http-status.constants` + `strategies/`) |
| `auth/` | jwt, guard de sessão, permission guard (RBAC) |
| `infra/` | cors, helmet, rate-limit, activity-log |
| `docs/` | swagger com Scalar |

Cada plugin é um ficheiro nomeado; a app faz `.use()` na ordem definida em `reference/01-stack-and-bootstrap.md`.

## Feature folders (`src/modules/<feature>/`)

| Sufixo | Responsabilidade |
|--------|------------------|
| `<feature>.routes.ts` | Prefixo Elysia, composição de plugins (`jwt`, `authGuard`, `permissionGuard`), handlers finos |
| `<feature>.service.ts` | Regras de negócio; **não** acede a `db` diretamente |
| `<feature>.repository.ts` | Queries Drizzle e acesso ao banco |
| `<feature>.schema.ts` | Schemas Zod (body, params, query) |
| `<feature>.types.ts` | Tipos TypeScript partilhados |
| `<feature>.docs.ts` | Objetos OpenAPI `detail` (tags, summary, description, responses, security) |
| `<feature>.constants.ts` | Constantes do domínio |

## Agregação de rotas

- **`src/modules/modules.routes.ts`** — encadeia `.use()` de cada módulo de feature.
- **`src/index.ts`** — regista plugins globais e **só** importa `modulesRoutes`, não ficheiros `*.routes.ts` isolados.

## Variáveis de ambiente

Nos módulos: **nunca** `process.env` solto. Sempre via `src/configs/<domínio>.config.ts` (agrupar por domínio: database, jwt, server, cors, …).

## Auth (resumo de encadeamento)

- Rotas de **login**: tipicamente `jwtPlugin` sem `authGuard` obrigatório; serviço valida credenciais e assina JWT com roles/permissions no payload.
- Rotas **autenticadas**: `.use(authGuard)` antes dos handlers; contexto com `session` (identifier, email, roles, permissions).
- Rotas **RBAC**: `.use(authGuard).use(permissionGuard)` e `authorizePermissions([...])` (todas as permissões) ou `authorizeRoles([...])` (pelo menos um papel) **no início** do handler ou via derive/guard conforme o projeto.

Detalhes de fluxo JWT → session → RBAC: alinhar ao repositório Astro; esta skill fixa o **padrão** de ordem e separação de ficheiros.
