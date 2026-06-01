<script lang="ts">
  import { callXrpc } from '$hatk/client'
  import { invalidateAll } from '$app/navigation'

  let { data } = $props()
  const events = $derived(data.events ?? [])
  let confirmingDelete = $state<string | null>(null)
  let error = $state('')

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

  function locationInfo(locations: any[] | undefined): { label: string; url: string } | null {
    if (!locations?.length) return null
    const loc = locations[0]
    const venueName = loc.name && (loc.name.match(/,/g)?.length ?? 0) <= 2 ? loc.name : ''
    const label = [venueName, loc.street, loc.locality, loc.country]
      .filter(Boolean)
      .join(', ')
    if (!label) return null
    return {
      label,
      url: `https://maps.google.com/?q=${encodeURIComponent(label)}`,
    }
  }

  function formatDateRange(start: string | undefined, end: string | undefined): string | null {
    if (!start) return null
    const s = new Date(start)
    const startStr = s.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
    if (!end) return startStr
    const e = new Date(end)
    const sameDay = s.toDateString() === e.toDateString()
    const endStr = sameDay
      ? e.toLocaleTimeString(undefined, { timeStyle: 'short' })
      : e.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
    return `${startStr} – ${endStr}`
  }

  const STATUS_LABELS: Record<string, string> = {
    'community.lexicon.calendar.event#scheduled': 'Scheduled',
    'community.lexicon.calendar.event#planned': 'Planned',
    'community.lexicon.calendar.event#cancelled': 'Cancelled',
    'community.lexicon.calendar.event#postponed': 'Postponed',
    'community.lexicon.calendar.event#rescheduled': 'Rescheduled',
  }

  const MODE_LABELS: Record<string, string> = {
    'community.lexicon.calendar.event#inperson': 'In person',
    'community.lexicon.calendar.event#virtual': 'Virtual',
    'community.lexicon.calendar.event#hybrid': 'Hybrid',
  }
</script>

<main>
  <div class="toolbar">
    <h1>My events</h1>
    <a href="/events/new"><button class="primary">+ Create event</button></a>
  </div>

  {#if error}
    <p class="form-error">{error}</p>
  {/if}

  {#if events.length === 0}
    <p class="empty">You haven't created any events yet.</p>
  {:else}
    <ul class="event-list">
      {#each events as item (item.uri)}
        {@const ev = item.value}
        <li class="event-card">
          <div class="event-header">
            <strong class="event-name">{ev.name}</strong>
            <div class="badges">
              {#if ev.mode}
                <span class="badge">{MODE_LABELS[ev.mode] ?? ev.mode}</span>
              {/if}
              {#if ev.status}
                <span class="badge">{STATUS_LABELS[ev.status] ?? ev.status}</span>
              {/if}
            </div>
          </div>
          {#if ev.description}
            <p class="event-description">{ev.description}</p>
          {/if}
          <div class="event-meta">
            {#if ev.startsAt}
              <span>{formatDateRange(ev.startsAt, ev.endsAt)}</span>
            {/if}
            {#if locationInfo(ev.locations)}
              {@const loc = locationInfo(ev.locations)!}
              <a class="event-location" href={loc.url} target="_blank" rel="noopener noreferrer">
                📍 {loc.label}
              </a>
            {/if}
          </div>
          <div class="event-actions">
            <a href="/events/{rkey(item.uri)}"><button>Edit</button></a>
            {#if confirmingDelete === item.uri}
              <button class="danger" onclick={() => deleteEvent(item.uri)}>Confirm delete</button>
              <button onclick={() => confirmingDelete = null}>Cancel</button>
            {:else}
              <button onclick={() => confirmingDelete = item.uri}>Delete</button>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  {/if}
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

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .empty {
    color: var(--muted);
    font-size: 0.9375rem;
    padding: 2rem 0;
    text-align: center;
    border: 1px dashed var(--border);
    border-radius: var(--radius);
  }

  .event-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

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

  .event-actions button {
    font-size: 0.8125rem;
    padding: 0.3rem 0.75rem;
  }

  button.danger {
    color: #dc2626;
    border-color: #fca5a5;
  }

  button.danger:hover:not(:disabled) {
    background: #fef2f2;
  }

  .form-error {
    margin-bottom: 1rem;
    font-size: 0.875rem;
    color: #dc2626;
  }
</style>
