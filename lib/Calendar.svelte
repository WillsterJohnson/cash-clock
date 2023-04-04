<script lang="ts">
  export let year: number;
  export let month: number | `${number}`;
  $: if (typeof month === "number") month = `${month}`;

  $: dayOfWeekFirstOfMonth = new Date(year, +month, 1).getDay();
  $: isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  $: daysInMonth = [
    /*jan*/ 0, /*mar*/ 2, /*may*/ 4, /*jul*/ 6, /*aug*/ 7, /*oct*/ 9, /*dec*/ 11,
  ].includes(+month)
    ? 31
    : month === /*feb*/ 1
    ? 28 + +isLeapYear
    : 30;
</script>

<style lang="scss"></style>
