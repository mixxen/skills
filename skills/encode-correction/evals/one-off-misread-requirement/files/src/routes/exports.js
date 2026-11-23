import { listExports } from "../data/exports.js";

export function exportsHandler(_req, res) {
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({ exports: listExports() }));
}
