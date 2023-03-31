import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  // extends serving list to allow ./service-worker.ts
  server: {
    fs: {
      allow: ["./"],
    },
  },
});
