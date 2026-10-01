# Yemeni Cubes — build brief for a website

You are being asked to build a public website about a three-dimensional puzzle
and the mathematics behind it. This document is the complete source of truth.
Everything numeric in it has been computed and cross-checked; do not alter a
figure, and do not invent one. Where a claim is an observation rather than a
proof, it says so — keep that distinction visible on the site.

Author / owner of the work: **Rebin**. Primary audience: a general visitor who
has never heard of this. Secondary: mathematicians, and people who want to 3D
print it.

Scope: **the three-dimensional objects only.** There is a two-dimensional
ancestor and it gets one short section (§1.1) because the name and the definition
come from it, and because two of the pieces turn out to be it in disguise. Do not
build out a 2D half of the site.

---

## 1. What the subject is

### 1.1 Where the name comes from (keep this short)

A **Yemeni square** is a square cut into four congruent polyomino pieces that are
carried into one another by a 90° rotation about the centre. They are named after
a tiling pattern in Yemeni architecture and were studied by **Wichmann and
Rigby**. The 4 × 4 case has exactly two of them: four T-tetrominoes in a
pinwheel, and four L-tetrominoes in a pinwheel.

That is all the visitor needs. One sentence, one picture of each, and move on.

### 1.2 Yemeni cubes

A **Yemeni cube** is the three-dimensional analogue: a **2n × 2n × 2n box cut
into eight congruent polycubes**, permuted by the largest rotation group of the
cube that acts **freely** on the cells — a group of order 8. "Freely" means no
rotation in the group fixes any cell, which is what makes the eight pieces
genuinely interchangeable rather than some of them sitting on an axis.

All work so far is at **n = 2**: a **4 × 4 × 4 box cut into eight pieces of eight
cells each**. That is the whole subject of the site. Order 3 is out of reach;
see §5.

### 1.3 The conditions a piece must satisfy

List these on the site in this order and these words:

1. exactly 8 cells
2. one cell from each of the 8 rotation orbits
3. face-connected
4. no sealed cavity — the complement stays connected to the outside
5. no solid 2 × 2 × 2 block
6. **stricter reading:** no 2 × 2 × 1 slab either
7. never touches itself only at an edge or corner (well-composedness)
8. no tunnel through it (Euler characteristic = 1)

Conditions 1–5, 7 and 8 are the definition. **Condition 6 is an optional filter**,
not a requirement — a stricter reading of the "no internal lattice point" idea
carried over from two dimensions. It is the only one that some valid dissections
fail: 34 of the 65 satisfy it. Present it as a toggle, not a rule.

---

## 2. The results

All of the following is **new in this project** unless marked otherwise. Every
figure was computed and independently re-checked.

### 2.1 The catalogue

| quantity | value |
|---|---|
| Yemeni cubes (dissections) at n = 2 | **65** |
| distinct piece shapes among them | **53** |
| shapes used by two different dissections | **12 pairs** |
| dissections that cannot be taken apart at all | **27** |
| dissections that do come apart | **38** |
| distinct seam patterns on the outside | **51** |
| pairs indistinguishable from the outside | **14** |
| pieces that are a tetromino two layers thick | **2** |

Distribution of piece statistics across the 65:

| surface area | count |   | cycle rank | count |   | opens along | count |
|---|---|---|---|---|---|---|---|
| 28 | 5 |   | 0 — a tree | 32 |   | nothing (locked) | 27 |
| 30 | 9 |   | 1 | 19 |   | 1 direction | 32 |
| 32 | 19 |   | 2 | 9 |   | 2 directions | 6 |
| 34 | 32 |   | 3 | 5 |   |  |  |

Bounding boxes, in cells: 2×2×3 → 8 pieces, 2×2×4 → 21, 2×3×3 → 15,
2×3×4 → 18, 2×4×4 → 3.

### 2.2 The headline: one shape, two different cubes

**53 shapes build 65 dissections.** Twelve shapes each build **two** dissections
that no rotation of the cube carries into one another. The piece does not
determine the cutting.

That is worth stating against the two-dimensional case, where it was verified
through order 7 that **no** Yemeni polyomino has two inequivalent embeddings — in
the plane, the piece always determines the dissection. The extra room in three
dimensions breaks that.

The 12 twin pairs, and whether the two pieces are related by a proper rotation —
so that **one set of eight printed pieces builds both cubes** — or only by a
reflection, in which case it physically cannot:

