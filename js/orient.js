/** Print poses. Only the 24 proper rotations. Lexicographic compare is element-by-element. */

function permutations(xs) {
  if (xs.length === 0) return [[]];
  const out = [];
  for (let i = 0; i < xs.length; i++) {
    const rest = xs.slice(0, i).concat(xs.slice(i + 1));
    for (const tail of permutations(rest)) out.push([xs[i], ...tail]);
  }
  return out;
}

function detSign(perm, signs) {
  const p = perm.slice();
  let sp = 1;
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 3; j++) {
      if (p[i] > p[j]) {
        sp = -sp;
        const tmp = p[i];
        p[i] = p[j];
        p[j] = tmp;
      }
    }
  }
  return sp * signs[0] * signs[1] * signs[2];
}

let ROTATIONS = null;
export function properRotations() {
  if (ROTATIONS) return ROTATIONS;
  ROTATIONS = [];
  const signsList = [];
  for (const a of [-1, 1]) {
    for (const b of [-1, 1]) {
      for (const c of [-1, 1]) signsList.push([a, b, c]);
    }
  }
  for (const perm of permutations([0, 1, 2])) {
    for (const signs of signsList) {
      if (detSign(perm, signs) === 1) ROTATIONS.push({ perm, signs });
    }
  }
  if (ROTATIONS.length !== 24) {
    throw new Error("expected 24 proper rotations, got " + ROTATIONS.length);
  }
  return ROTATIONS;
}

function mapCell(rot, x, y, z) {
  const min = [Infinity, Infinity, Infinity];
  for (const a of [0, 1]) {
    for (const b of [0, 1]) {
      for (const c of [0, 1]) {
        const corner = [x + a, y + b, z + c];
        const out = [0, 0, 0];
        for (let i = 0; i < 3; i++) out[i] = rot.signs[i] * corner[rot.perm[i]];
        for (let i = 0; i < 3; i++) if (out[i] < min[i]) min[i] = out[i];
      }
    }
  }
  return min;
}

function compareLex(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] < b[i]) return -1;
    if (a[i] > b[i]) return 1;
  }
  return 0;
}

/** Fewest cubes with nothing underneath, then shortest, then most on the bed. */
export function bestOrientation(cells) {
  const rots = properRotations();
  let best = null;
  for (let ri = 0; ri < rots.length; ri++) {
    const mapped = cells.map(([x, y, z]) => mapCell(rots[ri], x, y, z));
    const mins = [0, 1, 2].map((i) => Math.min(...mapped.map((p) => p[i])));
    const norm = mapped.map((p) => [p[0] - mins[0], p[1] - mins[1], p[2] - mins[2]]);
    const set = new Set(norm.map((p) => p.join(",")));
    let unsupported = 0;
    let bed = 0;
    let maxZ = 0;
    for (const [x, y, z] of norm) {
      if (z === 0) bed += 1;
      else if (!set.has(x + "," + y + "," + (z - 1))) unsupported += 1;
      if (z > maxZ) maxZ = z;
    }
    const height = maxZ + 1;
    const key = [unsupported, height, -bed, ri];
    if (!best || compareLex(key, best.key) < 0) {
      best = { key, cells: norm, unsupported, height, bed, rotation: ri };
    }
  }
  return best;
}

/** Known check: 38 poses sit flat, and they are exactly the ones that come apart. */
export function auditOrientations(cubes) {
  let zero = 0;
  let agree = 0;
  for (const d of cubes) {
    const pose = bestOrientation(d.cells);
    if (pose.unsupported === 0) zero += 1;
    if (pose.unsupported === 0 && !d.locked) agree += 1;
    if (pose.unsupported > 0 && d.locked) agree += 1;
    if (d.locked && (pose.unsupported < 1 || pose.unsupported > 2)) {
      throw new Error("locked piece " + d.id + " has unsupported " + pose.unsupported);
    }
  }
  if (zero !== 38 || agree !== 65) {
    throw new Error("orientation audit failed: flat " + zero + ", agree " + agree);
  }
}
