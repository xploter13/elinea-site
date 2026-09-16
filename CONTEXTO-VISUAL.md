# Contexto visual e técnico do `elinea-site`

Atualizado em 16 de setembro de 2026. Este documento registra decisões aprovadas
para o site institucional da Elínea e serve de referência para futuras alterações.
Novas instruções explícitas do usuário prevalecem. Registre aqui somente decisões
confirmadas, não propostas ainda em avaliação.

## Papel do projeto

O `elinea-site` é a landing page institucional e comercial da Elínea. Sua função é
apresentar a plataforma, explicar como a operação de ecommerce funciona, mostrar os
segmentos atendidos, comunicar integrações e planos e iniciar o fluxo de contratação.

A marca deve parecer uma plataforma de tecnologia e ecommerce madura, simples e
próxima de pequenos negócios reais. O resultado não deve parecer um template SaaS
genérico nem copiar outras marcas usadas como referência.

## Direção visual aprovada

- Linguagem premium, minimalista e editorial, com bastante espaço negativo.
- Hierarquia tipográfica forte e seções tratadas como capítulos de uma narrativa.
- Alternância deliberada entre superfícies claras e escuras.
- Preto profundo, branco/off-white e verde Elínea como base; cinzas são discretos.
- Cards aparecem quando representam produto, estado ou informação real. Evitar grades
  de pequenos cards usadas apenas como decoração.
- Bordas são sutis, raios moderados e sombras suaves, concentradas nas interfaces do
  produto.
- Fotografias devem aproximar a tecnologia de comerciantes e negócios reais.
- Evitar gradientes chamativos, glassmorphism excessivo, sombras pesadas, excesso de
  bordas e animações decorativas sem função narrativa.

## Tokens e tipografia

Os tokens locais ficam em `app/assets/css/main.css`. Valores de referência atuais:

| Papel | Token | Valor |
| --- | --- | --- |
| Fundo escuro | `--ink` | `#0d1715` |
| Texto escuro | `--ink-2` | `#14221f` |
| Fundo principal | `--paper` | `#fafcfb` |
| Fundo claro auxiliar | `--warm-white` | `#f6f8f6` |
| Verde Elínea | `--green` | `#07945e` |
| Verde claro | `--green-light` | `#dff4e9` |
| Verde luminoso | `--green-bright` | `#5cdda4` |
| Texto secundário | `--muted` | `#62716b` |

- Display: Sora, pesos 500–700.
- Corpo e interface: Manrope, pesos 400–800.
- As fontes são carregadas pelo `head` do Nuxt via Google Fonts.
- Grandes títulos usam `clamp()`, line-height compacto próximo de `0.9–1.05` e
  tracking negativo controlado.
- Não substituir as famílias sem uma decisão explícita de identidade.

## Layout e responsividade

- O container principal usa largura máxima de `1440px` e gutter fluido.
- Capítulos principais usam `min-height: 100svh` no desktop, conteúdo centralizado e
  espaço negativo generoso.
- Em até `1024px`, composições divididas passam para uma coluna quando necessário.
- Em até `767px`, não se força altura de viewport nos capítulos: o conteúdo define a
  altura, as composições são simplificadas e os CTAs continuam acessíveis.
- Todo ajuste deve ser verificado em 1440+, 1280, 1024, 768 e mobile, sem overflow
  horizontal.
- Use `svh` em experiências de viewport para reduzir problemas causados pelas barras
  móveis do navegador.

## Estrutura narrativa da Home

1. Header fixo/transparente no hero e claro/translúcido após o scroll.
2. Hero fotográfico escuro com a mensagem “Ecommerce simples para negócios reais.”
3. Fluxo visual da venda, conectado por uma linha progressiva.
4. Ecossistema escuro com módulos orbitando o núcleo “ELÍNEA — Operação central”.
5. Operação: comerciante e pequenos indicadores reais do produto.
6. Central de controle ampla: painel editorial, imagem conceitual da operação e cards
   narrativos para Pedidos, Catálogo, Clientes e WhatsApp. A imagem comunica controle
   por meio de objetos comerciais conectados a um núcleo verde, sem telas ou mockups
   de sistema.
7. Segmentos em painéis editoriais expansíveis. “Marcas próprias” usa uma natureza-morta
   conceitual de embalagens fictícias unificadas pelo verde, sem logos ou textos.
8. Integrações separadas entre disponíveis e em evolução, sem promessas indevidas.
9. Planos e valores reais da aplicação.
10. CTA final e footer institucional.

## Página Plataforma

