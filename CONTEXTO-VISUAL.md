# Contexto visual e técnico do `elinea-site`

Atualizado em 21 de outubro de 2026. Este documento registra decisões aprovadas
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
- O favicon global usa `app/assets/images/favicon.png`, fornecido pelo usuário,
  configurado no `head` em `app/app.vue`.
- O site usa os logotipos oficiais `logo-elinea-dark.svg` em superfícies claras e
  `logo-elinea-white.svg` em superfícies escuras, preservando suas proporções. A cor
  principal da versão dark acompanha o token `--ink` (`#0d1715`).
- Os núcleos “Operação central” do ecossistema e “Núcleo preparado” das integrações
  usam `logo-elinea-white.svg` no lugar do nome digitado, com os subtítulos abaixo
  e proporções originais do logotipo preservadas.
- Cards aparecem quando representam produto, estado ou informação real. Evitar grades
  de pequenos cards usadas apenas como decoração.
- Bordas são sutis, raios moderados e sombras suaves, concentradas nas interfaces do
  produto.
- Fotografias devem aproximar a tecnologia de comerciantes e negócios reais.
- `elinea-hero-documental.webp` é a referência aprovada de qualidade fotográfica para
  as demais páginas: cena de trabalho crível, luz natural, textura e composição editorial.
- Imagens geradas com pessoas devem seguir uma direção documental e natural: textura
  real de pele, assimetria, postura espontânea, luz imperfeita e ambientes com sinais
  de uso. Evitar pele plástica, pose publicitária e acabamento excessivamente perfeito.
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

- Tipografia da aplicação: Inter. Regular 400 para textos, Medium 500 para elementos
  de interface, SemiBold 600 para subtítulos e Bold 700 para títulos e destaques.
- Títulos auxiliares em cards e módulos usam `1rem`; descrições curtas usam `.9rem`.
  Textos de abertura dos capítulos podem ser maiores. Rótulos, estados e valores
  compactos seguem a escala própria da interface.
- As fontes Inter são servidas localmente em `public/fonts`, com `@font-face`,
  sem conexões ao Google Fonts. A família e os pesos aprovados são preservados.
- Grandes títulos usam `clamp()`, line-height compacto próximo de `0.9–1.05` e
  tracking negativo suave, em geral entre `-0.04em` e `-0.02em`, para preservar
  legibilidade e respiro entre as letras.
- Manter a Inter como família única até uma nova decisão explícita de identidade.

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
- Em telas de altura reduzida no desktop (notebooks 14"/15", `max-height: 860px`), o
  hero da Home compacta paddings e margens verticais (`padding-top` do layout, margens
  do título, do texto de apoio e das ações) para evitar que os CTAs fiquem espremidos
  contra o fim da seção. O ajuste é só de espaçamento; hierarquia e alinhamento
  permanecem os mesmos do desktop padrão.

## Estrutura narrativa da Home

1. Header fixo/transparente no hero e claro/translúcido após o scroll.
2. Hero fotográfico escuro com a mensagem “Ecommerce simples para negócios reais.”
3. Fluxo visual da venda, conectado por uma linha progressiva.
4. Ecossistema escuro com módulos orbitando o núcleo “ELÍNEA — Operação central”.
5. Operação: seção “Tecnologia a favor de quem faz acontecer” com abertura tipográfica
   “Seu negócio em primeiro lugar.” sobre fundo verde claro e um painel verde escuro
   que apresenta loja, rotina conectada e suporte. A composição aprovada não usa
   fotografia nem indicadores numéricos ilustrativos. O CTA “Contratar loja” aponta
   para os planos.
6. Central de controle ampla: painel editorial, imagem conceitual da operação e cards
   narrativos para Pedidos, Catálogo, Clientes e WhatsApp. A imagem comunica controle
   por meio de objetos comerciais conectados a um núcleo verde, sem telas ou mockups
   de sistema.
