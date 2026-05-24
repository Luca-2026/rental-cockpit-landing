// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    prerender: {
      enabled: true,
      crawlLinks: true,
    },
    pages: [
      { path: "/" },
      { path: "/kontakt" },
      { path: "/impressum" },
      { path: "/datenschutz" },
    ],
  },
  vite: {
    environments: {
      ssr: {
        build: {
          rollupOptions: {
            // preview-server-plugin requires `input` to be a string and derives
            // the output filename from its basename. Cloudflare plugin actually
            // builds the worker; we just need this to satisfy the type-check
            // and produce a `server.js` re-export for prerender.
            input: "src/server.ts",
          },
        },
      },
    },
  },
  plugins: [
    {
      name: "copy-worker-entry-to-server-js",
      apply: "build",
      async writeBundle(opts) {
        if (!opts.dir?.endsWith("/server")) return;
        const { copyFile, access } = await import("node:fs/promises");
        const path = await import("node:path");
        const src = path.join(opts.dir, "index.js");
        const dst = path.join(opts.dir, "server.js");
        try {
          await access(src);
          await copyFile(src, dst);
        } catch {
          /* index.js not present, skip */
        }
      },
    },
  ],
});
