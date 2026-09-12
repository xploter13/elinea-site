# Elínea — Contexto visual e direção do site

Atualizado em 12 de setembro de 2026. Este documento registra o alinhamento com o responsável pelo projeto e orienta as próximas alterações. A implementação atual é uma base em evolução, não uma aprovação automática de cada detalhe. Novas orientações explícitas do usuário prevalecem; incorporar aqui as decisões que mudarem a direção.

## Produto e posicionamento

**Elínea — Ecommerce simples para negócios reais.**

Plataforma SaaS de e-commerce para pequenos e médios negócios que precisam criar uma loja profissional e operar vendas sem conhecimento técnico. Reúne loja virtual, catálogo, carrinho, checkout, pagamentos, pedidos, cupons, banners, relatórios e gestão. Evolui para um ecossistema modular com automação comercial, WhatsApp, chatbot e fluxos de venda.

Farmácias de manipulação são um segmento de origem, não uma limitação da marca. A comunicação também contempla lojas especializadas, distribuidores, pequenos varejistas e marcas próprias.

Falar em benefícios concretos para o lojista. Detalhes como `tenant_id`, separação do core e serviços independentes pertencem à documentação técnica, não ao discurso principal da home. Distinguir recursos disponíveis de funcionalidades em desenvolvimento; não transformar a visão de produto em promessa de disponibilidade imediata.

## Direção aprovada

Aparência premium, clara e profissional, com produto em destaque, respiro, tipografia expressiva, luz natural, materiais realistas e profundidade por sombras. A sensação desejada é de uma operação simples, confiável e bem cuidada.

O usuário gostou da organização das seções e do conteúdo. Refinamentos visuais devem partir dessa estrutura, sem reorganizar toda a home por iniciativa própria.

Referências fornecidas pelo usuário:

- A página do iPhone, da Apple, orientou o ritmo de apresentação, o foco no produto e os efeitos ligados ao scroll. É uma referência de intenção, não uma especificação para copiar a identidade da Apple.
- A imagem aprovada para o hero é uma cena profissional com notebook em primeiro plano à esquerda e uma empreendedora à direita, em um ambiente contemporâneo iluminado. O asset foi escolhido e aprovado pelo usuário em 12 de setembro de 2026. Ela substitui a cena anterior com dashboard em perspectiva.
- O portfólio de Luiz Fernando Costa foi uma referência exploratória anterior. Em caso de conflito, prevalecem o hero mais recente e as decisões registradas aqui.

Evitar as direções já rejeitadas: grandes fundos pretos combinados com verde escuro e manchas, brilhos ou detalhes verdes decorativos espalhados pelo background. Usar o verde com intenção em ações, identidade e dados.

## Hero e navegação

Desktop: fotografia ocupando toda a largura, conteúdo à esquerda e pessoa em destaque à direita. Um overlay verde profundo escurece a área esquerda e perde intensidade antes da pessoa, seguindo a composição da referência Tekmino aprovada em 12 de setembro de 2026. Título, apoio e navegação usam tons claros sobre esse campo; o header retorna ao fundo branco e texto escuro após o scroll. O título deve manter o impacto e a proporção da referência sem invadir o assunto principal da fotografia. Ajustar tamanho e largura conforme o espaço real; não impor uma quebra de duas linhas que corte o texto em telas menores.

Dois cards claros sobrepostos à base direita do hero conectam a fotografia aos benefícios do produto. Somente os cards têm fundo branco; o fundo e toda a moldura externa do dock usam a superfície suave `--muted`, também visível no espaço entre eles, sem um divisor adicional. Os ícones e títulos têm presença suficiente para leitura rápida. Usar conteúdo verificável da plataforma e manter a composição compacta, sem transformar o hero em uma grade de recursos.

Conteúdo de referência:

- Título: “Ecommerce simples para negócios reais.”
- Apoio: “Uma plataforma completa para criar, gerenciar e fazer o seu negócio crescer, com mais vendas e menos complicação.”
- Ação principal: “Criar minha loja”.
- Ação secundária: “Conhecer a plataforma”.
- Benefícios curtos próximos das ações; qualquer promessa comercial, como “Sem fidelidade”, precisa corresponder à oferta real.

