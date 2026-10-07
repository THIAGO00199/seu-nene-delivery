# Seu Nenê Delivery

Cardápio digital demonstrativo do Restaurante e Pizzaria Seu Nenê, em Jandaia do Sul (PR).

## Recursos

- 68 itens organizados em 7 categorias
- busca e favoritos persistentes no navegador
- seleção de pizza de um ou dois sabores
- regra demonstrativa de meio a meio pelo maior valor
- carrinho persistente com entrega ou retirada
- pedido mínimo demonstrativo para entrega
- histórico local de pedidos demonstrativos
- cópia do resumo do pedido
- informações da loja, telefone e mapa
- layout responsivo para celular e desktop
- metadados de SEO, favicon e manifesto
- configuração pronta para Vercel

## Rodar localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
```

A saída é gerada em `dist/`.

## Deploy na Vercel

1. Importe o repositório `THIAGO00199/seu-nene-delivery`.
2. A Vercel deve detectar **Vite** automaticamente.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Root Directory: deixe em branco.
7. Faça o deploy.

O arquivo `vercel.json` já deixa o build e a pasta de saída definidos.

## Aviso

Os preços e itens foram transcritos de fontes públicas consultadas em outubro de 2026. A aplicação continua sendo uma prévia: não processa pagamentos e não envia pedidos automaticamente. Disponibilidade, regras de personalização, valores, horários, taxa de entrega e demais dados operacionais devem ser confirmados com a loja antes de uma publicação comercial definitiva.
