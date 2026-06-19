<script lang="ts">
  import '../app.css'
  import { login, logout } from '$hatk/client'
  import { invalidateAll } from '$app/navigation'
  import { t } from '$lib/t'
  import { getLang, setLang } from '$lib/lang.svelte'

  let { children, data } = $props()
  const viewer = $derived(data.viewer)
  const isAdmin = $derived(data.isAdmin)

  // Keep lang in sync with server-provided value (e.g. on first load)
  $effect(() => { setLang(data.lang as 'en' | 'de') })

  let handle = $state('')
  let loading = $state(false)
  let error = $state('')
  let showLogin = $state(false)
  let showMenu = $state(false)

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
    showMenu = false
  }

  function switchLang(e: Event) {
    const next = (e.target as HTMLSelectElement).value as 'en' | 'de'
    document.cookie = `lang=${next}; path=/; max-age=31536000`
    setLang(next)
  }
</script>

<nav>
  <div class="nav-left">
    <a href="/" class="site-title">bye bye broligarch</a>
    <div class="nav-links desktop-only">
      {#if viewer}
        <a href="/my-events" class="nav-link">{t('My events')}</a>
      {/if}
      {#if isAdmin}
        <a href="/manage" class="nav-link">{t('Admin')}</a>
      {/if}
      <a href="/about" class="nav-link">{t('About us')}</a>
    </div>
  </div>
  <img src="/broli_gocarts.png" alt="Broli go-karts" class="nav-logo" />
  <div class="nav-right">
    <select class="lang-switch desktop-only" value={getLang()} onchange={switchLang}>
      <option value="en">EN</option>
      <option value="de">DE</option>
    </select>
    {#if viewer}
      <div class="nav-account desktop-only">
        <span class="viewer-handle">@{viewer.handle}</span>
        <button class="btn-small" onclick={handleLogout}>{t('Sign out')}</button>
      </div>
    {:else}
      <button class="desktop-only" onclick={() => showLogin = !showLogin}>{t('Sign in')}</button>
    {/if}
    <button class="hamburger mobile-only" onclick={() => showMenu = !showMenu} aria-label="Menu">
      {showMenu ? '✕' : '☰'}
    </button>
  </div>
  {#if showMenu}
    <div class="mobile-menu">
      {#if viewer}
        <a href="/my-events" class="mobile-menu-link" onclick={() => showMenu = false}>{t('My events')}</a>
      {/if}
      {#if isAdmin}
        <a href="/manage" class="mobile-menu-link" onclick={() => showMenu = false}>{t('Admin')}</a>
      {/if}
      <a href="/about" class="mobile-menu-link" onclick={() => showMenu = false}>{t('About us')}</a>
      <hr class="mobile-menu-divider" />
      {#if viewer}
        <span class="mobile-menu-handle">@{viewer.handle}</span>
        <button onclick={handleLogout}>{t('Sign out')}</button>
      {:else}
        <button onclick={() => { showMenu = false; showLogin = true }}>{t('Sign in')}</button>
      {/if}
      <select class="lang-switch" value={getLang()} onchange={(e) => { switchLang(e); showMenu = false }}>
        <option value="en">English</option>
        <option value="de">Deutsch</option>
      </select>
    </div>
  {/if}
</nav>

{#if showLogin && !viewer}
  <div class="login-bar">
    <p class="login-hint">{@html t('Sign in with your Atmosphere account. You can get one at {eurosky} or {bluesky}.', {
      eurosky: '<a href="https://eurosky.social" target="_blank" rel="noopener noreferrer">eurosky.social</a>',
      bluesky: '<a href="https://bsky.app" target="_blank" rel="noopener noreferrer">Bluesky</a>',
    })}</p>
    <form onsubmit={(e) => { e.preventDefault(); handleLogin() }} class="login-form">
      <input type="text" bind:value={handle} placeholder="your.handle" />
      <button type="submit" class="primary" disabled={loading}>
        {loading ? '…' : t('Sign in')}
      </button>
      <button type="button" class="cancel-link" onclick={() => { showLogin = false; error = '' }}>{t('Cancel')}</button>
    </form>
    {#if error}
      <p class="login-error">{error}</p>
    {/if}
  </div>
{/if}

<div class="tagline">{t('Meet real people. Build community. Without Big Tech.')}</div>

{@render children()}

<style>
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.875rem 1.5rem;
    min-height: 89px;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .site-title {
    font-family: var(--font-display);
    font-size: 1.4rem;
    letter-spacing: 0.02em;
    color: var(--text);
    text-decoration: none;
  }

  .site-title:hover {
    color: var(--accent);
  }

  .nav-logo {
    width: 200px;
    height: 89px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .nav-left {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }

  .nav-links {
    display: flex;
    gap: 1rem;
  }

  .nav-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
  }

  .nav-account {
    display: flex;
    align-items: center;
    gap: 0.5rem;
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
    font-size: 0.75rem;
    color: var(--muted);
  }

  .btn-small {
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
  }

  .lang-switch {
    font-size: 0.75rem;
    font-weight: 700;
    font-family: var(--font);
    color: var(--muted);
    padding: 0.2rem 0.5rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg);
    cursor: pointer;
    width: auto;
  }

  .lang-switch:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .hamburger {
    font-size: 1.25rem;
    padding: 0.4rem 0.7rem;
    line-height: 1;
  }

  .mobile-menu {
    display: none;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    z-index: 200;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }

  .mobile-menu-link {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--text);
    text-decoration: none;
  }

  .mobile-menu-handle {
    font-size: 0.875rem;
    color: var(--muted);
  }

  .mobile-menu-divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 0.25rem 0;
    width: 100%;
  }

  .mobile-menu button,
  .mobile-menu select {
    font-size: 0.875rem;
    padding: 0.35rem 0.75rem;
  }

  .tagline {
    text-align: center;
    padding: 0.75rem 1.5rem;
    font-size: 0.9375rem;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
    background: var(--surface);
  }

  .login-bar {
    padding: 0.75rem 1.5rem;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
  }

  .login-hint {
    font-size: 0.875rem;
    color: var(--muted);
    text-align: center;
    margin-bottom: 0.75rem;
  }

  .login-form {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    max-width: 480px;
    margin: 0 auto;
  }

  .login-form input {
    flex: 1;
  }

  .cancel-link {
    background: none;
    border: none;
    color: var(--muted);
    font-size: 0.875rem;
    font-weight: 400;
    padding: 0;
    text-decoration: underline;
    cursor: pointer;
  }

  .cancel-link:hover:not(:disabled) {
    color: var(--accent);
    background: none;
    transform: none;
  }

  @media (max-width: 600px) {
    .cancel-link {
      width: 100%;
      text-align: right;
    }
  }

  .login-error {
    font-size: 0.8125rem;
    color: #dc2626;
    margin-top: 0.5rem;
    text-align: center;
  }

  .mobile-only { display: none; }
  .desktop-only { display: flex; }

  @media (max-width: 600px) {
    nav {
      min-height: unset;
    }

    .nav-logo {
      position: static;
      transform: none;
      width: 120px;
      height: auto;
    }

    .mobile-only { display: flex; }
    .desktop-only { display: none; }
    .mobile-menu { display: flex; }
  }
</style>
