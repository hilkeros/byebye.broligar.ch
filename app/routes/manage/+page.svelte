<script lang="ts">
  import { enhance } from '$app/forms'
  import { t } from '$lib/t'

  let { data, form } = $props()
  let adding = $state(false)
</script>

<main>
  <h1>{t('Curated accounts')}</h1>
  <p class="hint">{t('Events from these accounts appear on the home page.')}</p>

  <section class="add-section">
    <h2>{t('Add account')}</h2>
    <form method="POST" action="?/add" use:enhance={() => {
      adding = true
      return async ({ update }) => { await update(); adding = false }
    }}>
      <div class="add-row">
        <input name="handle" type="text" placeholder="handle.bsky.social" required />
        <button type="submit" class="primary" disabled={adding}>
          {adding ? '…' : t('Add')}
        </button>
      </div>
      {#if form?.error}
        <p class="error">{form.error}</p>
      {/if}
    </form>
  </section>

  <section class="accounts-section">
    <h2>{t('Accounts')}</h2>
    {#if data.accounts.length === 0}
      <p class="empty">{t('No accounts yet.')}</p>
    {:else}
      <ul class="account-list">
        {#each data.accounts as account (account.did)}
          <li class="account-item">
            <div class="account-info">
              <a href="/hi/{account.handle}" class="account-handle">@{account.handle}</a>
              <span class="account-did">{account.did}</span>
            </div>
            <form method="POST" action="?/remove" use:enhance>
              <input type="hidden" name="did" value={account.did} />
              <button type="submit" class="danger">{t('Remove')}</button>
            </form>
          </li>
        {/each}
      </ul>
    {/if}
  </section>
</main>

<style>
  main {
    max-width: 680px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  h1 {
    font-family: var(--font-display);
    font-size: 2rem;
    margin-bottom: 0.25rem;
  }

  h2 {
    font-size: 1rem;
    font-weight: 700;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 1rem;
  }

  .hint {
    color: var(--muted);
    font-size: 0.9375rem;
    margin-bottom: 2rem;
  }

  .add-section {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.25rem 1.5rem;
    margin-bottom: 2rem;
  }

  .add-row {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .add-row input {
    flex: 1;
  }

  .error {
    color: #dc2626;
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }

  .accounts-section {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }

  .accounts-section h2 {
    padding: 1rem 1.5rem 0;
  }

  .empty {
    padding: 1rem 1.5rem 1.5rem;
    color: var(--muted);
    font-size: 0.9375rem;
  }

  .account-list {
    list-style: none;
  }

  .account-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.875rem 1.5rem;
    border-top: 1px solid var(--border);
  }

  .account-info {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: 0;
  }

  .account-handle {
    font-weight: 700;
    color: var(--accent);
    font-size: 0.9375rem;
  }

  .account-did {
    font-size: 0.75rem;
    color: var(--muted);
    font-family: var(--mono);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  button.danger {
    color: #dc2626;
    border-color: #fecaca;
    font-size: 0.875rem;
    padding: 0.35rem 0.75rem;
    white-space: nowrap;
  }

  button.danger:hover:not(:disabled) {
    background: #fee2e2;
    border-color: #dc2626;
  }
</style>
