import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/kit/vite";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    files: {
      assets: "assets",
      appTemplate: "index.html",
      errorTemplate: "error.html",
      hooks: {
        client: "hooks/client.ts",
        server: "hooks/server.ts",
      },
      lib: "lib",
      params: "params",
      routes: "routes",
      serviceWorker: "service-worker.ts",
    },
  },
};

export default config;
