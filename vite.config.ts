import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite-plus";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

import { widgetDevPlugin } from "./vite/widget-dev-plugin";

// https://vite.dev/config/
export default defineConfig({
  base: "/betterevent/",
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  plugins: [vue(), vueDevTools(), widgetDevPlugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
