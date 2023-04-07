<script lang="ts">
  import type { TransitionConfig } from "svelte/transition";
  type Separate = {
    in: object;
    out: object;
  };
  type Both = { both: object };
  type Transition = {
    function: (node: Element, options?: object) => TransitionConfig;
    argument?: Separate | Both;
  };
  export let transitions: Transition | [Transition, Transition, Transition] = {
    function: () => ({}),
  };
  let t: [Transition, Transition, Transition] = null as unknown as [
    Transition,
    Transition,
    Transition,
  ];
  if (transitions) {
    if (!Array.isArray(transitions)) t = [transitions, transitions, transitions];
    else t = transitions;
  }
  const getFn = (t: Transition) => t.function;
  const getArg = (t: Transition, dir: "in" | "out") =>
    (t.argument as Separate)?.[dir] ?? (t.argument as Both)?.both ?? {};

  let [t0f, t1f, t2f] = [getFn(t[0]), getFn(t[1]), getFn(t[2])];
  let [t0ai, t1ai, t2ai] = [getArg(t[0], "in"), getArg(t[1], "in"), getArg(t[2], "in")];
  let [t0ao, t1ao, t2ao] = [getArg(t[0], "out"), getArg(t[1], "out"), getArg(t[2], "out")];

  import { writable } from "svelte/store";
  import Icon from "./Icon.svelte";
  import IconButton from "./IconButton.svelte";

  type T = $$Generic<string>;
  type IconInfo = {
    icon: string;
    sr: string;
  };
  export let options: Record<T, IconInfo>;
  export let value: T;

  const valueStore = writable<T>(value);

  valueStore.subscribe((val) => {
    value = val;
  });

  $: flatOptions = (Object.entries<IconInfo>(options) as [T, IconInfo][]).map(
    ([value, { icon, sr }]) => ({
      value,
      icon,
      sr,
    }),
  );

  $: idx = flatOptions?.findIndex((opt: (typeof flatOptions)[number]) => opt.value === value) ?? 0;

  $: $valueStore = value;
  $: $valueStore = flatOptions[idx].value;
</script>

<div class="select flex-row">
  <div class="nav left" in:t0f={t0ai} out:t0f={t0ao}>
    <IconButton
      size="small"
      sr="Previous option"
      on:click={() => (idx = (idx - 1 + flatOptions.length) % flatOptions.length)}
    >
      arrow_left
    </IconButton>
  </div>
  <div in:t1f={t1ai} out:t1f={t1ao}>
    <Icon bg sr={flatOptions[idx].sr}>
      {flatOptions[idx].icon}
    </Icon>
  </div>
  <div class="nav right" in:t2f={t2ai} out:t2f={t2ao}>
    <IconButton
      size="small"
      sr="Next option"
      on:click={() => (idx = (idx + 1) % flatOptions.length)}
    >
      arrow_right
    </IconButton>
  </div>
</div>

<style lang="scss">
</style>