| pair | relation | one printed set builds both? |
|---|---|---|
| 8, 24 | rotation | **yes** |
| 18, 40 | rotation | **yes** |
| 21, 36 | rotation | **yes** |
| 25, 44 | rotation | **yes** |
| 47, 65 | rotation | **yes** |
| 48, 64 | rotation | **yes** |
| 53, 57 | rotation | **yes** |
| 2, 41 | mirror only | no |
| 15, 58 | mirror only | no |
| 16, 59 | mirror only | no |
| 43, 45 | mirror only | no |
| 50, 51 | mirror only | no |

Of the seven rotation-related pairs, **three also come apart**: **(8, 24),
(25, 44) and (53, 57)**. Those three are the only cases where the finding can be
demonstrated physically — print eight copies of one shape, assemble two
inequivalent cubes from the same set, and the seams on the outside differ, so the
difference shows without taking anything apart.

### 2.3 The second finding: the outside hides the inside

Each of the eight pieces shows exactly **12 of the 96 unit squares** on the
surface of the finished cube, in all 65 dissections.

- The 65 leave only **51 distinct seam patterns**, up to the 48 symmetries of the
  box. **14 pairs are identical from every side.**
- In all 14 of those pairs the **pieces are not even congruent** — different
  shapes, and in most cases different surface area and cycle rank too.
- **No twin pair shares a seam pattern.**

So the outside tells you apart exactly those cases where the inside is the same,
and hides you in the cases where it isn't. Two cubes sitting closed on a table
can be built from pieces that are not the same shape and look identical; two
cubes built from *identical* pieces always look different.

The 14 indistinguishable pairs, by dissection id:

`(3,4) (10,11) (19,20) (22,23) (26,27) (31,32) (42,43) (45,46) (49,50) (51,52)
(53,54) (56,57) (62,63) (64,65)`

### 2.4 Taking it apart

- **27 of the 65 are interlocked.** No single piece can be slid free of the other
  seven along any axis direction, so they cannot be assembled from separate rigid
  pieces by straight motions at all. They exist only as mathematics, or as a
  single fused object.
- For the other **38**: whenever one piece can slide free, the **whole cube comes
  apart** — always in **seven straight slides**, with no exceptions.
- Stronger, and verified *continuously* along the whole travel rather than only
  at whole-cell steps: in **every one of the 38, all eight pieces can leave
  simultaneously**, each along a direction it is individually free to take, with
  no two ever meeting.
- Along the `+y` family that motion is a **four-fold pinwheel**: two pieces to
  each of the four sides, nothing up or down. It is the cube's quarter-turn
  symmetry turned into a movement, and it is the best thing to put on the site.
- The six dissections that open two ways have a **second burst along `−z`**: four
  pieces straight up, four straight down.

Burst direction patterns, indexed by piece number 0–7 in group order:

```
seed "+y":  +y  -y  +x  +x  -x  -x  +y  -y      horizontal pinwheel — all 38
seed "-z":  -z  +z  +z  -z  -z  +z  +z  -z      vertical — the 6 that open 2 ways
```

### 2.5 Two pieces are a flat puzzle in disguise

Exactly **two** of the 53 shapes are a **tetromino two layers thick**: the pieces
of dissections **#1** and **#13**. They are the two Yemeni squares of the 4 × 4
case extruded into three dimensions — #1 the T-tetromino pinwheel, #13 the
L-tetromino pinwheel.

In dissection #1 the cube is literally two stacked slabs, each a flat Yemeni
square: layers z = 0 and z = 1 are identical, and so are z = 2 and z = 3. It is
the cleanest way to show a visitor how the flat ancestor sits inside the solid
one, and it is why §1.1 exists at all.

### 2.6 An observation, not a theorem

The **38** dissections that come apart are **exactly** the 38 whose piece has an
orientation with no cube hanging in the air. The **27** that are interlocked are
exactly the 27 whose piece always leaves one or two cubes unsupported however you
turn it. The two sets coincide with no exceptions among the 65.

**Say on the page that this is observed and not proved.** The intuition: a piece
that wraps around itself tightly enough to lock into the cube is a piece that
cannot be laid down flat.

---

## 3. Data files

Two JSON files ship with this brief. Load them; do not re-derive or hand-type
anything.

### 3.1 `cubes65.json`

An array of 65 objects, one per dissection:

