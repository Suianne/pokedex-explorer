# Pokédex Explorer

Aplicação acadêmica para explorar Pokémon por meio da PokéAPI v2. Desenvolvida com HTML, CSS, JavaScript, Node.js e Express.

## Requisitos
- Node.js 20+
- npm
- Internet para consultar a PokéAPI

## Executar
```bash
npm install
npm start
``
Acesse http://localhost:3000.

## Testes
```bash
npm test
``
Os testes cobrem cache, tratamento de 404 e validação de IDs de favoritos.

## Funcionalidades
- Busca por nome ou número, catálogo paginado e filtro por tipo.
- Detalhes, imagens, habilidades, estatísticas e conversão de unidades.
- Descrição da espécie e cadeia evolutiva.
- Favoritos via LocalStorage e comparação de até dois Pokémon.
- Consulta aleatória, cache de 30 minutos e tratamento de erros.

## Arquitetura
Monólito modular: frontend servido pelo Express, API Gateway em `/api`, serviço de integração com PokéAPI e middleware centralizado de erros. Microsserviços são apresentados no relatório como evolução possível, não como serviços distribuídos já implantados.

## Estrutura
```text
backend/src/gateway/       Rotas da API Gateway
backend/src/services/      Integração PokéAPI e favoritos
backend/src/middleware/    Tratamento de erros
backend/test/              Testes automatizados
frontend/                  Interface web
docs/                      Relatório técnico
```

## Limitações
A aplicação depende da PokéAPI e de conexão com a internet. Cache em memória é volátil; favoritos ficam apenas no navegador atual. O sorteio considera IDs de 1 a 1025 e deve ser atualizado se o catálogo crescer.
