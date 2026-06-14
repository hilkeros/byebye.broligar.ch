<script lang="ts">
  import type { Snippet } from 'svelte'
  import EventCard from '$lib/components/EventCard.svelte'
  import { t } from '$lib/t'

  let { events, showBadges = false, cardActions }: {
    events: any[]
    showBadges?: boolean
    cardActions?: Snippet<[any]>
  } = $props()

  const now = new Date()
  const upcoming = $derived(
    events
      .filter((item) => !item.value.startsAt || new Date(item.value.startsAt) >= now)
      .sort((a, b) => {
        if (!a.value.startsAt) return 1
        if (!b.value.startsAt) return -1
        return new Date(a.value.startsAt).getTime() - new Date(b.value.startsAt).getTime()
      })
  )
  const past = $derived(
    events
      .filter((item) => item.value.startsAt && new Date(item.value.startsAt) < now)
      .sort((a, b) => new Date(b.value.startsAt).getTime() - new Date(a.value.startsAt).getTime())
  )
</script>

{#if upcoming.length === 0 && past.length === 0}
  <p class="empty">{t('No events yet.')}</p>
{/if}

{#if upcoming.length > 0}
  <section>
    <h2 class="section-heading">{t('Upcoming')}</h2>
    <ul class="event-list">
      {#each upcoming as item (item.uri)}
        {#snippet actions()}
          {@render cardActions?.(item)}
        {/snippet}
        <EventCard {item} {showBadges} actions={cardActions ? actions : undefined} />
      {/each}
    </ul>
  </section>
{/if}

{#if past.length > 0}
  <section class="past-section">
    <h2 class="section-heading">{t('Past')}</h2>
    <ul class="event-list past">
      {#each past as item (item.uri)}
        {#snippet actions()}
          {@render cardActions?.(item)}
        {/snippet}
        <EventCard {item} {showBadges} actions={cardActions ? actions : undefined} />
      {/each}
    </ul>
  </section>
{/if}

<style>
  .empty {
    color: var(--muted);
    font-size: 0.9375rem;
    padding: 3rem 0;
    text-align: center;
  }

  .section-heading {
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--muted);
    margin-bottom: 0.875rem;
  }

  .event-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .past-section {
    margin-top: 2rem;
  }

  .event-list.past :global(.event-card) {
    opacity: 0.6;
  }

  .event-list.past :global(.event-card:hover) {
    opacity: 1;
  }
</style>
