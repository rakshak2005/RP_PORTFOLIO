import fs from 'fs';

const base = 'http://127.0.0.1:9222';
const list = await (await fetch(`${base}/json/list`)).json();
const target = list.find((t) => t.type === 'page');
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
let nextId = 0;
const pending = new Map();
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(JSON.stringify(message.error)));
    else resolve(message.result);
  }
};
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++nextId;
  pending.set(id, { resolve, reject });
  ws.send(JSON.stringify({ id, method, params }));
});
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const evaluate = async (expression) => {
  const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  return res.result?.value ?? res.exceptionDetails?.text ?? res.result?.description;
};

await send('Page.enable');
await send('Runtime.enable');
const out = 'C:/Users/raksh/AppData/Local/Temp/opencode';

const sizes = [
  { name: 'desktop', width: 1440, height: 1000, mobile: false },
  { name: 'tablet', width: 820, height: 1100, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true },
];

for (const size of sizes) {
  await send('Emulation.setDeviceMetricsOverride', {
    width: size.width,
    height: size.height,
    deviceScaleFactor: 1,
    mobile: size.mobile,
  });
  await send('Page.navigate', { url: 'http://localhost:5000/' });
  await wait(3500);
  await evaluate(`document.querySelector('#achievements').scrollIntoView(); window.scrollBy(0, -60);`);
  await wait(1600);

  const box = await evaluate(`(() => {
    const el = document.querySelector('#achievements');
    const r = el.getBoundingClientRect();
    return { height: Math.round(r.height), y: Math.round(r.top + window.scrollY), width: Math.round(r.width) };
  })()`);

  const { data } = await send('Page.captureScreenshot', {
    format: 'jpeg',
    quality: 80,
    captureBeyondViewport: true,
    clip: { x: 0, y: box.y, width: size.width, height: box.height, scale: 1 },
  });
  const file = `${out}/achv2-${size.name}.jpg`;
  fs.writeFileSync(file, Buffer.from(data, 'base64'));
  console.log(`${file} -> ${size.width}x${box.height}`);
}

ws.close();
process.exit(0);
