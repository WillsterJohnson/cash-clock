<script lang="ts">
  import { Calendar, type Shift } from "$lib/calendar.js";
  import { onDestroy } from "svelte";

  const hour12 = {
    start: "07:45",
    end: "17:45",
    scheduledUnpaid: [
      {
        start: "13:00",
        end: "14:00",
      },
    ],
  } as Shift;
  Calendar.hourlyPay = 10.5;
  Calendar.setShiftPattern([[hour12, hour12, hour12, hour12, hour12, hour12, hour12]], new Date());

  const getTime = () => ~~(Date.currentTime.getTime() / 1000) % Date.daySeconds;

  const parseAngle = (ratio: number) => (360 - (ratio * 360 + 180)) % 360;

  const setRootHue = (hue = parseAngle(Date.now() / Date.minuteMillis)) =>
    document.documentElement.style.setProperty("--hue", `${Math.abs(hue) % 360}`);

  let earnings = Calendar.earningsNow();

  let currency = Calendar.currency;

  let time = getTime();
  $: seconds = time % Date.minuteSeconds;
  $: minutes = ~~(time / Date.minuteSeconds) % Date.hourMinutes;
  $: hours = (~~(time / Date.hourSeconds) % Date.dayHours) /* adjust for zero-index */ + 1;

  const fastInterval = setInterval(() => {
    setRootHue();
  }, 200);
  const midInterval = setInterval(() => {
    time = getTime();
    earnings = Calendar.earningsNow();
  }, 500);
  const slowInterval = setInterval(() => {
    currency = Calendar.currency;
  }, 1000);

  onDestroy(() => {
    clearInterval(fastInterval);
    clearInterval(midInterval);
    clearInterval(slowInterval);
    setRootHue(330);
  });
</script>

<div class="clockface">
  <div class="majorhour" />
  <div class="majorhour" />
  <div class="majorhour" />
  <div class="majorhour" />
  <div style="--rotation:{parseAngle(hours / 12)}deg" class="hours" />
  <div style="--rotation:{parseAngle(minutes / 60)}deg" class="minutes" />
  <div style="--rotation:{parseAngle(seconds / 60)}deg" class="seconds" />
  <div class="digital">
    <span>{hours.toString().padStart(2, "0")}</span>
    <span>{minutes.toString().padStart(2, "0")}</span>
  </div>
</div>
<div class="pay">
  <span class="currency">{currency}</span>
  <span class="count">
    <span class="whole">
      {earnings.toFixed(0)}
    </span>
    <span class="fraction">
      {earnings.toFixed(Calendar.currencyPrecision).split(".")[1] ?? ""}
    </span>
  </span>
</div>

<style lang="scss">
  .clockface {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90vmin;
    aspect-ratio: 1;
    border-radius: 90vmin;
    background: var(--background-elevated);
    overflow: hidden;

    .majorhour,
    .hours,
    .minutes,
    .seconds {
      position: absolute;
      background: var(--foreground);
      border-radius: 100vmin;
      width: var(--x-size);
      height: var(--y-size);
      left: calc((90vmin - var(--x-size)) / 2);
      top: calc((90vmin - var(--y-size)) / 2);
    }
    .majorhour {
      --x-size: 0.5vmin;
      --y-size: 7vmin;
      transform-origin: 50% 50%;
      @for $i from 1 through 4 {
        &:nth-child(#{$i}) {
          @if ($i - 1) % 2 == 0 {
            transform: translate(
                calc(cos(#{$i * 90}deg) * (45vmin - var(--x-size))),
                calc(sin(#{$i * 90}deg) * (45vmin - var(--y-size)))
              )
              rotate(0deg);
          } @else {
            transform: translate(
                calc(cos(#{$i * 90}deg) * (45vmin - var(--y-size))),
                calc(sin(#{$i * 90}deg) * (45vmin - var(--x-size)))
              )
              rotate(90deg);
          }
        }
      }
    }
    .hours,
    .minutes,
    .seconds {
      box-shadow: 0 0 1vmin var(--background);
      transform: translate(
          calc(sin(var(--rotation)) * (max(var(--x-size), var(--y-size)) / 2)),
          calc(cos(var(--rotation)) * (max(var(--x-size), var(--y-size)) / 2))
        )
        rotate(calc(90deg - var(--rotation)));
    }
    .hours {
      --x-size: 18vmin;
      --y-size: 0.75vmin;
    }
    .minutes {
      --x-size: 28vmin;
      --y-size: 0.5vmin;
    }
    .seconds {
      --x-size: 38vmin;
      --y-size: 0.25vmin;
    }
    .digital {
      position: absolute;
      top: 42vmin;
      left: 64vmin;
      font-size: 4vmin;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      z-index: -1;
      span {
        margin-inline: 0.5vmin;
        padding: 0.5vmin;
        background: var(--background);
      }
    }
  }
  .pay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1.8);
    padding: 5vmin;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    text-shadow: 0 0 1vmin var(--background);
    .currency {
      font-size: 7vmin;
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
