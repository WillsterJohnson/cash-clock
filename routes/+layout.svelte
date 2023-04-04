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
  <div class="width-limit" in:fade={{ duration: 300, delay: 350 }} out:fade={{ duration: 300 }}>
    <div class="page-wrap">
      <slot />
    </div>
  </div>
{/key}

<style lang="scss">
  :global(body) {
    overflow: hidden;
  }
  .width-limit {
    max-width: max(90vmin, 120vh);
    height: 100%;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .settings-toggle,
  .clock-calendar-toggle {
    position: absolute;
    border: none;
    color: var(--foreground);
    padding: 2vmin;
    border-radius: 100vmin;
    background: var(--background-elevated);
    cursor: pointer;
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
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 150;
  }

  .page-wrap {
    position: relative;
    margin: auto;
    width: 90vmin;
    height: 90vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    > :global(*) {
      width: 100%;
    }
  }
</style>
