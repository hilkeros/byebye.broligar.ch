<script lang="ts">
  import '../app.css'
  import { login, logout } from '$hatk/client'
  import { invalidateAll } from '$app/navigation'

  let { children, data } = $props()
  const viewer = $derived(data.viewer)

  let handle = $state('')
  let loading = $state(false)
  let error = $state('')
  let showLogin = $state(false)

  async function handleLogin() {
    if (!handle.trim()) return
    loading = true
    error = ''
    try {
      await login(handle)
    } catch (e: any) {
      error = e.message
    } finally {
      loading = false
    }
  }

  async function handleLogout() {
    await logout()
    await invalidateAll()
  }
</script>

<nav>
  <a href="/" class="site-title">bye bye broligarch</a>
  <div class="nav-right">
    {#if viewer}
      <a href="/my-events" class="nav-link">My events</a>
      <span class="viewer-handle">@{viewer.handle}</span>
      <button onclick={handleLogout}>Sign out</button>
    {:else}
      <button onclick={() => showLogin = !showLogin}>Sign in</button>
    {/if}
  </div>
</nav>

{#if showLogin && !viewer}
  <div class="login-bar">
    <form onsubmit={(e) => { e.preventDefault(); handleLogin() }} class="login-form">
      <input
        type="text"
        bind:value={handle}
        placeholder="your.handle"

      />
      <button type="submit" class="primary" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
      <button type="button" onclick={() => { showLogin = false; error = '' }}>Cancel</button>
    </form>
    {#if error}
      <p class="login-error">{error}</p>
    {/if}
  </div>
{/if}

{@render children()}

<style>
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.875rem 1.5rem;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .site-title {
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text);
    text-decoration: none;
  }

  .site-title:hover {
    color: var(--accent);
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .nav-link {
    font-size: 0.875rem;
    color: var(--muted);
    text-decoration: none;
  }

  .nav-link:hover {
    color: var(--accent);
  }

  .viewer-handle {
    font-size: 0.875rem;
    color: var(--muted);
  }

  .login-bar {
    padding: 0.75rem 1.5rem;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
  }

  .login-form {
    display: flex;
    gap: 0.5rem;
    max-width: 480px;
    margin: 0 auto;
  }

  .login-form input {
    flex: 1;
  }

  .login-error {
    font-size: 0.8125rem;
    color: #dc2626;
    margin-top: 0.5rem;
    text-align: center;
  }
</style>
