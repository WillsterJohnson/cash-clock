<script lang="ts">
  import { goto } from "$app/navigation";
  import IconButton from "$lib/components/IconButton.svelte";
  import Settings from "$lib/Settings.svelte";
  import { onDestroy } from "svelte";
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
      icon: "timer",
      navigate: "/clock",
    },
  } as const;

  let settings = false;
  $: clockCalendar = (
    data.pathname.startsWith("/clock") ? "clock" : "calendar"
  ) as keyof typeof clockCalendarOptions;

  const setRootHue = () => {
    const docElementHue = +document.documentElement.style.getPropertyValue("--hue").split("deg")[0];
    if (isNaN(docElementHue)) {
      document.documentElement.style.setProperty("--hue", "0deg");
      setRootHue();
      return;
    }
    const newHue = (docElementHue + 2) % 360;
    document.documentElement.style.setProperty("--hue", `${newHue}deg`);
  };

  const interval = setInterval(setRootHue, 400);
  onDestroy(() => clearInterval(interval));
</script>

<div class="settings-toggle">
  <IconButton
    on:click={() => (settings = !settings)}
    sr={settings ? "Close settings" : "Open settings"}
  >
    {settings ? "arrow_back" : "settings"}
  </IconButton>
</div>

<div class="clock-calendar-toggle">
  <IconButton
    on:click={() => goto(clockCalendarOptions[clockCalendar].navigate)}
    sr={clockCalendarOptions[clockCalendar].sr}
  >
    {clockCalendarOptions[clockCalendar].icon}
  </IconButton>
</div>

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
    top: 7vmin;
  }
  .settings-toggle {
    left: 5vmin;
    z-index: 200;
  }
  .clock-calendar-toggle {
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
