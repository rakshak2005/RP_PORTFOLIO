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
const clipOf = async (selector, file) => {
  const box = await evaluate(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top + window.scrollY), width: Math.round(r.width), height: Math.round(r.height) };
  })()`);
  if (!box) { console.log('missing', selector); return; }
  const { data } = await send('Page.captureScreenshot', {
    format: 'jpeg', quality: 88, captureBeyondViewport: true,
    clip: { ...box, scale: 1 },
  });
  fs.writeFileSync(`${out}/${file}`, Buffer.from(data, 'base64'));
  console.log(`${file} -> ${box.width}x${box.height}`);
};

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'http://localhost:5000/' });
await wait(4000);
await evaluate(`document.querySelector('#achievements').scrollIntoView(); window.scrollBy(0, -60);`);
await wait(2000);

await clipOf('#achievements > div.relative.z-10 > div:first-child', 'achv2-head.jpg');
await clipOf('#achievements article', 'achv2-card1.jpg');
await clipOf('#achievements article:nth-of-type(2)', 'achv2-card2.jpg');

// Interactions
const allCount = await evaluate(`document.querySelectorAll('#achievements .achv-card').length`);
await evaluate(`(() => {
  const group = document.querySelector('#achievements [role="group"]');
  const btn = [...group.querySelectorAll('button')].find(b => b.textContent.trim().startsWith('Technical'));
  btn.click();
})()`);
await wait(900);
const technicalCount = await evaluate(`document.querySelectorAll('#achievements .achv-card').length`);
const docCount = await evaluate(`document.querySelector('#achievements').innerText.match(/\\d{2} Documents/)?.[0]`);

await evaluate(`(() => {
  const group = document.querySelector('#achievements [role="group"]');
  [...group.querySelectorAll('button')].find(b => b.textContent.trim().startsWith('All')).click();
})()`);
await wait(700);
await evaluate(`document.querySelector('#achievements .achv-card button').click()`);
await wait(800);
const dialogOpen = await evaluate(`!!document.querySelector('[role="dialog"]')`);
const counterBefore = await evaluate(`[...document.querySelectorAll('[role="dialog"] span')].map(s => s.textContent.trim()).find(t => /^\\d{2} \\/ \\d{2}$/.test(t))`);

await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight', windowsVirtualKeyCode: 39 });
await wait(500);
const counterAfter = await evaluate(`[...document.querySelectorAll('[role="dialog"] span')].map(s => s.textContent.trim()).find(t => /^\\d{2} \\/ \\d{2}$/.test(t))`);

await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
await wait(600);
const dialogClosed = await evaluate(`!document.querySelector('[role="dialog"]')`);
const bodyUnlocked = await evaluate(`document.body.style.overflow !== 'hidden'`);

// Featured certificate button opens viewer
await evaluate(`document.querySelector('#achievements article button').click()`);
await wait(700);
const featuredDialog = await evaluate(`!!document.querySelector('[role="dialog"]')`);
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
await wait(500);

console.log(JSON.stringify({
  allCount, technicalCount, docCount,
  dialogOpen, counterBefore, counterAfter, dialogClosed, bodyUnlocked, featuredDialog,
}, null, 2));

ws.close();
process.exit(0);
