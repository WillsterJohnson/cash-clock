<script lang="ts">
  import Day from "./calendar/Day.svelte";

  const enum Month {
    Jan = 1,
    Feb = 2,
    Mar,
    Apr,
    May,
    Jun,
    Jul,
    Aug,
    Sep,
    Oct,
    Nov,
    Dec,
  }

  export let year: number;
  export let month: `${number}`;

  const daysInMonth = (month: number) =>
    month === Month.Feb
      ? 28 + +isLeapYear
      : [Month.Jan, Month.Mar, Month.May, Month.Jul, Month.Aug, Month.Oct, Month.Dec].includes(
          month,
        )
      ? 31
      : 30;

  $: dayOfWeekFirstOfMonth = new Date(year, +month - 1, 1).getDay();
  $: isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  $: monthLength = daysInMonth(+month);
</script>

<div class="month-view">
  {#each ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as day}
    <div class="day-label {day.toLowerCase()}">{day}</div>
  {/each}

  {#each Array.from({ length: dayOfWeekFirstOfMonth - 1 }) as _, i}
    <Day
      empty
      dayNumber={daysInMonth(+month - 2) - i}
      weekday={i}
      weeknumber={0}
      date={new Date(year, +month - 2, daysInMonth(+month - 1) - (dayOfWeekFirstOfMonth - 2 - i))}
    />
  {/each}

  {#each Array.from({ length: monthLength }) as _, i}
    <Day
      dayNumber={i + 1}
      weekday={(i + (dayOfWeekFirstOfMonth - 1)) % 7}
      weeknumber={Math.floor((i + (dayOfWeekFirstOfMonth - 1)) / 7)}
      date={new Date(year, +month - 1, i + 1)}
    />
  {/each}

  {#each Array.from({ length: 6 - ((dayOfWeekFirstOfMonth - 1 + monthLength - 1) % 7) }) as _, i}
    <Day
      empty
      dayNumber={i + 1}
      weekday={i + 1}
      weeknumber={5}
      date={new Date(year, +month - 1, monthLength + i + 1)}
    />
  {/each}
</div>

<style lang="scss">
  .month-view {
    margin-block-start: 2.5vmin;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: min-content;
    height: min(80vh, 180vmin);
    border-radius: 2.5vmin;
    border: 1px solid var(--foreground-elevated);
    overflow: hidden;
    text-align: center;
  }
  .day-label {
    padding-block: 1vmin;
    height: 5vmin;
    &:not(.mon) {
      border-left: 1px solid var(--foreground-elevated);
    }
  }
</style>
