# Configuração de privacidade

## Dados a confirmar com a empresa

Preencher somente com informações verificadas. A política permanece marcada como preliminar e com `noindex` enquanto faltarem os campos obrigatórios abaixo. O canal geral já existente é usado como contato, sem presumir a nomeação de um encarregado.

| Variável pública | Informação |
| --- | --- |
| `NUXT_PUBLIC_PRIVACY_COMPANY_NAME` | Razão social do controlador |
| `NUXT_PUBLIC_PRIVACY_CNPJ` | CNPJ |
| `NUXT_PUBLIC_PRIVACY_ADDRESS` | Endereço empresarial |
| `NUXT_PUBLIC_PRIVACY_CONTACT_EMAIL` | Canal de privacidade monitorado; padrão `contato@elinea.com.br` |
| `NUXT_PUBLIC_PRIVACY_OFFICER_NAME` | Nome do encarregado, se aplicável; opcional |
| `NUXT_PUBLIC_PRIVACY_CPF_PURPOSE` | Texto aprovado sobre necessidade e finalidade do CPF nesta etapa |
| `NUXT_PUBLIC_PRIVACY_PROVIDERS` | Texto aprovado com fornecedores de hospedagem, e-mail, pagamento e suas responsabilidades |
| `NUXT_PUBLIC_PRIVACY_RETENTION` | Texto aprovado sobre prazos/critérios de retenção e exclusão, incluindo abandono e backups |
| `NUXT_PUBLIC_PRIVACY_INTERNATIONAL_TRANSFERS` | Países envolvidos e condições de eventual transferência internacional; informar também se não houver |

Os valores são texto simples, sem HTML. São públicos: não inserir credenciais, detalhes internos de segurança ou dados de clientes. Para este site estático, definir as variáveis antes de `npm run generate` e publicar novamente o artefato. Preencher variáveis remove a marcação preliminar, mas não substitui a revisão jurídica nem a conferência do tratamento real.

## Controle de cookies

- Registro local: `elinea:cookie-consent`, versão 1, validade escolhida de 180 dias (não é prazo obrigatório imposto pela LGPD).
- O registro contém somente categorias, versão e datas; não é enviado à API e não é um histórico central de comprovação de consentimento.
- Opcionais começam negados; aceitar, rejeitar e salvar escolhas são ações explícitas. A recusa persiste como a aceitação. O painel pode ser reaberto pelo rodapé e pela política.
- Registros inválidos, expirados ou de outra versão exigem nova escolha. Alterações entre abas são sincronizadas. Falha de armazenamento é informada e não impede navegar ou contratar.
- Não há ferramentas de análise/publicidade instaladas. As preferências não ativam serviços inexistentes. Nenhum script externo foi adicionado.
- Antes de adicionar rastreadores: atualizar políticas e inventário com fornecedor, finalidade, dados, retenção e base legal; incrementar `CONSENT_VERSION` para exigir nova decisão; carregar apenas após `useCookieConsent().isAllowed('analytics' | 'marketing')`. A integração deve interromper coleta e remover identificadores sob seu controle quando a categoria for revogada, inclusive entre abas. Não basta colocar o script no `head` e apenas consultar a preferência depois.
- Quando houver rastreamento real, avaliar a evidência central de consentimento necessária ao tratamento, sem coletar novos identificadores desnecessários.

## API, segurança e produção

O endereço público padrão de produção é `https://api.elinea.com.br/api/v1`, conforme o exemplo já existente no projeto. O hook de build rejeita API HTTP ou loopback em produção; desenvolvimento continua permitindo API local. Se o `.env` local estiver configurado para HTTP, gerar com `NUXT_PUBLIC_API_BASE=https://api.elinea.com.br/api/v1 npm run generate` ou usar configuração própria do ambiente de publicação.

As fontes Inter agora são servidas em `public/fonts`, com sua licença. A página de acompanhamento usa `no-referrer`. Configurar também na hospedagem/API os cabeçalhos pertinentes, incluindo `Cache-Control: no-store` para respostas de acompanhamento e `Referrer-Policy`, conforme a arquitetura. Os metadados HTML não configuram cabeçalhos do servidor.

A API e a infraestrutura não foram alteradas. Permanecem pendentes: confirmação da necessidade de CPF, retenção/exclusão efetiva, controles do endpoint público de acompanhamento, contratos e transferências, atendimento de titulares e resposta a incidentes. A conclusão dessas tarefas depende do responsável e dos projetos correspondentes.

## Verificação no ambiente publicado

Inspecionar rede, cookies e armazenamento em navegador limpo, antes da escolha, após rejeição, aceitação, seleção granular e revogação. Repetir na API e no checkout externo. Confirmar que hospedagem/CDN não adicionam rastreadores ou cookies não declarados; se adicionarem, atualizar o inventário e os controles antes da publicação definitiva da política.

Referências: [Guia de cookies da ANPD](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf/@@display-file/file) e [LGPD](https://www2.camara.leg.br/legin/fed/lei/2018/lei-13709-14-agosto-2018-787077-normaatualizada-pl.html).

## Validação da implementação em 10/11/2026

- `npm run typecheck`: passou, inclusive com a configuração local de desenvolvimento.
- `node --test tests/*.test.cjs`: passou; inclui recusa, seleção por categoria, expiração, versão incompatível, corrupção e descarte de campos extras no registro local.
- `NUXT_PUBLIC_API_BASE=https://api.elinea.com.br/api/v1 npm run generate`: passou; as duas políticas foram pré-renderizadas. O build de produção com API HTTP/loopback foi rejeitado como esperado.
- Chromium com Playwright instalado apenas em `/tmp`: aceitação, recusa após recarga, seleção granular, revisão/revogação, sincronização entre abas, expiração/corrupção e armazenamento bloqueado passaram. Conferidos aviso do formulário, fonte local, `no-referrer` na conclusão e `noindex` da política preliminar, sem erros JavaScript.
- Conferidas larguras de 1440, 1280, 1024, 768, 390 e 320 pixels, sem overflow horizontal; painel cabe na viewport, com rolagem quando necessário. Capturas de desktop e mobile foram inspecionadas.
- As chamadas à API foram simuladas no navegador; não foram enviados formulários nem criadas cobranças. Nenhuma requisição ao Google Fonts ou a rastreadores foi observada nas páginas testadas. Isso não substitui a inspeção da infraestrutura publicada.
