---
name: building-elysia-apis
description: Use quando for implementar ou alterar APIs com Bun, Elysia, PostgreSQL, Drizzle, Zod ou OpenAPI Scalar e pastas por funcionalidade (`src/modules/<feature>`); ou quando a ordem global de plugins está incorreta, `src/index.ts` importa rotas isoladas em vez de `modulesRoutes`, o service acede a `db` sem repository, as exceções são `Error` genéricas, há `process.env` nos módulos, pastas de plugin expõem barrel `index.ts`, rotas fora de `src/modules/<feature>`, ou JWT, guards e RBAC estão inconsistentes.
---

# APIs Elysia (stack Astro / feature modules)

## Visão geral

Padrão para APIs **Bun + Elysia + Drizzle (`pg`) + Zod + Scalar**: feature folders, plugins por categoria, bootstrap ordenado, erros centralizados, service/repository separados, configs agrupadas, OpenAPI por `<feature>.docs.ts`.

**Progressive disclosure:** manter este `SKILL.md` como índice enxuto; carregar **`reference/*.md`** só para o tópico em causa; copiar **templates TypeScript** da raiz desta skill apenas ao implementar. Alinha aos critérios de skills de equipa curadas (metadados curtos, corpo focado, detalhe sob demanda), na linha de repositórios como [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) — secção *Skill Quality Standards* (sem caminhos absolutos de máquina; palavras-chave pesquisáveis na `description`).

## Mapa de recursos

| Recurso | Consultar quando |
|---------|-------------------|
| `reference/01-stack-and-bootstrap.md` | Stack, ordem dos `.use()`, fluxo erro global |
| `reference/02-modules-and-plugins.md` | `src/modules/<feature>`, plugins, auth, configs |
| `reference/03-errors-openapi.md` | `HttpError`, exceções, Zod, Scalar |
| `reference/04-database-config-tests.md` | Drizzle, aliases, testes, limites service/repository |
| `http-status.constants.ts`, `http-error.ts`, `error-handler.plugin.ts`, `strategies/` | Copiar/adaptar para `src/plugins/core/error-handler/` |
| `templates/*.exception.ts` | Modelo para `src/exceptions/` |

## Quando usar

- Novo serviço ou módulo; PR que mexe em bootstrap, plugins, módulos ou persistência.
- Sintomas: `.use()` fora de ordem, handler gordo, SQL no service, falta de `modules.routes.ts`, literais de status, `throw new Error` em rotas.

## Quando não usar

- Stack ou estrutura de pastas do repositório contradiz este padrão — seguir a documentação do projeto.
- App sem HTTP ou sem Elysia.

## Padrões centrais

- **Bootstrap:** error handler **primeiro**; depois cors → rate limit → helmet → swagger → activity log (se existir) → **`modulesRoutes`**; `index.ts` só agrega plugins + `modulesRoutes` (ver `reference/01-stack-and-bootstrap.md`).
- **Feature folders:** `src/modules/<feature>/` com sufixos `routes`, `service`, `repository`, `schema`, `types`, `docs`, `constants` (ver `reference/02-modules-and-plugins.md`).
- **SRP:** rota orquestra; service com regras; repository com Drizzle; uma responsabilidade por ficheiro.
- **Zod:** validação nos handlers; schemas em `*.schema.ts`; docs OpenAPI em `*.docs.ts` com spread nas rotas.
- **`HTTP_STATUS`:** um ficheiro de constantes; `set.status = HTTP_STATUS.CREATED` (alias `HttpStatusCode` exportado para compat).
- **Erros:** `onError({ as: "global" })`; `ZodError` e `HttpError` via estratégias; módulos lançam exceções em `src/exceptions/` (estender `HttpError`); evitar `try/catch` de fluxo (ver `reference/03-errors-openapi.md` e templates em `templates/`).
- **Plugins:** categorias `core`, `auth`, `infra`, `docs`; **sem** `index.ts` genérico — nomes explícitos (`*.plugin.ts`).
- **Config:** nunca `process.env` direto nos módulos — usar `src/configs/*.config.ts`.
- **Auth:** jwt plugin; rotas protegidas com guard de sessão; RBAC com permission guard **depois** do auth guard quando aplicável.

