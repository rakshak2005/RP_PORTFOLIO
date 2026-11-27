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

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'http://localhost:5000/' });
await wait(4000);

await evaluate(`(() => {
  const el = [...document.querySelectorAll('#achievements h3')].find(h => h.textContent.includes('Credentials'));
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 140);
})()`);
await wait(1600);
let shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 88 });
fs.writeFileSync(`${out}/achv2-gallery2.jpg`, Buffer.from(shot.data, 'base64'));

// Open a gallery card and capture modal
await evaluate(`document.querySelector('#achievements .achv-card button').click()`);
await wait(900);
shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 88 });
fs.writeFileSync(`${out}/achv2-modal.jpg`, Buffer.from(shot.data, 'base64'));

// Mobile gallery
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
await wait(600);
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await wait(1000);
await evaluate(`(() => {
  const el = [...document.querySelectorAll('#achievements h3')].find(h => h.textContent.includes('Credentials'));
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 90);
})()`);
await wait(1400);
shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 88 });
fs.writeFileSync(`${out}/achv2-gallery-mobile.jpg`, Buffer.from(shot.data, 'base64'));

console.log('done');
ws.close();
process.exit(0);
