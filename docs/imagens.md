# Inventário de imagens

Atualizado em 20 de outubro de 2026. Arquivos em `app/assets/images`.

Foram encontrados 45 arquivos: 12 utilizados e 33 sem uso. As nove fotografias maiores
foram convertidas para WebP de alta qualidade (qualidade 92), com comparação visual.
A imagem da mesa e os logotipos já estavam otimizados.
A pasta passou de **99,9 MB para 2,81 MB (97,2% de redução)**.
Considerando apenas as imagens originalmente em uso, o total passou de **37,6 MB
para 2,81 MB (92,5% de redução)**.
Este último refinamento reduziu o total de 11,3 MB para 2,81 MB
(75,1% menor). Esses totais representam a coleção de arquivos,
não o download de uma única página.

## Arquivos utilizados

| Arquivo | Dimensões | Antes | Depois | Uso |
| --- | --- | ---: | ---: | --- |
| [elinea-hero-documental.webp](../app/assets/images/elinea-hero-documental.webp) | 1672 × 941 | 1.957,8 KiB | 174,3 KiB | `/` — hero (`app/pages/index.vue`); exemplo fotográfico do manual de marca |
| [elinea-loja-especializada-documental.webp](../app/assets/images/elinea-loja-especializada-documental.webp) | 1675 × 939 | 2.089,1 KiB | 237,1 KiB | `/` — segmento Lojas especializadas (`SegmentsSection.vue`) |
| [elinea-farmacia-documental.webp](../app/assets/images/elinea-farmacia-documental.webp) | 1675 × 939 | 1.895,2 KiB | 177,2 KiB | `/` — segmento Farmácias de manipulação (`SegmentsSection.vue`) |
| [elinea-varejo-documental.webp](../app/assets/images/elinea-varejo-documental.webp) | 1675 × 939 | 2.087,7 KiB | 209,2 KiB | `/` — segmento Pequenos varejistas (`SegmentsSection.vue`) |
| [elinea-marcas-proprias-documental.webp](../app/assets/images/elinea-marcas-proprias-documental.webp) | 1536 × 1024 | 2.278,8 KiB | 219,2 KiB | `/` — segmento Marcas próprias (`SegmentsSection.vue`) |
| [elinea-worktable-documental.webp](../app/assets/images/elinea-worktable-documental.webp) | 6000 × 4000 | 73,5 KiB | 73,5 KiB | `/` — Tudo sob controle (`ProductShotSection.vue`) |
| [elinea-platform-hero-documental.webp](../app/assets/images/elinea-platform-hero-documental.webp) | 1672 × 941 | 2.193,8 KiB | 288,4 KiB | `/plataforma` — hero (`app/pages/plataforma.vue`) |
| [elinea-merchant-operation.webp](../app/assets/images/elinea-merchant-operation.webp) | 2400 × 1602 | 6.200,1 KiB | 511,3 KiB | `/plataforma` — Evolução sem recomeçar (`app/pages/plataforma.vue`) |
| [elinea-resources-hero-documental.webp](../app/assets/images/elinea-resources-hero-documental.webp) | 1536 × 1024 | 1.901,4 KiB | 150,3 KiB | `/recursos` — hero (`app/pages/recursos.vue`) |
| [portrait-woman-arranging-flowers-shop.webp](../app/assets/images/portrait-woman-arranging-flowers-shop.webp) | 1800 × 2700 | 16.071,4 KiB | 697 KiB | `/recursos` — A operação por inteiro (`app/pages/recursos.vue`) |
| [logo-elinea-dark.svg](../app/assets/images/logo-elinea-dark.svg) | viewBox 993,67 × 272,4 (vetorial) | 5 KiB | 4,8 KiB | Header compartilhado (`SiteHeader.vue`) e manual de marca |
| [logo-elinea-white.svg](../app/assets/images/logo-elinea-white.svg) | viewBox 993,67 × 272,4 (vetorial) | 5 KiB | 4,8 KiB | Header e footer compartilhados (`SiteHeader.vue`, `SiteFooter.vue`), núcleos do ecossistema (`EcosystemSection.vue`) e integrações (`IntegrationsSection.vue`) e manual de marca |