7. Segmentos em painéis editoriais expansíveis. “Marcas próprias” usa uma natureza-morta
   conceitual de embalagens fictícias unificadas pelo verde, sem logos ou textos.
   Manter a composição expansível: cada fotografia tem largura e ponto focal ajustáveis
   individualmente para destacar o assunto principal mesmo nos painéis estreitos.
8. Integrações separadas entre disponíveis e em evolução, sem promessas indevidas.
9. Planos e valores reais da aplicação.
10. CTA final e footer institucional.

O rodapé compartilhado usa fundo verde escuro (`#07110f`), logotipo oficial e
quatro grupos de navegação, com links apenas para páginas e seções existentes.
Em 11 de novembro de 2026, o usuário solicitou uma rediagramação do rodapé,
a inclusão de CNPJ e endereço e a assinatura “Powered by Gênios Mídia - Soluções
Digitais”, substituindo o crédito anterior “Um produto da”. Preservar o tratamento
discreto, a adaptação para telas menores e os acessos às políticas e preferências
de cookies. CNPJ e endereço reais ainda não foram fornecidos; os campos provisórios
não representam dados empresariais confirmados. Reutilizar os valores públicos de
`privacy.cnpj` e `privacy.address` quando configurados.
O usuário solicitou a remoção da primeira linha divisória, acima dos dados
empresariais; manter apenas a divisória da área de políticas.
A composição final do rodapé foi aprovada pelo usuário em 11 de novembro de
2026: marca, slogan, contato, CNPJ, endereço e ícones sociais juntos na coluna
esquerda; quatro grupos de navegação à direita no desktop; políticas e preferências
de cookies na base, seguidas dos direitos reservados e do crédito “Powered by
Gênios Mídia - Soluções Digitais”. Não repetir o nome “Elínea” acima do CNPJ nem
incluir o título “Siga-nos”. Em seguida, o usuário solicitou o título “Redes Sociais”
acima dos ícones e o slogan mais próximo do logotipo. Preservar essa composição
e sua adaptação responsiva.

## Página Plataforma

A rota `/plataforma` aprofunda o produto sem repetir a Home. Sua narrativa aprovada é:

1. Hero escuro com fotografia documental de uma pessoa real à frente de um pequeno
   ecommerce, conferindo pedidos no celular enquanto prepara uma embalagem. A cena deve
   parecer espontânea e vivida, sem pose publicitária ou aparência de banco de imagens.
   O tratamento aprovado segue uma captura profissional limpa: cores naturais, contraste
   suave, luz de janela clara, anatomia facial convincente, textura sutil de pele e
   retoque discreto, sem exagerar imperfeições ou aplicar gradação cinematográfica forte.
2. Loja virtual responsiva e identidade da marca. A seção “Sua marca na frente. A
   estrutura por trás.” é puramente tipográfica, sem telas, mockups ou fotografia:
   abertura centralizada, frase de destaque grande e três linhas editoriais em largura
   total (Vitrine, Catálogo e estoque, Pedidos) com número, título grande e descrição,
   separadas por fios finos. Os textos repetem apenas o que a página já afirma. As
   alternativas rejeitadas foram o mockup de navegador com celular e o painel “Nos
   bastidores”.
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
Os controles de anterior/próximo só aparecem quando há mais de três planos.
Nos botões dos cards de planos, manter a seta alinhada à borda direita do botão,
respeitando o padding de cada variante, com o texto centralizado no espaço restante.
Aplicar no carrossel compartilhado, preservando o estilo dos demais CTAs do site.
Na Home e em Preços, todas as variantes desses botões usam altura mínima de 60px,
mantendo a mesma altura entre o plano em destaque e os demais cards.

O hero, o header e o footer preservam sua direção atual. Mudanças futuras devem ser
refinamentos, salvo nova orientação explícita.

## Página Preços

