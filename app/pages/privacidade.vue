<script setup lang="ts">
const privacy = useRuntimeConfig().public.privacy
const complete = computed(() => [privacy.companyName, privacy.cnpj, privacy.address, privacy.cpfPurpose,
  privacy.providers, privacy.retention, privacy.internationalTransfers].every(value => value.trim()))
const contactUrl = computed(() => `mailto:${privacy.contactEmail}?subject=${encodeURIComponent('Privacidade e dados pessoais')}`)
useSeoMeta({ title: 'Política de privacidade — Elínea',
  description: 'Conheça os dados utilizados pelo site Elínea e os canais para exercer seus direitos.',
  robots: () => complete.value ? 'index, follow' : 'noindex, follow' })
</script>

<template>
  <SiteLegalPage title="Política de privacidade" intro="Informações sobre os dados utilizados neste site, suas finalidades e como falar com a Elínea sobre privacidade.">
    <p v-if="!complete" class="legal-note">Versão preliminar: os dados cadastrais do responsável, os prazos de retenção e os detalhes de fornecedores estão em confirmação. Para esclarecimentos, entre em contato pelo canal abaixo.</p>
    <section id="responsavel">
      <h2>Quem responde por este site</h2>
      <p>Esta política se aplica ao site institucional da Elínea e ao início da contratação de uma loja. O painel de administração, as lojas dos clientes e os serviços externos possuem fluxos de dados que devem ser considerados separadamente.</p>
      <dl>
        <dt>Responsável</dt><dd>{{ privacy.companyName || 'Elínea — identificação empresarial em confirmação' }}</dd>
        <template v-if="privacy.cnpj"><dt>CNPJ</dt><dd>{{ privacy.cnpj }}</dd></template>
        <template v-if="privacy.address"><dt>Endereço</dt><dd>{{ privacy.address }}</dd></template>
        <template v-if="privacy.officerName"><dt>Encarregado</dt><dd>{{ privacy.officerName }}</dd></template>
        <dt>Contato</dt><dd><a :href="contactUrl">{{ privacy.contactEmail }}</a></dd>
      </dl>
    </section>
    <section id="dados">
      <h2>Dados informados na contratação</h2>
      <p>Ao iniciar a contratação, você informa nome, e-mail, CPF do responsável, nome da loja e segmento. O telefone é opcional. Esses dados são enviados à API da Elínea para registrar a solicitação e dar continuidade à contratação e à preparação do acesso.</p>
      <p v-if="privacy.cpfPurpose">{{ privacy.cpfPurpose }}</p>
      <p v-else>A finalidade específica e a necessidade do CPF nesta etapa estão em confirmação. Você pode solicitar esclarecimentos antes de preencher o formulário pelo canal de contato desta política.</p>
      <p>O fluxo de contratação se relaciona à execução de contrato ou a procedimentos preliminares solicitados por você. Eventuais obrigações legais devem ser avaliadas conforme o uso efetivo dos dados. O envio do formulário não constitui autorização genérica para publicidade.</p>
    </section>
    <section id="navegacao">
      <h2>Navegação e preferências</h2>
      <p>O site salva suas preferências de cookies no armazenamento local do navegador por até 180 dias. O registro contém as categorias escolhidas, a versão e as datas da escolha e da expiração; não contém nome, e-mail ou CPF.</p>
      <p>Nesta versão, o site não incorpora ferramentas de análise de audiência ou pixels de publicidade. As fontes tipográficas são servidas pelo próprio site. Ao acessar um serviço online, informações técnicas como o endereço IP são comunicadas aos servidores envolvidos; o tratamento de registros da infraestrutura depende dos serviços utilizados.</p>
      <p>Consulte a <NuxtLink to="/cookies">Política de cookies</NuxtLink> para conhecer e alterar suas preferências.</p>
    </section>
    <section id="compartilhamento">
      <h2>Pagamento e serviços externos</h2>
      <p>O pagamento é concluído em uma página externa da Stripe. Este formulário não solicita número de cartão ou código de segurança. Os dados necessários à operação de pagamento são tratados no fluxo entre a Elínea e o provedor.</p>
      <p>Ao utilizar links de redes sociais, WhatsApp, e-mail ou painel, você passa a interagir com esses ambientes. As preferências deste site não controlam o armazenamento realizado por serviços externos.</p>
      <p v-if="privacy.providers">{{ privacy.providers }}</p>
      <p v-else>A relação completa de fornecedores de infraestrutura e comunicação e suas responsabilidades está em confirmação.</p>
      <p v-if="privacy.internationalTransfers">{{ privacy.internationalTransfers }}</p>
      <p v-else>As informações sobre localização do armazenamento e eventuais transferências internacionais estão em confirmação.</p>
    </section>
    <section id="retencao">
      <h2>Por quanto tempo os dados são mantidos</h2>
      <p v-if="privacy.retention">{{ privacy.retention }}</p>
      <p v-else>Os prazos e critérios de retenção dos dados de contratação, solicitações não concluídas, contatos e backups estão em confirmação. Solicite informações sobre o seu caso pelo canal de privacidade.</p>
      <p>A preferência de cookies expira após 180 dias ou pode ser alterada a qualquer momento. Limpar o armazenamento do navegador remove esse registro local. Isso não exclui os dados de contratação enviados à Elínea.</p>
    </section>
    <section id="direitos">
      <h2>Seus direitos e como fazer uma solicitação</h2>
      <p>Você pode solicitar confirmação do tratamento, acesso, correção, informações sobre compartilhamento e, nos casos previstos na LGPD, anonimização, bloqueio, eliminação e portabilidade. Também pode revogar consentimento ou apresentar oposição quando aplicável.</p>
      <p>Envie sua solicitação para <a :href="contactUrl">{{ privacy.contactEmail }}</a>, descrevendo o pedido e o e-mail utilizado no contato ou contratação. Não envie senha, dados de cartão ou documentos completos no primeiro contato. A verificação de identidade pode ser necessária para proteger os dados contra acesso indevido.</p>
      <p>A eliminação está sujeita às hipóteses legais de conservação. Se sua solicitação não for resolvida junto ao responsável, você pode recorrer aos canais da <a href="https://www.gov.br/anpd/pt-br/canais_atendimento/cidadao-titular-de-dados" target="_blank" rel="noopener noreferrer">ANPD</a>.</p>
    </section>
    <section>
      <h2>Atualizações desta política</h2>
      <p>Esta política deve acompanhar as mudanças nos serviços e no tratamento de dados. A data de atualização aparece no início da página. Novas finalidades que dependam de consentimento exigem uma nova escolha informada.</p>
    </section>
  </SiteLegalPage>
</template>
