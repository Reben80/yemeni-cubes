/** Figures and labels taken from the brief. Do not extend this table. */

export const PIECE_COLORS = [
  "#d84a3a",
  "#e0a11a",
  "#3b6fe0",
  "#1c946c",
  "#e07a32",
  "#7d5cc4",
  "#d23f70",
  "#6d8c2e",
];

/** Burst offsets by piece index 0–7. */
export const BURST_Y = [
  [0, 1, 0],
  [0, -1, 0],
  [1, 0, 0],
  [1, 0, 0],
  [-1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
];

export const BURST_Z = [
  [0, 0, -1],
  [0, 0, 1],
  [0, 0, 1],
  [0, 0, -1],
  [0, 0, -1],
  [0, 0, 1],
  [0, 0, 1],
  [0, 0, -1],
];

/** Outside pairs that share a seam pattern. */
export const OUTSIDE_PAIRS = [
  [3, 4], [10, 11], [19, 20], [22, 23], [26, 27], [31, 32],
  [42, 43], [45, 46], [49, 50], [51, 52], [53, 54], [56, 57],
  [62, 63], [64, 65],
];

const outsideMap = new Map();
for (const [a, b] of OUTSIDE_PAIRS) {
  outsideMap.set(a, b);
  outsideMap.set(b, a);
}
export function outsideTwin(id) {
  return outsideMap.get(id) ?? null;
}

/**
 * How the two dissections in a twin pair are related.
 * rotation: one printed set builds both. mirror: it does not.
 */
export const TWIN_RELATION = {
  8: "rotation", 24: "rotation",
  18: "rotation", 40: "rotation",
  21: "rotation", 36: "rotation",
  25: "rotation", 44: "rotation",
  47: "rotation", 65: "rotation",
  48: "rotation", 64: "rotation",
  53: "rotation", 57: "rotation",
  2: "mirror", 41: "mirror",
  15: "mirror", 58: "mirror",
  16: "mirror", 59: "mirror",
  43: "mirror", 45: "mirror",
  50: "mirror", 51: "mirror",
};

export const PRINTABLE_PAIRS = [
  [8, 24], [18, 40], [21, 36], [25, 44], [47, 65], [48, 64], [53, 57],
];

export const APART_PRINTABLE = [[8, 24], [25, 44], [53, 57]];

export function twinRelation(id) {
  return TWIN_RELATION[id] ?? null;
}

export function isExtruded(id) {
  return id === 1 || id === 13;
}

let cache = null;

export function loadData() {
  if (!cache) {
    cache = Promise.all([
      fetch("cubes65.json").then((r) => {
        if (!r.ok) throw new Error("Could not load cubes65.json");
        return r.json();
      }),
      fetch("group.json").then((r) => {
        if (!r.ok) throw new Error("Could not load group.json");
        return r.json();
      }),
    ]).then(([cubes, group]) => {
      const byId = new Map(cubes.map((d) => [d.id, d]));
      return { cubes, group, byId };
    });
  }
  return cache;
}

export function piecesFromGrid(grid) {
  const pieces = [[], [], [], [], [], [], [], []];
  for (let z = 0; z < 4; z++) {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        pieces[grid[z][y][x]].push([x, y, z]);
      }
    }
  }
  return pieces;
}

export function orbitsGrid(orb) {
  const grid = [];
  for (let z = 0; z < 4; z++) {
    const plane = [];
    for (let y = 0; y < 4; y++) {
      const row = [];
      for (let x = 0; x < 4; x++) row.push(orb[x + 4 * y + 16 * z]);
      plane.push(row);
    }
    grid.push(plane);
  }
  return grid;
}
