<script lang="ts">
  import { autoRepeat } from "$lib/autoRepeat.js";
  import { Calendar } from "$lib/calendar.js";
  import { onDestroy } from "svelte";

  const getTimeSeconds = () => ~~(Date.currentTime.getTime() / 1000) % Date.daySeconds;
  const getTimeMillis = () => Date.currentTime.getTime() % Date.dayMillis;

  const parseAngle = (ratio: number) => (360 - (ratio * 360 + 180)) % 360;

  let earnings = Calendar.earningsNow();
  $: procEarnings = earnings instanceof Error ? NaN : earnings;

  let currency = Calendar.currency;

  let time = getTimeSeconds();
  let seconds = (getTimeMillis() / 1000) % Date.minuteSeconds;
  $: minutes = ~~(time / Date.minuteSeconds) % Date.hourMinutes;
  $: hours = (~~(time / Date.hourSeconds) % Date.dayHours) /*adjust for zero-index*/ + 1;

  const fastInterval = autoRepeat(() => {
    seconds = (getTimeMillis() / 1000) % Date.minuteSeconds;
  }, 75);
  fastInterval.run();

  const midInterval = setInterval(() => {
    time = getTimeSeconds();
    earnings = Calendar.earningsNow();
  }, /* 500 */ 10_000);
  const slowInterval = setInterval(() => {
    currency = Calendar.currency;
  }, 1000);

  onDestroy(() => {
    fastInterval.active = false;
    clearInterval(midInterval);
    clearInterval(slowInterval);
  });
</script>

<div class="wrapper">
  <div class="clockface">
    {#each Array(12) as _}
      <div class="majorhour" />
    {/each}
    <div style="--rotation:{parseAngle(hours / 12)}deg" class="hours" />
    <div style="--rotation:{parseAngle(minutes / 60)}deg" class="minutes" />
    <div style="--rotation:{parseAngle(seconds / 60)}deg" class="seconds" />
    <div class="center" />
    <div class="digital">
      <span>{hours.toString().padStart(2, "0")}</span>
      <span>{minutes.toString().padStart(2, "0")}</span>
    </div>
  </div>
  <div class="pay" class:no-shift={isNaN(procEarnings)}>
    {#if isNaN(procEarnings)}
      <span class="icon">timer_off</span>
    {:else}
      <span class="currency">{currency}</span>
      <span class="count">
        <span class="whole">
          {procEarnings.toFixed(0)}
        </span>
        <span class="fraction">
          {procEarnings.toFixed(Calendar.currencyPrecision).split(".")[1] ?? ""}
        </span>
      </span>
    {/if}
  </div>
</div>

<style lang="scss">
  @use "sass:math";

  .wrapper {
    width: 90vmin;
    height: 90vmin;
    position: relative;
  }
  .clockface {
    border-radius: 90vmin;
    width: 90vmin;
    height: 90vmin;
    background: var(--background-elevated);

    .majorhour,
    .hours,
    .minutes,
    .seconds,
    .center {
      position: absolute;
      border-radius: 100vmin;
      width: var(--x-size);
      height: var(--y-size);
      left: calc((90vmin - var(--x-size)) / 2);
      top: calc((90vmin - var(--y-size)) / 2);
      z-index: 100;
    }
    .majorhour {
      --x-size: 0.2vmin;
      --y-size: 2vmin;
      background: var(--foreground-elevated);
      transform-origin: 50% 50%;
      @for $i from 1 through 12 {
        &:nth-of-type(#{$i}) {
          transform: translate(
              calc(cos(#{math.div($i * 360, 12)}deg) * (45vmin - var(--y-size) - 1vmin)),
              calc(sin(#{math.div($i * 360, 12)}deg) * (45vmin - var(--y-size) - 1vmin))
            )
            rotate(#{math.div(($i + 3) * 360, 12)}deg);
        }
      }
    }
    .hours,
    .minutes,
    .seconds {
      box-shadow: 0 0 0.5vmin var(--background);
      transform: translate(
          calc(sin(var(--rotation)) * (var(--x-size) / 2)),
          calc(cos(var(--rotation)) * (var(--x-size) / 2))
        )
        rotate(calc(90deg - var(--rotation)));
    }
    .hours {
      --x-size: 26vmin;
      --y-size: 5vmin;
      background: var(--colorful-elevated);
    }
    .minutes {
      --x-size: 39vmin;
      --y-size: 1vmin;
      background: var(--foreground-elevated);
    }
    .seconds {
      --x-size: 41vmin;
      --y-size: 0.2vmin;
      background: var(--colorful);
    }
    .center {
      --x-size: 2vmin;
      --y-size: 2vmin;
      background: var(--colorful);
    }
    .digital {
      position: absolute;
      --font-size: 5vmin;
      font-size: var(--font-size);
      top: calc(45vmin - var(--font-size) - 2vmin);
      left: calc(80vmin - var(--font-size) - 1vmin);
      border-radius: 100vmin;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      span {
        padding-inline: 1vmin;
        background: var(--background);
        &:first-child {
          padding-block-start: 1.5vmin;
        }
        &:last-child {
          padding-block-end: 1.5vmin;
        }
      }
    }
  }
  .pay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1.8);
    background: var(--background-dropped-50);
    border-radius: 100vmin;
    overflow: hidden;
    z-index: 100;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    &:not(.no-shift) {
      padding: 1vmin;
      padding-block-start: 1.5vmin;
      padding-block-end: 1.75vmin;
      padding-inline: 2.5vmin;
    }
    &.no-shift {
      width: 7vmin;
      padding-inline-end: 0.25vmin;
      aspect-ratio: 1/1;
    }
    .currency {
      font-size: 6vmin;
    }
    .count {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      .whole {
        font-size: 5vmin;
      }
      .fraction {
        margin-block-start: 4vmin;
        padding-inline-start: 0.5vmin;
        font-size: 3vmin;
      }
    }
  }
</style>
