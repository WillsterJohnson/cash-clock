import type { RequestHandler } from "./$types";
import { text } from "@sveltejs/kit";
export const GET = (() => {
  return text(
    "No data is shared. The only data which is stored is configuration data, which remains local to your device and is not transmitted across the internet.",
  );
}) satisfies RequestHandler;
