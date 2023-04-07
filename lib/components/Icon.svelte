<script lang="ts">
  export let sr: string | undefined = undefined;
  export let bg = false;
</script>

{#if sr}
  <span data-sr-only>{sr}</span>
{/if}

{#if bg}
  <div data-button>
    <span class="icon">
      <slot />
    </span>
  </div>
{:else}
  <span class="icon">
    <slot />
  </span>
{/if}

<style lang="scss">
  div {
    border: none;
    width: 3rem;
    aspect-ratio: 1/1;
    border-radius: 100vmin;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
  }
</style>
