# Yemeni Squares & Yemeni Cubes — build brief for a website

You are being asked to build a public website about a piece of recreational
mathematics and the physical puzzle made from it. This document is the complete
source of truth. Everything numeric in it has been computed and cross-checked;
do not alter a figure, and do not add figures of your own invention. Where a
claim is an observation rather than a proof, it says so — keep that distinction
on the page.

Author / owner of the work: **Rebin**. The site is for a general audience with a
secondary audience of mathematicians and people who want to 3D print the puzzle.

---

## 1. What the subject is

### 1.1 Yemeni squares (two dimensions)

A **Yemeni square** of order *n* is a dissection of a square into four congruent
polyomino pieces that are carried into one another by a 90° rotation about the
square's centre. The pieces are called **Yemeni polyominoes**. The objects are
named after a tiling pattern found in Yemeni architecture and were studied by
**Wichmann and Rigby**.

The structure that makes them tractable: the boundary between two neighbouring
pieces is a single staircase path — an **arm** — running from the centre of the
square to its edge. The four arms are images of one another under the rotation,
and together they form a cross that visits every interior lattice point of the
square exactly once. That is the key lemma, and it is Wichmann and Rigby's.

Because of it, a Yemeni square is completely described by **one word** over the
alphabet `E N W S` (east, north, west, south) giving the steps of a single arm.
For order *n* the word has length **n² − n + 1**, and each piece has perimeter
**2n² + 2**.

So the whole object reduces to a word. Order 2 has exactly two of them: `ENE`
and `ENN`.

### 1.2 Yemeni cubes (three dimensions)

The three-dimensional analogue developed in this project. A **Yemeni cube** of
order *n* is a dissection of a **2n × 2n × 2n** box into **eight congruent
polycubes**, permuted by the largest rotation group of the cube that acts
**freely** on the cells — a group of order 8. Free action is what makes the eight
pieces genuinely interchangeable: no rotation in the group fixes any cell.

All work so far is at **n = 2**, i.e. a **4 × 4 × 4 box cut into eight pieces of
eight cells each**. Order 3 (a 6×6×6 box) is far out of computational reach; see
§6.

A candidate piece must satisfy seven conditions. These are the ones the site
should list, in this order and these words:

1. exactly 8 cells
2. one cell from each of the 8 rotation orbits
3. face-connected
4. no sealed cavity (the complement stays connected to the outside)
5. no solid 2 × 2 × 2 block
6. **stricter reading:** no 2 × 2 × 1 slab either
7. never touches itself only at an edge or corner (well-composedness)
8. no tunnel through it (Euler characteristic = 1)

Condition 6 is the only one some valid dissections fail — it is a stricter
reading of the "no internal lattice point" idea carried over from two
dimensions, and it is a filter, not a requirement. 34 of the 65 satisfy it.
Present conditions 1–5, 7 and 8 as the definition and condition 6 as an optional
extra. (The app calls the set "the seven conditions" with 6 marked as varying;
keep that framing if convenient.)

---

## 2. The results

Every number below was computed and independently re-checked. Mark provenance on
the site exactly as shown — this matters, because some of it is Wichmann and
Rigby's, some came from an earlier note supplied to the project, and some is new.

### 2.1 Two dimensions — counts

Number of Yemeni squares of order *n*, counted up to the symmetries of the
square:

| n | Yemeni squares | arm word length | piece perimeter |
|---|---------------|-----------------|-----------------|
| 2 | 2 | 3 | 10 |
| 3 | 8 | 7 | 20 |
| 4 | 66 | 13 | 34 |
| 5 | 1,040 | 21 | 52 |
| 6 | 34,661 | 31 | 74 |
| 7 | **2,408,275** | 43 | 100 |

`N(7) = 2,408,275` was established by **three independent programs** producing
identical sorted class lists (SHA-256 prefix `9feffc270c3f7604`). Provenance:
**new in this project**.

### 2.2 Two dimensions — turns

A **turn** is a change of direction in the arm word.

- Minimum turns is **n − 1** for every n ≤ 7, attained by exactly one class: the
  spiral `E N² W⁴ S⁶ E⁸ …`
- Maximum turns: **2, 5, 11, 18, 28, 39, 53, 68, 86** for n = 2 … 10.
- **Proved:** an arm has at most **n² − n − ⌊(n−1)/2⌋** turns. The bound is
  attained for every n ≤ 10. For n = 8, 9, 10 there are 15, 23, 31 extremal
  classes respectively. Provenance: **new**.

### 2.3 Two dimensions — growth

- **Proved:** ½ · E(n−1)^⌊(n−1)/3⌋ ≤ N(n) ≤ 3^(n²−n−1), hence
  **log₂ N(n) = Θ(n²)**.
