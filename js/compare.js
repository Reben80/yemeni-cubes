import { loadData, OUTSIDE_PAIRS, TWIN_RELATION, APART_PRINTABLE, outsideTwin, twinRelation } from "./data.js";
import { mountViewer } from "./view.js";
import { renderLayers, renderNet, renderLegend } from "./faces.js";

const page = document.body.dataset.page;
const isOutside = page === "outside";
let data;
let viewer;
let pair = isOutside ? [3, 4] : [25, 44];
let showing = 0;
let pull = 0;

function other(id) {
  return isOutside ? outsideTwin(id) : data.byId.get(id).twin;
}

function paint() {
  const id = pair[showing];
  const d = data.byId.get(id);
  viewer.show(d);
  const vecs = Array.from({ length: 8 }, () => [0, 0, 0]);
  vecs[0] = [0, -pull * 2.2, 0];
  viewer.setMotion(vecs);
  renderLayers(document.querySelector("#layers"), d.grid);
  renderNet(document.querySelector("#net"), d.grid);
  renderLegend(document.querySelector("#legend"));
  const title = document.querySelector("#which");
  title.textContent = "Dissection #" + id;
  const meta = document.querySelector("#meta");
  const bits = [
    "Shape S" + d.shape,
    "surface " + d.surface,
    d.rank === 0 ? "cycle rank 0 — a tree" : "cycle rank " + d.rank,
    d.locked ? "interlocked" : "comes apart",
  ];
  if (!isOutside) {
    const rel = twinRelation(id);
    bits.push(rel === "rotation" ? "one printed set builds both" : "mirror only — one printed set does not build both");
  }
  meta.textContent = bits.join(" · ");
  const btn = document.querySelector("#flip");
  const alt = pair[1 - showing];
  btn.textContent = "Show #" + alt;
  document.querySelectorAll("tr.pick").forEach((tr) => {
    tr.classList.toggle("on", Number(tr.dataset.a) === pair[0] && Number(tr.dataset.b) === pair[1]);
  });
}

function choose(a, b) {
  pair = [a, b];
  showing = 0;
  pull = 0;
  const slider = document.querySelector("#pull");
  if (slider) slider.value = "0";
  paint();
}

function buildTable() {
  const body = document.querySelector("#pair-body");
  const rows = isOutside ? OUTSIDE_PAIRS : twinRows();
  for (const [a, b] of rows) {
    const tr = document.createElement("tr");
    tr.className = "pick";
    tr.dataset.a = String(a);
    tr.dataset.b = String(b);
    const da = data.byId.get(a);
    const db = data.byId.get(b);
    if (isOutside) {
      tr.innerHTML = "<td>#" + a + ", #" + b + "</td><td>" + da.surface + " / " + db.surface + "</td><td>" + da.rank + " / " + db.rank + "</td><td>S" + da.shape + ", S" + db.shape + "</td>";
    } else {
      const rel = TWIN_RELATION[a];
      const yes = rel === "rotation";
      const apart = APART_PRINTABLE.some(([x, y]) => x === a && y === b);
      tr.innerHTML = "<td>#" + a + ", #" + b + "</td><td>" + (yes ? "rotation" : "mirror only") + "</td><td>" + (yes ? "yes" : "no") + "</td><td>" + (apart ? "yes" : "no") + "</td>";
    }
    tr.addEventListener("click", () => choose(a, b));
    body.append(tr);
  }
}

function twinRows() {
  const seen = new Set();
  const rows = [];
  for (const id of Object.keys(TWIN_RELATION).map(Number).sort((a, b) => a - b)) {
    const otherId = data.byId.get(id).twin;
    const key = Math.min(id, otherId) + "-" + Math.max(id, otherId);
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push([Math.min(id, otherId), Math.max(id, otherId)]);
  }
  const order = [8, 18, 21, 25, 47, 48, 53, 2, 15, 16, 43, 50];
  rows.sort((p, q) => order.indexOf(p[0]) - order.indexOf(q[0]));
  return rows;
}

document.querySelector("#flip").addEventListener("click", () => {
  showing = 1 - showing;
  paint();
});

const slider = document.querySelector("#pull");
if (slider) {
  slider.addEventListener("input", () => {
    pull = Number(slider.value);
    const vecs = Array.from({ length: 8 }, () => [0, 0, 0]);
    vecs[0] = [0, -pull * 2.2, 0];
    viewer.setMotion(vecs);
  });
}

loadData().then((d) => {
  data = d;
  viewer = mountViewer(document.querySelector("#stage"));
  buildTable();
  paint();
}).catch((err) => {
  document.querySelector("#meta").textContent = err.message;
});