| key | type | meaning |
|---|---|---|
| `id` | 1–65 | the dissection's number |
| `cells` | 8 × `[x,y,z]` | the piece, as cells of the 4 × 4 × 4 box, 0 ≤ x,y,z ≤ 3 |
| `grid` | `[z][y][x]` → 0–7 | which of the eight pieces owns each cell of the box |
| `shape` | int | shape class id; two dissections sharing it are a twin pair |
| `twin` | id or `null` | the other dissection using the same shape |
| `surface` | int | surface area of the piece in unit squares — 28, 30, 32 or 34 |
| `rank` | 0–3 | cycle rank of the piece's cell-adjacency graph; 0 means a tree |
| `thin` | bool | true if the piece has no 2 × 2 × 1 slab (condition 6) |
| `locked` | bool | true if no piece can be slid free |
| `nfree` | 0, 1, 2 | how many axis directions piece 0 can leave along |
| `free` | list of `[dx,dy,dz]` | those directions |
| `freeNames` | list of strings | the same, as `"+y"`, `"-z"` |
| `bbox` | `[a,b,c]` ascending | the piece's bounding box in cells |

### 3.2 `group.json`

```
{ "ACT": [8][64],   // ACT[g][c] = where cell c goes under group element g
  "ORB": [64] }     // ORB[c] = which of the 8 free orbits cell c belongs to
```

`ACT[7]` is the identity. Piece *g* of a dissection is the image of `cells`
under `ACT[g]` — which is also what `grid` encodes, so you can use either.

---

## 4. Conventions — get these right or the pieces come out mirrored

These objects are **chiral**. A mirrored piece builds the other-handed cube, and
every table, diagram and exported model has to agree on handedness. Two separate
bugs in this project came from getting this wrong.

- **Cell index:** `c = x + 4·y + 16·z`, with `x, y, z ∈ {0,1,2,3}`.
- **Axes:** x to the right, **y away from the viewer**, z up.
- **Drawing a layer:** look straight **down**, with **y increasing up the page** —
  the top row of the picture is the highest y. Flip that and the piece is
  mirrored even though the picture looks the same. Label the axes on every
  diagram.
- **Rotations:** only the **24 proper rotations** (signed permutation matrices of
  determinant +1) may be used anywhere — canonicalising, re-orienting for print,
  matching a description. Never the full 48.
- **Comparing rank keys in JavaScript:** `[a,b,c] < [d,e,f]` compares the arrays
  as *strings*, so `-6` sorts after `-4` and `16` sorts before `9`. Write an
  explicit element-by-element comparator. This caused a real bug that produced
  unprintable models.

---

## 5. What is open, and what must not be claimed

- **Order 3 — a 6 × 6 × 6 box — has not been enumerated** and is not within
  reach. The search tree was profiled: branching around 8 per level, an estimated
  10¹⁶ nodes or more. **Do not state a count for n = 3.** It is fine, and
  interesting, to say how far out of reach it is.
- **No literature search has been done.** These objects sit inside the general
  area of polycube box-packing, where Clarke's Poly Pages and Sillke's tables are
  the places to look. The honest statement is that **it is not known whether
  these have been enumerated before**. Do not claim priority or novelty.
- The coincidence in §2.6 is an **observation**, not a theorem.
- The two-dimensional notion, the name, and the structure theory behind it are
  **Wichmann and Rigby's**, and §1.1 must say so.

---

## 6. The physical puzzle

A section for people who want to print it. All figures are for a **20 mm cell**;
everything scales linearly with that one number.

### 6.1 The piece

Each cell is printed as a cube shrunk to **0.92** of the cell and centred, so
cells of **different** pieces end up **1.6 mm apart**. That gap is the assembly
clearance and must not be reduced.

Consequently the **assembled puzzle is 78.4 mm across, not 80 mm**. Every case
dimension follows from 78.4. State this prominently; it is the commonest way to
get the case wrong.

Cells within one piece are marked by a **groove 0.6 mm deep and 1.6 mm wide**,
made by narrowing the connector between neighbouring cells to 17.2 mm. The body
stays continuous and the neck carries **87 %** of the section. An earlier design
used a 2 mm deep slot: a 2 mm unsupported ledge at every vertical boundary and a
neck of only 61 %. It printed badly. Do not revive it.

### 6.2 Print orientation

Turn each piece into the orientation that prints best, ranked by:

1. fewest cubes with **nothing underneath them**
2. then shortest
3. then most cubes touching the bed

