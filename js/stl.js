/**
 * Print models for a 20 mm cell.
 * Coordinates: x right, y away, z up. Proper rotations only — the mesh is never mirrored.
 * The piece sits on the bed. Do not auto-orient it in the slicer.
 */

import { bestOrientation } from "./orient.js";

const CELL = 20;
const BODY = 18.4;
const INSET = (CELL - BODY) / 2;
const NECK = 17.2;
const NECK_OFF = (CELL - NECK) / 2;
const OVERLAP = 0.05;

function addTri(tris, a, b, c) {
  const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const n = [
    ab[1] * ac[2] - ab[2] * ac[1],
    ab[2] * ac[0] - ab[0] * ac[2],
    ab[0] * ac[1] - ab[1] * ac[0],
  ];
  const len = Math.hypot(n[0], n[1], n[2]);
  if (len < 1e-8) return;
  tris.push([a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]]);
}

function addQuad(tris, a, b, c, d) {
  addTri(tris, a, b, c);
  addTri(tris, a, c, d);
}

function addBox(tris, min, max) {
  const [x0, y0, z0] = min;
  const [x1, y1, z1] = max;
  addQuad(tris, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]);
  addQuad(tris, [x0, y0, z0], [x0, y1, z0], [x1, y1, z0], [x1, y0, z0]);
  addQuad(tris, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]);
  addQuad(tris, [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]);
  addQuad(tris, [x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0]);
  addQuad(tris, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]);
}

function squareCorners(width, z) {
  const h = width / 2;
  return [
    [-h, -h, z],
    [h, -h, z],
    [h, h, z],
    [-h, h, z],
  ];
}

function addOuterWall(tris, z0, z1, w0, w1) {
  const a = squareCorners(w0, z0);
  const b = squareCorners(w1, z1);
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    addQuad(tris, a[i], a[j], b[j], b[i]);
  }
}

function addInnerWall(tris, z0, z1, w0, w1) {
  const a = squareCorners(w0, z0);
  const b = squareCorners(w1, z1);
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    addQuad(tris, a[j], a[i], b[i], b[j]);
  }
}

function addAnnulus(tris, z, outer, inner, up) {
  const o = squareCorners(outer, z);
  const inn = squareCorners(inner, z);
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    if (up) addQuad(tris, o[i], o[j], inn[j], inn[i]);
    else addQuad(tris, o[i], inn[i], inn[j], o[j]);
  }
}

export function pieceTriangles(cells) {
  const pose = bestOrientation(cells);
  const tris = [];
  const set = new Set(pose.cells.map((c) => c.join(",")));
  for (const [x, y, z] of pose.cells) {
    const min = [x * CELL + INSET, y * CELL + INSET, z * CELL + INSET - INSET];
    addBox(tris, min, [min[0] + BODY, min[1] + BODY, min[2] + BODY]);
  }
  const dirs = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (const [x, y, z] of pose.cells) {
    for (const [dx, dy, dz] of dirs) {
      if (!set.has((x + dx) + "," + (y + dy) + "," + (z + dz))) continue;
      const min = [0, 0, 0];
      const max = [0, 0, 0];
      const base = [x, y, z];
      const step = [dx, dy, dz];
      for (let i = 0; i < 3; i++) {
        if (step[i]) {
          const left = base[i] * CELL + INSET + BODY;
          min[i] = left - OVERLAP;
          max[i] = left + (CELL - BODY) + OVERLAP;
        } else {
          min[i] = base[i] * CELL + NECK_OFF;
          max[i] = min[i] + NECK;
        }
      }
      min[2] -= INSET;
      max[2] -= INSET;
      addBox(tris, min, max);
    }
  }
  let minX = Infinity, minY = Infinity;
  for (const t of tris) {
    for (let k = 0; k < 9; k += 3) {
      if (t[k] < minX) minX = t[k];
      if (t[k + 1] < minY) minY = t[k + 1];
    }
  }
  for (const t of tris) {
    for (let k = 0; k < 9; k += 3) {
      t[k] -= minX;
      t[k + 1] -= minY;
    }
  }
  return { triangles: tris, pose };
}

