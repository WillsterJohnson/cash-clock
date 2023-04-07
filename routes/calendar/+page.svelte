<script lang="ts">
  import CalendarUI from "$lib/Calendar.svelte";
  import { BreakReason, Calendar, type Shift } from "$lib/calendar.js";
  import IconButton from "$lib/components/IconButton.svelte";
  let year = Date.currentTime.getFullYear();
  let month: number = Date.currentTime.getMonth();

  const whatAWayToMakeALivin = {
    start: "09:00",
    end: "17:00",
    scheduledUnpaid: [
      {
        start: "12:00",
        end: "13:00",
        reason: BreakReason.lunch,
        id: crypto.randomUUID(),
      },
    ],
  } as Shift;

  const CEOShifts = {
    start: "07:45",
    end: "17:45",
    scheduledUnpaid: [
      {
        start: "13:00",
        end: "14:00",
        reason: BreakReason.lunch,
        id: crypto.randomUUID(),
      },
    ],
  } as Shift;
  Calendar.setShiftPattern(
    [[CEOShifts, CEOShifts, CEOShifts, CEOShifts, CEOShifts, CEOShifts, CEOShifts]],
    new Date(2023, 1, 27),
  );
  const nextMonth = () => {
    if (month === 11) {
      month = 0;
      year++;
    } else month = month + 1;
  };
  const lastMonth = () => {
    if (+month === 0) {
      month = 11;
      year--;
    } else month = month - 1;
  };
</script>

<div class="calendar">
  <div class="options">
    <div class="nav left">
      <IconButton on:click={lastMonth} sr="Previous Month">navigate_before</IconButton>
    </div>

    <div class="selector">
      <div class="month">
        <label for="month" data-sr-only>Month</label>
        <select name="month" bind:value={month}>
          {#each Array(12) as _, i}
            <option value={i}>
              {new Date(0, i).toLocaleDateString("en-US", {
                month: "short",
              })}
            </option>
          {/each}
        </select>
      </div>
      <div class="year">
        <label for="year" data-sr-only>Year</label>
        <input type="number" name="year" min="2000" max="3000" bind:value={year} />
      </div>
    </div>

    <div class="nav right">
      <IconButton on:click={nextMonth} sr="Next Month">navigate_next</IconButton>
    </div>
  </div>
</div>

<CalendarUI bind:year bind:month />

<style lang="scss">
  input,
  select,
  button {
    border: none;
    margin: 0;
    color: inherit;
    font: inherit;
    padding: 1vmin;
    background: var(--background-elevated);
    cursor: pointer;
  }
  input,
  select {
    font-size: 5vmin;
    height: 10vmin;
  }
  input {
    width: 15vmin;
    appearance: textfield;
  }
  select {
    width: 15vmin;
  }
  button {
    border-radius: 100vmin;
    aspect-ratio: 1/1;
  }

  .options {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin: auto;
    width: 80%;
  }

  .selector {
    display: flex;
    flex-direction: row;
    > * {
      overflow: hidden;
    }
    .year {
      border-top-right-radius: 2vmin;
      border-bottom-right-radius: 2vmin;
    }
    .month {
      border-top-left-radius: 2vmin;
      border-bottom-left-radius: 2vmin;
    }
  }
</style>
