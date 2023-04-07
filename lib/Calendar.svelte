<script lang="ts">
  import Day from "./calendar/Day.svelte";

  const enum Month {
    Jan = 0,
    Feb,
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
  export let month: number;

  const daysInMonth = (month: Month) =>
    month === Month.Feb
      ? 28 + +isLeapYear
      : [Month.Jan, Month.Mar, Month.May, Month.Jul, Month.Aug, Month.Oct, Month.Dec].includes(
          month,
        )
      ? 31
      : 30;

  const shiftByMonths = (month: Month, year: number, offset: number) => {
    const newMonth = month + offset;
    if (newMonth < 0) return [newMonth + 12, year - 1];
    else if (newMonth > 11) return [newMonth - 12, year + 1];
    else return [newMonth, year];
  };

  $: dayOfWeekFirstOfMonth = (() => {
    const dayNum = new Date(year, month, 1).getDay();
    return dayNum === 0 ? 7 : dayNum;
  })();

  $: isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  $: monthLength = daysInMonth(month);
</script>

<div class="month-view">
  {#each ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as day, i}
    {@const dayOfWeek = new Date().getDay()}
    {@const procDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek}
    {@const neededOffset = procDayOfWeek - (i + 1)}
    {@const shiftedDate = new Date(
      Date.currentTime.getFullYear(),
      Date.currentTime.getMonth(),
      Date.currentTime.getDate() - neededOffset,
    )}
    <div class="day-label flex-col {day}">
      {shiftedDate.toLocaleDateString("en-US", {
        weekday: "short",
      })}
    </div>
  {/each}

  {#each Array.from({ length: dayOfWeekFirstOfMonth - 1 }) as _, i}
    {@const [mm, yy] = shiftByMonths(month, year, -1)}
    <Day
      empty
      dayNumber={daysInMonth(mm) - (dayOfWeekFirstOfMonth - (i + 2))}
      weeknumber={0}
      year={yy}
      month={mm}
    />
  {/each}

  {#each Array.from({ length: monthLength }) as _, i}
    {@const [mm, yy] = shiftByMonths(month, year, 0)}
    <Day
      dayNumber={i + 1}
      weeknumber={Math.floor((i + (dayOfWeekFirstOfMonth - 1)) / 7)}
      year={yy}
      month={mm}
    />
  {/each}

  {#each Array.from({ length: 6 - ((dayOfWeekFirstOfMonth - 1 + monthLength - 1) % 7) }) as _, i}
    {@const [mm, yy] = shiftByMonths(month, year, 1)}
    <Day empty dayNumber={i + 1} weeknumber={5} year={yy} month={mm} />
  {/each}
</div>

<style lang="scss">
  .month-view {
    margin-block-start: 2.5vmin;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: min-content;
    height: min(80vh, 155vmin);
    border-radius: 2.5vmin;
    border: 1px solid var(--foreground-elevated);
    overflow: hidden;
    text-align: center;
  }
  .day-label {
    height: 2rem;
    &:not(.mon) {
      border-left: 1px solid var(--foreground-elevated);
    }
  }
</style>
