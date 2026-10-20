# Inventário de imagens

Atualizado em 20 de outubro de 2026. Arquivos em `app/assets/images`.

Foram encontrados 45 arquivos: 12 utilizados e 33 sem uso. Os sete PNGs utilizados
foram substituídos por WebP sem perdas. A pasta passou de 97.571,6 KiB
para 31.483,6 KiB (67,7% de redução). Considerando
apenas as imagens em uso, o total passou de 36.758,8 KiB para 31.483,6 KiB
(14,4% de redução). Esses totais representam a coleção de arquivos,
não o download de uma única página.

## Arquivos utilizados

| Arquivo | Dimensões | Antes | Depois | Uso |
| --- | --- | ---: | ---: | --- |
| [elinea-hero-documental.webp](../app/assets/images/elinea-hero-documental.webp) | 1672 × 941 | 1.957,8 KiB | 1.349,1 KiB | `/` — hero (`app/pages/index.vue`); exemplo fotográfico do manual de marca |
| [elinea-loja-especializada-documental.webp](../app/assets/images/elinea-loja-especializada-documental.webp) | 1675 × 939 | 2.089,1 KiB | 1.437,5 KiB | `/` — segmento Lojas especializadas (`SegmentsSection.vue`) |
| [elinea-farmacia-documental.webp](../app/assets/images/elinea-farmacia-documental.webp) | 1675 × 939 | 1.895,2 KiB | 1.296,8 KiB | `/` — segmento Farmácias de manipulação (`SegmentsSection.vue`) |
| [elinea-varejo-documental.webp](../app/assets/images/elinea-varejo-documental.webp) | 1675 × 939 | 2.087,7 KiB | 1.442,2 KiB | `/` — segmento Pequenos varejistas (`SegmentsSection.vue`) |
| [elinea-marcas-proprias-documental.webp](../app/assets/images/elinea-marcas-proprias-documental.webp) | 1536 × 1024 | 2.278,8 KiB | 1.462,7 KiB | `/` — segmento Marcas próprias (`SegmentsSection.vue`) |
| [elinea-worktable-documental.webp](../app/assets/images/elinea-worktable-documental.webp) | 6000 × 4000 | 73,5 KiB | 73,5 KiB | `/` — Tudo sob controle (`ProductShotSection.vue`) |
| [elinea-platform-hero-documental.webp](../app/assets/images/elinea-platform-hero-documental.webp) | 1672 × 941 | 2.193,8 KiB | 1.516,6 KiB | `/plataforma` — hero (`app/pages/plataforma.vue`) |
| [elinea-merchant-operation.jpg](../app/assets/images/elinea-merchant-operation.jpg) | 7360 × 4912 | 6.200,1 KiB | 6.200,1 KiB | `/plataforma` — Evolução sem recomeçar (`app/pages/plataforma.vue`) |
| [elinea-resources-hero-documental.webp](../app/assets/images/elinea-resources-hero-documental.webp) | 1536 × 1024 | 1.901,4 KiB | 1.235,5 KiB | `/recursos` — hero (`app/pages/recursos.vue`) |
| [portrait-woman-arranging-flowers-shop.jpg](../app/assets/images/portrait-woman-arranging-flowers-shop.jpg) | 4480 × 6720 | 16.071,4 KiB | 15.459,9 KiB | `/recursos` — A operação por inteiro (`app/pages/recursos.vue`) |
| [logo-elinea-dark.svg](../app/assets/images/logo-elinea-dark.svg) | viewBox 993,67 × 272,4 (vetorial) | 5 KiB | 4,8 KiB | Header compartilhado (`SiteHeader.vue`) e manual de marca |
| [logo-elinea-white.svg](../app/assets/images/logo-elinea-white.svg) | viewBox 993,67 × 272,4 (vetorial) | 5 KiB | 4,8 KiB | Header e footer compartilhados (`SiteHeader.vue`, `SiteFooter.vue`) e manual de marca |

## Critério de otimização

- PNGs: WebP lossless, sem redimensionamento e com comparação dos pixels decodificados em RGBA.
- JPEG da florista: jpegtran com tabelas Huffman otimizadas e codificação progressiva; metadados preservados e pixels decodificados idênticos.
- JPEG do comerciante e WebP da mesa: mantidos, pois as tentativas sem perdas geraram arquivos maiores.
- SVGs: remoção de declaração XML e espaços dispensáveis, preservando paths, estilos e viewBox; renderização comparada antes/depois.
- Resolução, enquadramento, cores e perfis ICC existentes foram preservados. Não houve recompressão com perdas. As duas fotografias JPEG continuam grandes para preservar integralmente a qualidade solicitada.
- Ferramentas temporárias: Sharp 0.35.5, jpegtran-bin 7.0.0 e SVGO 4.1.0. Nenhuma dependência foi adicionada ao projeto.

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

Os sete PNGs substituídos por WebP também foram removidos, evitando manter cópias redundantes.
