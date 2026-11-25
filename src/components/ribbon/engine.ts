import * as THREE from 'three';
import { CARD_DATA } from './data';
import type { CardData } from './data';
import {
  CARD_VERTEX,
  CARD_FRAGMENT,
  FLOOR_VERTEX,
  FLOOR_FRAGMENT,
} from './shaders';

const PI = Math.PI;
const FOV = 53.4;
const CAM_Z = 41.18;
const BANK = -0.16;
const REAR_Y = 0.1;
const REAR_Z = 0.2;
const VTWIST = 1.8;
const TAIL = 1.0;
const SHIFT = -0.2;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const ramp = (s: number) => {
  s = clamp(s, -1, 1);
  return s * (1.5 - 0.5 * s * s);
};
const qOf = (x: number, W: number, T: number) => (x / W) * T + SHIFT;
const shapeOf = (q: number, C: number) =>
  ((1 - C) * (1 - q * q) + C * Math.sin(PI * q)) * Math.exp(-TAIL * q * q);
const shapeSlope = (q: number, C: number) => {
  const bowl = -2 * q * (1 + TAIL * (1 - q * q));
  const ess = PI * Math.cos(PI * q) - 2 * TAIL * q * Math.sin(PI * q);
  return ((1 - C) * bowl + C * ess) * Math.exp(-q * q);
};
const wrap = (v: number, start: number, len: number) =>
  start + ((((v - start) % len) + len) % len);

type CardRuntime = {
  data: CardData;
  mesh: any;
  material: any;
  overlayCanvas: HTMLCanvasElement;
  overlayCtx: CanvasRenderingContext2D;
  overlayTex: any;
  mediaTex: any;
  posterTex: any;
  videoTex: any;
  video: HTMLVideoElement | null;
  mediaAspect: number;
  loaded: boolean;
  alphaStart: number;
  hover: number;
  w: number;
  h: number;
  x: number;
  y: number;
  aspect: number;
};

export type RibbonEngineOptions = {
  canvas: HTMLCanvasElement;
  root: HTMLDivElement;
  onReady: () => void;
};

