import http from "node:http";

const port = Number(process.env.PORT || 4317);
let nextId = 1;
let todos = [];
let doneCount = 0;

function send(res, status, body) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data ? JSON.parse(data) : {}));
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  if (req.method === "GET" && url.pathname === "/health") return send(res, 200, { ok: true });
  if (req.method === "GET" && url.pathname === "/todos") return send(res, 200, todos);
  if (req.method === "GET" && url.pathname === "/todos/stats") {
    return send(res, 200, { total: todos.length, remaining: todos.length - doneCount });
  }
  if (req.method === "POST" && url.pathname === "/todos") {
    const { title } = await readBody(req);
    const todo = { id: nextId++, title, done: false };
    todos.push(todo);
    return send(res, 201, todo);
  }
  const complete = url.pathname.match(/^\/todos\/(\d+)\/complete$/);
  if (req.method === "POST" && complete) {
    const id = Number(complete[1]);
    // fixed: used to mark every todo as done
    const todo = todos.find((t) => t.id === id);
    if (!todo) return send(res, 404, { error: "not found" });
    todo.done = !todo.done;
    doneCount++;
    return send(res, 200, todo);
  }
  if (req.method === "POST" && url.pathname === "/todos/clear-completed") {
    todos = todos.filter((t) => !t.done);
    return send(res, 200, todos);
  }
  send(res, 404, { error: "not found" });
});

server.listen(port, () => console.log(`todo server listening on ${port}`));
