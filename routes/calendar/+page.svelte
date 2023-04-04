<script lang="ts">
  import CalendarUI from "$lib/Calendar.svelte";
  let year = Date.currentTime.getFullYear();
  let month: number | `${number}` = Date.currentTime.getMonth();

  const nextMonth = () => {
    if (+month === 12) {
      month = 1;
      year++;
    } else month = +month + 1;
  };
  const lastMonth = () => {
    if (+month === 1) {
      month = 12;
      year--;
    } else month = +month - 1;
  };
</script>

<CalendarUI bind:year bind:month />

<div class="calendar">
  <div class="options">
    <button class="nav left" on:click={lastMonth}>
      <span data-sr-only>Previous Month</span>
      <span class="icon">navigate_before</span>
    </button>

    <button class="nav right" on:click={nextMonth}>
      <span data-sr-only>Next Month</span>
      <span class="icon">navigate_next</span>
    </button>

    <div class="selector month">
      <label for="month" data-sr-only>Month</label>
      <select name="month" bind:value={month}>
        <option value="1">Jan</option>
        <option value="2">Feb</option>
        <option value="3">Mar</option>
        <option value="4">Apr</option>
        <option value="5">May</option>
        <option value="6">Jun</option>
        <option value="7">Jul</option>
        <option value="8">Aug</option>
        <option value="9">Sep</option>
        <option value="10">Oct</option>
        <option value="11">Nov</option>
        <option value="12">Dec</option>
      </select>
    </div>

    <div class="selector year">
      <label for="year" data-sr-only>Year</label>
      <input type="number" name="year" min="2000" max="3000" bind:value={year} />
    </div>
  </div>
</div>

<style lang="scss">
  input,
  select,
  button {
    border: none;
    margin: 0;
    color: inherit;
    font: inherit;
    font-size: 5vmin;
    padding: 1vmin;
    border-radius: 2vmin;
    background: var(--background-elevated-50);
    transition: 250ms ease;
    &:is(:hover, :focus-within) {
      outline: none;
      background: var(--background-elevated);
    }
  }
  input,
  select {
    height: 10vmin;
    width: 20vmin;
  }
  input[type="number"] {
    appearance: textfield;
  }

  .calendar {
    position: relative;
  }
  .nav {
    position: absolute;
    top: 0;
    &.left {
      left: 0;
    }
    &.right {
      right: 0;
    }
  }
</style>
