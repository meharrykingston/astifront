import net from "node:net";
import path from "node:path";
import { spawn } from "node:child_process";

const host = "0.0.0.0";
const desiredPort = Number(process.env.PORT || 3000);

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on("error", () => resolve(false));
    server.listen({ port, host }, () => {
      server.close(() => resolve(true));
    });
  });
}

async function findAvailablePort(startPort, maxAttempts = 20) {
  let port = startPort;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    if (await isPortFree(port)) return port;
    port += 1;
  }
  throw new Error(`No available port found from ${startPort} to ${port - 1}`);
}

const port = await findAvailablePort(desiredPort);
if (port !== desiredPort) {
  console.log(`[dev] Port ${desiredPort} is busy, using ${port} instead.`);
}

const nextBin = path.join(
  process.cwd(),
  "node_modules",
  ".bin",
  process.platform === "win32" ? "next.cmd" : "next"
);

const args = ["dev", "-p", String(port)];

const child = spawn(nextBin, args, {
  stdio: "inherit",
  env: { ...process.env, PORT: String(port) },
  shell: true,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
