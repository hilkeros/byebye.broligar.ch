<script lang="ts">
  import { t } from '$lib/t'
  import EventList from '$lib/components/EventList.svelte'

  let { data } = $props()
</script>

<main>
  <a href="/" class="back-link">{t('← Back')}</a>
  <h1>@{data.handle}</h1>
  <EventList events={data.events ?? []} showBadges />
</main>

<style>
  main {
    max-width: 680px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem;
  }

  .back-link {
    font-size: 0.875rem;
    color: var(--muted);
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-top: 1rem;
    margin-bottom: 1.75rem;
  }
</style>