**"Largest face down" is not sufficient.** Several pieces have a two-cubes-tall
pose resting on only two of their eight cubes with the other six in mid-air. 38
of the 65 come out with no overhang at all; the other 27 — the interlocked ones —
always leave one or two.

Tell the reader plainly: **do not let the slicer auto-orient or mirror the
model.**

### 6.3 The case

A cube-shaped two-part case, base plus lid:

| dimension | value |
|---|---|
| cavity | 79.6 mm wide (0.6 mm per side), 78.8 mm deep (0.4 mm headroom) |
| base wall | 2.4 mm |
| base floor | 9.0 mm, with a 26 mm square push-out hole |
| base outer | 84.4 × 84.4 × 87.8 mm |
| lid skirt | 14 mm deep, 0.5 mm clearance per side |
| lid | 90.2 × 90.2 × 16.4 mm |
| **closed case** | **90.2 × 90.2 × 90.2 mm — a cube holding a cube** |

Two details that exist purely for printing: the base's bottom 0.8 mm is stepped
in by 0.6 mm so **elephant's foot** spreads into that relief instead of onto the
surface the lid slides over; and the cavity mouth has a 0.8 mm lead-in over its
top 3 mm so an assembled cube drops in without catching.

The **push-out hole** is in the floor. The fit is snug enough that there is
nothing to grip, so you turn the case over and push the cube up through the hole.

One case fits **any** of the 65 — they all assemble to the same 78.4 mm cube.

### 6.4 Settings

PLA, 0.2 mm layers, no supports in the shipped orientation. Roughly **210 g** for
a set of eight pieces and **85 g** for the case. Eight copies fit on one 256 mm
bed for every one of the 65.

Advise printing a pair of **5 mm fit rings** first — one a slice of the cavity
mouth, one a slice of the lid skirt. Fifteen minutes, and they verify both fits
before committing to a five-hour box.

### 6.5 Two good first prints

- **Dissection #1 (shape S18).** The friendliest: a T-tetromino two layers thick,
  smallest surface (28), smallest bounding box, and one of only six that come
  apart two different ways. Also the one that is a flat Yemeni square extruded.
- **The twin pair #25 / #44.** Eight copies of one shape build two inequivalent
  cubes, and the seams on the outside differ so the difference is visible.
  Rotation-related, so a single printed set really does serve both.

---

## 7. What the website should contain

Adapt the layout freely; keep the content and the distinctions.

1. **Opening.** A 4 × 4 × 4 cube coming apart into eight identical pieces, moving
   before anything is read. One sentence on what the object is. The number 65.
2. **What makes it a Yemeni cube.** The group of order 8 acting freely, and the
   conditions of §1.3 — with condition 6 as a toggle. One short paragraph on the
   flat ancestor (§1.1), naming Wichmann and Rigby.
3. **The catalogue.** All 65, browsable. Filters for: shape used twice; one
   printed set builds two cubes; comes fully apart; interlocked; twin from
   outside; a flat square extruded; opens two ways; thin; tree pieces. For each:
   a rotatable 3D view, the four layer maps, the unfolded surface, and the
   statistics.
4. **One shape, two cubes.** §2.2, with the twin table and the ability to flip
   between a dissection and its twin with the view held still.
5. **The outside hides the inside.** §2.3. Flip between a dissection and its
   outside-twin and watch nothing change on the surface while the interior does.
6. **Watch it come apart.** §2.4 — the burst, all eight leaving at once. Give it
   room; this is the memorable thing.
7. **Print it.** Everything in §6, with files, the fit rings first, and the
   chirality warning.
8. **Results and provenance.** Every claim marked *proved*, *computed*,
   *observed*, or *from Wichmann–Rigby*, plus §5 on what is open.

### Interaction notes

- 3D views can be plain coloured cubes. The groove is a print detail and does not
  need rendering.
- The **unfolded-surface view** is the one that carries §2.3 and it is easy to get
  subtly wrong. Lay the six faces out as: top; then left, front, right, back in a
  band; then bottom. Colour each of the 96 squares by the piece owning it and
  draw the seams as thick lines. Verify every crease lines up — two squares
  adjacent across a crease are two faces of the same corner cell.
- Everywhere a comparison is offered (twin, outside-twin), hold the camera still
  while swapping. The difference, or the lack of one, is the whole point.

### Tone

Plain language, short sentences. The objects are strange and the facts are
surprising on their own; they do not need adjectives. Prefer showing a thing
turning or coming apart over describing it.
