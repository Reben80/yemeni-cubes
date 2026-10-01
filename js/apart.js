import { loadData, BURST_Y, BURST_Z, PIECE_COLORS, separation } from "./data.js";
import { mountViewer } from "./view.js";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let data;
let viewer;
let id = 1;
let pattern = BURST_Y;
let playing = !reduced;
let start = performance.now();
let hold = 0;

function smooth(x) { return x * x * (3 - 2 * x); }

function distNow(now) {
  if (!playing) return hold;
  const u = ((now - start) / 1000) % 7.4;
  const open = 1.55;
  if (u < 0.8) return 0;
  if (u < 2.8) return open * smooth((u - 0.8) / 2);
  if (u < 4.2) return open;
  if (u < 6.2) return open * (1 - smooth((u - 4.2) / 2));
  return 0;
}

function apply(now) {
  const d = data.byId.get(id);
  const amount = d.locked || reduced ? 0 : distNow(now);
  if (!playing) hold = amount;
  viewer.setMotion(pattern.map(([x, y, z]) => [x * amount, y * amount, z * amount]));
  requestAnimationFrame(apply);
}

function syncButtons() {
  const d = data.byId.get(id);
  document.querySelector("#pinwheel").setAttribute("aria-pressed", String(pattern === BURST_Y));
  document.querySelector("#vertical").setAttribute("aria-pressed", String(pattern === BURST_Z));
  document.querySelector("#vertical").disabled = d.nfree < 2;
  document.querySelector("#play").disabled = d.locked;
  const note = document.querySelector("#apart-note");
  const kind = separation(d);
  if (kind === "none") {
    note.textContent = "Dissection #" + id + " cannot be separated at all. No group of pieces can be translated away along an axis, so there is no burst.";
  } else if (kind === "group") {
    note.textContent = "Dissection #" + id + ": no single piece slides free. A pair can leave together, and then the rest separates. The burst is only drawn for the 38 where one piece slides out.";
  } else if (pattern === BURST_Y) {
    note.textContent = "All eight leave at once. Two pieces to each of the four sides. Nothing up or down.";
  } else {
    note.textContent = "The second way. Four pieces straight up, four straight down.";
  }
  const dirs = document.querySelector("#dirs");
  dirs.replaceChildren();
  pattern.forEach((v, i) => {
    const name = v[0] === 1 ? "+x" : v[0] === -1 ? "−x" : v[1] === 1 ? "+y" : v[1] === -1 ? "−y" : v[2] === 1 ? "+z" : "−z";
    const row = document.createElement("div");
    const sw = document.createElement("i");
    sw.style.background = PIECE_COLORS[i];
    row.append(sw, document.createTextNode(" " + i));
    const lab = document.createElement("div");
    lab.textContent = name;
    dirs.append(row, lab);
  });
}

function show(next) {
  id = next;
  const d = data.byId.get(id);
  if (d.nfree < 2 && pattern === BURST_Z) pattern = BURST_Y;
  viewer.show(d);
  document.querySelector("#pick").value = String(id);
  history.replaceState(null, "", "#" + id);
  syncButtons();
  start = performance.now();
}

document.querySelector("#pinwheel").addEventListener("click", () => {
  pattern = BURST_Y;
  start = performance.now();
  syncButtons();
});
document.querySelector("#vertical").addEventListener("click", () => {
  pattern = BURST_Z;
  start = performance.now();
  syncButtons();
});
document.querySelector("#play").addEventListener("click", () => {
  playing = true;
  start = performance.now();
});
document.querySelector("#pick").addEventListener("change", (e) => {
  show(Number(e.target.value));
});

loadData().then((d) => {
  data = d;
  const sel = document.querySelector("#pick");
  for (const cube of data.cubes) {
    const opt = document.createElement("option");
    opt.value = String(cube.id);
    const kind = separation(cube);
    const tag = kind === "none" ? " — cannot be separated" : kind === "group" ? " — a group moves first" : cube.nfree === 2 ? " — two ways" : " — a piece slides out";
    opt.textContent = "#" + cube.id + tag;
    sel.append(opt);
  }
  viewer = mountViewer(document.querySelector("#stage"));
  const hash = Number(location.hash.slice(1));
  show(hash >= 1 && hash <= 65 ? hash : 1);
  requestAnimationFrame(apply);
}).catch((err) => {
  document.querySelector("#apart-note").textContent = err.message;
});