- **Proved:** the heuristic bound N(n) ≥ 2^(n(n−1)/2) cannot be established by a
  naive size-by-size injection — no such injection can exist.
- **Verified through n = 7:** no Yemeni polyomino has two inequivalent
  embeddings. In two dimensions the piece determines the dissection.

### 2.4 Three dimensions — the catalogue at n = 2

| quantity | value |
|---|---|
| Yemeni cubes (dissections) | **65** |
| distinct piece shapes | **53** |
| shapes used by two different dissections | **12 pairs** |
| pieces that cannot be taken apart at all | **27** |
| dissections that do come apart | **38** |
| distinct seam patterns on the outside | **51** |
| pairs indistinguishable from outside | **14** |
| piece is a tetromino two layers thick | **2** |

**Embedding uniqueness fails in three dimensions.** This is the headline
mathematical finding. In 2D the piece determines the dissection; in 3D twelve
shapes each build two dissections that no rotation of the cube relates. 53
shapes, 65 dissections.

Distribution of piece statistics across the 65:

| surface area | count | | cycle rank | count | | opens | count |
|---|---|---|---|---|---|---|---|
| 28 | 5 | | 0 (a tree) | 32 | | 0 ways (locked) | 27 |
| 30 | 9 | | 1 | 19 | | 1 way | 32 |
| 32 | 19 | | 2 | 9 | | 2 ways | 6 |
| 34 | 32 | | 3 | 5 | | | |

Bounding boxes (in cells): 2×2×3 → 8, 2×2×4 → 21, 2×3×3 → 15, 2×3×4 → 18,
2×4×4 → 3.

### 2.5 Three dimensions — taking it apart

- **27 of the 65 are interlocked**: no single piece can be slid free of the other
  seven along any axis direction, so they cannot be assembled from separate rigid
  pieces by straight motions at all.
- For the other **38**: whenever one piece can slide free, the **whole cube comes
  apart**, always in **seven straight slides**, with no exceptions.
- Stronger, and verified continuously along the whole travel rather than only at
  whole-cell steps: in **every one of the 38, all eight pieces can leave
  simultaneously**, each along a direction it is individually free to take, with
  no two ever meeting.
- Along the `+y` family that motion is a **four-fold pinwheel** — two pieces to
  each of the four sides, nothing up or down. It is the cube's quarter-turn
  symmetry turned into a movement.
- The six dissections that open two ways have a **second burst along `−z`**: four
  pieces straight up, four straight down.

The burst direction patterns, indexed by piece number 0–7 in group order:

```
seed "+y":  +y  -y  +x  +x  -x  -x  +y  -y      (horizontal pinwheel, all 38)
seed "-z":  -z  +z  +z  -z  -z  +z  +z  -z      (vertical, the 6 that open 2 ways)
```

### 2.6 Three dimensions — the outside

Each of the eight pieces shows exactly **12 of the 96 unit squares** on the
surface of the finished cube, in all 65 dissections.

- The 65 leave only **51 distinct seam patterns** up to the 48 symmetries of the
  box. **14 pairs look identical from every side.**
- In all 14 of those pairs the **pieces are not even congruent** — they differ in
  shape, and in most cases in surface area and cycle rank too.
- **No twin pair shares a seam pattern.** So the outside tells you apart exactly
  the cases where the inside is the same, and hides you in the cases where it
  isn't.

The 14 indistinguishable pairs, by dissection id:
`(3,4) (10,11) (19,20) (22,23) (26,27) (31,32) (42,43) (45,46) (49,50) (51,52)
(53,54) (56,57) (62,63) (64,65)`

### 2.7 Three dimensions — the twins, and which can be printed as one set

The 12 twin pairs, and whether the two pieces are related by a proper rotation
(so **one set of eight printed pieces builds both cubes**) or only by a
reflection (so it cannot):

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

Of the seven rotation-related pairs, **three also come apart**: (8,24), (25,44)
and (53,57). Those three are the only ones where the finding can be shown
physically — print eight copies of one shape, build two inequivalent cubes, and
the seam patterns on the outside differ so the difference is visible without
taking anything apart.

### 2.8 Three dimensions — the bridge back to two

Exactly **two** of the 53 shapes are a **tetromino two layers thick**: the pieces
of dissections **#1** and **#13**. They are the two Yemeni squares of the 4 × 4
case — words **`ENE`** and **`ENN`** — extruded into three dimensions. #1 is the
T-tetromino pinwheel, #13 the L-tetromino pinwheel.

This is the cleanest way to show a visitor how the 2D and 3D stories connect.

### 2.9 An observation worth stating as an observation

The **38** dissections that come apart are **exactly** the 38 whose piece has an
orientation with no cube hanging in the air — and the **27** that are interlocked
are exactly the 27 whose piece always leaves one or two cubes unsupported however
you turn it. The two sets coincide, with no exceptions among the 65.

