export const paramDelay = (cycles = 0) => ({
  duration: 300,
  delay: 300 * cycles + (cycles ? 50 : 0),
});
