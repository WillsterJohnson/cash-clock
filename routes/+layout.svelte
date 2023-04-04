<script lang="ts">
  import { goto } from "$app/navigation";
  import { autoRepeat } from "$lib/autoRepeat.js";
  import Settings from "$lib/Settings.svelte";
  import { fade, slide } from "svelte/transition";

  export let data;

  const clockCalendarOptions = {
    clock: {
      sr: "Change to calendar view",
      icon: "calendar_month",
      navigate: "/calendar",
    },
    calendar: {
      sr: "Change to clock view",
      icon: "schedule",
      navigate: "/clock",
    },
  } as const;

  let settings = false;
  $: clockCalendar = (
    data.pathname.startsWith("/clock") ? "clock" : "calendar"
  ) as keyof typeof clockCalendarOptions;

  const setRootHue = () =>
    document.documentElement.style.setProperty(
      "--hue",
      `${Math.abs(360 - ((Date.now() / Date.minuteMillis) * 360 + 180)) % 360}`,
    );

  const fastInterval = autoRepeat(setRootHue, 75);
  fastInterval.run();
</script>

<button class="settings-toggle" on:click={() => (settings = !settings)}>
  <span class="icon">{settings ? "arrow_back" : "settings"}</span>
</button>

<button
  class="clock-calendar-toggle"
  on:click={() => goto(clockCalendarOptions[clockCalendar].navigate)}
>
  <span data-sr-only>{clockCalendarOptions[clockCalendar].sr}</span>
  <span class="icon">{clockCalendarOptions[clockCalendar].icon}</span>
</button>

<div class="settings-wrap">
  {#if settings}
    <div transition:slide>
      <Settings />
    </div>
  {/if}
</div>

{#key data.pathname}
  <div class="page-wrap" in:fade={{ duration: 300, delay: 350 }} out:fade={{ duration: 300 }}>
    <slot />
  </div>
{/key}

<style lang="scss">
  .settings-toggle,
  .clock-calendar-toggle {
    position: absolute;
    border: none;
    color: var(--foreground);
    padding: 2vmin;
    border-radius: 100vmin;
    background: var(--background-elevated-50);
    transition: 250ms ease;
    cursor: pointer;
    &:is(:hover, :focus-within) {
      outline: none;
      background: var(--background-elevated);
    }
  }
  .settings-toggle {
    top: 7vmin;
    left: 5vmin;
    z-index: 200;
  }
  .clock-calendar-toggle {
    top: 7vmin;
    right: 5vmin;
    z-index: 100;
  }

  .settings-wrap {
    position: relative;
    z-index: 150;
  }

  .page-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90vmin;
    aspect-ratio: 1;
  }
</style>
