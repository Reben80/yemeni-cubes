"""Sanity checks for the site geometry. Does not invent catalogue numbers."""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
cubes = json.loads((root / "cubes65.json").read_text())
group = json.loads((root / "group.json").read_text())
ACT = group["ACT"]
assert len(cubes) == 65

def cell_index(x, y, z):
    return x + 4 * y + 16 * z

def unpack(c):
    return c % 4, (c // 4) % 4, c // 16

# Piece g is the image of cells under ACT[g], and matches grid.
mism = 0
for d in cubes:
    owned = {g: set() for g in range(8)}
    for x, y, z in d["cells"]:
        c = cell_index(x, y, z)
        for g in range(8):
            owned[g].add(ACT[g][c])
    for z in range(4):
        for y in range(4):
            for x in range(4):
                c = cell_index(x, y, z)
                g = d["grid"][z][y][x]
                if c not in owned[g]:
                    mism += 1
    # exactly one owner each
    allc = set()
    for g in range(8):
        if len(owned[g]) != 8:
            print("bad piece size", d["id"], g, len(owned[g]))
        allc |= owned[g]
    if len(allc) != 64:
        print("overlap or gap", d["id"], len(allc))
print("grid mismatches", mism)

# --- 2D words ---
DIRS = {"E": (1, 0), "N": (0, 1), "W": (-1, 0), "S": (0, -1)}

def rot_point(x, y, n, k):
    for _ in range(k):
        x, y = 2 * n - y, x
    return x, y

def arms_from_word(word, n):
    L = n * n - n + 1
    if len(word) != L:
        return None, f"length {len(word)}, need {L}"
    for ch in word:
        if ch not in DIRS:
            return None, "bad letter"
    path = [(n, n)]
    x, y = n, n
    for i, ch in enumerate(word):
        dx, dy = DIRS[ch]
        x, y = x + dx, y + dy
        if not (0 <= x <= 2 * n and 0 <= y <= 2 * n):
            return None, "left the square"
        on_edge = x == 0 or x == 2 * n or y == 0 or y == 2 * n
        if on_edge and i != len(word) - 1:
            return None, "hit the edge early"
        if not on_edge and i == len(word) - 1:
            return None, "ended inside"
        path.append((x, y))
    arms = []
    for k in range(4):
        arms.append([rot_point(px, py, n, k) for px, py in path])
    seen = {}
    for k, arm in enumerate(arms):
        for p in arm:
            if p[0] in (0, 2 * n) or p[1] in (0, 2 * n):
                continue  # boundary endpoint
            if p in seen and not (p == (n, n)):
                return None, f"revisit {p}"
            if p != (n, n):
                seen[p] = k
            elif p in seen:
                pass
            else:
                seen[p] = -1
    interior = (2 * n - 1) ** 2
    # center + others
    if len(seen) != interior:
        return None, f"visited {len(seen)} interior, need {interior}"
    # pieces
    edges = set()
    for arm in arms:
        for a, b in zip(arm, arm[1:]):
            edges.add(tuple(sorted((a, b))))
    parent = {}

    def find(a):
        parent.setdefault(a, a)
        while parent[a] != a:
            parent[a] = parent[parent[a]]
            a = parent[a]
        return a

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[rb] = ra

    cells = [(i, j) for i in range(2 * n) for j in range(2 * n)]
    for i, j in cells:
        if i + 1 < 2 * n:
            e = tuple(sorted(((i + 1, j), (i + 1, j + 1))))
            if e not in edges:
                union((i, j), (i + 1, j))
        if j + 1 < 2 * n:
            e = tuple(sorted(((i, j + 1), (i + 1, j + 1))))
            if e not in edges:
                union((i, j), (i, j + 1))
    comps = {}
    for c in cells:
        comps.setdefault(find(c), []).append(c)
    sizes = sorted(len(v) for v in comps.values())
    return {"arms": arms, "components": list(comps.values()), "sizes": sizes, "edges": edges}, None

for w in ("ENE", "ENN"):
    res, err = arms_from_word(w, 2)
    print(w, err, res["sizes"] if res else None)
    if res:
        # print piece cells
        for comp in res["components"]:
            print(" ", sorted(comp))

res, err = arms_from_word("ENNW" + "W" * 3, 3)  # ENNWWWW length 7
print("spiral n3", err, res["sizes"] if res else None)

# --- print orientation ---
# 24 proper rotations as signed perms
import itertools
rots = []
for perm in itertools.permutations(range(3)):
    for signs in itertools.product([-1, 1], repeat=3):
        # det = sign(perm) * product(signs)
        sign_perm = 1
        p = list(perm)
        for i in range(3):
            for j in range(i + 1, 3):
                if p[i] > p[j]:
                    sign_perm = -sign_perm
                    p[i], p[j] = p[j], p[i]
        det = sign_perm * signs[0] * signs[1] * signs[2]
        if det == 1:
            rots.append((perm, signs))
print("proper rotations", len(rots))

def apply_cell(perm, signs, x, y, z):
    src = [x, y, z]
    # transform 8 corners, take min
    mins = [10**9, 10**9, 10**9]
    for a in (0, 1):
        for b in (0, 1):
            for c in (0, 1):
                corner = [x + a, y + b, z + c]
                out = [0, 0, 0]
                for i in range(3):
                    out[i] = signs[i] * corner[perm[i]]
                for i in range(3):
                    mins[i] = min(mins[i], out[i])
    return tuple(mins)

def orient_stats(cells):
    best = None
    for ri, (perm, signs) in enumerate(rots):
        mapped = [apply_cell(perm, signs, x, y, z) for x, y, z in cells]
        mins = [min(p[i] for p in mapped) for i in range(3)]
        norm = [(p[0] - mins[0], p[1] - mins[1], p[2] - mins[2]) for p in mapped]
        S = set(norm)
        uns = sum(1 for x, y, z in norm if z > 0 and (x, y, z - 1) not in S)
        height = max(z for _, _, z in norm) + 1
        bed = sum(1 for _, _, z in norm if z == 0)
        key = (uns, height, -bed, ri)
        if best is None or key < best[0]:
            best = (key, norm)
    return best

zero = 0
match_locked = 0
for d in cubes:
    key, norm = orient_stats(d["cells"])
    uns = key[0]
    if uns == 0:
        zero += 1
    # observation: uns==0 iff not locked
    if (uns == 0) == (not d["locked"]):
        match_locked += 1
    else:
        print("orient mismatch", d["id"], "uns", uns, "locked", d["locked"], "key", key)
print("zero overhang", zero, "match locked observation", match_locked)

# --- seam patterns under full cube symmetry (48) ---
all_rots = []
for perm in itertools.permutations(range(3)):
    for signs in itertools.product([-1, 1], repeat=3):
        all_rots.append((perm, signs))
print("all rotations", len(all_rots))

# surface quads: (face axis, face sign, u, v) -> piece
# We'll list occupied surface faces as ((nx,ny,nz), (x,y,z)) where (x,y,z) is the cell
# and normal points outward. Position of the face square's min corner in a face-local frame.

FACE_DEFS = []  # filled conceptually in canon

def surface_cells(d):
    """Return list of (normal tuple, cell xyz, piece)."""
    out = []
    for z in range(4):
        for y in range(4):
            for x in range(4):
                g = d["grid"][z][y][x]
                if y == 0:
                    out.append(((0, -1, 0), (x, y, z), g))
                if y == 3:
                    out.append(((0, 1, 0), (x, y, z), g))
                if x == 0:
                    out.append(((-1, 0, 0), (x, y, z), g))
                if x == 3:
                    out.append(((1, 0, 0), (x, y, z), g))
                if z == 0:
                    out.append(((0, 0, -1), (x, y, z), g))
                if z == 3:
                    out.append(((0, 0, 1), (x, y, z), g))
    return out

def transform_vec(perm, signs, v):
    src = list(v)
    out = [0, 0, 0]
    for i in range(3):
        out[i] = signs[i] * src[perm[i]]
    return tuple(out)

def canon_seam(d):
    faces = surface_cells(d)
    best = None
    for perm, signs in all_rots:
        # map each face into the axis-aligned cube frame of the rotated object
        # A cell corner transforms, then we translate into 0..4
        # Use centers *2 to stay integer: center (2x+1, 2y+1, 2z+1)
        items = []
        for normal, (x, y, z), g in faces:
            center = (2 * x + 1, 2 * y + 1, 2 * z + 1)
            nc = transform_vec(perm, signs, center)
            nn = transform_vec(perm, signs, normal)
            items.append((nn, nc, g))
        # shift centers into positive: coords are odd from -something
        xs = [c[0] for _, c, _ in items]
        ys = [c[1] for _, c, _ in items]
        zs = [c[2] for _, c, _ in items]
        # after rotation of centers in {-7..7}-ish, shift so min cell is 0
        # center' = M*(2r+1). The min of (coord-1)/2 ...
        shift = []
        for coords in (xs, ys, zs):
            # cell index ~ (coord - 1) / 2, we want min 0
            mn = min((c - 1) // 2 for c in coords)
            shift.append(mn)
        # build face key: which side and uv
        labeled = []
        for nn, nc, g in items:
            cell = ((nc[0] - 1) // 2 - shift[0], (nc[1] - 1) // 2 - shift[1], (nc[2] - 1) // 2 - shift[2])
            labeled.append((nn, cell, g))
        # order faces in a fixed sequence and relabel by first appearance
        labeled.sort(key=lambda t: (t[0], t[1]))
        remap = {}
        seq = []
        for nn, cell, g in labeled:
            if g not in remap:
                remap[g] = len(remap)
            seq.append((nn, cell, remap[g]))
        key = tuple(seq)
        if best is None or key < best:
            best = key
    return best

from collections import defaultdict
buckets = defaultdict(list)
for d in cubes:
    buckets[canon_seam(d)].append(d["id"])
pairs = []
for ids in buckets.values():
    if len(ids) == 2:
        pairs.append(tuple(sorted(ids)))
    elif len(ids) != 1:
        print("unexpected bucket", ids)
pairs.sort()
expected = [(3,4),(10,11),(19,20),(22,23),(26,27),(31,32),(42,43),(45,46),(49,50),(51,52),(53,54),(56,57),(62,63),(64,65)]
print("seam pairs", len(pairs))
print("match expected", pairs == expected)
if pairs != expected:
    print("got", pairs)
    print("missing", set(expected) - set(pairs))
    print("extra", set(pairs) - set(expected))
