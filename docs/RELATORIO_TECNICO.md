# Relatório técnico — Pokédex Explorer

**Atividade:** laboratório prático de JavaScript, integração com API REST e arquitetura de software.  
**Tecnologias:** HTML5, CSS3, JavaScript, Node.js, Express e PokéAPI v2.  
**Carga horária indicada:** 8 horas. **Nível:** básico a intermediário.

## 1. Introdução e objetivos

O Pokédex Explorer consulta e apresenta informações de Pokémon por meio da PokéAPI v2. A solução integra desenvolvimento frontend, consumo de serviços REST, manipulação de JSON, tratamento de falhas, cache, testes e organização arquitetural. Os objetivos são pesquisar por nome/ID, exibir imagens e atributos, converter unidades, filtrar e paginar resultados, persistir favoritos, comparar Pokémon, consultar espécies e evoluções e discutir API Gateway e microsserviços.

## 2. Tecnologias e arquitetura

A aplicação utiliza HTML, CSS e JavaScript no navegador; Node.js 20+ e Express no servidor; e PokéAPI v2 como fonte externa. O Express serve a interface e publica rotas locais sob `/api`. A arquitetura implementada é um **monólito modular**, com API Gateway, serviço de integração/cache e middleware de erros. A separação em microsserviços é uma proposta de evolução, não uma implantação distribuída nesta entrega.

```text
Navegador (HTML/CSS/JS + LocalStorage)
              | HTTP
              v
Node.js + Express / API Gateway (/api)
       | serviço PokéAPI + cache
       v
PokéAPI v2 (HTTPS / JSON)
```

## 3. Resolução técnica das atividades

1. **Consulta por nome:** `GET /pokemon/:identifier` consulta o recurso pelo nome.
2. **Consulta por ID:** o mesmo endpoint aceita identificador numérico, como 25.
3. **Imagens:** prioriza arte oficial e usa sprite frontal como alternativa.
4. **Conversão:** altura em decímetros e peso em hectogramas são divididos por dez para exibir metros e quilogramas.
5. **Habilidades:** percorre `abilities` e apresenta os nomes.
6. **Estatísticas:** exibe HP, ataque, defesa, ataque especial, defesa especial e velocidade.
7. **Barras gráficas:** representa os valores de `base_stat` em barras proporcionais com escala visual de 255.
8. **Pesquisa:** formulário aceita nome ou número e trata entrada vazia e falhas.
9. **Erros:** respostas 404 são distinguidas de falhas externas; a integração realiza uma repetição simples antes de indicar indisponibilidade.
10. **Paginação:** usa `limit` e `offset`, com 12 resultados por página.
11. **Filtros:** consulta os tipos e busca Pokémon associados ao tipo selecionado.
12. **Favoritos:** IDs ficam no LocalStorage e persistem no navegador atual.
13. **Comparação:** permite comparar até dois Pokémon e seus atributos base.
14. **Espécies:** consulta descrição em português, recorrendo ao inglês quando necessário.
15. **Evolução:** percorre recursivamente `chain` e `evolves_to` para apresentar a cadeia.
16. **Aleatoriedade:** botão seleciona um ID de 1 a 1025; o limite deve ser atualizado se o catálogo crescer.
17. **Cache:** mapa em memória com TTL de 30 minutos; entradas expiradas são descartadas na próxima consulta.
18. **Serviço de favoritos:** a persistência está no navegador; o backend valida IDs como base para futura persistência multiusuário.
19. **API Gateway:** rotas centralizadas em `backend/src/gateway/routes.js`; erros padronizados por middleware.
20. **Documentação e testes:** README e testes nativos do Node.js acompanham o projeto.

## 4. Endpoints locais

| Método | Rota | Finalidade |
|---|---|---|
| GET | `/api/health` | Estado do serviço |
| GET | `/api/pokemon?limit=12&offset=0` | Catálogo paginado |
| GET | `/api/pokemon/:identifier` | Pokémon por nome ou ID |
| GET | `/api/types` | Lista de tipos |
| GET | `/api/types/:type` | Pokémon por tipo |
| GET | `/api/species/:id` | Dados da espécie |
| GET | `/api/evolution-chain?url=...` | Cadeia evolutiva |

A rota de evolução restringe a URL ao domínio oficial da PokéAPI.

## 5. Questões de arquitetura

### Quando um backend único deixa de ser suficiente?

Quando partes do sistema precisam escalar, ser implantadas ou evoluir de forma independente, ou quando equipes e requisitos operacionais justificam esse isolamento. Microsserviços adicionam comunicação de rede, latência, observabilidade distribuída, segurança entre serviços, versionamento de contratos, deploys e testes de integração. Para um projeto pequeno, um monólito modular costuma ser mais simples e econômico.

### Onde implementar cache e como lidar com falhas?

O cache pode ficar no backend, próximo ao cliente HTTP, com TTL. Redis é adequado para múltiplas instâncias. Para dados desatualizados, pode-se adotar stale-while-revalidate; para falhas, timeout, repetição limitada com backoff e circuit breaker. A versão entregue utiliza TTL de 30 minutos e uma repetição simples.

### Por que GET é suficiente na PokéAPI e onde guardar favoritos?

A aplicação apenas lê dados públicos da PokéAPI, portanto GET atende ao caso de uso. Favoritos são dados próprios do produto. Em uma solução multiusuário, podem ser armazenados em PostgreSQL numa tabela com `user_id`, `pokemon_id` e `created_at`, chave única composta e autorização por usuário. Nesta versão, LocalStorage atende à demonstração.

## 6. Testes e validação

Os testes em `backend/test/services.test.js` usam o test runner nativo do Node.js e verificam cache, tratamento de 404 e validação de IDs. A validação executada no ambiente de desenvolvimento registrou **3 testes aprovados e 0 falhas**. A interface e as consultas reais dependem de execução com Express instalado e conexão à PokéAPI; recomenda-se validar pesquisa, filtros, paginação, favoritos, comparação e evolução no navegador.

## 7. Limitações e melhorias

- Dependência de internet e disponibilidade da PokéAPI.
- Cache volátil, local ao processo.
- Favoritos restritos ao navegador atual, sem autenticação ou sincronização.
- Sorteio limitado ao intervalo 1–1025.
- Testes automatizados concentrados nos serviços; faltam testes E2E.
- Recomenda-se adicionar timeout explícito, rate limiting, logs estruturados, monitoramento e política de segurança de conteúdo.

## 8. Conclusão

A solução demonstra integração REST, transformação e apresentação de JSON, paginação, filtros, persistência local, cache, tratamento de erros e testes. A arquitetura modular mantém a execução simples e permite evolução futura para persistência centralizada e serviços independentes sem antecipar complexidade operacional.

## Referências

- PokéAPI. Documentation — Version 2. https://pokeapi.co/docs/v2
- MDN Web Docs. Fetch API. https://developer.mozilla.org/docs/Web/API/Fetch_API
- Express. Express 4.x API Reference. https://expressjs.com/en/4x/api.html
