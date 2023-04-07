<script lang="ts">
  import Icon from "./Icon.svelte";

  export let sr: string;
  export let size: "small" | "normal" | "large" = "normal";
</script>

<button on:click aria-label={sr} class={size}>
  <Icon>
    <slot />
  </Icon>
</button>

<style lang="scss">
  button {
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
  button {
    cursor: pointer;
  }
  .small {
    transform: scale(0.75);
  }
  .large {
    transform: scale(1.25);
  }
</style>