A rota `/plataforma` aprofunda o produto sem repetir a Home. Sua narrativa aprovada é:

1. Hero escuro com uma composição de operação construída em HTML/CSS.
2. Loja virtual responsiva e identidade da marca.
3. Fluxo que conecta venda, rotina, comunicação e decisão.
4. Recursos apresentados em capítulos editoriais: loja, catálogo, pedidos, clientes e
   WhatsApp/automações.
5. Evolução da operação sem precisar recomeçar.
6. Mapa de integrações reutilizado da Home.
7. Três passos para começar e CTA final.

A página usa a hierarquia de páginas de produto como referência conceitual, mas não
replica conteúdo, claims, preços ou identidade de concorrentes. Header e footer ficam
nos componentes compartilhados `app/components/site/SiteHeader.vue` e
`app/components/site/SiteFooter.vue` e devem ser reutilizados pelas páginas públicas.

O carrossel de planos permanece rolável por gesto, teclado e controles visuais, mas a
barra de rolagem nativa não deve ficar visível.

O hero, o header e o footer preservam sua direção atual. Mudanças futuras devem ser
refinamentos, salvo nova orientação explícita.

## Página Preços

A rota `/precos` concentra a decisão comercial sem duplicar os dados da Home. Sua
narrativa usa uma página de preços de ecommerce como referência de hierarquia, sem
copiar texto, promessas ou identidade de concorrentes:

1. Hero escuro e editorial com preço inicial e leitura rápida da estrutura comercial.
2. Seção de planos reutilizada integralmente da Home.
3. Comparação dos recursos centrais em tabela semântica e rolável no mobile.
4. Capítulo escuro que separa mensalidade, implantação e evolução do projeto.
5. Perguntas frequentes baseadas somente nas condições comerciais já cadastradas.
6. CTA final, checkout existente e footer institucional.

Os valores e recursos vivem em `app/data/plans.ts`. A Home e a página Preços usam a
mesma fonte e o mesmo `app/components/pricing/CheckoutModal.vue`; qualquer alteração
comercial deve ser feita nessa fonte única e validada antes de publicação.

## Movimento e interação

- GSAP e ScrollTrigger são carregados dinamicamente na Home.
- O hero possui entrada editorial e parallax sutil.
- Blocos de conteúdo usam reveals curtos de opacidade e deslocamento.
- A headline da seção de operação é preenchida caractere a caractere pela opacidade,
  vinculada ao progresso do scroll com GSAP, preservando a diferença visual entre
  “Você cuida do negócio” e “O Elínea cuida do digital”.
- Na seção “Tudo sob controle”, os módulos operacionais aparecem progressivamente em
  cards conforme o scroll; no mobile, permanecem no fluxo vertical da página.
- Na página Plataforma, os blocos de “Recursos que formam uma operação” preservam a
  estilização editorial original e formam um empilhamento sticky no desktop: cada
  recurso cobre diretamente o anterior enquanto a coluna esquerda permanece
  centralizada. Não há cards, scrub ou transição interpolada; em tablet e mobile, os
  recursos voltam ao fluxo natural.
- A entrada dessa seção respeita o `padding` padrão dos capítulos e usa fade com
  parallax curto entre a coluna editorial e o primeiro recurso. O movimento existe
  apenas na entrada, sem alterar o empilhamento, e respeita redução de movimento.
- Os cards do mapa de integrações flutuam continuamente com movimentos curtos e
  assíncronos. No mobile, deixam a composição absoluta e passam ao fluxo da página
  ao redor do núcleo para preservar legibilidade e impedir overflow.
- A linha do fluxo de venda é desenhada durante o scroll, conecta as bordas dos cards
  com curvas ortogonais amplas e pequenos pontos de passagem, permanecendo atrás dos
  estados. Os pontos surgem progressivamente com o avanço da linha. Desktop e mobile
  usam o mesmo tratamento responsivo: o percurso é calculado pelas posições reais dos
  cards, adapta-se à composição de cada viewport e alcança o estado final.
- Os módulos do ecossistema orbitam continuamente em dois sentidos, mantendo os cards
  legíveis. Não existe botão de pausa. A órbita pausa enquanto o cursor está sobre a
  composição e retoma ao sair; também pausa fora da viewport ou com a aba oculta.
- `MarketingTextButton` desenha sua linha da esquerda para a direita apenas em hover
  ou foco e desloca discretamente a seta.
- Não usar scroll hijacking, bounce, rotações aleatórias ou movimentos longos.
- Toda animação deve usar preferencialmente `transform` e `opacity`, ter cleanup e
  respeitar `prefers-reduced-motion`.

