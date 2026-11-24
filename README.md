# Simulado — Mercado de Energia

Simulado de estudos para a **Certificação de Operadores da CCEE 2027**.

**Acesse:** https://tatianacardosolima.github.io/simulado-mercado-de-energia/

## O que tem

- **Simulado cronometrado:** 15 questões sorteadas em 25 minutos, com nota e gabarito comentado no final.
- **Estudar:** 10 questões com correção e explicação logo após cada resposta.
- **Treino nos pontos fracos:** questões das 3 áreas com menor percentual de acertos.
- **Desempenho:** acertos por área e histórico dos simulados.
- **Modo escuro.**

O progresso fica salvo apenas no navegador de quem usa (`localStorage`). Não há login nem servidor.

## Conteúdo

São 239 questões de múltipla escolha, distribuídas em 9 áreas. As alternativas são embaralhadas a cada exibição.

| Área | Temas |
|---|---|
| Estrutura do SEB | Geração, transmissão, distribuição, SIN, submercados, fontes |
| Instituições | MME, EPE, ANEEL, ONS, CCEE |
| ACR e ACL | Ambientes de contratação, abertura do mercado, uso da rede |
| Unidades | MW, MWh, MW médio, valor nominal |
| MCP e PLD | Mercado de curto prazo, exposição, convenção de sinais |
| Comercialização | Comercializadoras, sazonalização, flexibilidade |
| Medição e ETRM | Contratos versus medição, posição energética, arquitetura |
| Comercialização varejista | Representado e varejista, PdC 1.6 e 1.8, encerramento da representação, resolução e resilição, modelo simplificado, portabilidade, adesão à CCEE, retorno ao cativo, atendimento sem CCER, suspensão do fornecimento (modelos tradicional e simplificado) |
| MCP | Apuração do mercado de curto prazo: funcionamento do SIN, papel da CCEE, dados de entrada (medição, contratos e PLD), trilha de liquidação |

## Como adicionar questões

Edite o arquivo [`questoes.js`](questoes.js) e copie um bloco existente:

```js
{ area: "MCP e PLD",
  q: "Enunciado da questão?",
  op: ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D"],
  c: 1,                       // índice da correta: 0 = A, 1 = B, 2 = C, 3 = D
  exp: "Explicação mostrada na correção." },
```

Uma área nova aparece automaticamente na tela de Desempenho.

A data da prova, o número de questões e o tempo ficam no objeto `CONFIG`, no início do `<script>` do [`index.html`](index.html).

## Estrutura

```
index.html   → interface e lógica do simulado (HTML, CSS e JavaScript puros)
questoes.js  → banco de questões
```

## Aviso

Material de estudo pessoal. As questões são autorais, elaboradas a partir de material de estudo próprio, e **não são oficiais da CCEE**. Os conteúdos regulatórios devem ser confirmados nas fontes oficiais vigentes: [CCEE](https://www.ccee.org.br), [ANEEL](https://www.gov.br/aneel), [ONS](https://www.ons.org.br), [EPE](https://www.epe.gov.br) e [MME](https://www.gov.br/mme).

## Licença

O código (`index.html`) tem licença MIT (arquivo [LICENSE](LICENSE)). As questões (`questoes.js`) vêm de material de estudo próprio e não são cobertas por essa licença.

Inspirado no [Simulado dos Gabaritos](https://mayconaranha.github.io/simulado-gabaritos-dsa/).
