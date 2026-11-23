import http from "node:http";
import { markAllRead, unreadCount } from "./src/inbox.mjs";

const seed = () => [
  { id: 1, subject: "Welcome to Mail Lite", read: false, archived: false },
  { id: 2, subject: "Your invoice for March", read: false, archived: false },
  { id: 3, subject: "Weekly newsletter", read: false, archived: false },
];
let messages = seed();

function send(res, status, body) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (req.method === "GET" && url.pathname === "/health") return send(res, 200, { ok: true });
  if (req.method === "GET" && url.pathname === "/badge") {
    return send(res, 200, { unread: unreadCount(messages) });
  }
  if (req.method === "GET" && url.pathname === "/inbox") {
    markAllRead(messages);
    return send(res, 200, messages.filter((m) => !m.archived));
  }
  const archive = url.pathname.match(/^\/messages\/(\d+)\/archive$/);
  if (req.method === "POST" && archive) {
    const message = messages.find((m) => m.id === Number(archive[1]));
    if (!message) return send(res, 404, { error: "not found" });
    message.archived = true;
    return send(res, 200, message);
  }
  if (req.method === "POST" && url.pathname === "/reset") {
    messages = seed();
    return send(res, 200, { ok: true });
  }
  send(res, 404, { error: "not found" });
});

const port = Number(process.env.PORT || 4400);
server.listen(port, () => console.log(`mail-lite listening on ${port}`));
