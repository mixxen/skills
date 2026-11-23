import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { handle } from "../app.js";

test("GET /health returns ok", async () => {
  const server = http.createServer(handle).listen(0);
  const { port } = server.address();
  const res = await fetch(`http://localhost:${port}/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  server.close();
});
