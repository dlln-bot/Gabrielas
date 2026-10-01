// Twisting-ribbon "G" — a parametric centreline with a signed width (front/back faces).
export function catmull(pts, n = 40) {
  const out = [];
  const P = [pts[0], ...pts, pts[pts.length - 1]];
  for (let i = 1; i < P.length - 2; i++) {
    const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]];
    // centripetal parametrisation
    const d = (a, b) => Math.max(1e-6, Math.hypot(b[0] - a[0], b[1] - a[1]) ** 0.5);
    const t0 = 0, t1 = t0 + d(p0, p1), t2 = t1 + d(p1, p2), t3 = t2 + d(p2, p3);
    for (let k = 0; k < n; k++) {
      const t = t1 + ((t2 - t1) * k) / n;
      const L = (a, b, ta, tb) => [0, 1].map((j) => ((tb - t) * a[j] + (t - ta) * b[j]) / (tb - ta));
      const A1 = L(p0, p1, t0, t1), A2 = L(p1, p2, t1, t2), A3 = L(p2, p3, t2, t3);
      const B1 = L(A1, A2, t0, t2), B2 = L(A2, A3, t1, t3);
      out.push(L(B1, B2, t1, t2));
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

export function resample(line, step) {
  const out = [line[0]]; let carry = 0;
  for (let i = 1; i < line.length; i++) {
    const [ax, ay] = line[i - 1], [bx, by] = line[i];
    const len = Math.hypot(bx - ax, by - ay); let d = step - carry;
    while (d <= len) { out.push([ax + ((bx - ax) * d) / len, ay + ((by - ay) * d) / len]); d += step; }
    carry = len - (d - step);
  }
  out.push(line[line.length - 1]);
  return out;
}

// moving-average passes erase tangent breaks where the spiral meets the hook
export function smooth(line, k, passes) {
  let L = line;
  for (let p = 0; p < passes; p++) {
    L = L.map((pt, i) => {
      const r = Math.min(k, i, L.length - 1 - i); if (!r) return pt;
      let x = 0, y = 0; for (let j = -r; j <= r; j++) { x += L[i + j][0]; y += L[i + j][1]; }
      return [x / (2 * r + 1), y / (2 * r + 1)];
    });
  }
  return L;
}

export function centreline({ cx = 120, cy = 124, R = 84, a0 = 50, a1 = 338, grow = 0.1, tail = 40, flare = 0.6, hook = 1 } = {}) {
  const pol = (a, r) => [cx + r * Math.cos((a * Math.PI) / 180), cy - r * Math.sin((a * Math.PI) / 180)];
  // one analytic spiral: radius grows gently along the sweep, and the free end flares
  // outward (u² keeps the join tangent-continuous)
  const rad = (a) => { const u = Math.max(0, (a0 - a) / tail); return R * (1 + grow * ((a - a0) / (a1 - a0) - 0.5)) * (1 + flare * u * u); };
  const arc = [];
  for (let a = a0 - tail; a <= a1; a += 0.75) arc.push(pol(a, rad(a)));
  // hook: rise along the right edge, then a softly arched crossbar into the bowl
  const hk = [arc[arc.length - 21], arc[arc.length - 1],
    [cx + R * 0.97, cy - R * 0.02], [cx + R * 0.8, cy - R * 0.13 * hook], [cx + R * 0.56, cy - R * 0.1 * hook], [cx + R * 0.3, cy - R * 0.02], [cx + R * 0.08, cy + R * 0.04]];
  return smooth(resample([...arc.slice(0, -1), ...catmull(hk, 30).slice(30)], 0.8), 7, 4);
}

export function ribbon(line, { W = 24, twists = [0.3, 0.8], tIn = 0.14, tOut = 0.1, phase = 0, flip = false } = {}) {
  const L = [0];
  for (let i = 1; i < line.length; i++) L.push(L[i - 1] + Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]));
  const total = L[L.length - 1];
  const ss = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
  // signed width: piecewise cosine with zeros exactly at the twist positions
  const knots = [-Infinity, ...twists, Infinity];
  const signed = (s) => {
    let k = 0; while (s > knots[k + 1]) k++;
    const a = k === 0 ? Math.max(0, twists[0] - (twists[1] ?? 1) + twists[0]) : knots[k];
    const b = k === knots.length - 2 ? 1 + (1 - twists[twists.length - 1]) : knots[k + 1];
    const lo = k === 0 ? -1e9 : a, hi = k === knots.length - 2 ? 1e9 : b;
    // distance-to-nearest-twist based bell
    const dl = s - (k === 0 ? -0.6 : lo), dr = (k === knots.length - 2 ? 1.6 : hi) - s;
    const m = Math.min(dl, dr), span = Math.min(0.22, ((k === 0 ? twists[0] : k === knots.length - 2 ? 1 - twists[twists.length - 1] : hi - lo)) / 1.0);
    const mag = Math.sin(Math.min(1, m / span) * Math.PI / 2) ** 0.8;
    const sign = (k % 2 === 0) !== flip ? 1 : -1;
    return sign * mag;
  };
  const pts = line.map((p, i) => {
    const s = L[i] / total;
    const j = Math.min(line.length - 1, i + 1), h = Math.max(0, i - 1);
    let tx = line[j][0] - line[h][0], ty = line[j][1] - line[h][1];
    const n = Math.hypot(tx, ty) || 1; tx /= n; ty /= n;
    const ease = (x) => Math.sin(Math.min(1, Math.max(0, x)) * Math.PI / 2) ** 1.15;
    const env = ease(s / tIn) * ease((1 - s) / tOut);
    const w = (W / 2) * env * signed(s + phase);
    return { s, c: p, nx: -ty, ny: tx, w };
  });
  // signed curvature; the edge on the inside of a tight turn is clamped to the turn radius
  // so the ribbon never folds over itself (k smoothed over a small window)
  const K = pts.map((p, i) => {
    const a = line[Math.max(0, i - 6)], b = line[i], c = line[Math.min(line.length - 1, i + 6)];
    const cr = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
    const la = Math.hypot(b[0] - a[0], b[1] - a[1]), lb = Math.hypot(c[0] - b[0], c[1] - b[1]), lc = Math.hypot(c[0] - a[0], c[1] - a[1]);
    return la && lb && lc ? (2 * cr) / (la * lb * lc) : 0;
  });
  pts.forEach((p, i) => {
    const rho = 1 / Math.max(1e-6, Math.abs(K[i])) * 0.92;
    const inner = Math.sign(K[i]); // +: inner side is +n
    const aw = Math.abs(p.w), sg = Math.sign(p.w) || 1;
    // a = offset along +n, b = offset along -n (both as positive distances, signed by face)
    let a = aw, b = aw;
    if (inner > 0) a = Math.min(a, rho); else if (inner < 0) b = Math.min(b, rho);
    p.a = sg * a; p.b = sg * b;
  });
  // split into faces at sign changes
  const faces = []; let cur = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    if (Math.sign(a.w) !== Math.sign(b.w) && a.w !== 0 && b.w !== 0) {
      const t = a.w / (a.w - b.w);
      const z = { s: a.s + (b.s - a.s) * t, c: [a.c[0] + (b.c[0] - a.c[0]) * t, a.c[1] + (b.c[1] - a.c[1]) * t], nx: a.nx, ny: a.ny, w: 0, a: 0, b: 0 };
      cur.push(z); faces.push(cur); cur = [z];
    }
    cur.push(b);
  }
  faces.push(cur);
  const f = (v) => v.toFixed(2);
  return faces.map((face) => {
    const left = face.map((p) => [p.c[0] + p.nx * p.a, p.c[1] + p.ny * p.a]);
    const right = face.map((p) => [p.c[0] - p.nx * p.b, p.c[1] - p.ny * p.b]).reverse();
    const all = [...left, ...right];
    const d = "M" + all.map(([x, y]) => `${f(x)} ${f(y)}`).join("L") + "Z";
    const mid = face[Math.floor(face.length / 2)];
    return { d, front: mid.w >= 0 };
  });
}