export function createRibbonEngine({ canvas, root, onReady }: RibbonEngineOptions) {
  let vw = window.innerWidth;
  let vh = window.innerHeight;
  let isPhone = vw <= 649;
  let U = vw / (isPhone ? 390 : 1500);
  let H = Math.tan((FOV / 2) * (PI / 180)) * CAM_Z;
  let W = H * (vw / vh);
  let k = (2 * H) / vh;

  let cardH = 0;
  let gap = 0;
  let radius = 0;
  let L = 1;
  let stripStart = 0;
  let bases: number[] = [];

  let current = 0;
  let target = 0;
  let pending = 0;
  let initialized = false;

  let Dcur = 0;
  let Vcur = 0;
  let rcur = 0;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let readyFlag = false;
  let floorStart = 0;
  let disposed = false;

  let hovered: CardRuntime | null = null;
  let pointerCX = -1;
  let pointerCY = -1;

  let lastWheelTime = 0;
  let burstUntil = 0;
  let touchPrevY = 0;
  let touchLastDelta = 0;

  let overlayScale = 1;
  let maxAniso = 1;

  let floorY = 0;
  let floorO = 0;
  let mirrorCamY = 0;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setClearColor(0x000000, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(vw, vh, false);
  maxAniso = renderer.capabilities.getMaxAnisotropy();

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(FOV, vw / vh, 0.1, 2000);
  camera.position.set(0, 0, CAM_Z);
  camera.lookAt(0, 0, 0);

  const mirrorCam = camera.clone();
  mirrorCam.position.set(0, 0, CAM_Z);
  mirrorCam.updateMatrixWorld(true);

  const makeDataTexture = (r: number, g: number, b: number, a: number) => {
    const tex = new THREE.DataTexture(new Uint8Array([r, g, b, a]), 1, 1, THREE.RGBAFormat);
    tex.needsUpdate = true;
    return tex;
  };
  const emptyOverlay = makeDataTexture(0, 0, 0, 0);
  const emptyMedia = makeDataTexture(0, 0, 0, 255);
  emptyMedia.colorSpace = THREE.SRGBColorSpace;

  const rt = new THREE.WebGLRenderTarget(1, 1, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    depthBuffer: true,
    stencilBuffer: false,
  });
  rt.texture.generateMipmaps = false;

  const geometry = new THREE.PlaneGeometry(1, 1, 96, 24);

  const cards: CardRuntime[] = CARD_DATA.map((data) => {
    const overlayCanvas = document.createElement('canvas');
    overlayCanvas.width = 2;
    overlayCanvas.height = 2;
    const overlayCtx = overlayCanvas.getContext('2d') as CanvasRenderingContext2D;

    const material = new THREE.ShaderMaterial({
      vertexShader: CARD_VERTEX,
      fragmentShader: CARD_FRAGMENT,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      side: THREE.FrontSide,
      extensions: { derivatives: true },
      uniforms: {
        u_media: { value: emptyMedia },
        u_overlay: { value: emptyOverlay },
        u_crop: { value: new THREE.Vector4(0, 0, 1, 1) },
        u_res: { value: new THREE.Vector2(1, 1) },
        u_aspect: { value: data.aspect },
        u_corner: { value: 0.05 },
        u_alpha: { value: 0 },
        u_hover: { value: 0 },
        u_sheetW: { value: W },
        u_sheetD: { value: 0 },
        u_sheetT: { value: 1.15 },
        u_sheetC: { value: 1 },
        u_sheetV: { value: 0 },
        u_leanA: { value: 0 },
        u_leanW: { value: 0 },
        u_diag: { value: 0.03 },
        u_axis: { value: 0 },
        u_dent: { value: 0.035 },
        u_shade: { value: 1 },
        u_shadeS: { value: 1 },
      },
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    mesh.renderOrder = 0;
    scene.add(mesh);

    return {
      data,
      mesh,
      material,
      overlayCanvas,
      overlayCtx,
      overlayTex: null,
      mediaTex: null,
      posterTex: null,
      videoTex: null,
      video: null,
      mediaAspect: data.aspect,
      loaded: false,
      alphaStart: 0,
      hover: 0,
      w: 1,
      h: 1,
      x: 0,
      y: 0,
      aspect: data.aspect,
    };
  });

  const floorGeo = new THREE.PlaneGeometry(1, 1, 48, 24);
  const floorMat = new THREE.ShaderMaterial({
    vertexShader: FLOOR_VERTEX,
    fragmentShader: FLOOR_FRAGMENT,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide,
    extensions: { derivatives: true },
    uniforms: {
      u_reflection: { value: rt.texture },
      u_reflVP: { value: new THREE.Matrix4() },
      u_cells: { value: new THREE.Vector2(1, 1) },
      u_alpha: { value: 0 },
      u_lightX: { value: 0 },
      u_o: { value: 1 },
      u_leanA: { value: 0 },
      u_leanW: { value: 1 },
    },
  });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -PI / 2;
  floorMesh.frustumCulled = false;
  floorMesh.renderOrder = -1;
  scene.add(floorMesh);

  function updateCrop(card: CardRuntime) {
    const ma = card.mediaAspect || card.aspect;
    const a = card.aspect;
    let sx = 1;
    let sy = 1;
    if (a > ma) sy = ma / a;
    else sx = a / ma;
    card.material.uniforms.u_crop.value.set((1 - sx) / 2, (1 - sy) / 2, sx, sy);
  }

  function paintOverlay(card: CardRuntime) {
    const ctx = card.overlayCtx;
    const cw = card.overlayCanvas.width;
    const ch = card.overlayCanvas.height;
    const s = cw / Math.max(card.w, 1);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cw, ch);
    ctx.setTransform(s, 0, 0, s, 0, 0);

    const scrim = ctx.createLinearGradient(0, card.h * 0.68, 0, card.h);
    scrim.addColorStop(0, 'rgba(0,0,0,0)');
    scrim.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = scrim;
    ctx.fillRect(0, card.h * 0.68, card.w, card.h * 0.32);

    const u = U;
    const fontSize = (isPhone ? 16 : 18) * u;
    const inset = (isPhone ? 10 : 20) * u;
    const pillInsetX = (isPhone ? 10 : 20) * u;
    const pillInsetY = 10 * u;
    const pillR = 12.5 * u;
    const pillX = card.w - pillInsetX - pillR;
    const pillY = card.h - pillInsetY - pillR;

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(pillX, pillY, pillR, 0, PI * 2);
    ctx.fill();

    const arm = 4.5 * u;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.4 * u;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    if (isPhone) {
      ctx.moveTo(pillX - arm, pillY);
      ctx.lineTo(pillX + arm, pillY);
      ctx.moveTo(pillX + 0.2 * arm, pillY - 0.8 * arm);
      ctx.lineTo(pillX + arm, pillY);
      ctx.lineTo(pillX + 0.2 * arm, pillY + 0.8 * arm);
    } else {
      ctx.moveTo(pillX - arm, pillY);
      ctx.lineTo(pillX + arm, pillY);
      ctx.moveTo(pillX, pillY - arm);
      ctx.lineTo(pillX, pillY + arm);
    }
    ctx.stroke();

    const baseline = card.h - 10 * u - 0.22 * fontSize;
    ctx.font = `400 ${fontSize}px "Inter Tight", sans-serif`;
    const anyCtx = ctx as any;
    if ('letterSpacing' in anyCtx) anyCtx.letterSpacing = `${-0.05 * fontSize}px`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#fff';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 12 * u * s;
    ctx.fillText(card.data.caption, inset, baseline);
    ctx.shadowBlur = 0;

    if (!card.overlayTex) {
      const tex = new THREE.CanvasTexture(card.overlayCanvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAniso;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.needsUpdate = true;
      card.overlayTex = tex;
      card.material.uniforms.u_overlay.value = tex;
    } else {
      card.overlayTex.needsUpdate = true;
    }
  }

  function resizeOverlay(card: CardRuntime) {
    overlayScale = (2 * Math.min(window.devicePixelRatio || 1, 2)) / 1.5;
    const w = Math.max(1, Math.round(card.w * overlayScale));
    const h = Math.max(1, Math.round(card.h * overlayScale));
    if (card.overlayCanvas.width !== w || card.overlayCanvas.height !== h) {
      card.overlayCanvas.width = w;
      card.overlayCanvas.height = h;
      if (card.overlayTex) {
        card.overlayTex.dispose();
        card.overlayTex = null;
        card.material.uniforms.u_overlay.value = emptyOverlay;
      }
    }
    if (card.loaded) paintOverlay(card);
  }

  function layout() {
    const wasPhone = isPhone;
    vw = window.innerWidth;
    vh = window.innerHeight;
    isPhone = vw <= 649;
    U = vw / (isPhone ? 390 : 1500);
    H = Math.tan((FOV / 2) * (PI / 180)) * CAM_Z;
    W = H * (vw / vh);
    k = (2 * H) / vh;

    root.style.setProperty('--u', `${U}px`);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(vw, vh, false);
    camera.aspect = vw / vh;
    camera.updateProjectionMatrix();

    gap = (isPhone ? 20 : 10) * U;
    radius = (isPhone ? 15 : 20) * U;
    bases = [];
    let total = 0;

    if (isPhone) {
      const cardW = vw - 40 * U;
      cards.forEach((card, i) => {
        card.w = cardW;
        card.h = cardW / card.aspect;
        bases[i] = total;
        total += card.h + gap;
      });
      cardH = 0;
      L = total;
      stripStart = -(L - vh) / 2;
    } else {
      cardH = Math.min(0.435 * vh, 550 * U);
      cards.forEach((card, i) => {
        card.h = cardH;
        card.w = cardH * card.aspect;
        bases[i] = total;
        total += card.w + gap;
      });
      L = total;
      stripStart = -(L - vw) / 2;
    }

    if (!initialized || wasPhone !== isPhone) {
      current = target = isPhone ? -0.177 * vh : 100;
      pending = 0;
      hovered = null;
    }
    initialized = true;

    if (!isPhone) {
      const a = (-cardH * k) / 2 - 0.06 * H;
      floorY = a;
      const near = Math.min(CAM_Z * (1 - Math.abs(a) / H) + 0.2 * H, CAM_Z * 0.8);
      const o = 6 * H;
      floorO = o;
      floorMesh.visible = true;
      floorMesh.position.set(0, a, (near - o) / 2);
      floorMesh.scale.set(W * 2 * 4, near + o, 1);
      floorMat.uniforms.u_o.value = o;
      floorMat.uniforms.u_leanA.value = -0.12 * W;
      floorMat.uniforms.u_leanW.value = W;
      floorMat.uniforms.u_lightX.value = -0.6 * W;
      floorMat.uniforms.u_cells.value.set((W * 2 * 4) / (0.22 * H), o / (0.22 * H));
    } else {
      floorMesh.visible = false;
      floorY = -0.06 * H;
      floorO = 6 * H;
    }

    const m = floorY - 0.07 * H;
    mirrorCamY = 2 * m - camera.position.y;
    mirrorCam.aspect = camera.aspect;
    mirrorCam.position.set(0, mirrorCamY, camera.position.z);
    mirrorCam.quaternion.copy(camera.quaternion);
    mirrorCam.updateProjectionMatrix();
    mirrorCam.updateMatrixWorld(true);

    const size = renderer.getDrawingBufferSize(new THREE.Vector2());
    rt.setSize(
      Math.max(1, Math.floor(size.x * 0.5)),
      Math.max(1, Math.floor(size.y * 0.5)),
    );

    cards.forEach((card) => {
      const u = card.material.uniforms;
      card.mesh.scale.set(card.w * k, card.h * k, 1);
      u.u_aspect.value = card.aspect;
      u.u_corner.value = radius / card.h;
      u.u_res.value.set(card.w * k, card.h * k);

      if (isPhone) {
        u.u_sheetW.value = H;
        u.u_sheetT.value = 1;
        u.u_sheetC.value = 0;
        u.u_leanA.value = 0;
        u.u_leanW.value = 0;
        u.u_diag.value = 0;
        u.u_axis.value = 1;
        u.u_dent.value = 0.035;
        u.u_shade.value = 0;
        u.u_shadeS.value = 0.6;
      } else {
        u.u_sheetW.value = W;
        u.u_sheetT.value = 1.15;
        u.u_sheetC.value = 1;
        u.u_leanA.value = -0.12 * W;
        u.u_leanW.value = W;
        u.u_diag.value = 0.03;
        u.u_axis.value = 0;
        u.u_dent.value = 0.035;
        u.u_shade.value = 1;
        u.u_shadeS.value = 1;
      }

      updateCrop(card);
      resizeOverlay(card);
    });

    if (isPhone) hovered = null;
  }

  function loadImage(url: string): Promise<HTMLImageElement | null> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }

  function setupCard(card: CardRuntime, img: HTMLImageElement | null, now: number) {
    if (img) {
      const tex = new THREE.Texture(img);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAniso;
      tex.needsUpdate = true;
      card.posterTex = tex;
      card.mediaTex = tex;
      card.mediaAspect = img.naturalWidth / img.naturalHeight || card.aspect;
      card.material.uniforms.u_media.value = tex;
      updateCrop(card);
    }

    if (!reducedMotion && card.data.video) {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('muted', '');
      video.preload = 'auto';
      video.src = card.data.video;
      card.video = video;

      const swap = () => {
        if (card.videoTex || disposed) return;
        const vt = new THREE.VideoTexture(video);
        vt.colorSpace = THREE.SRGBColorSpace;
        vt.anisotropy = maxAniso;
        vt.minFilter = THREE.LinearFilter;
        vt.magFilter = THREE.LinearFilter;
        card.videoTex = vt;
        card.mediaTex = vt;
        card.mediaAspect = video.videoWidth / video.videoHeight || card.mediaAspect;
        card.material.uniforms.u_media.value = vt;
        updateCrop(card);
        if (card.posterTex) {
          card.posterTex.dispose();
          card.posterTex = null;
        }
      };

      const anyVideo = video as any;
      if (typeof anyVideo.requestVideoFrameCallback === 'function') {
        anyVideo.requestVideoFrameCallback(swap);
      } else {
        video.addEventListener('playing', swap, { once: true });
      }
      video.load();
    }

    if (!card.loaded) {
      card.loaded = true;
      card.alphaStart = now;
    }
    paintOverlay(card);
  }

  let failsafe = 0;
  function finish() {
    if (disposed) return;
    if (failsafe) {
      clearTimeout(failsafe);
      failsafe = 0;
    }
    if (!readyFlag) {
      readyFlag = true;
      onReady();
    }
    const now = performance.now();
    cards.forEach((card) => {
      if (!card.loaded) {
        card.loaded = true;
        card.alphaStart = now;
        paintOverlay(card);
      }
    });
    if (!floorStart) floorStart = now;
  }

  failsafe = window.setTimeout(finish, 8000);
  (async () => {
    try {
      const fontPromise = document.fonts
        .load('400 18px "Inter Tight"')
        .catch(() => undefined);
      const images = await Promise.all(CARD_DATA.map((d) => loadImage(d.poster)));
      await fontPromise;
      if (disposed) return;
      const now = performance.now();
      cards.forEach((card, i) => setupCard(card, images[i], now));
      finish();
    } catch {
      finish();
    }
  })();

  function pushTarget(d: number) {
    if (!d) return;
    target += d;
    if (!isPhone) {
      target = current + Math.tanh((target - current) / vw) * vw;
    }
  }

  function onWheel(e: WheelEvent) {
    if (e.ctrlKey) return;
    const now = performance.now();
    const raw = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    let delta = raw;
    if (e.deltaMode === 1) delta = raw * 16;
    else if (e.deltaMode === 2) delta = raw * vh;

    if (now - lastWheelTime < 30) burstUntil = now + 500;
    const big =
      Math.abs(delta) >= 40 && now - lastWheelTime >= 30 && now > burstUntil;
    lastWheelTime = now;

    if (big) pending += delta * 1.25 * 2;
    else pushTarget(delta * 1.25);
  }

  function onTouchStart(e: TouchEvent) {
    if (!e.touches.length) return;
    touchPrevY = e.touches[0].clientY;
    touchLastDelta = 0;
  }

  function onTouchMove(e: TouchEvent) {
    if (!e.touches.length) return;
    const y = e.touches[0].clientY;
    const d = touchPrevY - y;
    touchPrevY = y;
    touchLastDelta = d;
    pushTarget(d * 3.25);
  }

  function onTouchEnd() {
    if (touchLastDelta) {
      pushTarget(touchLastDelta * 35);
      touchLastDelta = 0;
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    let d = 0;
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        d = 100;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        d = -100;
        break;
      case 'PageDown':
        d = 0.9 * vh;
        break;
      case 'PageUp':
        d = -0.9 * vh;
        break;
      case ' ':
      case 'Spacebar':
        d = e.shiftKey ? -0.9 * vh : 0.9 * vh;
        break;
      default:
        return;
    }
    e.preventDefault();
    pushTarget(d);
  }

  let resizeTimer = 0;
  function onResize() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    renderer.setSize(vw, vh, false);
    camera.aspect = vw / vh;
    camera.updateProjectionMatrix();
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (!disposed) layout();
    }, 100);
  }

  function onVisibility() {
    if (document.hidden) {
      cards.forEach((card) => card.video?.pause());
    }
  }

  function onPointerMove(e: PointerEvent) {
    if (e.pointerType === 'touch') return;
    pointerCX = e.clientX;
    pointerCY = e.clientY;
  }

  function onPointerLeave() {
    pointerCX = -1;
    pointerCY = -1;
  }

  function updateScroll(dt: number) {
    if (pending !== 0) {
      const f = 1 - Math.pow(1 - 0.22, Math.min(dt * 60, 4));
      const step = pending * f;
      pushTarget(step);
      pending -= step;
      if (Math.abs(pending) < 0.05) {
        pushTarget(pending);
        pending = 0;
      }
    }

    if (reducedMotion) {
      current = target;
    } else {
      const ratio = Math.min(dt * 60, 2);
      current += (target - current) * 0.1 * ratio;
    }
    current = Math.round(current * 100) / 100;

    const N = isPhone ? 245 : 550;
    const t = Math.tanh((target - current) / N);
    const vel = t * Math.abs(t);
    rcur = reducedMotion ? 0 : Math.min(1, Math.abs(vel));
    Dcur = isPhone ? H * 0.18 * 1.1 * rcur : W * 0.2 * (1 + 1.1 * rcur);
    Vcur = isPhone ? 0 : rcur;
  }

  function deformPoint(x: number, y: number, z: number) {
    const T = 1.15;
    const C = 1;
    const q = qOf(x, W, T);
    let roll = (BANK * shapeSlope(q, C)) / PI * C;
    if (Vcur > 0) {
      roll +=
        VTWIST * Vcur * smoothstep(0.3, 0.9, Math.abs(x / W)) * Math.sign(x / W);
    }

    const cr = Math.cos(roll);
    const sr = Math.sin(roll);
    const yy = y * cr - z * sr;
    const zz = y * sr + z * cr;

    z = zz - Dcur * shapeOf(qOf(x, W, T), C);
    y = yy + 0.03 * x;

    if (Vcur > 0) {
      const m = 1 - smoothstep(-1, 0.3, x / W);
      y += REAR_Y * W * Vcur * m;
      z += REAR_Z * W * Vcur * m;
    }
    z += -0.12 * W * ramp(x / W);
    return { x, y, z };
  }

  const projected = new THREE.Vector3();

  function pickCard(clientX: number, clientY: number): CardRuntime | null {
    if (clientX < 0 || clientY < 0 || clientX > vw || clientY > vh) return null;

    if (isPhone) {
      let best: CardRuntime | null = null;
      let bestY = -Infinity;
      for (const card of cards) {
        if (
          clientX >= card.x &&
          clientX <= card.x + card.w &&
          clientY >= card.y &&
          clientY <= card.y + card.h &&
          card.y > bestY
        ) {
          bestY = card.y;
          best = card;
        }
      }
      return best;
    }

    const px = (clientX / vw) * 2 - 1;
    const py = -(clientY / vh) * 2 + 1;

    camera.updateMatrixWorld();
    let best: CardRuntime | null = null;
    let bestZ = -Infinity;

    for (const card of cards) {
      const hw = (card.w * k) / 2;
      const hh = (card.h * k) / 2;
      const bx = card.mesh.position.x;
      const by = card.mesh.position.y;
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      let zSum = 0;

      for (let col = 0; col < 5; col++) {
        const lx = -hw + (col / 4) * 2 * hw;
        for (let row = 0; row < 2; row++) {
          const ly = row === 0 ? -hh : hh;
          const p = deformPoint(bx + lx, by + ly, 0);
          projected.set(p.x, p.y, p.z).project(camera);
          if (projected.x < minX) minX = projected.x;
          if (projected.x > maxX) maxX = projected.x;
          if (projected.y < minY) minY = projected.y;
          if (projected.y > maxY) maxY = projected.y;
          zSum += p.z;
        }
      }

      if (px >= minX && px <= maxX && py >= minY && py <= maxY) {
        const avgZ = zSum / 10;
        if (avgZ > bestZ) {
          bestZ = avgZ;
          best = card;
        }
      }
    }

    return best;
  }

  function updateHover(dt: number) {
    if (isPhone || reducedMotion) {
      hovered = null;
      cards.forEach((card) => {
        card.hover += (0 - card.hover) * (1 - Math.exp(-6 * dt));
      });
      canvas.style.cursor = 'default';
      return;
    }

    hovered = pickCard(pointerCX, pointerCY);
    cards.forEach((card) => {
      const goal = card === hovered ? 1 : 0;
      const rate = 1 - Math.exp(-(goal ? 8 : 6) * dt);
      card.hover += (goal - card.hover) * rate;
    });
    canvas.style.cursor = hovered ? 'pointer' : 'default';
  }

  function onClick(e: MouseEvent) {
    if (e.button !== 0) return;
    const card = pickCard(e.clientX, e.clientY);
    if (!card) return;
    window.open(card.data.href, '_blank', 'noopener,noreferrer');
  }

  function updateScene(now: number) {
    cards.forEach((card, i) => {
      let x: number;
      let y: number;
      if (isPhone) {
        x = (vw - card.w) / 2;
        y = wrap(bases[i] - current, stripStart, L);
      } else {
        x = wrap(bases[i] - current, stripStart, L);
        y = (vh - card.h) / 2;
      }
      card.x = x;
      card.y = y;

      const wx = (x + card.w / 2 - vw / 2) * k;
      const wy = -(y + card.h / 2 - vh / 2) * k;
      card.mesh.position.set(wx, wy, 0);

      const u = card.material.uniforms;
      u.u_sheetD.value = Dcur;
      u.u_sheetV.value = Vcur;
      u.u_alpha.value = card.loaded
        ? clamp((now - card.alphaStart) / 600, 0, 1)
        : 0;
    });

    floorMat.uniforms.u_alpha.value = floorStart
      ? clamp(((now - floorStart) / 800) * 0.9, 0, 0.9)
      : 0;
  }

  function updatePlayback() {
    if (document.hidden) return;
    cards.forEach((card) => {
      const video = card.video;
      if (!video) return;
      const on = isPhone
        ? card.y + card.h > -0.5 * vh && card.y < 1.5 * vh
        : card.x + card.w > -0.5 * vw && card.x < 1.5 * vw;
      if (on) {
        if (video.paused) video.play().catch(() => undefined);
      } else if (!video.paused) {
        video.pause();
      }
    });
  }

  function renderReflection() {
    floorMesh.visible = false;
    renderer.setRenderTarget(rt);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    mirrorCam.updateMatrixWorld(true);
    renderer.render(scene, mirrorCam);
    renderer.setRenderTarget(null);
    renderer.setClearColor(0x000000, 1);
    floorMesh.visible = true;
    floorMat.uniforms.u_reflVP.value.multiplyMatrices(
      mirrorCam.projectionMatrix,
      mirrorCam.matrixWorldInverse,
    );
  }

  let last = performance.now();
  let raf = 0;

  function frame(now: number) {
    if (disposed) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(Math.max((now - last) / 1000, 0), 0.05);
    last = now;

    updateScroll(dt);
    updateScene(now);
    updateHover(dt);
    cards.forEach((card) => {
      card.material.uniforms.u_hover.value = card.hover;
    });
    updatePlayback();

    if (!isPhone) renderReflection();
    renderer.render(scene, camera);
  }

  document.documentElement.classList.add('ml-ribbon-lock');
  document.body.classList.add('ml-ribbon-lock');

  window.addEventListener('wheel', onWheel, { passive: true });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('touchcancel', onTouchEnd, { passive: true });
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('resize', onResize);
  window.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('click', onClick);
  window.addEventListener('blur', onPointerLeave);
  document.documentElement.addEventListener('pointerleave', onPointerLeave);
  document.addEventListener('visibilitychange', onVisibility);

  layout();
  last = performance.now();
  raf = requestAnimationFrame(frame);

  return function dispose() {
    disposed = true;
    cancelAnimationFrame(raf);
    clearTimeout(failsafe);
    clearTimeout(resizeTimer);

    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('touchcancel', onTouchEnd);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('click', onClick);
    window.removeEventListener('blur', onPointerLeave);
    document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    document.removeEventListener('visibilitychange', onVisibility);

    document.documentElement.classList.remove('ml-ribbon-lock');
    document.body.classList.remove('ml-ribbon-lock');

    const textures = new Set<any>();
    cards.forEach((card) => {
      if (card.video) {
        card.video.pause();
        card.video.removeAttribute('src');
        card.video.load();
      }
      if (card.overlayTex) textures.add(card.overlayTex);
      if (card.videoTex) textures.add(card.videoTex);
      if (card.posterTex) textures.add(card.posterTex);
      if (card.mediaTex) textures.add(card.mediaTex);
      card.material.dispose();
    });
    textures.forEach((tex) => tex.dispose());
    emptyOverlay.dispose();
    emptyMedia.dispose();
    geometry.dispose();
    floorGeo.dispose();
    floorMat.dispose();
    rt.dispose();
    renderer.dispose();
  };
}
