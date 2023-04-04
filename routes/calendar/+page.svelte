<script lang="ts">
  import CalendarUI from "$lib/Calendar.svelte";
  let year = Date.currentTime.getFullYear();
  let month: `${number}` = (Date.currentTime.getMonth() + 1).toString();

  const nextMonth = () => {
    if (+month === 12) {
      month = "1";
      year++;
    } else month = (+month + 1).toString();
  };
  const lastMonth = () => {
    if (+month === 1) {
      month = "12";
      year--;
    } else month = (+month - 1).toString();
  };
</script>

<div class="calendar">
  <div class="options">
    <button class="nav left" on:click={lastMonth} aria-label="Previous Month">
      <span class="icon">navigate_before</span>
    </button>

    <div class="selector">
      <div class="month">
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
      <div class="year">
        <label for="year" data-sr-only>Year</label>
        <input type="number" name="year" min="2000" max="3000" bind:value={year} />
      </div>
    </div>

    <button class="nav right" on:click={nextMonth} aria-label="Next Month">
      <span class="icon">navigate_next</span>
    </button>
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
