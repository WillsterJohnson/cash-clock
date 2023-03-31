/// <reference types="@sveltejs/kit" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from "$service-worker";

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];
const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener("install", (event) => {
  async function addFilesToCache() {
    try {
      const cache = await caches.open(CACHE);
      await cache.addAll(ASSETS);
    } catch (e) {
      console.warn(e);
    }
  }

  event.waitUntil(addFilesToCache());
});

sw.addEventListener("activate", (event) => {
  // Remove previous cached data from disk
  async function deleteOldCaches() {
    try {
      for (const key of await caches.keys()) {
        if (key !== CACHE) await caches.delete(key);
      }
    } catch (e) {
      console.warn(e);
    }
  }

  event.waitUntil(deleteOldCaches());
});

sw.addEventListener("fetch", (event) => {
  // ignore POST requests etc
  if (event.request.method !== "GET") return;

  async function respond() {
    const url = new URL(event.request.url);
    const cache = await caches.open(CACHE);

    // `build`/`files` can always be served from the cache
    if (ASSETS.includes(url.pathname)) {
      return cache.match(event.request);
    }

    // for everything else, try the network first, but
    // fall back to the cache if we're offline
    try {
      const response = await fetch(event.request);

      if (response.status === 200) {
        cache.put(event.request, response.clone());
      }

      return response;
    } catch {
      return cache.match(event.request);
    }
  }

  event.respondWith(respond());
});
