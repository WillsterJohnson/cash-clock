export function browserOnly<Args extends unknown[], Return extends unknown>(
  cb: (...args: Args) => Return,
  args: Args,
) {
  if (typeof window === "undefined") return;
  return cb(...(args ?? ([] as unknown as Args)));
}
