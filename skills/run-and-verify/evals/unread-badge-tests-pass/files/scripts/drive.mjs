// Project driver: performs user actions against the running app and prints JSON.
// Usage: node scripts/drive.mjs <badge | open-inbox | archive ID | reset>
const base = `http://localhost:${process.env.PORT || 4400}`;
const [cmd, ...args] = process.argv.slice(2);

async function call(method, path) {
  const res = await fetch(base + path, { method });
  return { status: res.status, body: await res.json() };
}

const actions = {
  badge: () => call("GET", "/badge"),
  "open-inbox": () => call("GET", "/inbox"),
  archive: () => call("POST", `/messages/${args[0]}/archive`),
  reset: () => call("POST", "/reset"),
};

if (!actions[cmd]) {
  console.error("usage: drive.mjs <badge | open-inbox | archive ID | reset>");
  process.exit(2);
}
console.log(JSON.stringify(await actions[cmd](), null, 2));
