export type FooterPage = {
  section: 'operacao' | 'ecossistema'
  slug: string
  label: string
  title: string
  intro: string
  context: string
  status: string
  flow: [string, string, string]
  flowText: [string, string, string]
  detailTitle: string
  detail: string
  points: [string, string, string]
  note: string
}

export const footerPages: FooterPage[] = [
  {
    section: 'operacao', slug: 'pagamentos', label: 'Pagamentos',
    title: 'Da escolha do cliente ao pedido confirmado.',
    intro: 'Ofereça meios de pagamento que fazem sentido para o seu negócio e acompanhe a confirmação junto do pedido.',
    context: 'O pagamento precisa ser simples para quem compra e claro para quem opera. Pix, cartão e gateways podem compor o checkout conforme o plano e o provedor escolhido.',
    status: 'Conforme plano e provedor',
    flow: ['Cliente escolhe', 'Pagamento é processado', 'Pedido segue'],
    flowText: ['Os meios configurados aparecem no checkout.', 'O provedor recebe a transação e informa o resultado.', 'A equipe acompanha o status para preparar os próximos passos.'],
    detailTitle: 'Um checkout alinhado à sua operação',
    detail: 'A definição dos meios de pagamento considera o perfil de compra, as condições comerciais do provedor e a rotina de conciliação do negócio.',
    points: ['Meios e condições definidos na configuração', 'Status associado ao fluxo de pedidos', 'Ativação validada conforme plano e provedor'],
    note: 'A disponibilidade e as condições de cada meio dependem do plano, do provedor e da configuração contratada.',
  },
  {
    section: 'operacao', slug: 'frete-e-logistica', label: 'Frete e logística',
    title: 'A venda continua até a entrega.',
    intro: 'Organize regras de envio e dê sequência ao pedido com informações de frete, expedição e acompanhamento.',
    context: 'Uma boa experiência de entrega começa antes de fechar a compra. As regras de frete precisam refletir regiões atendidas, produtos, custos e prazos possíveis.',
    status: 'Sob configuração',
    flow: ['Frete é calculado', 'Pedido é preparado', 'Entrega é acompanhada'],
    flowText: ['O cliente vê as opções definidas para a sua operação.', 'A equipe reúne os dados para separar e despachar.', 'Os status ajudam a manter o atendimento informado.'],
    detailTitle: 'Regras que acompanham a realidade do negócio',
    detail: 'A operação pode ser estruturada com regras de envio e conexões a serviços como Melhor Envio e Correios, após validação técnica do projeto.',
    points: ['Regiões e condições de envio', 'Dados do pedido para expedição', 'Integrações avaliadas caso a caso'],
    note: 'Etiquetas, rastreio e serviços externos dependem da solução escolhida e da configuração validada.',
  },
  {
    section: 'operacao', slug: 'gestao-e-erp', label: 'Gestão e ERP',
    title: 'Menos redigitação. Mais controle do pedido.',
    intro: 'Aproxime loja, estoque e faturamento para que a rotina administrativa acompanhe o ritmo das vendas.',
    context: 'Quando cada sistema guarda uma parte da informação, a equipe perde tempo conferindo dados. Um projeto de integração define o que precisa circular entre loja e gestão.',
    status: 'Projeto personalizado',
    flow: ['Venda registrada', 'Dados compartilhados', 'Rotina conferida'],
    flowText: ['O pedido nasce na loja com seus itens e cliente.', 'As informações previstas no escopo seguem para o sistema de gestão.', 'Estoque, faturamento e documentos são revisados no fluxo definido.'],
    detailTitle: 'Integração começa pelo processo',
    detail: 'ERPs como o Bling e fluxos fiscais podem ser avaliados em projetos personalizados, respeitando as regras e os sistemas usados pelo negócio.',
    points: ['Mapeamento de dados e responsabilidades', 'Regras de estoque e faturamento', 'Validação dos fluxos antes da entrada em produção'],
    note: 'A conexão com ERP e emissão fiscal exige análise técnica e escopo específico.',
  },
  {
    section: 'operacao', slug: 'whatsapp', label: 'WhatsApp',
    title: 'A conversa faz parte da venda.',
    intro: 'Reúna atendimento, histórico e contexto do pedido para responder melhor e continuar o relacionamento.',
    context: 'O cliente pode começar uma conversa antes da compra e retomá-la depois. Com informações próximas da operação, a equipe entende melhor cada contato.',
    status: 'Disponível',
    flow: ['Contato chega', 'Equipe entende', 'Conversa continua'],
    flowText: ['O canal aproxima clientes e atendimento.', 'Histórico e contexto comercial ajudam na resposta.', 'Campanhas e automações podem apoiar a continuidade da relação.'],
    detailTitle: 'Atendimento com contexto',
    detail: 'Organize contatos, pedidos e comunicação em uma rotina comercial mais consistente, sem tratar cada mensagem como uma conversa isolada.',
    points: ['Histórico para apoiar o atendimento', 'Contexto de pedidos e clientes', 'Campanhas e automações na rotina comercial'],
    note: 'Os recursos disponíveis variam conforme o plano e a configuração da operação.',
  },
  {
    section: 'operacao', slug: 'dados-e-crescimento', label: 'Dados e crescimento',
    title: 'Decisões melhores começam com dados legíveis.',
    intro: 'Use a leitura de vendas e pedidos para entender a operação e planejar o próximo movimento.',
    context: 'Crescer pede mais do que contar pedidos. Organizar relatórios, conteúdo e medição ajuda a encontrar gargalos e avaliar o efeito das ações comerciais.',
    status: 'Recursos conforme plano',
    flow: ['Registrar', 'Interpretar', 'Ajustar'],
    flowText: ['Pedidos e vendas formam uma base de acompanhamento.', 'Relatórios ajudam a perceber padrões da operação.', 'A leitura orienta catálogo, campanhas e atendimento.'],
    detailTitle: 'Uma base para medir e evoluir',
    detail: 'A estrutura da loja permite cuidar de títulos, descrições e URLs. Projetos de medição com Google Analytics e Meta Pixel são avaliados conforme a necessidade.',
    points: ['Relatórios compatíveis com o plano', 'Estrutura de conteúdo para SEO', 'Medição de campanhas em evolução'],
    note: 'A implantação de eventos e conversões depende de validação específica; recursos de analytics estão em evolução.',
  },
  {
    section: 'ecossistema', slug: 'visao-geral', label: 'Visão geral',
    title: 'Uma operação conectada, do primeiro clique ao pós-venda.',
    intro: 'Loja, pedidos, clientes e comunicação reunidos em uma base que pode evoluir com o negócio.',
    context: 'A Elínea organiza o núcleo da venda online e abre espaço para as conexões necessárias em cada operação. O ponto de partida é entender como seu negócio vende hoje.',
    status: 'Plataforma e serviços',
    flow: ['Vitrine', 'Operação', 'Relacionamento'],
    flowText: ['O cliente encontra produtos e conclui a compra.', 'Catálogo, estoque e pedidos sustentam a rotina.', 'Atendimento e dados criam contexto para a próxima venda.'],
    detailTitle: 'As partes trabalham melhor juntas',
    detail: 'O ecossistema combina recursos da plataforma, serviços configuráveis e projetos personalizados. Cada conexão entra quando resolve uma necessidade real.',
    points: ['Loja e catálogo como ponto de partida', 'Pedidos e clientes próximos da operação', 'Integrações e migração planejadas'],
    note: 'A disponibilidade de recursos e conexões varia conforme plano, configuração e escopo do projeto.',
  },
  {
    section: 'ecossistema', slug: 'integracoes', label: 'Integrações',
    title: 'Conecte o que a sua operação precisa.',
    intro: 'Pagamentos, envio, gestão e comunicação entram no fluxo com escopo e disponibilidade claros.',
    context: 'Integração útil não é uma lista de logotipos. Ela define quais dados circulam, quando circulam e quem responde por cada etapa.',
    status: 'Disponibilidade variável',
    flow: ['Mapear sistemas', 'Definir fluxo', 'Validar conexão'],
    flowText: ['Identificamos as ferramentas e os dados importantes.', 'Documentamos eventos, regras e responsabilidades.', 'Testamos os pontos críticos antes do uso.'],
    detailTitle: 'Cada conexão no seu estágio',
    detail: 'WhatsApp está disponível. Pagamentos dependem do plano e do provedor; frete requer configuração; ERP e fiscal pedem projeto personalizado; analytics e Meta estão em evolução.',
    points: ['WhatsApp disponível', 'Pagamentos e frete sujeitos a configuração', 'ERP, fiscal e medição avaliados por projeto'],
    note: 'A existência de uma ferramenta na lista não significa ativação automática na sua loja.',
  },
  {
    section: 'ecossistema', slug: 'migracao', label: 'Migração',
    title: 'Mudar de plataforma sem perder o fio da operação.',
    intro: 'Planeje a transição da loja com atenção a catálogo, dados, integrações e jornada de compra.',
    context: 'Cada loja tem um histórico e processos que precisam continuar funcionando. Por isso, a migração começa com diagnóstico e escopo validado.',
    status: 'Escopo sob avaliação',
    flow: ['Diagnóstico', 'Preparação', 'Entrada no ar'],
    flowText: ['Mapeamos dados, integrações e regras existentes.', 'Organizamos a transferência e testamos fluxos críticos.', 'Revisamos domínio, redirecionamentos e compra antes da publicação.'],
    detailTitle: 'Uma transição planejada para a sua loja',
    detail: 'Produtos, clientes, pedidos, URLs e serviços conectados são avaliados segundo a plataforma de origem e as possibilidades técnicas da implantação.',
    points: ['Inventário do que precisa migrar', 'Testes de catálogo e jornada de compra', 'Cuidados com URLs e SEO'],
    note: 'Dados e integrações transferíveis são definidos após análise da plataforma de origem e do escopo contratado.',
  },
]

export const footerPagePath = (page: Pick<FooterPage, 'section' | 'slug'>) => `/${page.section}/${page.slug}`
