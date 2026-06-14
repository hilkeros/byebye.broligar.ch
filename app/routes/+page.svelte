<script lang="ts">
  import EventList from '$lib/components/EventList.svelte'

  let { data } = $props()
</script>

<main>
  <EventList events={data.events ?? []} />
</main>

<style>
  main {
    max-width: 680px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem;
  }
</style>
