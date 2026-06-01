<script lang="ts">
  import { callXrpc } from '$hatk/client'
  import { goto } from '$app/navigation'

  let { data } = $props()

  let name = $state('')
  let description = $state('')
  let startsAt = $state('')
  let endsAt = $state('')
  let mode = $state('community.lexicon.calendar.event#inperson')
  let status = $state('community.lexicon.calendar.event#scheduled')
  let loading = $state(false)
  let error = $state('')

  async function handleSubmit() {
    if (!name.trim()) return
    loading = true
    error = ''

    try {
      await callXrpc('dev.hatk.createRecord', {
        collection: 'community.lexicon.calendar.event',
        repo: data.viewer!.did,
        record: {
          name: name.trim(),
          ...(description.trim() ? { description: description.trim() } : {}),
          ...(startsAt ? { startsAt: new Date(startsAt).toISOString() } : {}),
          ...(endsAt ? { endsAt: new Date(endsAt).toISOString() } : {}),
          mode,
          status,
          createdAt: new Date().toISOString(),
        },
      })
      await goto('/')
    } catch (e: any) {
      error = e.message
      loading = false
    }
  }
</script>

<main>
  <a href="/" class="back-link">← Back</a>
  <h1>Create event</h1>

  <div class="form">
    <label>
      <span class="label-text">Name <span class="required">*</span></span>
      <input type="text" bind:value={name} placeholder="Event name" />
    </label>

    <label>
      <span class="label-text">Description</span>
      <textarea bind:value={description} placeholder="What's this event about?" rows="4"></textarea>
    </label>

    <div class="row">
      <label>
        <span class="label-text">Starts at</span>
        <input type="datetime-local" bind:value={startsAt} />
      </label>
      <label>
        <span class="label-text">Ends at</span>
        <input type="datetime-local" bind:value={endsAt} />
      </label>
    </div>

    <div class="row">
      <label>
        <span class="label-text">Mode</span>
        <select bind:value={mode}>
          <option value="community.lexicon.calendar.event#inperson">In person</option>
          <option value="community.lexicon.calendar.event#virtual">Virtual</option>
          <option value="community.lexicon.calendar.event#hybrid">Hybrid</option>
        </select>
      </label>
      <label>
        <span class="label-text">Status</span>
        <select bind:value={status}>
          <option value="community.lexicon.calendar.event#scheduled">Scheduled</option>
          <option value="community.lexicon.calendar.event#planned">Planned</option>
        </select>
      </label>
    </div>

    {#if error}
      <p class="form-error">{error}</p>
    {/if}

    <button class="primary" onclick={handleSubmit} disabled={loading || !name.trim()}>
      {loading ? 'Creating…' : 'Create event'}
    </button>
  </div>
</main>

<style>
  main {
    max-width: 600px;
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

  .form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .label-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text);
  }

  .required {
    color: #dc2626;
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .form-error {
    font-size: 0.875rem;
    color: #dc2626;
  }
</style>
