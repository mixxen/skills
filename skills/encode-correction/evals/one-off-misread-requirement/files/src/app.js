import { exportsHandler } from "./routes/exports.js";
import { healthHandler } from "./routes/health.js";

const routes = { "GET /health": healthHandler, "GET /exports": exportsHandler };

export function handle(req, res) {
  const route = routes[`${req.method} ${new URL(req.url, "http://x").pathname}`];
  if (!route) {
    res.writeHead(404, { "content-type": "application/json" });
    return res.end(JSON.stringify({ error: "not found" }));
  }
  return route(req, res);
}