## Estrutura alvo (resumo)

```
src/
  index.ts
  configs/
  database/
    connection.ts
    index.ts
    schema/
    migrations/
  exceptions/
  plugins/
    core/error-handler/   # ou espelhar templates desta skill
    auth/
    infra/
    docs/
  modules/
    <feature>/
      <feature>.routes.ts
      <feature>.service.ts
      <feature>.repository.ts
      <feature>.schema.ts
      <feature>.types.ts
      <feature>.docs.ts
      <feature>.constants.ts
    modules.routes.ts
```

## Ficheiros desta skill (copiar para o repo)

Caminhos relativos ao repositório de código; sem paths absolutos de máquina.

| Origem (skill) | Destino típico (repo) |
|----------------|------------------------|
| `http-status.constants.ts` | `src/plugins/core/error-handler/http-status.constants.ts` |
| `http-error.ts` | `src/plugins/core/error-handler/http-error.ts` |
| `strategies/*` | `src/plugins/core/error-handler/strategies/` |
| `error-handler.plugin.ts` | `src/plugins/core/error-handler/error-handler.plugin.ts` |
| `templates/*.exception.ts` | `src/exceptions/<nome>.exception.ts` (ajustar imports) |

## Referência rápida

| Sintoma | Direção |
|---------|---------|
| Error handler no fim da cadeia | Mover para o **primeiro** `.use()` |
| `index.ts` importa `user.routes` | Passar a usar só `modulesRoutes` |
| Service importa `db` | Mover queries para `*.repository.ts` |
| `throw new Error("…")` em rota | Exceção em `src/exceptions/` estendendo `HttpError` |
| `process.env` no módulo | `src/configs/<domínio>.config.ts` |
| Plugin folder com barrel opaco | Ficheiros explícitos, sem `index.ts` de atalho |
| Status mágico | `HTTP_STATUS` |
| Validação só no service | Subir Zod no route + `*.schema.ts` |

## Erros comuns

- Esquecer que **ordem dos plugins** altera CORS, limite, segurança e documentação antes das rotas.
- `activityLog` com `mapResponse` global a interferir com testes — isolar dados ou esperas (ver referência de testes).
- Misturar `detail` OpenAPI à mão sem `*.docs.ts` por feature.
- `permissionGuard` sem `authGuard` quando a rota exige utilizador autenticado.

## Exemplo mínimo (módulo + HTTP_STATUS + error plugin)

Caminhos relativos à pasta da skill; no repo, viver em `src/modules/items/` e importar plugins por alias.

```typescript
import { Elysia } from "elysia";
import { z } from "zod";
import { errorHandlerPlugin } from "./error-handler.plugin";
import { HTTP_STATUS } from "./http-status.constants";

const bodySchema = z.object({ name: z.string().min(1) });
const responseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

export const itemsRoutes = new Elysia({ prefix: "/items" }).post(
  "",
  ({ body, set }) => {
    set.status = HTTP_STATUS.CREATED;
    return { id: crypto.randomUUID(), name: body.name };
  },
  {
    body: bodySchema,
    response: responseSchema,
  },
);

export const application = new Elysia()
  .use(errorHandlerPlugin)
  .use(itemsRoutes);
```

## Racionalizações a ignorar

| Desculpa | Realidade |
|----------|-----------|
| “Ordem dos plugins não interessa” | CORS e erro global deixam de cobrir o que deveriam. |
| “Service com `db` é mais rápido” | Acoplamento impossível de testar e de trocar persistência. |
| “Uma exception genérica basta” | Cliente e logs não distinguem 401/403/404 nem contratos estáveis. |
| “`index.ts` no plugin simplifica imports” | Esconde ficheiros reais e quebra convenção explícita do repositório. |

**Violar bootstrap, agregação `modules.routes.ts`, camadas service/repository, exceções tipadas ou configs centralizadas reproduz dívida que esta skill existe para evitar.**
