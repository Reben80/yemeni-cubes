"""Can outside-twin pairs be posed so the seam pattern is identical, using only proper rotations?"""
import json
import itertools
from pathlib import Path

root = Path(__file__).resolve().parents[1]
cubes = json.loads((root / "cubes65.json").read_text())
by_id = {d["id"]: d for d in cubes}
PAIRS = [(3,4),(10,11),(19,20),(22,23),(26,27),(31,32),(42,43),(45,46),(49,50),(51,52),(53,54),(56,57),(62,63),(64,65)]

def proper_rots():
    rots = []
    for perm in itertools.permutations(range(3)):
        for signs in itertools.product([-1, 1], repeat=3):
            p = list(perm)
            sp = 1
            for i in range(3):
                for j in range(i + 1, 3):
                    if p[i] > p[j]:
                        sp = -sp
                        p[i], p[j] = p[j], p[i]
            det = sp * signs[0] * signs[1] * signs[2]
            if det == 1:
                rots.append((perm, signs))
    return rots

ROTS = proper_rots()

def seam_key(d, perm=None, signs=None):
    """Partition of the 96 surface faces, labels remapped by first appearance.
    If perm is set, rotate the cube first (proper)."""
    faces = []
    for z in range(4):
        for y in range(4):
            for x in range(4):
                g = d["grid"][z][y][x]
                cell = (x, y, z)
                if perm is None:
                    mapped = cell
                    def keep(n):
                        return n
                else:
                    # transform 8 corners, min is new index, then we'll shift later
                    mapped = None
                for normal, present in (
                    ((0, -1, 0), y == 0),
                    ((0, 1, 0), y == 3),
                    ((-1, 0, 0), x == 0),
                    ((1, 0, 0), x == 3),
                    ((0, 0, -1), z == 0),
                    ((0, 0, 1), z == 3),
                ):
                    if not present:
                        continue
                    faces.append((normal, (x, y, z), g))
    if perm is None:
        items = faces
        shift = (0, 0, 0)
    else:
        raw = []
        for normal, (x, y, z), g in faces:
            center = (2 * x + 1, 2 * y + 1, 2 * z + 1)
            def xf(v):
                out = [0, 0, 0]
                for i in range(3):
                    out[i] = signs[i] * v[perm[i]]
                return tuple(out)
            raw.append((xf(normal), xf(center), g))
        cells_idx = []
        for _, c, _ in raw:
            cells_idx.append(tuple((c[i] - 1) // 2 for i in range(3)))
        shift = tuple(min(p[i] for p in cells_idx) for i in range(3))
        items = []
        for nn, c, g in raw:
            cell = tuple((c[i] - 1) // 2 - shift[i] for i in range(3))
            items.append((nn, cell, g))
    items = sorted(items, key=lambda t: (t[0], t[1]))
    remap = {}
    seq = []
    for nn, cell, g in items:
        if g not in remap:
            remap[g] = len(remap)
        seq.append((nn, cell, remap[g]))
    return tuple(seq)

same_pose = 0
proper_ok = 0
for a, b in PAIRS:
    ka = seam_key(by_id[a])
    kb = seam_key(by_id[b])
    if ka == kb:
        same_pose += 1
        proper_ok += 1
        print(f"{a},{b}: already aligned")
        continue
    found = None
    for perm, signs in ROTS:
        if seam_key(by_id[b], perm, signs) == ka:
            found = (perm, signs)
            break
    if found:
        proper_ok += 1
        print(f"{a},{b}: proper rotation {found[0]} {found[1]}")
    else:
        print(f"{a},{b}: NO proper rotation")
print("already", same_pose, "proper", proper_ok, "of", len(PAIRS))