## Arquitetura de componentes

Componentes específicos da narrativa da Home ficam em `app/components/home`:

- `SaleFlowSection.vue`
- `EcosystemSection.vue`
- `OperationSection.vue`
- `ProductShotSection.vue`
- `SegmentsSection.vue`
- `IntegrationsSection.vue`
- `PricingSection.vue`

O `app/pages/index.vue` coordena a página, o header/footer e a animação global. Os dados
dos planos e o modal de contratação são compartilhados com a página Preços. Evite
devolver para esse arquivo detalhes visuais ou comerciais que já pertencem às fontes
compartilhadas.

Componentes compartilháveis não devem ser duplicados no site. Eles pertencem ao
pacote irmão `@elinea/ui`, conforme o domínio:

- `@elinea/ui/marketing`: CTAs, peças institucionais e aquisição.
- `@elinea/ui/core`: primitivas sem contexto de produto.
- `@elinea/ui/storefront`: experiência da loja e compra.
- `@elinea/ui/painel`: administração e operação interna.

O site usa atualmente `MarketingButton`, `MarketingTextButton` e
`MarketingSocialRail`. O `MarketingTextButton` possui tons `dark` e `light`, seta
padrão, semântica de link ou botão e toda a interação visual. O site controla somente
o espaçamento externo por classes como `.chapter-text-cta`.

Durante o desenvolvimento, `nuxt.config.ts` aponta aliases diretamente para os fontes
locais de `elinea-ui` e `elinea-sdk`. Novos componentes públicos precisam ser
exportados pelo entrypoint de domínio correspondente; não importar arquivos internos
da biblioteca diretamente.

## Tecnologias e integração

- Nuxt 4, Vue 3 e TypeScript estrito.
- Geração estática pelo preset Nitro `static`.
- Tailwind CSS 4 e DaisyUI 5 disponíveis; a Home usa principalmente CSS autoral para
  preservar sua direção editorial.
- GSAP 3 com ScrollTrigger para movimento narrativo.
- Lucide Vue para iconografia funcional.
- `@elinea/ui` para componentes compartilhados.
- `@elinea/sdk` está ligado localmente e deve concentrar contratos compartilháveis de
  integração quando aplicável.

Configurações públicas vêm de:

- `NUXT_PUBLIC_API_BASE`
- `NUXT_PUBLIC_FACEBOOK_URL`
- `NUXT_PUBLIC_INSTAGRAM_URL`

O fluxo de contratação envia dados para `POST /implementation-checkouts` e redireciona
para a URL de checkout devolvida pela API. Não alterar os IDs, valores ou regras dos
planos sem validar a fonte comercial. Não inventar preços nem disponibilidade de
integrações.

## Acessibilidade, SEO e performance

- O documento usa `lang="pt-BR"`, título, descrição e theme color configurados no
  Nuxt.
- Preserve estrutura semântica, skip link, textos alternativos e labels dos controles.
- Estados de foco devem permanecer visíveis; hover nunca pode ser a única indicação
  necessária para compreender ou executar uma ação.
- Links devem continuar links e ações de formulário devem continuar botões.
- Imagens abaixo da dobra devem usar carregamento adequado e reservar espaço para
  evitar layout shift. O hero pode permanecer prioritário.
- Bibliotecas grandes não devem ser adicionadas para efeitos simples.
- Observers, listeners, timelines e triggers precisam de cleanup no unmount.

## Assets atuais

Os assets da Home ficam em `app/assets/images`:

- logos colorida e branca da Elínea;
- fotografia principal do hero;
- composição visual do comerciante/operação.
- composição conceitual de embalagens para o segmento de marcas próprias.

Antes de gerar ou adicionar uma nova imagem, verifique se um asset existente atende à
necessidade. Sempre inclua `alt` útil quando a imagem comunica conteúdo; imagens
puramente decorativas devem ter `alt=""`.

## Checklist para futuras alterações

1. Ler este documento e o contexto do `@elinea/ui` quando houver componente
   compartilhado.
2. Preservar dados comerciais, rotas, SEO e fluxos existentes.
3. Reutilizar o domínio correto da biblioteca antes de criar CSS ou componente local.
4. Validar typecheck e build nos projetos afetados.
5. Testar desktop, tablet e mobile, incluindo foco por teclado e redução de movimento.
6. Verificar console, warnings relevantes e overflow horizontal.
7. Atualizar este arquivo apenas quando uma nova decisão for aprovada.
