// Project driver: performs user actions against the running app and prints JSON.
// Usage: node scripts/drive.mjs <add TITLE | list | stats | complete ID | clear-completed>
const base = `http://localhost:${process.env.PORT || 4317}`;
const [cmd, ...args] = process.argv.slice(2);

async function call(method, path, body) {
  const res = await fetch(base + path, {
    method,
    headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, body: await res.json() };
}

const actions = {
  add: () => call("POST", "/todos", { title: args.join(" ") }),
  list: () => call("GET", "/todos"),
  stats: () => call("GET", "/todos/stats"),
  complete: () => call("POST", `/todos/${args[0]}/complete`),
  "clear-completed": () => call("POST", "/todos/clear-completed"),
};

if (!actions[cmd]) {
  console.error("usage: drive.mjs <add TITLE | list | stats | complete ID | clear-completed>");
  process.exit(2);
}
console.log(JSON.stringify(await actions[cmd](), null, 2));