A rota `/precos` concentra a decisão comercial sem duplicar os dados da Home. Sua
narrativa usa uma página de preços de ecommerce como referência de hierarquia, sem
copiar texto, promessas ou identidade de concorrentes:

1. Hero fotográfico escuro, com texto e CTAs em uma única coluna. A imagem mostra um
   pequeno negócio em momento de análise e crescimento, com o assunto à direita e a
   leitura protegida à esquerda. Não utilizar card de preço nesse hero.
2. Seção de planos reutilizada integralmente da Home.
3. Comparação dos recursos centrais em tabela semântica e rolável no mobile.
4. Capítulo com gradiente linear baseado no verde Elínea (`#07945e`) que separa
   mensalidade, implantação e evolução do projeto. A abertura editorial fica em uma
   coluna e as três partes do investimento aparecem em linhas com divisórias na outra;
   no mobile, seguem em fluxo vertical.
5. Perguntas frequentes baseadas somente nas condições comerciais já cadastradas.
6. CTA final para conhecer os planos e footer institucional.

Os planos, preços, períodos de cobrança, descrições e recursos exibidos na Home,
em Preços e na contratação vêm exclusivamente de `GET /api/v1/plans`.
`app/data/plans.ts` mantém tipos, formatação e apresentação; não duplica preços nem
substitui condições cadastradas na API. Recursos herdados por “Tudo do plano” são
resolvidos a partir das listas retornadas pela API para montar a comparação.
O FAQ e os resumos de mensalidade e implantação também derivam desses dados;
a descrição de SEO não deve fixar preços que possam ficar desatualizados.

As condições comerciais fornecidas em 8 de novembro de 2026 são: Catálogo
(R$ 99,90/mês, implantação grátis), E-commerce (R$ 249,90/mês, implantação grátis)
e Personalizado (mensalidade e implantação sob consulta). O cadastro e a atualização
dessas ofertas pertencem à API/Gestão. O Personalizado usa “Pode incluir” e
“Conforme escopo”, sem prometer todas as personalizações como inclusões automáticas.
Parágrafos adicionais da descrição retornada pela API aparecem como observações.

Os botões preservam o fluxo `/contratar-loja?plano=<slug>&periodo=<intervalo>`.
A disponibilidade de checkout é informada pela API; planos sem preços de cobrança
configurados seguem o contato com a equipe já existente nessa página. Preços anuais
só aparecem quando cadastrados. A contratação continua validando os valores na API
antes de iniciar o pagamento.

## Página Contratar loja

A nomenclatura comercial aprovada é “Contratar loja” nos CTAs e no título da página.
A rota aprovada é `/contratar-loja`, incluindo links de planos e retorno do checkout.

A rota `/contratar-loja` concentra o início da contratação. Mostra o plano escolhido, a
mensalidade, a implantação e os dados necessários para criar a solicitação. Os CTAs
“Contratar loja” apontam para essa página; os links “Conhecer os planos” continuam
na comparação de preços. A composição usa resumo escuro do plano e formulário claro,
em colunas no desktop e em fluxo vertical no mobile.

A página usa os mesmos dados de planos da API e os atualiza antes de iniciar o
pagamento. Planos sem preços Stripe completos para o período escolhido oferecem
contato com a equipe. Nos planos configurados, o Checkout da Stripe inclui a primeira
mensalidade ou anuidade e a implantação quando ela é paga. Após o webhook de pagamento,
a API cria a loja e o administrador, registra a assinatura e envia um email de
boas-vindas com o link para criar a senha. A página de conclusão acompanha o estado da
solicitação pelo identificador público.

## Página Recursos

A rota `/recursos` detalha as capacidades da operação sem repetir a narrativa da
página Plataforma. A página usa como referência a hierarquia de cards editoriais de
plataformas de ecommerce, sem copiar identidade, textos, imagens ou promessas:

