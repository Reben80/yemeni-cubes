import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PIECE_COLORS, piecesFromGrid } from "./data.js";

/**
 * Math axes: x right, y away from the viewer, z up.
 * Three.js: (X, Y, Z) = (x, z, −y), so Y is up and the camera on +Z looks at the front (y = 0).
 */

function toThree(x, y, z) {
  return [x - 2, z - 2, -(y - 2)];
}

const FACE_QUADS = [
  {
    dir: [1, 0, 0],
    corners(x, y, z) {
      const x1 = x + 1;
      return [
        [x1, y, z],
        [x1, y + 1, z],
        [x1, y + 1, z + 1],
        [x1, y, z + 1],
      ];
    },
  },
  {
    dir: [-1, 0, 0],
    corners(x, y, z) {
      return [
        [x, y, z],
        [x, y, z + 1],
        [x, y + 1, z + 1],
        [x, y + 1, z],
      ];
    },
  },
  {
    dir: [0, 1, 0],
    corners(x, y, z) {
      const y1 = y + 1;
      return [
        [x, y1, z],
        [x, y1, z + 1],
        [x + 1, y1, z + 1],
        [x + 1, y1, z],
      ];
    },
  },
  {
    dir: [0, -1, 0],
    corners(x, y, z) {
      return [
        [x, y, z],
        [x + 1, y, z],
        [x + 1, y, z + 1],
        [x, y, z + 1],
      ];
    },
  },
  {
    dir: [0, 0, 1],
    corners(x, y, z) {
      const z1 = z + 1;
      return [
        [x, y, z1],
        [x + 1, y, z1],
        [x + 1, y + 1, z1],
        [x, y + 1, z1],
      ];
    },
  },
  {
    dir: [0, 0, -1],
    corners(x, y, z) {
      return [
        [x, y, z],
        [x, y + 1, z],
        [x + 1, y + 1, z],
        [x + 1, y, z],
      ];
    },
  },
];

function pieceGeometry(cells) {
  const set = new Set(cells.map((c) => c.join(",")));
  const positions = [];
  function quad(corners) {
    const p = corners.map(([x, y, z]) => toThree(x, y, z));
    positions.push(...p[0], ...p[1], ...p[2], ...p[0], ...p[2], ...p[3]);
  }
  for (const [x, y, z] of cells) {
    for (const face of FACE_QUADS) {
      const nx = x + face.dir[0];
      const ny = y + face.dir[1];
      const nz = z + face.dir[2];
      if (set.has(nx + "," + ny + "," + nz)) continue;
      quad(face.corners(x, y, z));
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  return geo;
}

export function mountViewer(container) {
  const canvas = document.createElement("canvas");
  canvas.className = "view-canvas";
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "Rotatable 4 by 4 by 4 cube, eight pieces");
  const legend = document.createElement("p");
  legend.className = "view-axes";
  legend.textContent = "x right · y away · z up";
  container.replaceChildren(canvas, legend);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x171411, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
  camera.position.set(10.2, 8.1, 11.2);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.target.set(0, 0.2, 0);
  controls.update();

  scene.add(new THREE.HemisphereLight(0xfff4e8, 0x2a221c, 0.95));
  const key = new THREE.DirectionalLight(0xfffaf4, 1.25);
  key.position.set(5, 9, 6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xc9d7ef, 0.38);
  fill.position.set(-7, 3, -4);
  scene.add(fill);

  const root = new THREE.Group();
  scene.add(root);
  let groups = [];

  function resize() {
    const w = container.clientWidth || 320;
    const h = container.clientHeight || 320;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();

  let running = true;
  function frame() {
    if (!running) return;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  frame();

  function show(dissection) {
    for (const g of groups) {
      g.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      root.remove(g);
    }
    groups = [];
    const pieces = piecesFromGrid(dissection.grid);
    for (let i = 0; i < 8; i++) {
      const geo = pieceGeometry(pieces[i]);
      const mat = new THREE.MeshStandardMaterial({
        color: PIECE_COLORS[i],
        roughness: 0.58,
        metalness: 0.02,
        flatShading: true,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const group = new THREE.Group();
      group.scale.setScalar(0.985);
      group.add(mesh);
      root.add(group);
      groups.push(group);
    }
  }

  /** vecs[g] is a math-space offset in cell units. The camera is left alone. */
  function setMotion(vecs) {
    for (let g = 0; g < groups.length; g++) {
      const [dx, dy, dz] = vecs[g];
      groups[g].position.set(dx, dz, -dy);
    }
  }

  function dispose() {
    running = false;
    observer.disconnect();
    controls.dispose();
    renderer.dispose();
  }

  return { show, setMotion, resize, dispose };
}

/** Orbit a triangle mesh already in math millimetres (x right, y away, z up). */
export function mountSolid(container, triangles, color) {
  const canvas = document.createElement("canvas");
  canvas.className = "view-canvas";
  container.replaceChildren(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x171411, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 5000);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;

  const positions = [];
  let cx = 0, cy = 0, cz = 0, n = 0;
  for (const t of triangles) {
    for (let k = 0; k < 9; k += 3) {
      const x = t[k], y = t[k + 1], z = t[k + 2];
      positions.push(x, z, -y);
      cx += x; cy += y; cz += z; n += 1;
    }
  }
  cx /= n; cy /= n; cz /= n;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] -= cx;
    positions[i + 1] -= cz;
    positions[i + 2] -= -cy;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  scene.add(new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({ color, roughness: 0.72, metalness: 0, flatShading: true, side: THREE.FrontSide })
  ));
  scene.add(new THREE.HemisphereLight(0xfff4e8, 0x2a221c, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(80, 140, 90);
  scene.add(key);

  geo.computeBoundingSphere();
  const radius = geo.boundingSphere.radius || 40;
  camera.position.set(radius * 1.5, radius * 1.15, radius * 1.7);
  camera.near = Math.max(0.1, radius / 50);
  camera.far = radius * 20;
  camera.updateProjectionMatrix();
  controls.target.set(0, 0, 0);
  controls.update();

  function resize() {
    const w = container.clientWidth || 320;
    const h = container.clientHeight || 280;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();
  let running = true;
  (function frame() {
    if (!running) return;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  })();
  return {
    dispose() {
      running = false;
      observer.disconnect();
      controls.dispose();
      geo.dispose();
      renderer.dispose();
    },
  };
}
