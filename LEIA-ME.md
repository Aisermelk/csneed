# CSNEED — Landing Page

## O que já está pronto
- `index.html`, `css/style.css`, `js/v8-loader.js` — projeto completo, HTML5 + CSS3 + JS vanilla, sem frameworks.
- Todo o conteúdo (textos, serviços, diferenciais, processo) vem exatamente do briefing e do material da CSNEED — nada foi inventado.
- Estrutura pronta para GitHub → Cloudflare Pages → V8 Loader.

## Placeholders a substituir antes de publicar
As imagens em `assets/images/` e a logo em `assets/logo/` são **placeholders gerados localmente** (não são fotos reais da CSNEED nem de bancos de imagem — evitei usar fotos de terceiros sem licença num site comercial). Troque pelos arquivos finais mantendo os mesmos nomes, ou ajuste os `src` no `index.html`:
- `hero-estrutura.jpg` — foto de obra/estrutura metálica de impacto
- `sobre-engenharia.jpg` — foto de equipe/obra
- `servico-estruturas.jpg`, `servico-coberturas.jpg`, `servico-pintura.jpg`, `servico-pavilhoes.jpg`, `servico-fachadas.jpg` — uma foto real por serviço
- `cta-obra.jpg` — foto diferente do Hero
- `assets/logo/csneed-logo.png` — logo oficial (o PDF enviado já tem a arte da marca; posso extrair e vetorizar se você quiser)
- `assets/icons/favicon.png` — favicon recortado da logo

## V8 Admin / V8 Loader
- `data-v8-project="csneed"` foi definido no `<body>` seguindo o mesmo padrão de slug usado nos outros projetos (ex.: `studio-voar`). Se você já tiver/preferir outro Project ID no painel, é só trocar essa string.
- `js/v8-loader.js` busca a config em `https://v8adminuniversal.aisermelk.workers.dev/api/public/config/csneed` e aplica: logo, nome, WhatsApp, e-mail, Instagram, texto do rodapé, SEO (title/description/OG) e scripts de rastreamento (GA/Pixel/GTM), via atributos `data-v8-field`.
- Cadastre o projeto "csneed" no V8 Admin com esses campos preenchidos para a página passar a puxar os dados reais.

## WhatsApp — confirmar número
O botão flutuante, o CTA "Falar pelo WhatsApp" e o link de contato usam `data-v8-field="whatsapp-link"`, então o número final vem do V8 Admin. Até lá, os links apontam para `#`. Ainda ficou em aberto qual número usar: `(51) 99622-4539` (do material) ou `5511996224539` (do briefing) — cadastre o correto no painel.

## Formulário
O formulário de contato está pronto no frontend (Nome, Empresa, WhatsApp, E-mail, Serviço, Mensagem) mas sem envio real — por enquanto só mostra uma confirmação visual. A integração de envio (Formspree/V8 Admin) fica para quando o `data-v8-form="orcamento"` for conectado no painel.