1. Hero fotográfico escuro, em uma única coluna de texto e sem botões, mostrando uma
   operação real de venda e expedição ao fundo. O tratamento segue a linguagem do
   hero da Home, com assunto visual à direita e área de leitura protegida à esquerda.
2. A seção “A operação por inteiro” usa título amplo sobre fundo claro e um painel
   escuro abaixo. O painel apresenta as quatro frentes da operação em uma lista à
   esquerda, com estado de disponibilidade explícito, e a imagem conceitual vertical
   à direita. O título interno do painel é claro para manter contraste.
3. Capítulo em degradê verde dedicado a automação e ao Agente de IA.
4. Recursos de dados e crescimento: Analytics, Meta Pixel, SEO e relatórios. A seção
   usa uma única moldura técnica assimétrica com três instrumentos visuais: fluxo de
   eventos, prévia de busca e camadas de relatório, sem métricas fictícias.
5. Estados de disponibilidade explícitos para evitar promessas indevidas. A seção de
   integrações usa fundo escuro contínuo (`#091713`) e um painel de conexões: um núcleo
   representa a operação Elínea e cards horizontais distinguem WhatsApp, pagamentos,
   logística, ERP/fiscal e dados por texto, ícone, superfície e indicador de estado.
6. Migração apresentada como processo de diagnóstico, preparação, conexões e entrada
   no ar, incluindo cuidados com dados e SEO.
7. CTA final e componentes compartilhados de header e footer.

WhatsApp é apresentado como disponível. Gateways variam conforme o plano; ERP,
logística e emissão fiscal dependem de configuração ou projeto personalizado; Agente
de IA, Google Analytics e Meta permanecem identificados como recursos em evolução.

Nos blocos “Base técnica para SEO” e “Relatórios para agir”, manter espaçamento
uniforme entre ícones e títulos, com os textos alinhados pelo topo.

Em 11 de novembro de 2026, o usuário solicitou um botão flutuante de WhatsApp
no site. O contato comercial já informado é (24) 99816-4753. O atalho deve respeitar
a área do aviso de cookies, o foco por teclado e as margens seguras do mobile.

## Movimento e interação

- GSAP e ScrollTrigger são carregados dinamicamente na Home.
- O hero possui entrada editorial e parallax sutil.
- Ao rolar para fora do hero, o conteúdo desaparece em camadas com scrub do GSAP: o
  texto (`.hero-copy`) sobe e some primeiro, mais rápido; a foto de fundo
  (`.hero-photo`) sobe mais devagar, ganha um zoom leve e some por último, criando
  sensação de profundidade. A animação de saída usa `immediateRender: false` na foto
  para não conflitar com a animação de entrada (ambas afetam `opacity` no mesmo
  elemento).
- A última linha do título do hero (“negócios reais.”) tem efeito de máquina de
  escrever: digita, pausa, apaga e digita a próxima frase, em loop contínuo, com
  cursor piscando. As frases do ciclo são “negócios reais.”, “lojas de verdade.” e
  “vender mais.”, todas com o mesmo peso/tempo de exibição — “negócios
  reais.” é o slogan aprovado do hero, é a primeira frase exibida (inclusive sem
  JavaScript) e continua aparecendo normalmente a cada volta do ciclo, sem ficar de
  fora. O efeito só começa depois que a animação de entrada do hero termina, pausa
  quando o hero sai da viewport ou a aba fica oculta, e não roda com
  `prefers-reduced-motion` (a frase original permanece fixa e sem cursor). Um texto
  fixo e acessível com a frase completa existe para leitores de tela, e a fonte da
  linha animada se ajusta automaticamente para nunca quebrar linha nem estourar a
  largura do hero-copy.
