<script lang="ts">
  import { Calendar } from "$lib/calendar.js";
  import ShiftEditor from "./ShiftEditor.svelte";
  import ShiftInfo from "./ShiftInfo.svelte";

  export let empty: boolean = false;
  export let dayNumber: number;
  export let weeknumber: number;
  export let year: number;
  export let month: number;

  $: date = new Date(year, month, dayNumber);
  $: weekday = date.getDay() === 0 ? 7 : date.getDay();
  $: today = date.asDay().getTime() === Date.today().getTime();
  $: shift = Calendar.getShiftForDay(date);

  let open = false;
</script>

{#if empty}
  <div
    class="day"
    data-weekday={weekday}
    data-weeknumber={weeknumber}
    data-date={date.toDateString()}
  >
    <span>{dayNumber}</span>
    <ShiftInfo info={shift} />
  </div>
{:else}
  <button
    class="day"
    class:today
    data-weekday={weekday}
    data-weeknumber={weeknumber}
    data-date={date.toDateString()}
    on:click={() => (open = true)}
  >
    <span>{dayNumber}</span>
    <ShiftInfo info={shift} />
  </button>
  <ShiftEditor {date} {shift} bind:open />
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
    &:not([data-weekday="1"]) {
      border-left: 1px solid var(--foreground-elevated);
    }
    &:is(button) {
      background: var(--background-elevated-50);
      appearance: none;
      background: none;
      cursor: pointer;
      color: inherit;
      font: inherit;
      border: none;
      border-top: 1px solid var(--foreground-elevated);
      &:not([data-weekday="1"]) {
        border-left: 1px solid var(--foreground-elevated);
      }
      &:is(:hover, :focus-within) {
        background: var(--background-elevated);
      }
      &.today {
        background: var(--background-elevated);
        &:is(:hover, :focus-within) {
          background: var(--background-elevated-50);
        }
      }
    }
  }
</style>