Manter título, navegação, links e botões em HTML, selecionáveis e acessíveis. O dashboard da fotografia é ilustrativo, não uma interface funcional nem prova de resultados de clientes.

O header fica fixo e translúcido sobre o hero. Ao rolar, assume fundo branco com transição suave. **Preservar o shadow solicitado pelo usuário.** A implementação atual usa o limite de 24px, branco com 96% de opacidade e blur; esses valores podem ser ajustados para legibilidade, mantendo o comportamento. O menu aberto deve ser legível e os links precisam corresponder a destinos reais.

No desktop, uma barra social escura permanece fixa e centralizada na lateral esquerda, seguindo a referência aprovada em 12 de setembro de 2026. Exibir somente Facebook e Instagram, com o rótulo vertical “Siga-nos”. Os destinos vêm de `NUXT_PUBLIC_FACEBOOK_URL` e `NUXT_PUBLIC_INSTAGRAM_URL`; não fixar perfis não confirmados no componente compartilhado. Ocultar a barra abaixo de 768px para não cobrir o conteúdo móvel.

No mobile, reorganizar texto e fotografia verticalmente, com o produto abaixo e um recorte planejado. Garantir espaço suficiente para conteúdo, CTAs e imagem em vez de depender apenas de uma altura fixa. Não aceitar texto cortado, sobreposição ou rolagem horizontal.

## Identidade, cores e tipografia

Reutilizar os tokens de `app/assets/css/main.css`. Esta é a paleta de referência da implementação:

| Papel | Valor | Uso |
| --- | --- | --- |
| Fundo claro | `#fafcfb` | Base da página |
| Branco | `#ffffff` | Superfícies e header após scroll |
| Verde principal | `#07945e` | CTAs, marca e destaques |
| Verde profundo | `#17362c` | Texto e contraste |
| Texto secundário | `#62716b` | Descrições e apoio |
| Superfície suave | `#edf2f0` | Áreas de produto e agrupamentos |

O logotipo oficial foi fornecido pelo usuário: lettering próprio em azul-marinho com detalhes verdes e acento em “ELÍNEA”. Preservar desenho, proporção, cores e acento. Não tratar texto digitado com um ponto verde como reprodução fiel desse arquivo. Se o original não estiver disponível no repositório, localizar o asset fornecido ou pedir o arquivo antes de recriá-lo.

Fonte atual: **Manrope**, com fallbacks definidos no tema. Títulos fortes, espaçamento entre letras moderadamente fechado e corpo confortável. Usar a hierarquia existente de `.site-title`, `.site-copy` e botões; evitar uma nova família de estilos por seção. No desktop, textos reais de navegação, apoio, cards, controles, planos, formulários e rodapé devem ter no mínimo 16px, conforme decisão aprovada em 12 de setembro de 2026. Textos internos de mockups ilustrativos podem permanecer menores para preservar a escala simulada da interface; não usar esses tamanhos no conteúdo comercial.

Sombras devem criar profundidade suave. Bordas discretas e cantos arredondados variam conforme a função: controles menores, cards intermediários e cenas de produto maiores. Evitar excesso de cartões idênticos, halos verdes e efeitos de vidro sem propósito. Ícones seguem a família Lucide já usada no projeto.

Botões de ação usam o componente `MarketingButton` exportado por `@elinea/ui/marketing`, com as variantes `primary`, `outline` e `solid`. Ele pertence ao domínio de marketing e é separado do `StorefrontButton`, usado nos fluxos transacionais da loja. `primary` preserva o desenho aprovado no hero, incluindo o ícone destacado e os cantos configuráveis por `--elinea-marketing-button-radius`; `outline` atende ações secundárias e `solid` substitui o antigo padrão `site-btn`. O site consome o código-fonte local do pacote por alias durante o desenvolvimento. A taxonomia compartilhada completa está registrada em `elinea-ui/docs/context.md`.

## Imagens e assets

Background atual e aprovado: `app/assets/images/h3-slider-img-1.webp`, selecionado e integrado pelo usuário. Preservar esse asset como imagem principal do hero até nova orientação explícita.

