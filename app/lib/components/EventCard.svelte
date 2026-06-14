<script lang="ts">
  import type { Snippet } from 'svelte'
  import { locationInfo, formatDateRange, modeLabel, statusLabel } from '$lib/events'

  let { item, showBadges = false, actions }: {
    item: any
    showBadges?: boolean
    actions?: Snippet
  } = $props()

  const ev = $derived(item.value)
  const loc = $derived(locationInfo(ev.locations))
</script>

<li class="event-card">
  <div class="event-header">
    <strong class="event-name">{ev.name}</strong>
    {#if showBadges}
      <div class="badges">
        {#if ev.mode}
          <span class="badge">{modeLabel(ev.mode)}</span>
        {/if}
        {#if ev.status}
          <span class="badge">{statusLabel(ev.status)}</span>
        {/if}
      </div>
    {/if}
  </div>
  {#if ev.description}
    <p class="event-description">{ev.description}</p>
  {/if}
  <div class="event-meta">
    {#if ev.startsAt}
      <span>{formatDateRange(ev.startsAt, ev.endsAt)}</span>
    {/if}
    {#if loc}
      <a class="event-location" href={loc.url} target="_blank" rel="noopener noreferrer">
        📍 {loc.label}
      </a>
    {/if}
  </div>
  {#if actions}
    <div class="event-actions">
      {@render actions()}
    </div>
  {/if}
</li>

<style>
  .event-card {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.125rem 1.25rem;
    transition: box-shadow 0.15s;
  }

  .event-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .event-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .event-name {
    font-size: 1rem;
    font-weight: 600;
  }

  .badges {
    display: flex;
    gap: 0.375rem;
    flex-shrink: 0;
  }

  .badge {
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
    background: var(--surface);
    color: var(--muted);
    border: 1px solid var(--border);
    white-space: nowrap;
  }

  .event-description {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: var(--muted);
    line-height: 1.5;
  }

  .event-meta {
    margin-top: 0.625rem;
    font-size: 0.8125rem;
    color: var(--muted);
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1rem;
  }

  .event-location {
    color: var(--muted);
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }

  .event-location:hover {
    color: var(--accent);
    text-decoration: underline;
  }

  .event-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.875rem;
  }

  .event-actions :global(button) {
    font-size: 0.8125rem;
    padding: 0.3rem 0.75rem;
  }
</style>
