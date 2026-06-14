<script lang="ts">
  import { callXrpc } from '$hatk/client'
  import { invalidateAll } from '$app/navigation'
  import { t } from '$lib/t'
  import EventList from '$lib/components/EventList.svelte'

  let { data } = $props()
  let confirmingDelete = $state<string | null>(null)
  let error = $state('')
  let copied = $state(false)

  async function copyProfileLink() {
    const url = `${data.siteUrl}/hi/${data.viewer?.handle}`
    await navigator.clipboard.writeText(url)
    copied = true
    setTimeout(() => (copied = false), 2000)
  }

  function rkey(uri: string) {
    return uri.split('/').pop()!
  }

  async function deleteEvent(uri: string) {
    try {
      await callXrpc('dev.hatk.deleteRecord', {
        collection: 'community.lexicon.calendar.event',
        rkey: rkey(uri),
      })
      confirmingDelete = null
      await invalidateAll()
    } catch (e: any) {
      error = e.message
    }
  }
</script>

<main>
  <div class="toolbar">
    <h1>{t('My events')}</h1>
    <a href="/events/new"><button class="primary">{t('+ Create event')}</button></a>
  </div>

  {#if data.viewer?.handle}
    <div class="share-bar">
      <span class="share-hint">{t('Share your events with others')}</span>
      <a class="share-link" href="/hi/{data.viewer.handle}">{data.siteUrl}/hi/{data.viewer.handle}</a>
      <button class="btn-small" onclick={copyProfileLink}>
        {copied ? t('Copied!') : t('Copy link')}
      </button>
    </div>
  {/if}

  {#if error}
    <p class="form-error">{error}</p>
  {/if}

  {#snippet cardActions(item: any)}
    <a href="/events/{rkey(item.uri)}"><button>{t('Edit')}</button></a>
    {#if confirmingDelete === item.uri}
      <button class="danger" onclick={() => deleteEvent(item.uri)}>{t('Confirm delete')}</button>
      <button onclick={() => confirmingDelete = null}>{t('Cancel')}</button>
    {:else}
      <button onclick={() => confirmingDelete = item.uri}>{t('Delete')}</button>
    {/if}
  {/snippet}

  <EventList events={data.events ?? []} showBadges {cardActions} />
</main>

<style>
  main {
    max-width: 680px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem;
  }

  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.75rem;
  }

  @media (max-width: 600px) {
    .toolbar {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .share-bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }

  .share-hint {
    font-size: 0.875rem;
    color: var(--muted);
  }

  .share-link {
    font-size: 0.875rem;
    color: var(--accent);
    word-break: break-all;
  }

  .form-error {
    margin-bottom: 1rem;
    font-size: 0.875rem;
    color: #dc2626;
  }

  .danger {
    color: #dc2626;
    border-color: #fca5a5;
  }

  .danger:hover:not(:disabled) {
    background: #fef2f2;
  }
</style>
