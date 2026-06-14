<script lang="ts">
  import { t } from '$lib/t'
</script>

<main>
  <h1>{t('About us')}</h1>
  <div class="content">
    <p>{@html t("This is supposed to be about us, but for now it mainly an experiment by me, {hilke}. It is a website that I built to help my musical peers escape big tech social media but stil stay connected.", {
      hilke: '<a href="https://hilk.eu" target="_blank" rel="noopener noreferrer">Hilke</a>',
    })}</p>
    <p>{t("It is a curated list of events for our music community, but the data is not locked into a database of this website. It is built on an open and interoperable system, called the Atmosphere.")}</p>
    <p>{@html t("You can create your own events if you log in with what we call an {atmoaccount}. It is one account for an ecosystem of many apps, and you can get one at {eurosky} or {bluesky}, for instance. The events will also show up on other event apps of the Atmosphere, like {atmo} and {smokesignal}.", {
      atmoaccount: '<a href="https://atmosphereaccount.com/" target="_blank" rel="noopener noreferrer">Atmosphere account</a>',
      eurosky: '<a href="https://eurosky.social" target="_blank" rel="noopener noreferrer">Eurosky</a>',
      bluesky: '<a href="https://bsky.app" target="_blank" rel="noopener noreferrer">Bluesky</a>',
      atmo: '<a href="https://atmo.rsvp" target="_blank" rel="noopener noreferrer">atmo.rsvp</a>',
      smokesignal: '<a href="https://smokesignal.events" target="_blank" rel="noopener noreferrer">smokesignal.events</a>',
    })}</p>
    <p>{t("Right now the events on the homepage are curated to a selection of accounts, but please reach out to byebye@broligar.ch if you think your events should be included.")}</p>
    <p>{t("I want this website to be shaped by our community. And if you stop liking what I do, I don't own your event data. You keep them and you can build something different with it on your own.")}</p>
  </div>
</main>

<style>
  main {
    max-width: 680px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem;
  }

  h1 {
    font-family: var(--font-display);
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  .content {
    font-size: 1rem;
    line-height: 1.75;
    color: var(--text);
  }

  .content :global(p + p) {
    margin-top: 1.25rem;
  }
</style>