**This is observed, not proved.** Say so on the page. The intuition is that the
piece which wraps around itself tightly enough to lock into the cube is the piece
that cannot be laid down flat.

---

## 3. Data files

Two JSON files ship with this brief. Use them; do not re-derive or hand-type the
data.

### 3.1 `cubes65.json`

An array of 65 objects, one per dissection, each with these keys:

| key | type | meaning |
|---|---|---|
| `id` | 1–65 | the dissection's number |
| `cells` | 8 × `[x,y,z]` | the piece, as cells of the 4×4×4 box, 0 ≤ x,y,z ≤ 3 |
| `grid` | `[z][y][x]` → 0–7 | which of the eight pieces owns each cell of the box |
| `shape` | int | shape class id; two dissections sharing it are a twin pair |
| `twin` | id or `null` | the other dissection using the same shape |
| `surface` | int | surface area of the piece in unit squares (28, 30, 32 or 34) |
| `rank` | 0–3 | cycle rank of the piece's cell-adjacency graph; 0 means a tree |
| `thin` | bool | true if the piece contains no 2 × 2 × 1 slab (condition 6) |
| `locked` | bool | true if no piece can be slid free |
| `nfree` | 0, 1 or 2 | how many axis directions piece 0 can leave along |
| `free` | list of `[dx,dy,dz]` | those directions |
| `freeNames` | list of strings | the same, as `"+y"`, `"-z"` |
| `bbox` | `[a,b,c]` sorted | the piece's bounding box in cells |

### 3.2 `group.json`

```
{ "ACT": [8][64],   // ACT[g][c] = where cell c goes under group element g
  "ORB": [64] }     // ORB[c] = which of the 8 free orbits cell c belongs to
```

`ACT[7]` is the identity. Piece *g* of a dissection is the image of `cells`
under `ACT[g]`, which is also what `grid` encodes.

---

## 4. Conventions — get these right or the pieces come out mirrored

These objects are **chiral**. A mirrored piece builds the other-handed cube, and
every coordinate table, diagram and exported model has to agree on handedness.
Two separate bugs in this project came from getting this wrong. Be careful.

- **Cell index:** `c = x + 4·y + 16·z`, with `x, y, z ∈ {0,1,2,3}`.
- **Axes:** x to the right, **y away from the viewer**, z up.
- **Drawing a layer:** draw it looking straight **down**, with **y increasing up
  the page** — the top row of the picture is the highest y. Flipping that
  convention mirrors the piece even though the picture looks the same. Always
  label the axes on any diagram.
- **Rotations:** only the **24 proper rotations** (signed permutation matrices of
  determinant +1) may be used anywhere — canonicalising, re-orienting for print,
  matching a user's description. Never the full 48.
- **Comparing rank keys in JavaScript:** `[a,b,c] < [d,e,f]` compares the arrays
  as *strings*, so `-6` sorts after `-4` and `16` sorts before `9`. Write an
  explicit element-by-element comparator. This caused a real bug.

---

## 5. The physical puzzle

The site should have a section for people who want to print it. All figures are
for a **20 mm cell**; everything scales linearly with that one number.

### 5.1 The piece

Each unit cell is printed as a cube shrunk to **0.92** of the cell and centred,
so adjacent cells of **different** pieces end up **1.6 mm apart** — that gap is
the assembly clearance and must not be reduced.

Consequently the **assembled puzzle is 78.4 mm across, not 80 mm.** Every case
dimension follows from 78.4. State this prominently; it is the single most
common way to get the case wrong.

Cells within one piece are marked by a **groove 0.6 mm deep and 1.6 mm wide**,
made by narrowing the connector between neighbouring cells to 17.2 mm. The body
stays continuous and the neck carries **87 %** of the section. An earlier design
used a 2 mm deep slot, which left a 2 mm unsupported ledge at every vertical
boundary and a neck of only 61 % — it printed badly. Do not revive it.

### 5.2 Print orientation

A piece must be turned into the orientation that prints best, ranked by:

1. fewest cubes with **nothing underneath them**
2. then shortest
3. then most cubes touching the bed

"Largest face down" alone is **not** sufficient: several pieces have a
two-cubes-tall pose that rests on only two of their eight cubes with the other
six in mid-air. 38 of the 65 come out with no overhang at all; the other 27 —
the interlocked ones — always leave one or two.

Tell the reader: **do not let the slicer auto-orient or mirror the model.**

### 5.3 The case

A cube-shaped two-part case, base plus lid:

| dimension | value |
|---|---|
| cavity | 79.6 mm wide (0.6 mm clearance per side), 78.8 mm deep (0.4 mm headroom) |
| base wall | 2.4 mm |
| base floor | 9.0 mm, with a 26 mm square push-out hole |
| base outer | 84.4 × 84.4 × 87.8 mm |
| lid skirt | 14 mm deep, 0.5 mm clearance per side |
| lid | 90.2 × 90.2 × 16.4 mm |
| **closed case** | **90.2 × 90.2 × 90.2 mm — a cube holding a cube** |

