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

  $: dayOfWeekFirstOfMonth = (() => {
    const dayNum = new Date(year, +month - 1, 1).getDay();
    return dayNum === 0 ? 7 : dayNum;
  })();
  $: console.log(dayOfWeekFirstOfMonth);
  $: isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  $: monthLength = daysInMonth(+month);
</script>

<div class="month-view">
  {#each ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as day}
    <div class="day-label {day.toLowerCase()}">{day}</div>
  {/each}

  <!-- daysInMonth(+month - 1) -  -->
  {#each Array.from({ length: dayOfWeekFirstOfMonth - 1 }) as _, i}
    <Day
      empty
      dayNumber={daysInMonth(+month - 1) - (dayOfWeekFirstOfMonth - (i + 2))}
      weekday={i}
      weeknumber={0}
      {year}
      month={+month - 1}
    />
  {/each}

  {#each Array.from({ length: monthLength }) as _, i}
    <Day
      dayNumber={i + 1}
      weekday={((i + (dayOfWeekFirstOfMonth - 1)) % 7) + 1}
      weeknumber={Math.floor((i + (dayOfWeekFirstOfMonth - 1)) / 7)}
      {year}
      month={+month}
    />
  {/each}

  {#each Array.from({ length: 6 - ((dayOfWeekFirstOfMonth - 1 + monthLength - 1) % 7) }) as _, i}
    <Day empty dayNumber={i + 1} weekday={i + 1} weeknumber={5} {year} month={+month + 1} />
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