Brief para futuras variações: ambiente profissional contemporâneo, luz natural, pessoa à direita e espaço visual utilizável à esquerda para o conteúdo. Não incluir navegação, títulos, CTAs ou textos promocionais dentro da fotografia.

Importar esse asset no componente usando `~/assets/images/h3-slider-img-1.webp` e vincular o resultado ao `src`. A importação pelo Vite é necessária para que o arquivo seja incluído corretamente no build.

Manter assets usados pelo site dentro do repositório, sem depender de caminhos pessoais do Windows ou da pasta do gerador. Otimizar formato e tamanho quando possível, preservar proporções, priorizar a imagem do hero e conferir o carregamento real no navegador.

## Estrutura da home

Preservar como base a sequência atual:

1. Hero e apresentação comercial.
2. Carrossel contínuo de logos em cards claros, com selo central acima. Usar apenas
   clientes e autorizações confirmados na versão publicada.
3. Jornada da venda: loja → pagamento → gestão → relacionamento.
4. Ecossistema de recursos conectados.
5. Comparação entre montar a estrutura sozinho e operar com Elínea.
6. Segmentos atendidos.
7. Planos.
8. Chamada final e rodapé.

A faixa de logos segue a referência de um trilho horizontal contínuo, com cards de
superfície suave e movimento uniforme. Os nomes sem imagem atualmente presentes são
fallbacks tipográficos da implementação anterior, não comprovação de clientes. Trocar
cada item pelo arquivo oficial e respectivo texto alternativo após confirmação.

Os nomes, números, percentuais e estados de mockups não constituem dados reais. Não inventar clientes, depoimentos, resultados, descontos ou funcionalidades para preencher a interface. Preços e contratação devem continuar integrados aos dados e ao fluxo existentes.

## Movimento e interação

GSAP e ScrollTrigger são parte da direção solicitada. Usar movimento para apresentar o produto e acompanhar a progressão da jornada: entrada coordenada do hero, parallax sutil da fotografia e transições entre cenas.

- Preservar o scroll natural e manter links e controles utilizáveis durante as animações.
- Priorizar `transform` e `opacity`; evitar alterações de layout a cada frame.
- Concentrar os efeitos mais elaborados em poucos momentos, sem movimento contínuo em todos os elementos.
- Pinning da jornada e parallax secundário ficam restritos ao desktop; considerar também a altura disponível para não prender conteúdo fora da tela.
- Respeitar `prefers-reduced-motion`, mantendo todo o conteúdo acessível sem animação.
- Limpar contextos GSAP, ScrollTriggers e listeners ao desmontar a página.
- Não deixar conteúdo permanentemente invisível se uma animação ou carregamento falhar.

## Verificação antes de entregar mudanças visuais

Conferir desktop, tablet e celular, incluindo 375px, além de teclado e movimento reduzido. Observar legibilidade sobre a fotografia, limites do título, recorte do produto, header no topo e após scroll, menu móvel, CTAs e ausência de overflow horizontal.

Para imagens, confirmar o endereço solicitado, resposta HTTP e renderização. Build passando não comprova que o navegador carregou o asset ou que o layout está correto. Capturas cortadas ou de viewport inadequado não validam o mobile.

Executar as verificações técnicas proporcionais à mudança, como `npm run typecheck`, `npm run build` e `git diff --check`. Informar com precisão quais comportamentos foram verificados e quais permanecem sem validação.

## Onde trabalhar e como manter o alinhamento

- `app/pages/index.vue`: conteúdo da home, hero, header, GSAP e integração comercial.
- `app/assets/css/main.css`: tokens, estilos compartilhados, responsividade e estados visuais.
- `app/assets/images/`: imagens importadas pelo site.
- `nuxt.config.ts`: configuração Nuxt, fontes e metadados.

Antes de alterar a aparência, ler este documento e examinar a implementação atual. Fazer refinamentos dentro da direção aprovada. Quando o usuário aprovar uma mudança de direção, atualizar este contexto junto com a implementação, distinguindo decisões aprovadas de propostas e detalhes ainda em validação.
