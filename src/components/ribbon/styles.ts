import { interTightWoff2 } from '../interTightFont';

export const RIBBON_CSS = `
@font-face {
  font-family: "Inter Tight";
  src: url(${interTightWoff2}) format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}

html.ml-ribbon-lock,
html.ml-ribbon-lock body {
  height: 100%;
  overflow: hidden;
  overscroll-behavior: none;
  background: #000;
  color: #fff;
}
body.ml-ribbon-lock {
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
  font-family: "Inter Tight", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.ml-ribbon,
.ml-ribbon * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.ml-ribbon {
  position: fixed;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  background: #000;
  color: #fff;
  font-family: "Inter Tight", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  overscroll-behavior: none;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
  --u: calc(100vw / 1500);
}

@media (max-width: 649px) {
  .ml-ribbon {
    --u: calc(100vw / 390);
  }
}

.ml-ribbon canvas#gl {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.ml-ribbon .ml-ui {
  position: fixed;
  z-index: 5;
  color: #fff;
  font-family: "Inter Tight", system-ui, sans-serif;
  font-weight: 500;
  font-size: max(9px, calc(var(--u) * 10));
  line-height: 1.4;
  text-transform: uppercase;
  letter-spacing: 0;
  opacity: 0;
  transition: opacity 0.6s ease 0.2s;
}

.ml-ribbon.ml-ready .ml-ui {
  opacity: 1;
}

.ml-ribbon .ml-ui a,
.ml-ribbon .ml-ui button {
  position: fixed;
  z-index: 5;
  color: inherit;
  font: inherit;
  text-transform: inherit;
  letter-spacing: inherit;
  background: none;
  border: 0;
  text-decoration: none;
  cursor: pointer;
}

.ml-ribbon .ml-ui .tl {
  left: calc(var(--u) * 80);
  top: calc(var(--u) * 40);
}
.ml-ribbon .ml-ui .tr {
  right: calc(var(--u) * 80);
  top: calc(var(--u) * 40);
}
.ml-ribbon .ml-ui .bl {
  left: calc(var(--u) * 80);
  bottom: calc(var(--u) * 40);
}
.ml-ribbon .ml-ui .br {
  right: calc(var(--u) * 80);
  bottom: calc(var(--u) * 40);
}

.ml-ribbon .ml-ui .bl span {
  opacity: 0.5;
}

@media (max-width: 649px) {
  .ml-ribbon .ml-ui .tl {
    left: calc(var(--u) * 40);
    top: calc(var(--u) * 25);
  }
  .ml-ribbon .ml-ui .tr {
    right: calc(var(--u) * 40);
    top: calc(var(--u) * 25);
  }
  .ml-ribbon .ml-ui .bl {
    left: calc(var(--u) * 40);
    bottom: calc(var(--u) * 25);
  }
  .ml-ribbon .ml-ui .br {
    right: calc(var(--u) * 40);
    bottom: calc(var(--u) * 25);
  }
}

.ml-ribbon .ml-loader {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 6px;
  z-index: 4;
  transition: opacity 0.4s ease;
}

.ml-ribbon.ml-ready .ml-loader {
  opacity: 0;
  pointer-events: none;
}

.ml-ribbon .ml-loader i {
  display: block;
  height: 2px;
  background: #fff;
  animation: mlDash 1s ease-in-out infinite;
}

.ml-ribbon .ml-loader i:nth-child(1) {
  width: 44px;
  animation-delay: 0s;
}
.ml-ribbon .ml-loader i:nth-child(2) {
  width: 44px;
  animation-delay: 0.12s;
}
.ml-ribbon .ml-loader i:nth-child(3) {
  width: 38px;
  animation-delay: 0.24s;
}

@keyframes mlDash {
  0%,
  100% {
    opacity: 0.25;
  }
  50% {
    opacity: 1;
  }
}

.ml-ribbon .ml-veil {
  display: none;
}

@media (max-width: 649px) {
  .ml-ribbon .ml-veil {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 3;
    pointer-events: none;
    background:
      linear-gradient(
        to bottom,
        #000 0%,
        rgba(0, 0, 0, 0.77) 5%,
        rgba(0, 0, 0, 0.42) 10%,
        rgba(0, 0, 0, 0.14) 15%,
        rgba(0, 0, 0, 0.02) 20%,
        transparent 26%
      ),
      linear-gradient(
        to top,
        #000 0%,
        rgba(0, 0, 0, 0.77) 5%,
        rgba(0, 0, 0, 0.42) 10%,
        rgba(0, 0, 0, 0.14) 15%,
        rgba(0, 0, 0, 0.02) 20%,
        transparent 26%
      );
  }
}

.ml-ribbon .ml-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
`;
