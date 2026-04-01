# Erros, exceções e OpenAPI (Scalar)

## Error handler (core)

- Plugin com `onError({ as: "global" }, …)`.
- **`ZodError`** → estratégia de validação (corpo + `422` / `UNPROCESSABLE_ENTITY` conforme constantes).
- Instâncias de **`HttpError`** (e subclasses) → estratégia default (status vindo de `error.statusCode`, corpo JSON estável).
- **`SyntaxError`** (payload JSON inválido) → `400` / `BAD_REQUEST`.
- Reserva: no projeto Astro, códigos nativos do Elysia (ex.: `NOT_FOUND`) podem ter estratégia dedicada no mapa — usar só quando o erro **não** chega como exceção de domínio.

## Exceções de domínio (`src/exceptions/`)

- Cada erro HTTP de negócio **estende `HttpError`** e fixa o status via `HTTP_STATUS` (ou constante importada).
- Nos módulos: **lançar** `NotFoundException`, `UnauthorizedException`, `ForbiddenException`, etc. — **não** `new Error()` genérico nem `new HttpError()` direto se o projeto padronizou exceções nomeadas.
- O error handler permanece o **único** sítio que traduz erro → JSON de resposta HTTP.

Evitar `try/catch` para fluxo normal: falhar com `throw` e deixar o handler global formatar.

## Constantes de status

- Ficheiro único: `http-status.constants.ts` (ou equivalente em `plugins/core/error-handler/`), exportando **`HTTP_STATUS`**. Handlers usam `set.status = HTTP_STATUS.CREATED`, etc.

## OpenAPI / Scalar

- Plugin `@elysiajs/swagger` com `provider: "scalar"`, metadados da API, tags por área, `components.securitySchemes.bearerAuth` para JWT Bearer.
- Por feature: **`<feature>.docs.ts`** exporta objetos com `detail` (tags, summary, description, responses, security).
- Nas rotas: spread conjunto schema Zod + docs no terceiro argumento do método HTTP, ex.: `{ ...bodySchema, ...loginDocs }`. Rotas só com docs: passar `detail` como terceiro argumento.

Para serializar Zod na spec, seguir a documentação atual do plugin (ex.: `mapJsonSchema` / `z.toJSONSchema` quando necessário).
