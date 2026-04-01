# IRRACIONAL SKILLS

Este repositório guarda **Agent Skills**: ficheiros em Markdown (e, quando faz sentido, código de apoio) que instruem assistentes de IA — por exemplo no **Cursor** — sobre **quando** e **como** aplicar um conjunto de regras ou um fluxo de trabalho. Cada skill é um pacote reutilizável, não a história de um bugfix isolado.

O formato segue a ideia de [Agent Skills](https://agentskills.io/specification) (metadados YAML + `SKILL.md`) e boas práticas de documentação enxuta com **progressive disclosure** (detalhe em ficheiros ligados, não tudo no primeiro ecrã).

## O que há neste repositório

Além de uma única skill, o repositório está organizado por **áreas** (pastas). Hoje inclui, entre outras:

| Pasta | Skill (`name` no frontmatter) | Função resumida |
|-------|-------------------------------|-----------------|
| `critical-thinking/` | `critical-thinking-code-architect` | Revisão e refatoração com SRP, nomenclatura de domínio, anti-mágica, fluxo previsível e checklist de qualidade — sem complexidade “de Big Tech” por defeito. |
| `builder/building-elysia-apis/` | `building-elysia-apis` | APIs com **Bun**, **Elysia**, **Drizzle**, **Zod**, módulos por funcionalidade, plugins ordenados, erros centralizados, OpenAPI/Scalar; inclui `reference/` e templates TypeScript. |

Novas skills podem ser adicionadas ao lado destas, mantendo a convenção **um diretório por skill** com `SKILL.md` na raiz desse diretório.

## Estrutura típica

```
skills/
  README.md                 # este ficheiro
  critical-thinking/
    SKILL.md
  builder/
    building-elysia-apis/
      SKILL.md
      reference/            # documentação opcional por tópico
      templates/            # exemplos copiáveis (ex.: exceções)
      …
```

Skills mais pesadas podem ter subpastas `reference/`, `strategies/`, etc., conforme descrito no próprio `SKILL.md`.

## Como usar no Cursor

1. Copiar ou ligar a pasta da skill para um local que o Cursor reconheça (por exemplo `.cursor/skills/<nome-da-skill>/` no projeto, ou a pasta global de skills do utilizador — ver [documentação atual do Cursor sobre skills](https://cursor.com/docs/context/skills)).
2. Garantir que o ficheiro principal se chama **`SKILL.md`** e que o frontmatter YAML inclui pelo menos `name` e `description`.
3. Em conversas onde o contexto se aplique, o agente pode carregar a skill automaticamente conforme a `description` (gatilhos e sintomas).

## Contribuir ou adicionar uma skill

- Criar um novo diretório com nome em minúsculas e hífens (`minha-nova-skill/`).
- Colocar `SKILL.md` com frontmatter válido; descrição focada em **quando usar** (sintomas), não num resumo do procedimento completo.
- Opcional: testar o comportamento do agente com e sem a skill antes de considerar a skill “fechada” (ver abordagem tipo TDD em [Writing Skills](https://github.com/obra/superpowers/blob/main/skills/writing-skills/SKILL.md) do projeto superpowers).

Este README descreve o **conjunto** de skills do repositório; cada `SKILL.md` continua a ser a fonte de verdade para o comportamento da respetiva skill.
