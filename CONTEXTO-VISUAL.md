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

No desktop, uma barra social escura permanece fixa e centralizada na lateral esquerda, seguindo a referência aprovada em 12 de setembro de 2026. Sua superfície usa a escala escura da aplicação, com `dark-100` e `dark-200` no corpo e `dark-300` nos círculos dos ícones; reservar o verde para o hover. Exibir somente Facebook e Instagram, com o rótulo vertical “Siga-nos”. Os destinos vêm de `NUXT_PUBLIC_FACEBOOK_URL` e `NUXT_PUBLIC_INSTAGRAM_URL`; não fixar perfis não confirmados no componente compartilhado. Ocultar a barra abaixo de 768px para não cobrir o conteúdo móvel.

No mobile, reorganizar texto e fotografia verticalmente, com o produto abaixo e um recorte planejado. A fotografia usa escurecimento uniforme, sem degradê ou máscara atravessando a pessoa, e mantém o rosto próximo ao centro do enquadramento. Garantir espaço suficiente para conteúdo, CTAs e imagem em vez de depender apenas de uma altura fixa. Não aceitar texto cortado, sobreposição ou rolagem horizontal.

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

O logotipo oficial foi fornecido pelo usuário: lettering próprio em azul-marinho com detalhes verdes e acento em “ELÍNEA”. Preservar desenho, proporção, cores e acento. As versões vetoriais ficam em `app/assets/images/elinea-logo.svg` e `app/assets/images/elinea-logo-white.svg`. No header transparente, usar o lettering branco com os detalhes verdes; após o scroll e a entrada do fundo branco, fazer a transição para a versão oficial azul-marinho e verde. Não tratar texto digitado com um ponto verde como reprodução fiel da marca.

Tipografia atual: **Sora** para títulos e **Manrope** para corpo, navegação e controles, com fallbacks definidos no tema. A Sora aproxima os títulos da geometria técnica do logotipo com ritmo mais regular e menos massa visual do que a alternativa Space Grotesk testada anteriormente; usar peso 600 como padrão e caixa de sentença. Os tons escuros do site acompanham a escala neutra azulada da aplicação: `oklch(0.16 0.012 240)` para títulos e fundos profundos, `oklch(0.195 0.014 240)` para superfícies intermediárias e `oklch(0.225 0.016 240)` para texto estrutural e elevação; o verde permanece como acento em rótulos e ações. Títulos fortes têm espaçamento entre letras moderadamente fechado e o corpo permanece confortável. Usar a hierarquia existente de `.site-title`, `.site-copy` e botões; evitar uma nova família de estilos por seção. No desktop, textos reais de navegação, apoio, cards, controles, planos, formulários e rodapé devem ter no mínimo 16px, conforme decisão aprovada em 12 de setembro de 2026. Textos internos de mockups ilustrativos podem permanecer menores para preservar a escala simulada da interface; não usar esses tamanhos no conteúdo comercial.

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

A jornada da venda usa uma composição inspirada na referência visual enviada em 14 de setembro de 2026: título e ação no topo, seletor horizontal das quatro etapas e um painel amplo que combina benefício comercial com uma cena do produto. A etapa ativa pode ser escolhida por clique, toque ou teclado. No mobile, o seletor passa para duas colunas e o painel empilha conteúdo e mockup. Manter a paleta da Elínea; o verde-limão da referência não faz parte da identidade aprovada.

O ecossistema de recursos mantém a metáfora de módulos conectados, mas com hierarquia mais premium: o núcleo Elínea concentra a mensagem e os módulos aparecem em dois trilhos laterais ligados por linhas discretas. Para integrar a composição ao restante da home, o núcleo usa corpo branco e reserva o azul-marinho com petróleo para o cabeçalho, evitando um bloco escuro muito alto e dominante. Os cards de conexão usam fundo branco sólido, sem degradê e sem sombra; a paleta secundária contida — verde, azul, âmbar e violeta — aparece apenas nas bordas laterais, ícones e linhas, associada às categorias também por texto, nunca apenas por cor. A elevação visual fica concentrada no card principal, enquanto o diagrama inteiro repousa em um quadro branco sem fundo quadriculado ou textura, definido por borda quase imperceptível e bastante respiro. No mobile, o núcleo vem primeiro e os módulos formam uma grade sem conexões decorativas.

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
