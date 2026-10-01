import { PIECE_COLORS } from "./data.js";

/**
 * Layer and net drawings.
 * Looking down a layer: y increases up the page, x increases to the right.
 * Net: top; then left, front, right, back; then bottom.
 * Axes: x right, y away from the viewer, z up. Front is y = 0.
 */

function faceMatrix(grid, name) {
  const m = [];
  for (let row = 0; row < 4; row++) {
    const line = [];
    for (let col = 0; col < 4; col++) {
      let id = 0;
      if (name === "front") id = grid[3 - row][0][col];
      else if (name === "top") id = grid[3][3 - row][col];
      else if (name === "left") id = grid[3 - row][3 - col][0];
      else if (name === "right") id = grid[3 - row][col][3];
      else if (name === "back") id = grid[3 - row][3][3 - col];
      else if (name === "bottom") id = grid[0][row][col];
      line.push(id);
    }
    m.push(line);
  }
  return m;
}

function assertCreases(grid) {
  const front = faceMatrix(grid, "front");
  const top = faceMatrix(grid, "top");
  const left = faceMatrix(grid, "left");
  const right = faceMatrix(grid, "right");
  const back = faceMatrix(grid, "back");
  const bottom = faceMatrix(grid, "bottom");
  for (let i = 0; i < 4; i++) {
    if (front[0][i] !== top[3][i]) throw new Error("top/front crease");
    if (left[i][3] !== front[i][0]) throw new Error("left/front crease");
    if (front[i][3] !== right[i][0]) throw new Error("front/right crease");
    if (right[i][3] !== back[i][0]) throw new Error("right/back crease");
    if (front[3][i] !== bottom[0][i]) throw new Error("front/bottom crease");
  }
}

function cellEl(id, borders, withNumber, colors) {
  const el = document.createElement("span");
  el.className = "sq";
  el.style.background = colors[id];
  el.style.borderTopWidth = borders[0];
  el.style.borderRightWidth = borders[1];
  el.style.borderBottomWidth = borders[2];
  el.style.borderLeftWidth = borders[3];
  if (withNumber) el.textContent = String(id);
  return el;
}

function seam(a, b) {
  return a !== b ? "2.5px" : "1px";
}

export function renderLayers(root, grid, opts = {}) {
  const withNumber = opts.numbers !== false;
  const colors = opts.colors || PIECE_COLORS;
  const zs = opts.onlyZ != null ? [opts.onlyZ] : [3, 2, 1, 0];
  root.replaceChildren();
  assertCreases(grid);
  const note = document.createElement("p");
  note.className = "axes-note";
  note.textContent = "Looking down. The top row is the highest y. x increases to the right.";
  root.append(note);
  const row = document.createElement("div");
  row.className = "layer-row";
  for (const z of zs) {
    const fig = document.createElement("figure");
    fig.className = "layer";
    const cap = document.createElement("figcaption");
    cap.textContent = "z = " + z;
    const gridEl = document.createElement("div");
    gridEl.className = "layer-grid";
    for (let y = 3; y >= 0; y--) {
      for (let x = 0; x < 4; x++) {
        const id = grid[z][y][x];
        const up = y < 3 ? grid[z][y + 1][x] : null;
        const down = y > 0 ? grid[z][y - 1][x] : null;
        const left = x > 0 ? grid[z][y][x - 1] : null;
        const right = x < 3 ? grid[z][y][x + 1] : null;
        const borders = [
          up == null ? "2.5px" : seam(id, up),
          right == null ? "2.5px" : seam(id, right),
          down == null ? "2.5px" : seam(id, down),
          left == null ? "2.5px" : seam(id, left),
        ];
        gridEl.append(cellEl(id, borders, withNumber, colors));
      }
    }
    const xLab = document.createElement("div");
    xLab.className = "axis-x";
    xLab.textContent = "x →";
    fig.append(cap, gridEl, xLab);
    row.append(fig);
  }
  root.append(row);
}

function paintFace(matrix, neighbors) {
  const face = document.createElement("div");
  face.className = "net-face";
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const id = matrix[r][c];
      const up = r > 0 ? matrix[r - 1][c] : neighbors.up ? neighbors.up[3][c] : null;
      const down = r < 3 ? matrix[r + 1][c] : neighbors.down ? neighbors.down[0][c] : null;
      const left = c > 0 ? matrix[r][c - 1] : neighbors.left ? neighbors.left[r][3] : null;
      const right = c < 3 ? matrix[r][c + 1] : neighbors.right ? neighbors.right[r][0] : null;
      const borders = [
        up == null ? "2.5px" : seam(id, up),
        right == null ? "2.5px" : seam(id, right),
        down == null ? "2.5px" : seam(id, down),
        left == null ? "2.5px" : seam(id, left),
      ];
      // A crease that continues the same piece stays a hairline, already handled by seam().
      face.append(cellEl(id, borders, false, PIECE_COLORS));
    }
  }
  return face;
}

export function renderNet(root, grid) {
  root.replaceChildren();
  assertCreases(grid);
  const faces = {
    top: faceMatrix(grid, "top"),
    left: faceMatrix(grid, "left"),
    front: faceMatrix(grid, "front"),
    right: faceMatrix(grid, "right"),
    back: faceMatrix(grid, "back"),
    bottom: faceMatrix(grid, "bottom"),
  };
  const net = document.createElement("div");
  net.className = "net";
  const top = paintFace(faces.top, { down: faces.front });
  top.classList.add("net-top");
  const left = paintFace(faces.left, { right: faces.front });
  left.classList.add("net-left");
  const front = paintFace(faces.front, {
    up: faces.top,
    left: faces.left,
    right: faces.right,
    down: faces.bottom,
  });
  front.classList.add("net-front");
  const right = paintFace(faces.right, { left: faces.front, right: faces.back });
  right.classList.add("net-right");
  const back = paintFace(faces.back, { left: faces.right });
  back.classList.add("net-back");
  const bottom = paintFace(faces.bottom, { up: faces.front });
  bottom.classList.add("net-bottom");
  net.append(top, left, front, right, back, bottom);
  const note = document.createElement("p");
  note.className = "axes-note";
  note.textContent = "Outside of the cube. Top, then left, front, right, back, then bottom. Thick lines are seams between pieces.";
  root.append(net, note);
}

export function renderLegend(root) {
  root.replaceChildren();
  for (let i = 0; i < 8; i++) {
    const item = document.createElement("span");
    item.className = "legend-item";
    const sw = document.createElement("i");
    sw.style.background = PIECE_COLORS[i];
    item.append(sw, document.createTextNode(String(i)));
    root.append(item);
  }
}
