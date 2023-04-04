<script lang="ts">
  import type { Shift } from "$lib/calendar.js";

  export let info: Shift | null;
</script>

{#if info}
  <div>
    <span>{info.start}</span>
    <span>{info.end}</span>
  </div>
{/if}

<style lang="scss">
  div {
    width: clamp(0px, 100%, 10vmin);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: clamp(0.688rem, 6.25cqmin + 0.563rem, 1.063rem);
    span {
      padding: 0.5vmin;
      &:first-child {
        margin-right: auto;
      }
      &:last-child {
        margin-left: auto;
      }
    }
  }
</style>
