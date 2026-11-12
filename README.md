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
| `logoSub`, `tagline` | Subtítulo do logo e descrição no rodapé |
| `heroTitle`, `heroAccent`, `heroText` | Título (parte branca + parte laranja) e texto do topo |
| `phone`, `whatsapp`, `email`, `address`, `hours`, `instagram`, `cnpj` | Contatos e links do WhatsApp |
| `warrantyMonths`, `founded` | Garantia e anos de experiência (calculados automaticamente) |
| `colors.primary / secondary / accent / ink` | Paleta inteira do site (variáveis CSS) |

Qualquer elemento com `data-brand="campo"` no HTML recebe o valor automaticamente.
O monograma do logo usa as cores `primary` → `secondary`. Para trocar o desenho do logo, edite o `<svg class="logo__mark">` no `index.html` e o `assets/favicon.svg`.

Os produtos ficam no array `products` e a tabela de preços do orçamento fica em `table`/`factor`, ambos em `js/main.js`.

## Paleta padrão

- **Azul elétrico** `#1E7BFF`: brilhos, bordas e botões
- **Ciano** `#22E4FF`: destaques de texto, ícones e reflexos
- **Azul-gelo** `#A9D8FF`: textos de apoio
- **Ink** `#020816`: fundo azul-noite

## Seções

Header com menu em vidro · Hero com celular neon, órbitas, pedestal e números · Cards de diferenciais · Serviços clicáveis com preço · Como funciona em hexágonos · Loja com filtro novos/seminovos · Trade-in · Orçamento online que envia pelo WhatsApp · Sobre · Depoimentos · FAQ · Contato com mapa · Rodapé.

O site é responsivo, tem foco visível para teclado e respeita `prefers-reduced-motion`.