export function caseTriangles() {
  const base = [];
  addAnnulus(base, 0, 83.2, 26, false);
  addOuterWall(base, 0, 0.8, 83.2, 83.2);
  addAnnulus(base, 0.8, 84.4, 83.2, false);
  addOuterWall(base, 0.8, 87.8, 84.4, 84.4);
  addInnerWall(base, 0, 9, 26, 26);
  addAnnulus(base, 9, 79.6, 26, true);
  addInnerWall(base, 9, 84.8, 79.6, 79.6);
  addInnerWall(base, 84.8, 87.8, 79.6, 81.2);
  addAnnulus(base, 87.8, 84.4, 81.2, true);

  const lid = [];
  addAnnulus(lid, 0, 90.2, 85.4, false);
  addOuterWall(lid, 0, 16.4, 90.2, 90.2);
  addInnerWall(lid, 0, 14, 85.4, 85.4);
  addQuad(lid,
    [-42.7, -42.7, 14],
    [-42.7, 42.7, 14],
    [42.7, 42.7, 14],
    [42.7, -42.7, 14]
  );
  addQuad(lid,
    [-45.1, -45.1, 16.4],
    [45.1, -45.1, 16.4],
    [45.1, 45.1, 16.4],
    [-45.1, 45.1, 16.4]
  );

  const cavityRing = [];
  addAnnulus(cavityRing, 0, 84.4, 79.6, false);
  addOuterWall(cavityRing, 0, 5, 84.4, 84.4);
  addInnerWall(cavityRing, 0, 2, 79.6, 79.6);
  addInnerWall(cavityRing, 2, 5, 79.6, 81.2);
  addAnnulus(cavityRing, 5, 84.4, 81.2, true);

  const lidRing = [];
  addAnnulus(lidRing, 0, 90.2, 85.4, false);
  addOuterWall(lidRing, 0, 5, 90.2, 90.2);
  addInnerWall(lidRing, 0, 5, 85.4, 85.4);
  addAnnulus(lidRing, 5, 90.2, 85.4, true);

  return { base, lid, cavityRing, lidRing };
}

export function previewPair(base, lid) {
  const tris = base.map((t) => t.slice());
  for (const t of lid) {
    const u = t.slice();
    u[2] += 110;
    u[5] += 110;
    u[8] += 110;
    tris.push(u);
  }
  return tris;
}

export function encodeSTL(triangles, label) {
  const buf = new ArrayBuffer(84 + triangles.length * 50);
  const view = new DataView(buf);
  const bytes = new Uint8Array(buf);
  const text = new TextEncoder().encode(label);
  bytes.set(text.subarray(0, Math.min(79, text.length)), 0);
  view.setUint32(80, triangles.length, true);
  let o = 84;
  for (const t of triangles) {
    const ab = [t[3] - t[0], t[4] - t[1], t[5] - t[2]];
    const ac = [t[6] - t[0], t[7] - t[1], t[8] - t[2]];
    let nx = ab[1] * ac[2] - ab[2] * ac[1];
    let ny = ab[2] * ac[0] - ab[0] * ac[2];
    let nz = ab[0] * ac[1] - ab[1] * ac[0];
    const len = Math.hypot(nx, ny, nz) || 1;
    nx /= len; ny /= len; nz /= len;
    view.setFloat32(o, nx, true); o += 4;
    view.setFloat32(o, ny, true); o += 4;
    view.setFloat32(o, nz, true); o += 4;
    for (let k = 0; k < 9; k++) {
      view.setFloat32(o, t[k], true);
      o += 4;
    }
    view.setUint16(o, 0, true);
    o += 2;
  }
  return buf;
}

export function downloadSTL(triangles, filename, label) {
  const blob = new Blob([encodeSTL(triangles, label)], { type: "model/stl" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
