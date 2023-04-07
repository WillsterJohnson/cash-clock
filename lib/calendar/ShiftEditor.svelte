<script lang="ts">
  import { BreakReason, type Empty, type Shift } from "$lib/calendar.js";
  import Icon from "$lib/components/Icon.svelte";
  import IconButton from "$lib/components/IconButton.svelte";
  import { deepClone } from "$lib/deepClone.js";
  import { fade, scale } from "svelte/transition";
  import BreakControls from "./BreakControls.svelte";
  import { paramDelay } from "$lib/paramDelay.js";

  export let date: Date;
  export let shift: Shift | Empty;
  export let open: boolean;

  let show: "ui" | "confirmed" | "reroll" = "ui";
  const flash = (to: typeof show) => {
    show = to;
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        show = "ui";
        resolve();
      }, 800);
    });
  };

  $: localShift = deepClone(shift);

  const close = () => {
    open = false;
    setTimeout(ui, 500);
    localShift = deepClone(shift);
  };
  const save = () => {
    flash("confirmed");
    shift = deepClone(localShift);
  };
  const reroll = () => {
    // if no change (check via json string parse) no ask, just close
    show = "reroll";
  };
  const ui = () => (show = "ui");

  const removeScheduled = (index: number) =>
    (localShift.scheduledUnpaid = localShift.scheduledUnpaid.filter((_, i) => i !== index));

  const addScheduled = () => {
    localShift.scheduledUnpaid = [
      ...localShift.scheduledUnpaid,
      {
        start: "00:00",
        end: "00:00",
        reason: BreakReason.lunch,
        id: crypto.randomUUID(),
      },
    ];
    setTimeout(() => {
      breaksList.lastElementChild?.scrollIntoView({
        behavior: "smooth",
        inline: "start",
      });
    }, 250);
  };

  let breaksList: HTMLDivElement;
</script>

{#if open}
  <div class="backdrop" transition:fade>
    <dialog {open}>
      <div class="top-left">
        <IconButton on:click={reroll} sr="Close shift editor">close</IconButton>
      </div>
      {#if show === "ui"}
        <div class="top-right" in:scale={paramDelay(1.5)} out:scale={paramDelay(0.5)}>
          <IconButton on:click={save} sr="Save changes">save</IconButton>
        </div>
        <div class="main-ui" in:fade={paramDelay(1)} out:fade={paramDelay()}>
          <span class="date">
            {date.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            })}
          </span>
          {#if !Object.isEmpty(localShift)}
            <div class="shift-controls">
              <div class="start-end">
                <span class="start">{localShift.start}</span>
                <span class="to">-</span>
                <span class="end">{localShift.end}</span>
              </div>
              <div class="breaks-container flex-row-jcsb">
                <div
                  bind:this={breaksList}
                  class="breaks flex-row-jcs"
                  class:scroll={localShift.scheduledUnpaid.length}
                >
                  {#each localShift.scheduledUnpaid as unpaid, index (unpaid.id)}
                    <BreakControls
                      {unpaid}
                      original={shift.scheduledUnpaid[index]}
                      on:remove={() => removeScheduled(index)}
                      on:input={(e) => {
                        localShift.scheduledUnpaid[index].end = e.detail.end;
                        localShift.scheduledUnpaid[index].start = e.detail.start;
                        localShift.scheduledUnpaid[index].reason = e.detail.reason;
                      }}
                    />
                  {/each}
                </div>
                <div class="add-break flex-col" transition:scale>
                  <IconButton sr="Add break" size="large" on:click={addScheduled}>add</IconButton>
                </div>
              </div>
            </div>
          {/if}
        </div>
      {:else if show === "confirmed"}
        <div class="flashed flex-col" in:fade={paramDelay(1)} out:fade={paramDelay()}>
          <Icon>check</Icon>
        </div>
      {:else if show === "reroll"}
        <div class="top-left">
          <IconButton on:click={ui} sr="Go back">arrow_back</IconButton>
        </div>
        <div class="flashed flex-col" in:fade={paramDelay(1)} out:fade={paramDelay()}>
          <div>
            <Icon>save</Icon>
          </div>
          <div class="flex-row">
            <IconButton on:click={close} sr="Discard changes">close</IconButton>
            <IconButton
              on:click={async () => {
                save();
                await flash("confirmed");
                close();
              }}
              sr="Save changes"
            >
              check
            </IconButton>
          </div>
        </div>
      {/if}
    </dialog>
  </div>
{/if}

<style lang="scss">
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }
  dialog {
    position: absolute;
    transform: translate(0%, 100%);
    z-index: 1000;
    border: none;
    color: var(--foreground-elevated);
    background: var(--background);
    width: 80vmin;
    height: 30vh;
    border-radius: 5vmin;
    padding: 1.5rem;
    cursor: auto;
  }
  .top-left,
  .top-right {
    position: absolute;
    top: 2.5vmin;
  }
  .top-left {
    left: 2.5vmin;
  }
  .top-right {
    right: 2.5vmin;
  }

  .flashed {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    gap: 2vmin;
    .flex-row {
      gap: 2vmin;
    }
  }

  .breaks {
    margin-block-start: 1vmin;
    padding-block-end: 1vmin;
    position: relative;
    width: calc(100% - 3.75rem);
    overflow: hidden;
    scrollbar-color: var(--foreground) var(--background-elevated);
    scrollbar-width: thin;
    :global(> *) {
      transition: margin 0.2s ease-in-out;
      margin-inline: 1.5vmin;
    }
    :global(> :last-child) {
      margin-inline-end: 3vmin;
    }
    :global(> :first-child) {
      margin-inline-start: 3vmin;
    }
    &::-webkit-scrollbar {
      width: 0.5rem;
    }
    &::-webkit-scrollbar-track {
      background: var(--background-elevated);
      border-radius: 1rem;
    }
    &::-webkit-scrollbar-thumb {
      background-color: var(--foreground);
      border-radius: 1rem;
      border: 0.25rem solid var(--background-elevated);
    }
    &.scroll {
      overflow-x: scroll;
    }
  }

  .breaks-container {
    position: relative;
  }

  .add-break {
    padding-inline-start: 2vmin;
    height: 140px;
    transition: ease-in-out 0.2s;
    margin-inline-start: auto;
    width: 60px;
    &::before,
    &::after {
      content: "";
      position: absolute;
      top: 1vmin;
      bottom: 2vmin;
      z-index: 1000;
      width: 4vmin;
      pointer-events: none;
    }
    &::before {
      right: 60px;
      background: linear-gradient(to right, transparent, var(--background));
    }
    &::after {
      left: 0;
      background: linear-gradient(to left, transparent, var(--background));
    }
  }
</style>