Two details that exist for printing reasons: the base's bottom 0.8 mm is stepped
in by 0.6 mm so **elephant's foot** spreads into the relief instead of onto the
surface the lid slides over; and the cavity mouth has a 0.8 mm lead-in over its
top 3 mm so an assembled cube drops in without catching.

The **push-out hole** is in the floor: the fit is snug enough that there is
nothing to grip, so you turn the case over and push the cube up through the hole.

The case fits **any** of the 65, since they all assemble to the same 78.4 mm
cube.

### 5.4 Settings

PLA, 0.2 mm layers, no supports in the shipped orientation. Roughly **210 g** for
a set of eight pieces and **85 g** for the case. Eight copies of a piece fit on
one 256 mm bed for every one of the 65.

Advise printing a pair of **5 mm fit rings** first — one a slice of the cavity
mouth, one a slice of the lid skirt. Fifteen minutes, and they verify both fits
before committing to a five-hour box.

### 5.5 Two good first prints

- **Shape S18, dissection #1.** The friendliest: a T-tetromino two layers thick,
  smallest surface (28), smallest bounding box, and one of only six that come
  apart two different ways. Also the bridge to the 2D story.
- **The twin pair #25 / #44.** Eight copies of one shape build two inequivalent
  cubes, and the seam patterns on the outside differ so the difference is
  visible. Rotation-related, so one printed set really does serve both.

---

## 6. What is open, and what must not be claimed

Keep these honest on the site.

- **Order 3 (a 6 × 6 × 6 box) has not been enumerated** and is not within reach.
  The search tree was profiled: branching around 8 per level, an estimated 10¹⁶
  nodes or more. Do not state a count for n = 3.
- **No literature search has been done** for the 3D objects. They sit inside the
  general area of polycube box-packing, where Clarke's Poly Pages and Sillke's
  tables are the places to look. The honest statement is that it is **not known
  whether these have been enumerated before**. Do not claim priority or novelty
  for the 3D enumeration.
- The coincidence in §2.9 is an **observation**, not a theorem.
- Results from Wichmann and Rigby — the arm/cross structure and the reduction to
  a word — are **theirs**, and the site must say so.

---

## 7. What the website should contain

Suggested structure. Adapt the layout freely; keep the content and the
distinctions.

1. **Opening.** What a Yemeni square is, in two sentences and one picture. The
   square, the four pieces, the arm drawn as a bold line. Name Wichmann and
   Rigby here.
2. **The word.** The idea that the whole object is a word over `E N W S`. Let the
   visitor type a word and see whether it makes a valid square, and watch the
   four arms being drawn. For order 2 there are only two words; show both.
3. **How many are there.** The counts table from §2.1, with the growth result and
   the turn bound from §2.2 and §2.3.
4. **Into three dimensions.** The seven conditions, the 4 × 4 × 4 box, the group
   of order 8 acting freely. Then the number: 65 dissections, 53 shapes.
5. **The catalogue.** All 65, browsable, with filters for: shape used twice,
   one printed set builds two cubes, comes fully apart, interlocked, twin from
   outside, a flat square extruded, opens two ways, thin, tree pieces. For each
   one: a rotatable 3D view, the four layer maps, the unfolded surface showing
   the seam pattern, and the statistics.
6. **The two findings worth their own page.** Embedding uniqueness failing in
   3D (§2.4, §2.7), and the outside hiding what the inside shows (§2.6).
7. **Watch it come apart.** The burst animation of §2.5 — all eight pieces
   leaving at once, the four-fold pinwheel. This is the best thing on the site;
   give it room.
8. **Print it.** Everything in §5, with the files to download, the fit rings
   first, and the chirality warning.
9. **Results and provenance.** A table of every claim marked *proved*,
   *computed*, *observed*, or *from Wichmann–Rigby*. Plus §6.

### Interaction notes

- The 3D views can be plain coloured cubes; the groove is a print detail and does
  not need rendering.
- The unfolded-surface view is the most under-used idea and the one that carries
  §2.6. Lay out the six faces as: top; then left, front, right, back in a band;
  then bottom. Colour each of the 96 squares by the piece owning it and draw the
  seams as thick lines. Check that every crease lines up — adjacent squares
  across a crease are two faces of the same corner cell.
- Let visitors flip between a dissection and its twin, and between a dissection
  and its outside-twin, with the view held still. The difference, or the lack of
  one, is the whole point.

### Tone

Plain language. Short sentences. The objects are strange and the facts are
surprising on their own; they do not need adjectives. Prefer showing a thing
turning or coming apart over describing it.
