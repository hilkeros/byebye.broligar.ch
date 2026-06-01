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

  // Location
  type Address = {
    $type: 'community.lexicon.location.address'
    street?: string
    locality?: string
    region?: string
    country: string
    name?: string
  }
  let locationQuery = $state('')
  let locationResults: any[] = $state([])
  let locationSearching = $state(false)
  let showDropdown = $state(false)
  let selectedLocation: Address | null = $state(null)
  let searchTimeout: ReturnType<typeof setTimeout> | null = null

  async function searchLocation() {
    if (searchTimeout) clearTimeout(searchTimeout)
    if (!locationQuery.trim()) {
      locationResults = []
      showDropdown = false
      return
    }
    searchTimeout = setTimeout(async () => {
      locationSearching = true
      try {
        const res = await fetch(`/api/geocoding?q=${encodeURIComponent(locationQuery)}`)
        locationResults = res.ok ? await res.json() : []
        showDropdown = locationResults.length > 0
      } finally {
        locationSearching = false
      }
    }, 300)
  }

  function pickLocation(result: any) {
    const addr = (result.address ?? {}) as Record<string, string>
    const road = addr.road ?? ''
    const houseNumber = addr.house_number ?? ''
    const street = road ? (houseNumber ? `${road} ${houseNumber}` : road) : ''
    const locality = addr.city ?? addr.town ?? addr.village ?? addr.municipality ?? addr.hamlet ?? ''
    const region = addr.state ?? addr.county ?? ''
    const country = (addr.country_code ?? '').toUpperCase()

    if (!country) return // country is required by the lexicon
    const venueName = addr.name ?? ''
    selectedLocation = {
      $type: 'community.lexicon.location.address',
      country,
      ...(street && { street }),
      ...(locality && { locality }),
      ...(region && { region }),
      ...(venueName && { name: venueName }),
    }
    locationQuery = result.display_name
    showDropdown = false
  }

  function clearLocation() {
    selectedLocation = null
    locationQuery = ''
    locationResults = []
  }

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
          ...(selectedLocation ? { locations: [selectedLocation] } : {}),
          createdAt: new Date().toISOString(),
        },
      })
      await goto('/my-events')
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

    <div class="location-field">
      <span class="label-text">Location</span>
      <div class="location-input-wrap">
        <input
          type="text"
          bind:value={locationQuery}
          oninput={searchLocation}
          onblur={() => setTimeout(() => (showDropdown = false), 150)}
          placeholder="Search for a place…"
          class:has-selection={!!selectedLocation}
        />
        {#if locationSearching}
          <span class="location-spinner">…</span>
        {/if}
        {#if selectedLocation}
          <button type="button" class="clear-btn" onclick={clearLocation} aria-label="Clear location">×</button>
        {/if}
        {#if showDropdown}
          <ul class="location-dropdown">
            {#each locationResults as result (result.place_id)}
              <li>
                <button
                  type="button"
                  onmousedown={() => pickLocation(result)}
                >
                  {result.display_name}
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
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
  }

  .required {
    color: #dc2626;
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  /* Location */
  .location-field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .location-input-wrap {
    position: relative;
  }

  .location-input-wrap input {
    padding-right: 2rem;
  }

  .location-spinner,
  .clear-btn {
    position: absolute;
    right: 0.6rem;
    top: 50%;
    transform: translateY(-50%);
  }

  .location-spinner {
    color: var(--muted);
    font-size: 0.875rem;
    pointer-events: none;
  }

  .clear-btn {
    background: none;
    border: none;
    color: var(--muted);
    font-size: 1.1rem;
    line-height: 1;
    padding: 0.2rem 0.25rem;
    cursor: pointer;
    border-radius: 4px;
  }

  .clear-btn:hover {
    color: var(--text);
    background: var(--surface);
  }

  .location-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    list-style: none;
    z-index: 10;
    overflow: hidden;
  }

  .location-dropdown li button {
    width: 100%;
    text-align: left;
    padding: 0.6rem 0.875rem;
    font-size: 0.875rem;
    border: none;
    border-radius: 0;
    background: none;
    color: var(--text);
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .location-dropdown li button:hover {
    background: var(--surface);
  }

  .location-dropdown li + li {
    border-top: 1px solid var(--border);
  }

  .form-error {
    font-size: 0.875rem;
    color: #dc2626;
  }
</style>
