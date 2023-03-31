import { goto } from "$app/navigation";
import { browserOnly } from "$lib/browserOnly.js";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => await browserOnly(goto, ["/clock"]);
