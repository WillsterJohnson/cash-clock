<script lang="ts">
  import Day from "./calendar/Day.svelte";

  const enum Month {
    Jan = 1,
    Feb = 2,
    Mar = 3,
    Apr = 4,
    May = 5,
    Jun = 6,
    Jul = 7,
    Aug = 8,
    Sep = 9,
    Oct = 10,
    Nov = 11,
    Dec = 12,
  }

  export let year: number;
  export let month: `${number}`;

  const daysInMonth = (month: Month) =>
    month === Month.Feb
      ? 28 + +isLeapYear
      : [Month.Jan, Month.Mar, Month.May, Month.Jul, Month.Aug, Month.Oct, Month.Dec].includes(
          month,
        )
      ? 31
      : 30;

  const shiftByMonths = (month: Month, year: number, offset: number) => {
    const newMonth = month - 1 + offset;
    if (newMonth < 0) return [newMonth + 12, year - 1];
    else if (newMonth > 11) return [newMonth - 12, year + 1];
    else return [newMonth, year];
  };

  $: dayOfWeekFirstOfMonth = (() => {
    const dayNum = new Date(year, +month - 1, 1).getDay();
    return dayNum === 0 ? 7 : dayNum;
  })();

  $: isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  $: monthLength = daysInMonth(+month);
</script>

<div class="month-view">
  {#each ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as day}
    <div class="day-label {day.toLowerCase()}">{day}</div>
  {/each}

  {#each Array.from({ length: dayOfWeekFirstOfMonth - 1 }) as _, i}
    {@const [mm, yy] = shiftByMonths(+month, year, -1)}
    <Day
      empty
      dayNumber={daysInMonth(mm + 1) - (dayOfWeekFirstOfMonth - (i + 2))}
      weeknumber={0}
      year={yy}
      month={mm}
    />
  {/each}

  {#each Array.from({ length: monthLength }) as _, i}
    {@const [mm, yy] = shiftByMonths(+month, year, 0)}
    <Day
      dayNumber={i + 1}
      weeknumber={Math.floor((i + (dayOfWeekFirstOfMonth - 1)) / 7)}
      year={yy}
      month={mm}
    />
  {/each}

  {#each Array.from({ length: 6 - ((dayOfWeekFirstOfMonth - 1 + monthLength - 1) % 7) }) as _, i}
    {@const [mm, yy] = shiftByMonths(+month, year, 1)}
    <Day empty dayNumber={i + 1} weeknumber={5} year={yy} month={mm} />
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
