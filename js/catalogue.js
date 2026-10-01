import { loadData, PIECE_COLORS, outsideTwin, twinRelation, isExtruded, separation, separationLabel } from "./data.js";
import { mountViewer } from "./view.js";
import { renderLayers, renderNet, renderLegend } from "./faces.js";

const filters = new Set();
let data;
let viewer;
let current = null;

const FILTERS = [
  ["twice", (d) => d.twin != null],
  ["printset", (d) => twinRelation(d.id) === "rotation"],
  ["apart", (d) => separation(d) === "single"],
  ["group", (d) => separation(d) === "group"],
  ["fused", (d) => separation(d) === "none"],
  ["outside", (d) => outsideTwin(d.id) != null],
  ["flat", (d) => isExtruded(d.id)],
  ["two", (d) => d.nfree === 2],
  ["thin", (d) => d.thin],
  ["tree", (d) => d.rank === 0],
];

function passes(d) {
  for (const [key, test] of FILTERS) {
    if (filters.has(key) && !test(d)) return false;
  }
  return true;
}

function mini(grid) {
  const wrap = document.createElement("div");
  wrap.className = "mini";
  for (let z = 3; z >= 0; z--) {
    const g = document.createElement("div");
    g.className = "mini-grid";
    for (let y = 3; y >= 0; y--) {
      for (let x = 0; x < 4; x++) {
        const s = document.createElement("i");
        s.style.background = PIECE_COLORS[grid[z][y][x]];
        g.append(s);
      }
    }
    wrap.append(g);
  }
  return wrap;
}

function blurb(d) {
  const bits = ["S" + d.shape];
  bits.push(separationLabel(d));
  if (d.twin != null) bits.push("twin #" + d.twin);
  return bits.join(" · ");
}

function renderCards() {
  const host = document.querySelector("#cards");
  const list = data.cubes.filter(passes);
  document.querySelector("#shown").textContent = list.length + " of 65";
  host.replaceChildren();
  for (const d of list) {
    const btn = document.createElement("button");
    btn.className = "card" + (current === d.id ? " on" : "");
    btn.type = "button";
    const title = document.createElement("b");
    title.textContent = "#" + d.id;
    const small = document.createElement("small");
    small.textContent = blurb(d);
    btn.append(title, mini(d.grid), small);
    btn.addEventListener("click", () => openId(d.id, true));
    host.append(btn);
  }
}

function stat(label, value) {
  const li = document.createElement("li");
  const s = document.createElement("span");
  s.textContent = label;
  li.append(s, document.createTextNode(value));
  return li;
}

function takingApart(d) {
  const kind = separation(d);
  if (kind === "single") {
    const ways = d.nfree === 2 ? "yes, two ways (" + d.freeNames.join(", ") + ")" : "yes, " + d.freeNames.join(", ");
    return ways + ". The whole cube then comes apart.";
  }
  if (kind === "group") return "no single piece slides free. A pair can leave together, and then the rest separates.";
  return "cannot be separated at all, by any straight axis motion of any subset.";
}

function fillStats(d) {
  const ul = document.querySelector("#stats");
  ul.replaceChildren();
  ul.append(
    stat("Shape", "S" + d.shape),
    stat("Surface", String(d.surface)),
    stat("Cycle rank", d.rank === 0 ? "0 — a tree" : String(d.rank)),
    stat("Bounding box", d.bbox.join("×")),
    stat("Condition 6", d.thin ? "no 2×2×1 slab" : "has a 2×2×1 slab"),
    stat("Taking apart", takingApart(d))
  );
  const rel = twinRelation(d.id);
  if (d.twin != null) {
    const how = rel === "rotation" ? "same shape by a rotation" : "same shape by a mirror only";
    ul.append(stat("Twin", "#" + d.twin + " — " + how));
  } else {
    ul.append(stat("Twin", "none"));
  }
  const out = outsideTwin(d.id);
  ul.append(stat("Outside twin", out ? "#" + out : "none"));
  if (isExtruded(d.id)) {
    ul.append(stat("Flat ancestor", d.id === 1 ? "T-tetromino, two layers" : "L-tetromino, two layers"));
  }

  const actions = document.querySelector("#detail-actions");
  actions.replaceChildren();
  if (d.twin != null) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = "Show twin #" + d.twin;
    b.addEventListener("click", () => openId(d.twin, false));
    actions.append(b);
  }
  if (out) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = "Show outside twin #" + out;
    b.addEventListener("click", () => openId(out, false));
    actions.append(b);
  }
  const apart = document.createElement("a");
  apart.className = "button";
  apart.href = "apart.html#" + d.id;
  apart.textContent = separation(d) === "single" ? "Watch it come apart" : separationLabel(d);
  actions.append(apart);
  const print = document.createElement("a");
  print.className = "button";
  print.href = "print.html#" + d.id;
  print.textContent = "Print this piece";
  actions.append(print);
}

function openId(id, scroll) {
  const d = data.byId.get(id);
  if (!d) return;
  current = id;
  history.replaceState(null, "", "#" + id);
  document.querySelector("#detail").hidden = false;
  document.querySelector("#detail-title").textContent = "Dissection #" + id;
  const note = document.querySelector("#detail-note");
  if (id === 1) {
    note.hidden = false;
    note.textContent = "Layers z = 0 and z = 1 are the same T pinwheel. Layers z = 2 and z = 3 are the same again. Two flat squares, stacked.";
  } else if (id === 13) {
    note.hidden = false;
    note.textContent = "The piece is an L-tetromino, two layers thick. The other flat Yemeni square.";
  } else {
    note.hidden = true;
    note.textContent = "";
  }
  if (!viewer) viewer = mountViewer(document.querySelector("#detail-stage"));
  viewer.show(d);
  viewer.setMotion(Array.from({ length: 8 }, () => [0, 0, 0]));
  renderLayers(document.querySelector("#detail-layers"), d.grid);
  renderNet(document.querySelector("#detail-net"), d.grid);
  renderLegend(document.querySelector("#legend"));
  fillStats(d);
  renderCards();
  requestAnimationFrame(() => viewer.resize());
  if (scroll) document.querySelector("#detail").scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelectorAll(".filters button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.filter;
    if (filters.has(key)) filters.delete(key);
    else filters.add(key);
    btn.setAttribute("aria-pressed", String(filters.has(key)));
    renderCards();
  });
});

document.querySelector("#close-detail").addEventListener("click", () => {
  current = null;
  history.replaceState(null, "", location.pathname);
  document.querySelector("#detail").hidden = true;
  renderCards();
});

loadData().then((d) => {
  data = d;
  renderCards();
  const hash = Number(location.hash.slice(1));
  if (hash >= 1 && hash <= 65) openId(hash, true);
}).catch((err) => {
  document.querySelector("#shown").textContent = err.message;
});
