# Auditoria técnica de privacidade e LGPD

Data: 10/11/2026. Projeto: `elinea-site`.

> Registro da situação antes das correções. Em 10/11/2026 foram implementadas as páginas de privacidade e cookies, o painel de preferências, o aviso no formulário, as fontes locais e a proteção da configuração de produção. A política permanece preliminar até a confirmação dos dados empresariais e operacionais. Consulte [configuração e pendências](privacidade-configuracao.md). Os achados abaixo preservam as evidências da auditoria original.

**Resultado: existem lacunas de transparência no site e não há controle de cookies implementado no código revisado. Não é possível atestar conformidade integral com a LGPD a partir deste repositório.**

## Escopo e método

Revisão estática das páginas, formulários, componentes, configurações, rotas de servidor e componentes de marketing compartilhados efetivamente referenciados. Conferência complementar dos HTMLs já existentes em `.output/public`, que podem corresponder a uma compilação anterior. Consulta às fontes oficiais indicadas ao final.

Não foram alterados os fluxos do site, enviados formulários, criadas cobranças ou examinados dados reais. Não houve inspeção de rede em navegador nem verificação do site publicado, da API, do painel, do checkout externo, dos bancos de dados ou da infraestrutura. A ausência de evidência neste repositório não demonstra ausência de controles nesses outros ambientes.

## Inventário observado

| Fluxo | Dados ou comunicação | Evidência |
| --- | --- | --- |
| Contratação | Nome, e-mail, CPF obrigatório, telefone opcional, nome da loja e segmento; envio em corpo de POST para `/implementation-checkouts` | `app/pages/contratar-loja.vue:18,74–87,174–179` |
| Pagamento | Redirecionamento para `checkout_url` fornecida pela API; interface informa processamento pela Stripe | `app/pages/contratar-loja.vue:89,187` |
| Acompanhamento | Identificador `solicitacao` na URL; consulta de status e nome da loja | `app/pages/compra-concluida.vue:16–25` |
| Fontes | Conexões automáticas com `fonts.googleapis.com` e `fonts.gstatic.com` | `nuxt.config.ts:33–35` |
| Atendimento e redes | Links de e-mail, Instagram, Facebook e painel externo; WhatsApp na apresentação local | `app/components/site/SiteFooter.vue:38–63`; `app/components/site/SiteHeader.vue:42`; `app/pages/apresentacao.vue:43` |
| Modal de checkout | Componente com nome, e-mail, telefone, loja e segmento; não foram encontradas referências de uso nas páginas atuais | `app/components/pricing/CheckoutModal.vue:16,55–65,95–101` |

Links para redes sociais não equivalem à instalação de pixels. O texto comercial que menciona Analytics e Meta também não comprova sua ativação.

## Achados e prioridades

### 1. Alta — ausência de informações de privacidade na coleta

Não foram encontradas páginas de política de privacidade ou cookies em `app/pages`, nem links correspondentes no rodapé. O formulário de contratação termina com a informação de pagamento pela Stripe, sem aviso de privacidade ou acesso a explicações sobre o tratamento.

Publicar um aviso com identificação do controlador, finalidades, dados utilizados, compartilhamentos, critérios de retenção e canal para direitos. Apresentar acesso ao aviso junto ao formulário. Identificação empresarial, fornecedores e prazos precisam ser confirmados pelo responsável antes da publicação.

