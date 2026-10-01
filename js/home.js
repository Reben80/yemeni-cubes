import { loadData, BURST_Y, BURST_Z, orbitsGrid } from "./data.js";
import { mountViewer } from "./view.js";
import { renderLayers } from "./faces.js";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const stage = document.querySelector("#stage");
const status = document.querySelector("#burst-status");
let pattern = BURST_Y;
let mode = "y";
let viewer;
let cube;
let start = performance.now() - 1800;

function distAt(t) {
  const cycle = 7.4;
  const u = (t % cycle);
  const open = 1.45;
  if (u < 1.0) return 0;
  if (u < 3.1) return open * smooth((u - 1.0) / 2.1);
  if (u < 4.3) return open;
  if (u < 6.3) return open * (1 - smooth((u - 4.3) / 2.0));
  return 0;
}
function smooth(x) { return x * x * (3 - 2 * x); }

function apply(now) {
  if (!viewer) return;
  const d = reduced ? 0 : distAt((now - start) / 1000);
  viewer.setMotion(pattern.map(([x, y, z]) => [x * d, y * d, z * d]));
  requestAnimationFrame(apply);
}

function setMode(next) {
  mode = next;
  pattern = next === "z" ? BURST_Z : BURST_Y;
  start = performance.now();
  document.querySelector("#pinwheel").setAttribute("aria-pressed", String(next === "y"));
  document.querySelector("#vertical").setAttribute("aria-pressed", String(next === "z"));
  status.textContent = next === "y"
    ? "Dissection #1. Two pieces to each side. Nothing up or down."
    : "Dissection #1. Four pieces up, four pieces down.";
}

document.querySelector("#pinwheel").addEventListener("click", () => setMode("y"));
document.querySelector("#vertical").addEventListener("click", () => setMode("z"));
document.querySelector("#replay").addEventListener("click", () => { start = performance.now(); });

const strict = document.querySelector("#strict");
const strictNote = document.querySelector("#strict-note");
strict.addEventListener("click", () => {
  const on = strict.getAttribute("aria-pressed") !== "true";
  strict.setAttribute("aria-pressed", String(on));
  strictNote.hidden = !on;
});

loadData().then(({ byId, group }) => {
  cube = byId.get(1);
  viewer = mountViewer(stage);
  viewer.show(cube);
  requestAnimationFrame(apply);
  const orbitColors = ["#f7f1e6", "#ead7b8", "#d7b48a", "#c4926a", "#a86d4e", "#8a4e38", "#6b3a2e", "#3e2a24"];
  renderLayers(document.querySelector("#orbits"), orbitsGrid(group.ORB), { numbers: true, colors: orbitColors });
  renderLayers(document.querySelector("#pic-t"), byId.get(1).grid, { onlyZ: 0, numbers: false });
  renderLayers(document.querySelector("#pic-l"), byId.get(13).grid, { onlyZ: 0, numbers: false });
}).catch((err) => {
  status.textContent = err.message;
});
