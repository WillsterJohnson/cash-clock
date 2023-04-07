<script lang="ts">
  import { cubicOut } from "svelte/easing";
  import type { Break } from "$lib/calendar.js";
  import IconButton from "$lib/components/IconButton.svelte";
  import IconSelect from "$lib/components/IconSelect.svelte";
  import { createEventDispatcher } from "svelte";
  import { scale, type TransitionConfig } from "svelte/transition";
  import { paramDelay } from "$lib/paramDelay.js";

  export let unpaid: Break;
  export let original: Break;

  const dispatch = createEventDispatcher<{ remove: never; input: Omit<Break, "id"> }>();

  const remove = () => dispatch("remove");

  const restore = () => {
    reason = original.reason;
    start = original.start;
    end = original.end;
  };

  let reason = unpaid.reason;
  let start = unpaid.start;
  let end = unpaid.end;

  $: unpaid = { reason, start, end, id: unpaid.id };

  $: dispatch("input", { reason, start, end });

  function scaleShrinkX(
    node: HTMLElement,
    params?: { delay?: number; duration?: number },
  ): TransitionConfig {
    const existingTransform = getComputedStyle(node).transform.replace("none", "");
    const existingTransition = getComputedStyle(node).transition;
    const existingWidth = getComputedStyle(node).width;

    return {
      delay: params?.delay ?? 0,
      duration: params?.duration ?? 400,
      easing: cubicOut,
      css(t) {
        if (t < 0.5) {
          return `
          transform: ${existingTransform} scale(0);
          transition: ${existingTransition}, width ${(params?.duration ?? 400) / 2}ms;
          width: calc(${existingWidth} * ${t * 2});
          `;
        } else {
          return `
          transform: ${existingTransform} scale(${t});
          transition: ${existingTransition};
          width: ${existingWidth};
          `;
        }
      },
    };
  }
</script>

<div
  class="break-controls flex-col"
  in:scaleShrinkX={paramDelay()}
  out:scaleShrinkX={paramDelay(2)}
>
  <IconSelect
    transitions={{
      function: scale,
      argument: {
        in: paramDelay(0.25),
        out: paramDelay(0.75),
      },
    }}
    bind:value={reason}
    options={{
      lunch: {
        icon: "restaurant",
        sr: "Lunch",
      },
      tea: {
        icon: "local_cafe",
        sr: "Tea",
      },
      dentist: {
        icon: "dentistry",
        sr: "Dentist",
      },
      doctors: {
        icon: "stethoscope",
        sr: "Doctors",
      },
      other: {
        icon: "question_mark",
        sr: "Other",
      },
    }}
  />
  <div class="time-controls flex-row" in:scale={paramDelay(0.5)} out:scale={paramDelay(0.5)}>
    <input type="time" bind:value={start} />
    <input type="time" bind:value={end} />
  </div>
  <div class="confirm-controls flex-row-jcsa">
    <div class="remove-break" in:scale={paramDelay(0.75)} out:scale={paramDelay(0.25)}>
      <IconButton on:click={remove} sr="Remove break">close</IconButton>
    </div>
    <div class="undo-change" in:scale={paramDelay(0.75)} out:scale={paramDelay(0.25)}>
      <IconButton on:click={restore} sr="Discard changes">undo</IconButton>
    </div>
  </div>
</div>

<style lang="scss">
  .break-controls {
    gap: 1vmin;
    transition: ease-in-out 0.2s;
  }
  .time-controls {
    input {
      width: 5rem;
      padding: 1vmin;
      border: none;
      margin: 0;
      color: inherit;
      font: inherit;
      padding: 1vmin;
      border-bottom: var(--foreground) 1px solid;
      background: var(--background-elevated);
      height: 2rem;
      text-align: center;
      &::-webkit-calendar-picker-indicator {
        display: none;
      }
      &:first-child {
        border-top-left-radius: 1vmin;
        padding-inline-end: 0;
      }
      &:last-child {
        border-top-right-radius: 1vmin;
        padding-inline-start: 0;
      }
    }
  }
  .confirm-controls {
    width: 100%;
  }
</style>
