/* Custom GLSL for the ribbon cards and the perspective grid floor. */

export const CARD_VERTEX = /* glsl */ `
  uniform float u_sheetW;
  uniform float u_sheetD;
  uniform float u_sheetT;
  uniform float u_sheetC;
  uniform float u_sheetV;
  uniform float u_leanA;
  uniform float u_leanW;
  uniform float u_diag;
  uniform float u_axis;
  uniform float u_dent;
  uniform float u_hover;
  uniform vec2 u_res;

  varying vec2 vUv;
  varying vec3 vWorld;
  varying float vRibbonX;
  varying float vDome;

  const float PI = 3.141592653589793;
  const float BANK = -0.16;
  const float REAR_Y = 0.1;
  const float REAR_Z = 0.2;
  const float VTWIST = 1.8;
  const float TAIL = 1.0;
  const float SHIFT = -0.2;

  float qOf(float x) {
    return x / u_sheetW * u_sheetT + SHIFT;
  }

  float shapeOf(float q) {
    return mix(1.0 - q * q, sin(PI * q), u_sheetC) * exp(-TAIL * q * q);
  }

  float shapeSlope(float q) {
    float bowl = -2.0 * q * (1.0 + TAIL * (1.0 - q * q));
    float ess = PI * cos(PI * q) - 2.0 * TAIL * q * sin(PI * q);
    return mix(bowl, ess, u_sheetC) * exp(-q * q);
  }

  float zOf(float x) {
    return -u_sheetD * shapeOf(qOf(x));
  }

  float rollOf(float x) {
    return BANK * shapeSlope(qOf(x)) / PI * u_sheetC;
  }

  float ramp(float s) {
    s = clamp(s, -1.0, 1.0);
    return s * (1.5 - 0.5 * s * s);
  }

  void main() {
    vUv = uv;

    vec2 q = uv * 2.0 - 1.0;
    float dome = (1.0 - q.x * q.x) * (1.0 - q.y * q.y);
    vDome = dome;

    vec4 wp = modelMatrix * vec4(position, 1.0);

    /* Hover dent, pushed back along z. */
    wp.z -= u_hover * u_dent * u_res.y * dome;

    /* Phone: run the same ribbon down the vertical axis. */
    if (u_axis > 0.5) {
      float tmp = wp.x;
      wp.x = wp.y;
      wp.y = tmp;
    }

    float x = wp.x;
    float roll = rollOf(x);

    if (u_sheetV > 0.0) {
      float side = sign(x / u_sheetW);
      roll += VTWIST * u_sheetV * smoothstep(0.3, 0.9, abs(x / u_sheetW)) * side;
    }

    /* Wind: rotate (y, z) about x. */
    float cr = cos(roll);
    float sr = sin(roll);
    float wy = wp.y * cr - wp.z * sr;
    float wz = wp.y * sr + wp.z * cr;
    wp.y = wy;
    wp.z = wz;

    /* Bend. */
    wp.z += zOf(x);

    /* Diagonal climb and the rear lift while moving. */
    wp.y += u_diag * x;
    if (u_sheetV > 0.0) {
      float m = 1.0 - smoothstep(-1.0, 0.3, x / u_sheetW);
      wp.y += REAR_Y * u_sheetW * u_sheetV * m;
      wp.z += REAR_Z * u_sheetW * u_sheetV * m;
    }

    /* Lean ("door"). */
    if (u_leanW > 0.0) {
      wp.z += u_leanA * ramp(x / u_leanW);
    }

    vRibbonX = x;

    if (u_axis > 0.5) {
      float tmp2 = wp.x;
      wp.x = wp.y;
      wp.y = tmp2;
    }

    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

export const CARD_FRAGMENT = /* glsl */ `
  uniform sampler2D u_media;
  uniform sampler2D u_overlay;
  uniform vec4 u_crop;
  uniform vec2 u_res;
  uniform float u_aspect;
  uniform float u_corner;
  uniform float u_alpha;
  uniform float u_hover;
  uniform float u_shade;
  uniform float u_shadeS;
  uniform float u_sheetW;
  uniform float u_sheetD;
  uniform float u_sheetT;
  uniform float u_sheetC;
  uniform float u_sheetV;
  uniform float u_leanA;
  uniform float u_leanW;
  uniform float u_axis;
  uniform float u_dent;

  varying vec2 vUv;
  varying vec3 vWorld;
  varying float vRibbonX;
  varying float vDome;

  const float PI = 3.141592653589793;
  const float BANK = -0.16;
  const float VTWIST = 1.8;
  const float TAIL = 1.0;
  const float SHIFT = -0.2;

  float qOf(float x) {
    return x / u_sheetW * u_sheetT + SHIFT;
  }

  float shapeOf(float q) {
    return mix(1.0 - q * q, sin(PI * q), u_sheetC) * exp(-TAIL * q * q);
  }

  float shapeSlope(float q) {
    float bowl = -2.0 * q * (1.0 + TAIL * (1.0 - q * q));
    float ess = PI * cos(PI * q) - 2.0 * TAIL * q * sin(PI * q);
    return mix(bowl, ess, u_sheetC) * exp(-q * q);
  }

  float zOf(float x) {
    return -u_sheetD * shapeOf(qOf(x));
  }

  float rollOf(float x) {
    return BANK * shapeSlope(qOf(x)) / PI * u_sheetC;
  }

  float leanSlope(float s) {
    s = min(abs(s), 1.0);
    return 1.5 * (1.0 - s * s);
  }

  void main() {
    /* Cover crop. */
    vec2 mediaUv = u_crop.xy + vUv * u_crop.zw;
    vec4 media = texture2D(u_media, mediaUv);
    vec4 overlay = texture2D(u_overlay, vUv);
    vec3 rgb = mix(media.rgb, overlay.rgb, overlay.a);

    float x = vRibbonX;

    /* Depth darkening. */
    float depth = clamp((u_sheetD - zOf(x)) / (2.0 * u_sheetD + 0.0001), 0.0, 1.0);
    rgb = mix(rgb, vec3(0.059), u_shade * 0.8 * pow(depth, u_shadeS));

    /* Analytic normal. */
    float q = qOf(x);
    float dzdx = -u_sheetD * shapeSlope(q) * u_sheetT / u_sheetW;
    if (u_leanW > 0.0) {
      dzdx += (u_leanA / u_leanW) * leanSlope(x / u_leanW);
    }

    vec2 qq = vUv * 2.0 - 1.0;
    float domeDx = (1.0 - qq.y * qq.y) * (-4.0 * qq.x) / max(u_res.x, 0.0001);
    dzdx += -u_hover * u_dent * u_res.y * domeDx;

    float roll = rollOf(x);
    if (u_sheetV > 0.0) {
      roll += VTWIST * u_sheetV * smoothstep(0.3, 0.9, abs(x / u_sheetW)) * sign(x / u_sheetW);
    }

    vec3 n = normalize(vec3(-dzdx, 0.0, 1.0));
    float cr = cos(roll);
    float sr = sin(roll);
    n = vec3(n.x, n.y * cr - n.z * sr, n.y * sr + n.z * cr);
    if (u_axis > 0.5) {
      n = vec3(n.y, n.x, n.z);
    }

    vec3 lightDir = normalize(vec3(-0.4, 0.5, 1.0));
    float ndl = dot(n, lightDir) * 0.5 + 0.5;
    rgb *= 1.0 - 0.12 * (1.0 - ndl);

    vec3 viewDir = normalize(cameraPosition - vWorld);
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(n, halfDir), 0.0), 48.0) * 0.35;
    rgb += spec;

    /* Rounded corners in card space (aspect x 1). */
    vec2 p = (vUv - 0.5) * vec2(u_aspect, 1.0);
    vec2 b = vec2(u_aspect, 1.0) * 0.5;
    vec2 d = abs(p) - (b - u_corner);
    float sd = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - u_corner;
    float aa = max(fwidth(sd), 0.0001);
    float mask = 1.0 - smoothstep(-aa, aa, sd);

    gl_FragColor = vec4(rgb, u_alpha * mask);
  }
