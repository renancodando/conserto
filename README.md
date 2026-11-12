# Renan Mobile Lab — site whitelabel

Site institucional para uma loja de conserto e venda de celulares, com visual de **spatial UI**: painéis de vidro em camadas, profundidade em 3D, parallax e luz ambiente.

Não precisa de build. Abra o `index.html` no navegador ou sirva a pasta:

```bash
python3 -m http.server 8080
```

## Como trocar a marca (whitelabel)

Tudo fica em **`js/brand.js`**:

| Campo | Uso |
|---|---|
| `name`, `suffix` | Logotipo, títulos e rodapé ("Renan" + "Mobile Lab") |
| `tagline`, `slogan` | Título do hero e descrição no rodapé |
| `phone`, `whatsapp`, `email`, `address`, `hours`, `instagram`, `cnpj` | Contatos e links do WhatsApp |
| `warrantyMonths`, `founded` | Garantia e anos de experiência (calculados automaticamente) |
| `colors.primary / secondary / accent / ink` | Paleta inteira do site (variáveis CSS) |

Qualquer elemento com `data-brand="campo"` no HTML recebe o valor automaticamente.
O monograma do logo usa as cores `primary` → `secondary`. Para trocar o desenho do logo, edite o `<svg class="logo__mark">` no `index.html` e o `assets/favicon.svg`.

Os produtos ficam no array `products` e a tabela de preços do orçamento fica em `table`/`factor`, ambos em `js/main.js`.

## Paleta padrão

- **Menta** `#3DDBB4`: ações principais
- **Violeta** `#7C6CFF`: profundidade e gradientes
- **Âmbar** `#FFB547`: preços e chamadas
- **Ink** `#0B1020`: fundo

## Seções

Header fixo em vidro · Hero com celular 3D e cards flutuantes · Marcas · Serviços · Como funciona · Loja com filtro novos/seminovos · Trade-in · Orçamento online que envia pelo WhatsApp · Sobre · Depoimentos · FAQ · Contato com mapa · Rodapé.

O site é responsivo, tem foco visível para teclado e respeita `prefers-reduced-motion`.
