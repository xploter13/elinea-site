<script setup lang="ts">
import { CONSENT_KEY } from '~/utils/cookieConsent'
const { openPreferences } = useCookieConsent()
useSeoMeta({ title: 'Política de cookies — Elínea', description: 'Saiba como o site Elínea armazena suas preferências e gerencie suas escolhas de privacidade.' })
</script>

<template>
  <SiteLegalPage title="Política de cookies" intro="Você escolhe os usos opcionais e pode mudar de ideia. Aqui explicamos o que este site armazena no seu navegador.">
    <section>
      <h2>Cookies e armazenamento local</h2>
      <p>Cookies são pequenos registros que sites podem salvar no navegador. O armazenamento local, chamado localStorage, é outra forma de manter informações no dispositivo. As preferências deste site são guardadas no armazenamento local, sem enviar esse registro automaticamente a cada requisição.</p>
    </section>
    <section>
      <h2>O que utilizamos neste site</h2>
      <dl>
        <dt>Registro</dt><dd><code>{{ CONSENT_KEY }}</code></dd>
        <dt>Tipo e responsável</dt><dd>Armazenamento local do próprio site Elínea.</dd>
        <dt>Finalidade</dt><dd>Lembrar suas escolhas de privacidade, inclusive a recusa de usos opcionais.</dd>
        <dt>Conteúdo</dt><dd>Versão, categorias escolhidas e datas da escolha e expiração, sem dados do formulário.</dd>
        <dt>Validade</dt><dd>Até 180 dias. Após esse prazo, a preferência deixa de valer e o site solicita uma nova escolha.</dd>
      </dl>
      <p>Esse registro é necessário para respeitar suas escolhas. Não é usado para publicidade ou medição de audiência. A expiração é verificada pelo site; o registro também pode ser removido ao limpar os dados do navegador.</p>
    </section>
    <section>
      <h2>Análise e publicidade</h2>
      <p>Não há ferramentas de análise de audiência ou publicidade ativas nesta versão do site. As duas categorias começam desativadas. O painel permite registrar suas preferências; aceitar não instala ferramentas nem inicia rastreamento.</p>
      <p>Se forem adicionados novos serviços com essas finalidades, esta política e as informações de consentimento deverão ser atualizadas, com uma nova solicitação de escolha antes da ativação.</p>
    </section>
    <section>
      <h2>Altere ou revogue sua escolha</h2>
      <p>Abra as preferências, desmarque as categorias opcionais e salve, ou escolha “Rejeitar opcionais”. Você pode fazer isso a qualquer momento pelo botão abaixo ou por “Gerenciar cookies” no rodapé.</p>
      <button class="legal-action" type="button" @click="openPreferences">Gerenciar cookies</button>
      <p>As escolhas valem para este navegador e este site. Se você limpar os dados de navegação, trocar de navegador ou se o armazenamento estiver bloqueado, pode ser necessário escolher novamente. Quando o navegador impede a gravação, a escolha vale somente na visita atual.</p>
    </section>
    <section>
      <h2>Serviços externos</h2>
      <p>O checkout da Stripe, o painel e as páginas abertas por links possuem políticas e controles próprios. Este painel não altera cookies nesses ambientes. As fontes Inter são carregadas do próprio site, sem conexão ao Google Fonts.</p>
      <p>Para os dados informados na contratação e solicitações de direitos, consulte a <NuxtLink to="/privacidade#direitos">Política de privacidade</NuxtLink>.</p>
    </section>
  </SiteLegalPage>
</template>