`;

export const FLOOR_VERTEX = /* glsl */ `
  uniform float u_o;
  uniform float u_leanA;
  uniform float u_leanW;

  varying vec2 vUv;
  varying float vFar;
  varying vec3 vWorld;

  float ramp(float s) {
    s = clamp(s, -1.0, 1.0);
    return s * (1.5 - 0.5 * s * s);
  }

  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vFar = -wp.z / u_o;

    if (u_leanW > 0.0) {
      wp.z += u_leanA * ramp(wp.x / u_leanW);
    }

    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

export const FLOOR_FRAGMENT = /* glsl */ `
  uniform sampler2D u_reflection;
  uniform mat4 u_reflVP;
  uniform vec2 u_cells;
  uniform float u_alpha;
  uniform float u_lightX;

  varying vec2 vUv;
  varying float vFar;
  varying vec3 vWorld;

  void main() {
    float fade = 1.0 - smoothstep(0.2, 0.95, vFar);

    /* Both floor tints are black; the grid and reflection do the work. */
    vec3 col = mix(vec3(0.0), vec3(0.0), smoothstep(0.0, 0.8, vFar));
    col *= 1.0 - 0.55 * exp(-14.0 * abs(vFar));

    vec2 g = vec2(vUv.x * u_cells.x, vFar * u_cells.y);
    float fx = max(1.5 * fwidth(g.x), 0.00001);
    float fy = max(1.5 * fwidth(g.y), 0.00001);
    float lx = 1.0 - smoothstep(0.0, fx, abs(fract(g.x) - 0.5));
    float ly = 1.0 - smoothstep(0.0, fy, abs(fract(g.y) - 0.5));
    float line = max(lx, ly);

    col += line * 0.08 * fade;

    /* Mirror the cards across the floor and smear them away from the light. */
    vec3 rw = vWorld;
    rw.x -= (vWorld.x - u_lightX) * 0.35 * abs(vFar);

    vec4 rp = u_reflVP * vec4(rw, 1.0);
    vec2 ruv = rp.xy / rp.w * 0.5 + 0.5;

    vec2 edge0 = smoothstep(vec2(0.0), vec2(0.1), ruv);
    vec2 edge1 = smoothstep(vec2(0.0), vec2(0.1), 1.0 - ruv);
    float edges = edge0.x * edge0.y * edge1.x * edge1.y;

    float weight = vFar > 0.0 ? exp(-6.0 * vFar) : exp(2.2 * vFar);
    vec3 reflection = texture2D(u_reflection, ruv).rgb;

    col += reflection * line * 0.5 * weight * edges * fade;

    gl_FragColor = vec4(col, u_alpha * fade);
  }
`;
