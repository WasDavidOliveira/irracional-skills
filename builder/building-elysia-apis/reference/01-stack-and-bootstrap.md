# Stack e bootstrap

## Stack alvo

| Camada | Tecnologia |
|--------|------------|
| Runtime | Bun |
| Framework HTTP | Elysia |
| ORM | Drizzle ORM + drizzle-kit |
| Driver PostgreSQL | `pg` (`Pool`) |
| Linguagem | TypeScript (`strict`) |
| Validação / OpenAPI auxiliar | Zod + `@elysiajs/swagger` (Scalar) |

## Ordem dos `.use()` no `src/index.ts`

A ordem **importa**. Referência (ajustar nomes aos imports reais):

1. **`errorHandler`** — primeiro: `onError` global padroniza falhas de toda a app (`as: "global"`).
2. **`corsPlugin`** — origens de config central (ex.: `coreConfig.cors.allowedOrigins`).
3. **`rateLimitPlugin`** — limite de pedidos (`coreConfig.rateLimit`).
4. **`helmetPlugin`** — cabeçalhos de segurança (CSP pode estar desativado na config).
5. **`swaggerPlugin`** — OpenAPI + UI Scalar (ex.: `/swagger`).
6. **`activityLogPlugin`** — `mapResponse` global para registo de atividade após resposta.
7. **`modulesRoutes`** — agregação de todas as rotas de domínio.

Porta do servidor: config central (ex.: `coreConfig.server.port`).

## Fluxo pedido → resposta (resumo)

Plugins globais encadeiam na ordem acima. Rotas de módulos executam após infra core. Em erro, o Elysia encaminha para o `onError` do error handler, que formata JSON conforme estratégias (`ZodError`, `HttpError`, `SyntaxError`, …).

O `index.ts` **não** deve importar cada módulo de rota diretamente: apenas `modulesRoutes` (ver `reference/02-modules-and-plugins.md`).