- Blocos de conteúdo usam reveals curtos de opacidade e deslocamento.
- A abertura da seção de operação usa o reveal curto dos blocos de conteúdo da Home;
  não há preenchimento caractere a caractere no título.
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
- Na seção “Sua marca na frente” da página Plataforma, as palavras da frase de destaque
  acendem uma a uma com scrub do GSAP (cada palavra é um `inline-block` com margem
  própria, porque o Vue remove o espaço entre spans). Cada linha editorial revela
  número e descrição com fade curto, e o título passa de cinza claro a tinta no scroll.
  No hover, um traço verde preenche o fio da linha e o título desliza levemente. O
  hover é apenas acabamento. Sem `prefers-reduced-motion: no-preference`, tudo
  permanece visível e estático.
- Os cards do mapa de integrações flutuam continuamente com movimentos curtos e
  assíncronos. No mobile, deixam a composição absoluta e passam ao fluxo da página
  ao redor do núcleo para preservar legibilidade e impedir overflow.
- A linha do fluxo de venda é desenhada durante o scroll, conecta as bordas dos cards
  com curvas ortogonais amplas e pequenos pontos de passagem, permanecendo atrás dos
  estados. Os pontos surgem progressivamente com o avanço da linha. Desktop e mobile
  usam o mesmo tratamento responsivo: o percurso é calculado pelas posições reais dos
  cards, adapta-se à composição de cada viewport e alcança o estado final.
- Na seção “Migração com método” da página Recursos, a linha dos passos nasce no centro
  do primeiro marcador, termina no centro do último e é desenhada progressivamente no
  scroll, seguindo o tratamento do fluxo da página Plataforma. Em tablet e mobile, a
  linha permanece oculta para preservar a leitura das colunas reduzidas.
- No núcleo do painel de integrações da página Recursos, os cinco pontos percorrem a
  órbita lentamente, com durações e sentidos alternados. O movimento pausa no hover e
  é removido quando `prefers-reduced-motion` está ativo.
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
dos planos são compartilhados com a página Preços; ambas levam à página de criação
da loja. Evite devolver para esse arquivo detalhes visuais ou comerciais das fontes
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
para a URL de checkout devolvida pela API. A API é a fonte dos IDs, valores e regras
comerciais dos planos. Não inventar preços nem disponibilidade de integrações.

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

Os 13 assets utilizados ficam em `app/assets/images`. O inventário completo de
arquivos, locais de uso, dimensões e otimização está em [docs/imagens.md](docs/imagens.md).

- logos oficiais dark e white em SVG;
- hero documental da Home e quatro fotografias de segmentos em WebP de alta qualidade;
- mesa de expedição da Home em WebP;
- hero documental da Plataforma e comerciante em WebP;
- hero documental de Recursos e fotografia da florista em WebP.

O refinamento aprovado em 20 de outubro de 2026 usa WebP de alta qualidade
(qualidade 92) nas nove fotografias maiores, priorizando qualidade visual no site.
As sete fotografias de hero e segmentos mantêm suas dimensões; comerciante e
florista usam 2400 × 1602 e 1800 × 2700, respectivamente. As versões foram
comparadas visualmente antes/depois, incluindo detalhes em resolução nativa nas
sete fotografias refinadas por último. A mesa já tem 75 KB e foi preservada, assim
como os SVGs oficiais já otimizados. Versões antigas e arquivos sem uso foram removidos.

Antes de gerar ou adicionar uma nova imagem, verifique se um asset existente atende à
necessidade. Sempre inclua `alt` útil quando a imagem comunica conteúdo; imagens
puramente decorativas devem ter `alt=""`.

## Apresentação comercial

