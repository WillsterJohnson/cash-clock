<script lang="ts">
  import Settings from "$lib/settings.svelte";
  import { slide } from "svelte/transition";

  let settings = false;
</script>

<button class="settings-toggle" on:click={() => (settings = !settings)}>
  <span class="icon">{settings ? "arrow_back" : "settings"}</span>
</button>

<div class="settings-wrap">
  {#if settings}
    <div transition:slide>
      <Settings />
    </div>
  {/if}
</div>

<slot />

<style lang="scss">
  .settings-toggle {
    position: absolute;
    border: none;
    color: var(--foreground);
    top: 7vmin;
    left: 5vmin;
    padding: 2vmin;
    border-radius: 100vmin;
    z-index: 200;
    background: var(--background-elevated-50);
    transition: 250ms ease;
    cursor: pointer;
    &:is(:hover, :focus-within) {
      outline: none;
      background: var(--background-elevated);
    }
  }

  .settings-wrap {
    position: relative;
    z-index: 100;
  }
</style>
