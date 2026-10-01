import { loadData, separation } from "./data.js";
import { auditOrientations, bestOrientation } from "./orient.js";
import { mountSolid } from "./view.js";
import { pieceTriangles, caseTriangles, previewPair, downloadSTL } from "./stl.js";

let data;
let id = 1;
let solid;
const models = caseTriangles();

function poseLine(cells) {
  const pose = bestOrientation(cells);
  if (pose.unsupported === 0) return "In this file, nothing is hanging. Every cube has something underneath it.";
  const word = pose.unsupported === 1 ? "one cube has" : "two cubes have";
  return "In this file, " + word + " nothing underneath. No single piece of this dissection slides free.";
}

function showPiece() {
  const d = data.byId.get(id);
  const { triangles, pose } = pieceTriangles(d.cells);
  if (solid) solid.dispose();
  solid = mountSolid(document.querySelector("#piece-stage"), triangles, 0xe4d3b4);
  document.querySelector("#pose-line").textContent = poseLine(d.cells);
  document.querySelector("#piece-label").textContent = "Dissection #" + id + ", shape S" + d.shape + ". One piece, already turned for the bed.";
  document.querySelector("#dl-piece").textContent = "Download piece #" + id;
  history.replaceState(null, "", "#" + id);
  document.querySelector("#pick").value = String(id);
  void pose;
}

document.querySelector("#pick").addEventListener("change", (e) => {
  id = Number(e.target.value);
  showPiece();
});

document.querySelector("#dl-piece").addEventListener("click", () => {
  const d = data.byId.get(id);
  const { triangles } = pieceTriangles(d.cells);
  const n = String(id).padStart(2, "0");
  downloadSTL(triangles, "yemeni-piece-" + n + ".stl", "Yemeni cube piece " + id + " — do not mirror");
});
document.querySelector("#dl-base").addEventListener("click", () => {
  downloadSTL(models.base, "yemeni-case-base.stl", "Yemeni cube case base — do not mirror");
});
document.querySelector("#dl-lid").addEventListener("click", () => {
  downloadSTL(models.lid, "yemeni-case-lid.stl", "Yemeni cube case lid — do not mirror");
});
document.querySelector("#dl-cavity").addEventListener("click", () => {
  downloadSTL(models.cavityRing, "yemeni-fit-cavity.stl", "Yemeni cube cavity-mouth fit ring");
});
document.querySelector("#dl-skirt").addEventListener("click", () => {
  downloadSTL(models.lidRing, "yemeni-fit-lid.stl", "Yemeni cube lid-skirt fit ring");
});

loadData().then((d) => {
  data = d;
  auditOrientations(data.cubes);
  const sel = document.querySelector("#pick");
  for (const cube of data.cubes) {
    const opt = document.createElement("option");
    opt.value = String(cube.id);
    const kind = separation(cube);
    const tag = kind === "none" ? " — cannot be separated" : kind === "group" ? " — a group moves first" : "";
    opt.textContent = "#" + cube.id + " — S" + cube.shape + tag;
    sel.append(opt);
  }
  const hash = Number(location.hash.slice(1));
  if (hash >= 1 && hash <= 65) id = hash;
  showPiece();
  mountSolid(document.querySelector("#case-stage"), previewPair(models.base, models.lid), 0xd9c7a8);
}).catch((err) => {
  document.querySelector("#pose-line").textContent = err.message;
});