A apresentação comercial em `app/pages/apresentacao.vue` é uma página Nuxt
voltada à exportação em PDF, sem navegação entre páginas. O botão de exportação
gera no navegador um novo PDF de 10 páginas em 16:9. Os convites de demonstração e
os contatos usam links reais, também incorporados como áreas clicáveis no PDF. A apresentação é
servida exclusivamente na rota local `/apresentacao`; o middleware da página e o
handler dos assets recusam hosts não locais. O controle é ocultado automaticamente
durante a captura. Cada seção corresponde a
uma página independente em formato 16:9, com dimensões físicas definidas na impressão
para impedir cortes ou redimensionamentos inesperados. A fonte Inter é servida localmente
na apresentação para manter métricas consistentes durante a geração do PDF. Sua direção visual traduz as
referências editoriais de `docs/ref` para a identidade Elínea: tipografia em grande
escala, composições assimétricas, arcos geométricos, fotografias documentais e uso
contido de verde, tinta e papel. As fotografias da capa, encerramento, segmentos e
suporte são exclusivas da apresentação e não devem reutilizar as imagens institucionais
do site. O antigo monograma estrutural “E” foi descartado. Em seu lugar, a apresentação
usa um campo gráfico de alcance: círculos concêntricos finos, eixos discretos e um único
ponto verde, sugerindo conexão, presença digital e encontro com novos clientes sem
competir com a hierarquia tipográfica.

O redesign das páginas 02 a 10 foi aprovado em 8 de novembro de 2026. A capa deve
preservar a composição anterior: título “Novas oportunidades.”, fotografia com
recorte elíptico, arcos verdes e faixa de apoio em duas colunas, sem cabeçalho ou
rodapé adicional.

Na exportação, os textos são desenhados em vetor com os quatro pesos da Inter
incorporados ao PDF. Fotografias e efeitos permanecem na camada visual. Preservar
essa separação: rasterizar as letras junto das fotos prejudica a nitidez em zoom de 100%.

Os convites de demonstração abrem o WhatsApp comercial (24) 99816-4753, informado
pelo usuário, com uma mensagem pronta. O e-mail comercial permanece clicável no
encerramento. Os destinos ficam centralizados em `presentationContact` na página.

A página de planos da apresentação reutiliza `PlansCarousel.vue`, o mesmo carrossel
da Home e de Preços, com os dados de `GET /api/v1/plans`. Não manter uma lista de
preços separada na apresentação. Na exportação, cada página mostra até três planos,
com os controles ocultados e links clicáveis para contato.
Na apresentação, todos os recursos de cada plano ficam visíveis desde a abertura,
sem “Ver todos”. As listas usam duas colunas no desktop para caber no formato 16:9;
o PDF preserva a lista completa, sem ocultar itens durante a captura.

No slide de planos, os cards ficam centralizados verticalmente na área disponível
abaixo do cabeçalho, sem o link de comparação. Os botões de contato ficam alinhados
na base dos cards, depois dos recursos e das observações comerciais.
No encerramento, manter apenas o
e-mail com ícone de envelope abaixo do CTA de demonstração; o link com o número
do WhatsApp foi removido, mas o CTA continua apontando para o WhatsApp comercial.
Em “O mercado mudou”, o campo gráfico mantém apenas os dois arcos concêntricos
maiores, sem círculo interno, eixo ou ponto.

## Checklist para futuras alterações

1. Ler este documento e o contexto do `@elinea/ui` quando houver componente
   compartilhado.
2. Preservar dados comerciais, rotas, SEO e fluxos existentes.
3. Reutilizar o domínio correto da biblioteca antes de criar CSS ou componente local.
4. Validar typecheck e build nos projetos afetados.
5. Testar desktop, tablet e mobile, incluindo foco por teclado e redução de movimento.
6. Verificar console, warnings relevantes e overflow horizontal.
7. Atualizar este arquivo apenas quando uma nova decisão for aprovada.

## Privacidade e cookies

Em 10 de novembro de 2026, o usuário autorizou a implementação das correções da
auditoria, incluindo política de privacidade e controle de cookies, mantendo o visual.
As rotas `/privacidade` e `/cookies` usam Inter, tokens e header/footer compartilhados.
O rodapé dá acesso às políticas e à revisão das preferências de cookies.
Não registrar dados empresariais, prazos ou fornecedores como aprovados antes de
confirmação explícita do responsável.