Referência: transparência e acesso às informações de tratamento, arts. 6º e 9º da [LGPD](https://www2.camara.leg.br/legin/fed/lei/2018/lei-13709-14-agosto-2018-787077-normaatualizada-pl.html).

### 2. Alta — exercício dos direitos sem orientação pública

Existe o contato geral `contato@elinea.com.br`, mas não há explicação de como utilizá-lo para solicitar acesso, correção ou eliminação de dados, entre outros direitos. Não foi possível verificar o atendimento interno desse canal.

Definir e divulgar o procedimento e seu responsável. O canal existente pode ser aproveitado se houver atendimento efetivo; não é necessário presumir a criação de outro e-mail. Verificar a necessidade de encarregado e eventual enquadramento nas dispensas regulamentares. A dispensa para agentes de pequeno porte elegíveis não elimina o canal para titulares. Referências: art. 18 da [LGPD](https://www2.camara.leg.br/legin/fed/lei/2018/lei-13709-14-agosto-2018-787077-normaatualizada-pl.html) e art. 11 da [Resolução CD/ANPD nº 2/2022](https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-2-de-27-de-janeiro-de-2022).

### 3. Condicional — controle de cookies inexistente

Não foram localizados banner, painel de preferências, registro de escolha, revogação ou bloqueio condicionado ao consentimento. As buscas também não encontraram uso explícito de `document.cookie`, `useCookie`, `localStorage`, `sessionStorage` ou IndexedDB no código da aplicação revisado. Não há evidência de Analytics, Tag Manager, Meta Pixel, Hotjar ou Clarity instalados nesse código. Os HTMLs locais examinados também não apresentam texto de cookies ou privacidade.

Isso não permite declarar que o ambiente publicado está livre de cookies: API, CDN, hospedagem e checkout externo precisam ser inspecionados em execução.

Conforme o [guia da ANPD](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf/@@display-file/file), a base legal depende da finalidade e do contexto. A ausência de banner não comprova, isoladamente, infração. Caso sejam utilizados rastreadores baseados em consentimento, implementar bloqueio prévio, opções claras de aceitar e rejeitar, seleção por finalidade, registro da escolha e revogação facilitada. Um banner que apenas avisa não resolve o problema.

### 4. Média — Google Fonts carregado automaticamente

As fontes externas são declaradas globalmente, inclusive na contratação e na conclusão. As requisições comunicam metadados de conexão ao destino; isso não comprova instalação de cookies ou rastreamento pelo serviço.

Recomenda-se servir as fontes localmente para reduzir conexões externas. O projeto já contém arquivos Inter para a apresentação em `docs/assets/apresentacao/fonts`, cuja adequação técnica e licença devem ser conferidas antes de reutilização. Caso a integração externa seja mantida, documentar o fluxo e avaliar suas condições, inclusive eventual transferência internacional.

### 5. Média — necessidade do CPF e base legal a confirmar

O CPF é obrigatório, validado e enviado à API. O site não explica sua necessidade. Validar com o responsável se a coleta é necessária nessa etapa e como o dado é utilizado no backend.

Não se recomenda adicionar uma caixa genérica de consentimento como solução automática: contratação pode se apoiar em execução contratual ou procedimentos preliminares, conforme o caso. Consentimento para marketing, se adotado, deve ter finalidade própria. Referências: arts. 6º, III, e 7º da [LGPD](https://www2.camara.leg.br/legin/fed/lei/2018/lei-13709-14-agosto-2018-787077-normaatualizada-pl.html).

### 6. Alta se publicado assim — endereço de API inadequado no build local

`nuxt.config.ts:5` utiliza `http://127.0.0.1:8000/api/v1` como fallback. Esse endereço também aparece no runtime config dos HTMLs locais examinados. `.env.example` indica `https://api.elinea.com.br/api/v1`, mas o exemplo não comprova a configuração implantada.

Validar o artefato e as variáveis de produção; impedir publicação com API de loopback e exigir HTTPS fora do desenvolvimento. Não foi observado envio real de dados em HTTP nesta auditoria.

### 7. Verificação complementar — identificador de acompanhamento

A página consulta uma rota aparentemente pública utilizando um identificador da URL. O frontend espera apenas status e nome da loja e configura `noindex, nofollow`, o que reduz exposição em buscadores, mas não substitui controles de acesso.

Verificar na API a resposta efetiva, imprevisibilidade do identificador, limitação de consultas, cache e proteção dos logs. Avaliar expiração e política de referenciador no ambiente publicado. Não foi demonstrada vulnerabilidade ou acesso indevido.

## Verificações necessárias fora deste repositório

- Inspecionar cookies, armazenamento e requisições em navegador limpo, antes de qualquer interação e durante o checkout. Se houver consentimento, repetir após rejeição, aceitação, recarga e revogação.
- Confirmar finalidade, base legal e retenção de cada operação, incluindo solicitações abandonadas, contatos comerciais e backups.
- Revisar contratos e responsabilidades com pagamento, hospedagem, e-mail e demais fornecedores; verificar localização e transferências de dados.
- Auditar autorização, minimização das respostas, proteção de logs, acesso administrativo e exclusão na API e no banco.
- Confirmar atendimento de titulares e processo de resposta a incidentes. Referência para incidentes: [orientação oficial da ANPD](https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/comunicado-de-incidente-de-seguranca-cis).

## Sequência recomendada

1. Confirmar os dados do controlador e o fluxo real de tratamento; publicar aviso de privacidade e canal de direitos.
2. Acrescentar informação de privacidade junto à coleta e justificar ou reduzir os campos obrigatórios.
3. Corrigir a configuração do build de produção e avaliar fontes locais.
4. Inventariar cookies no ambiente publicado e implementar consentimento se o uso identificado exigir essa base.
5. Concluir a revisão da API, dos fornecedores e dos processos internos.

Este relatório documenta evidências técnicas e pontos de adequação; não constitui certificação jurídica de conformidade.
