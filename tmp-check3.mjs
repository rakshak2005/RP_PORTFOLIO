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
const out = 'C:/Users/raksh/AppData/Local/Temp/opencode';
const shot = async (file, fullPage = false) => {
  const { data } = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85, captureBeyondViewport: fullPage });
  fs.writeFileSync(`${out}/${file}`, Buffer.from(data, 'base64'));
  console.log(file);
};

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 950, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'http://localhost:5000/' });
await wait(4000);
await evaluate(`document.querySelector('#achievements').scrollIntoView(); window.scrollBy(0, -60);`);
await wait(2200);
await shot('achv2-header-view.jpg');

await evaluate(`(() => {
  const el = document.querySelector('#achievements .grid');
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 80);
})()`);
await wait(1200);
await shot('achv2-header-view2.jpg');

await evaluate(`(() => {
  const el = document.querySelector('#achievements article');
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 90);
})()`);
await wait(1500);
await shot('achv2-featured-view.jpg');

await evaluate(`(() => {
  const el = [...document.querySelectorAll('#achievements h3')].find(h => h.textContent.includes('Credentials'));
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 160);
})()`);
await wait(1500);
await shot('achv2-gallery-view.jpg');

// Mobile featured view
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await wait(900);
await evaluate(`(() => {
  const el = document.querySelector('#achievements article');
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 70);
})()`);
await wait(1200);
await shot('achv2-featured-mobile-view.jpg');

ws.close();
process.exit(0);
