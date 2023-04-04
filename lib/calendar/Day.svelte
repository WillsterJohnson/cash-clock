<script lang="ts">
  import { Calendar } from "$lib/calendar.js";
  import ShiftInfo from "./ShiftInfo.svelte";

  export let empty: boolean = false;
  export let dayNumber: number;
  export let weekday: number;
  export let weeknumber: number;
  export let date: Date;

  $: shift = Calendar.getShiftForDay(date);
</script>

{#if empty}
  <div class="day" data-weekday={weekday} data-weeknumber={weeknumber}>
    <span>{dayNumber}</span>
    <ShiftInfo info={shift} />
  </div>
{:else}
  <button class="day" data-weekday={weekday} data-weeknumber={weeknumber}>
    <span>{dayNumber}</span>
    <ShiftInfo info={shift} />
  </button>
{/if}

<style lang="scss">
  .day {
    padding-block: 1vmin;
    border-top: 1px solid var(--foreground-elevated);
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    container-type: inline-size;
    &:is(div) {
      color: var(--foreground-elevated-50);
    }
    &:not([data-weekday="0"]) {
      border-left: 1px solid var(--foreground-elevated);
    }
    &:is(button) {
      appearance: none;
      background: none;
      cursor: pointer;
      color: inherit;
      font: inherit;
      border: none;
      border-top: 1px solid var(--foreground-elevated);
      &:not([data-weekday="0"]) {
        border-left: 1px solid var(--foreground-elevated);
      }
      &:hover {
        background: var(--background-elevated);
      }
    }
  }
</style>
