export function autoRepeat(cb: () => void, interval: number) {
  const repeater = {
    active: true,
  } as { active: boolean; run: () => Promise<void> };
  repeater.run = async () => {
    while (repeater.active)
      await new Promise((resolve) => setTimeout(() => resolve(cb()), interval));
  };
  return repeater;
}
