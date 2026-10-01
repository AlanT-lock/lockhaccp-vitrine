import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import type { HelmetServerState } from "react-helmet-async";
import { AppContenu, AppProviders } from "./App";

export { PAGES_PUBLIQUES } from "./lib/pages";
export { getActivePricing } from "./lib/launch";

/** Rend une URL en HTML complet (pages lazy résolues) + balises <head> de Helmet. */
export function render(url: string): Promise<{ html: string; head: string }> {
  const helmetContext: { helmet?: HelmetServerState | null } = {};
  return new Promise((resolve, reject) => {
    let html = "";
    let echec: unknown = null;
    const sortie = new Writable({
      write(chunk, _enc, suite) {
        html += chunk.toString();
        suite();
      },
    });
    sortie.on("finish", () => {
      if (echec) return reject(echec);
      const h = helmetContext.helmet;
      if (!h) return reject(new Error(`Helmet n'a rien produit pour ${url}`));
      const head = [h.title, h.meta, h.link, h.script].map((b) => b.toString()).join("\n");
      resolve({ html, head });
    });
    const { pipe } = renderToPipeableStream(
      <AppProviders helmetContext={helmetContext}>
        <StaticRouter location={url}>
          <AppContenu />
        </StaticRouter>
      </AppProviders>,
      {
        onAllReady() {
          pipe(sortie);
        },
        onShellError(err) {
          reject(err);
        },
        onError(err) {
          echec = err;
        },
      },
    );
  });
}
