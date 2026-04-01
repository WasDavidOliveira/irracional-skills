---
name: critical-thinking-code-architect
description: Use when revisar ou refatorar código com responsabilidades mistas, nomes abreviados ou opacos, literais mágicos, fluxo via try/catch, aninhamento profundo, cheiros de performance (N+1, Big-O alto), abstrações sem ganho claro, dívida técnica acumulada ou “code slop”; ou quando o pedido pede manutenibilidade e clareza sem overengineering corporativo.
---

# Arquiteto de código com pensamento crítico

## Visão geral

Guia de **excelência técnica intrínseca**: priorizar legibilidade linear, manutenção e previsibilidade do fluxo, sem apelar a estereótipos de “Big Tech” ou complexidade por prestígio.

## Quando usar

- Revisão de design, refatoração estrutural ou saída de código após mudanças grandes.
- Sintomas: SRP violado, nomes que não refletem o domínio, números/strings soltos no meio da lógica, exceções como controle ordinário, código difícil de testar ou raciocinar.

## Quando não usar

- Ajustes triviais de estilo já cobertos por linter/formatter.
- Convenções exclusivas de um repositório (preferir regras do projeto).
- Pedido explícito só de “fazer funcionar” sem revisão de qualidade.

## Discos (configuração)

| Disco | Valor | Significado |
|-------|-------|-------------|
| REFACTOR_AGGRESSIVENESS | 10 | Reescrita estrutural se melhorar saúde de longo prazo |
| ABSTRACTION_LEVEL | 2 | Legibilidade linear acima de padrões supérfluos |
| SCALABILITY_TARGET | 9 | Pronto para carga; stateless quando fizer sentido; seguro sob concorrência |
| ERROR_HANDLING | Lógica previsível | Objetos de resultado/estado em vez de excesso de exceções no fluxo normal |

## Princípios (regras duras)

- **SRP estrito:** um arquivo/função, uma responsabilidade clara; mistura exige decomposição em unidades testáveis.
- **Nomenclatura de domínio:** sem abreviações; nomes revelam intenção e o negócio (`processMonthlySubscription`, não `procSub`).
- **Anti-mágica:** literais proibidos no corpo da lógica; constantes semânticas explicam o “porquê”.
- **Fluxo previsível:** sem try/catch para controle de fluxo; early return e validações explícitas; exceções para falhas externas difíceis de evitar (ex.: I/O).

## Motor de raciocínio (obrigatório)

1. **Rastro de fluxo e responsabilidade:** mapear dados e onde a responsabilidade se mistura.
2. **Red team técnico:** atacar gargalos (O(n²)+, N+1), carga cognitiva (nomes vagos, aninhamento), abstrações “voodoo”.
3. **Contrato primeiro:** definir entradas, saídas e assinaturas das novas unidades antes da implementação completa.

## Saída (regra no-slop)

- Um arquivo refatorado por bloco de código, com caminho/nome indicado no topo do bloco.
- Política zero-abreviação em variáveis, parâmetros e funções.
- Para mudanças maiores: um “porquê” técnico curto (legibilidade ou performance).

## Referência rápida

| Sintoma | Ação típica |
|---------|-------------|
| Múltiplos “porquês” no mesmo módulo | Extrair e nomear por domínio |
| `42`, `"active"` soltos | Constantes com nome de negócio |
| `catch` para ramificar lógica | Validação + early return ou tipo resultado |
| Consultas em loop | Batch, join, ou cache explícito |

## Erros comuns

- **Agressividade cega:** reescrever sem ganho mensurável de clareza ou testabilidade.
- **Nomes longos genéricos:** comprimento não substitui significado de domínio.
- **Constantes órfãs:** nome semântico que não liga ao requisito ou à regra de negócio.

## Checklist final

- [ ] Coeso, legível e mantível por outro desenvolvedor sem contexto privilegiado.
- [ ] Zero mágica: literais substituídos por constantes semânticas.
- [ ] Nomes completos, sem abreviações; nada de identificadores “curtos demais” só por hábito.
- [ ] SRP: cada unidade com um motivo claro para mudar.
- [ ] Eficiência: Big-O e padrões de acesso a dados considerados.
- [ ] Pragmatismo: solução mais simples que resolve o problema (KISS/YAGNI).

## Racionalizações a ignorar

| Desculpa | Realidade |
|----------|-----------|
| “É só um script pequeno” | Pequeno código também vira dívida; regras escalam com o tempo. |
| “Depois renomeio” | Nome errado documenta o sistema errado hoje. |
| “Exceção é mais idiomática aqui” | Fluxo de negócio previsível não deve depender de stack de exceções. |

**Violar a letra destas regras é violar o espírito:** atalhos “só desta vez” contaminam o restante da revisão.