O favicon `app/assets/images/favicon.png` foi adicionado posteriormente pelo usuário
e é carregado globalmente por `app/app.vue` como `rel="icon"` em PNG.
Com ele, o inventário atual contém 13 arquivos; os totais acima se referem à otimização
das 12 imagens anteriores.

## Critério de otimização

- Padrão aprovado: WebP de alta qualidade, qualidade 92, esforço 6 e smart subsampling, priorizando qualidade visual na exibição do site.
- As sete fotografias que antes usavam WebP lossless foram refinadas com esse padrão, mantendo integralmente suas dimensões (entre 1536 e 1675 px de largura), proporção e enquadramento. Redução adicional de 81% a 88% por arquivo.
- Comerciante: JPEG de 7360 × 4912 convertido para WebP de 2400 × 1602; de 6.348.875 para 523.542 bytes (91,8% menor).
- Florista: JPEG de 4480 × 6720 convertido para WebP de 1800 × 2700; de 16.457.150 para 713.746 bytes (95,7% menor).
- As nove conversões usam compressão com perdas. Comparações visuais antes/depois das sete fotografias restantes incluíram a imagem completa e recortes em resolução nativa; não mostraram degradação relevante nos detalhes conferidos. Não se trata de preservação pixel a pixel. Saída em sRGB.
- WebP da mesa: mantido em 75.240 bytes. A tentativa em 2400 px de largura e qualidade 92 gerou um arquivo maior, sem benefício para o site.
- SVGs: já otimizados com remoção de declaração XML e espaços dispensáveis, preservando paths, estilos e viewBox; renderização comparada antes/depois.
- Ferramentas temporárias: Sharp 0.35.5 e SVGO 4.1.0. Nenhuma dependência foi adicionada ao projeto.

## Arquivos sem uso removidos

A verificação cobriu imports, templates, dados, estilos, configuração Nuxt, componentes compartilhados utilizados e o manual de marca.
As referências `startSteps` e seus três imports na página Plataforma pertenciam a uma seção ausente do template e foram removidas.
O manual HTML apontava para `h3-slider-img-1.webp`, que já não existia; agora usa o hero documental atual.

- `elinea-control-concept.png`
- `elinea-control-concept.webp`
- `elinea-farmacia-2.png`
- `elinea-farmacia-de-manipulacao.png`
- `elinea-farmacia.png`
- `elinea-hero.png`
- `elinea-hero.webp`
- `elinea-logo-white.svg`
- `elinea-logo.svg`
- `elinea-loja-especializada.png`
- `elinea-lojas-especializadas.png`
- `elinea-marca-propria-2.png`
- `elinea-marca-propria.png`
- `elinea-marcas-proprias.png`
- `elinea-merchant-operation-.png`
- `elinea-merchant-operation.png`
- `elinea-operation-machine.png`
- `elinea-payment-scene.jpg`
- `elinea-pequenos-varejistas.png`
- `elinea-platform-concept-v2.png`
- `elinea-platform-concept-v3.png`
- `elinea-platform-concept.png`
- `elinea-platform-operation-documental.png`
- `elinea-pricing-hero-documental.png`
- `elinea-pricing-hero-natural.webp`
- `elinea-private-label-concept.png`
- `elinea-resources-hero-2.png`
- `elinea-resources-hero-3.webp`
- `elinea-resources-hero.png`
- `elinea-varejo-2.png`
- `elinea-varejo.png`
- `elinea-worktable-documental.jpg`
- `elinea-worktable-documental.png`

Os sete PNGs e os dois JPEGs substituídos por WebP também foram removidos, evitando manter cópias redundantes.