O usuário solicitou os links das políticas no rodapé e a remoção da faixa branca
após ele. As políticas e “Gerenciar cookies” ficam em uma faixa inferior própria.
O espaço de proteção do banner é absorvido pelo fundo escuro do rodapé, sem
acrescentar padding ao body; ao dispensar o banner, volta o espaçamento normal.

## Termos de contratação e gestão de versões

Em 10 de novembro de 2026, o usuário forneceu os termos versão 1.1 e solicitou
aceite obrigatório no formulário, registro na API e edição pelo `elinea-gestao`.
Diante da divergência sobre o início da cobrança, escolheu manter o fluxo atual:
a primeira mensalidade ou anuidade é paga na contratação, junto da implantação
quando aplicável, antes da preparação da loja. As cláusulas 4 e 5 e a declaração
de aceite foram alinhadas a essa escolha, sem alterar o processamento Stripe.

A rota `/termos` mantém o visual das políticas. O formulário consulta a versão
publicada em `GET /service-terms`, abre o texto da versão específica em outra aba
e exige novo aceite quando seu conteúdo ou as condições do plano mudarem.
O aceite contratual é independente do controle de cookies e de marketing.
Todos os formulários do site, incluindo `/contratar-loja` e o modal de contratação,
mostram erros de validação junto aos respectivos campos, sem resumos ou repetição
em mensagens gerais. Aplicar esse padrão também às respostas de validação da API,
incluindo telefone e aceite dos termos. Ao enviar dados inválidos, focar o primeiro
campo com erro. Manter feedback separado para falhas gerais de pagamento ou erros
que não correspondam a campos disponíveis no formulário.
A Gestão oferece rascunhos e publicação de novas versões; o histórico publicado
e os registros de aceite não são substituídos por edições posteriores.
Dados empresariais ainda ausentes permanecem identificados como pendentes.

## Documentação de domínios e DNS

A rota `/documentacao` reúne o guia de apontamento, acessível pelo rodapé em
Atendimento. Preservar Inter, tokens e header/footer do site. O usuário solicitou
um menu de âncoras fixo à esquerda: o índice acompanha a rolagem no desktop e
vira um menu compacto no mobile, com indicação da seção atual.

O público da documentação é o cliente que contratou uma loja, não o gestor da
infraestrutura. O roteiro parte da contratação: a plataforma recebe os dados e o nome da loja e
cria um endereço padrão, por exemplo `exemplo.elinea.com.br`. Depois o cliente
aponta seu domínio próprio com A/CNAME e informa os dois endereços à Elínea para
vinculação e ativação. Usar o mesmo exemplo em todo o guia. Manter os
nameservers atuais; não publicar os pares de DNS do projeto como instrução para
clientes. Cloudflare aparece apenas como opção para quem já a usa no próprio domínio.

O IP informado é `193.160.119.94`; `exemplo.elinea.com.br` é um exemplo que deve ser
substituído pelo endereço recebido na implantação. O servidor multitenant identifica
a loja pelo domínio associado; o CNAME não faz essa associação automaticamente nem
altera o hostname que o visitante usa. A Elínea cuida da vinculação e do HTTPS,
incluindo a validação dos endereços com e sem www. Não prometer cadastro de aliases,
redirecionamentos ou certificados automáticos sem uma implementação verificada.

Não incluir comandos de terminal, configuração de VPS, Cloudflare for SaaS, modos
de SSL ou instalação de certificados no passo a passo do cliente. Essas tarefas
pertencem à operação da Elínea. A página é orientação e não altera infraestrutura.

Na documentação, o usuário pediu a remoção do bloco de três passos numerados
e do sublinhado no hover do CTA “Falar com a Elínea”. Aplicar essa exceção apenas
a esse CTA, preservando o foco por teclado e o padrão dos demais links e botões.
