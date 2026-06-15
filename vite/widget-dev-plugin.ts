import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { build, type Plugin, type Rollup } from "vite-plus";

const widgetConfigFile = resolve(
  fileURLToPath(new URL(".", import.meta.url)),
  "../vite.widget.config.ts",
);

const WIDGET_JS = "/betterevent/widget.js";
const WIDGET_CSS = "/betterevent/widget.css";

type WidgetAssets = { js: string; css: string };

function parseWidgetBuild(outputs: Rollup.RollupOutput | Rollup.RollupOutput[]): WidgetAssets {
  const list = Array.isArray(outputs) ? outputs : [outputs];
  let js = "";
  let css = "";

  for (const output of list) {
    for (const item of output.output) {
      if (item.type === "chunk") {
        js = item.code;
      } else if (item.type === "asset" && item.fileName.endsWith(".css")) {
        css = typeof item.source === "string" ? item.source : new TextDecoder().decode(item.source);
      }
    }
  }

  if (!js || !css) {
    throw new Error("widget dev build: expected widget.js and widget.css in output");
  }

  return { js, css };
}

async function buildWidget(): Promise<WidgetAssets> {
  const outputs = await build({
    configFile: widgetConfigFile,
    build: { write: false },
    logLevel: "warn",
  });

  return parseWidgetBuild(outputs as Rollup.RollupOutput | Rollup.RollupOutput[]);
}

export function widgetDevPlugin(): Plugin {
  let cache: WidgetAssets | null = null;
  let stale = true;
  let buildPromise: Promise<WidgetAssets> | null = null;

  async function getAssets(): Promise<WidgetAssets> {
    if (!stale && cache) return cache;

    buildPromise ??= buildWidget()
      .then((assets) => {
        cache = assets;
        stale = false;
        return assets;
      })
      .finally(() => {
        buildPromise = null;
      });

    return buildPromise;
  }

  return {
    name: "betterevent-widget-dev",
    apply: "serve",
    configureServer(server) {
      const invalidate = (file: string) => {
        if (file.includes("/src/")) stale = true;
      };

      server.watcher.on("change", invalidate);
      server.watcher.on("add", invalidate);
      server.watcher.on("unlink", invalidate);

      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split("?")[0];
        if (path !== WIDGET_JS && path !== WIDGET_CSS) {
          next();
          return;
        }

        try {
          const assets = await getAssets();
          const body = path === WIDGET_JS ? assets.js : assets.css;

          res.statusCode = 200;
          res.setHeader("Content-Type", path === WIDGET_JS ? "application/javascript" : "text/css");
          res.setHeader("Cache-Control", "no-store");
          res.end(body);
        } catch (error) {
          next(error);
        }
      });
    },
  };
}
