# BIOSPHERE — A *Concepts of Biology* Mystery

A 3D, first-person, story-driven game that teaches introductory biology. You
play the last enrolled **cadet** aboard BIOSPHERE, a research arcology where a
catastrophe called the **Withering** is unravelling life itself. Guided by the
station intelligence **HELIX**, you move chamber by chamber — atom to biosphere —
relearning what life is and restoring each shard of knowledge.

The 21 chambers mirror the 21 chapters (6 units) of the OpenStax textbook
**Concepts of Biology**. Completing a chamber means mastering that chapter's
learning objectives.

## How to play

You need a tiny local web server (ES modules can't load from `file://`).

```bash
cd "biology game"
node server.js          # serves on http://localhost:8731
#   — or —
python3 -m http.server 8731
```

Then open **http://localhost:8731** in a modern browser (Chrome/Edge/Firefox/Safari).

### Controls
- **WASD** — move
- **Mouse** — look (click the scene to capture the cursor)
- **E** — interact (scan a data node, start a Challenge, take the exit)
- **M** — open/close the Journey Map
- **Esc** — release the cursor

### Loop of a chamber
1. **Enter** — HELIX introduces the chapter's mystery.
2. **Scan the glowing data nodes** — original, story-driven explanations of each
   key concept, with a 3D visualization rotating at the room's center.
3. **Take the Challenge** — a short quiz. Every answer must be correct to *master*
   the chapter (you can retry freely).
4. **Pass** to unlock the exit and earn a piece of the overarching mystery, then
   walk through to the next chamber.

Progress is saved automatically in your browser (`localStorage`), so you can
**Continue** where you left off.

## The journey (curriculum)

| Unit | Chapters | Chambers |
|------|----------|----------|
| 1 — The Cellular Foundation of Life | 1–5 | Atrium of Living Things · Molecular Forge · Grand Cell · Powerhouse · Solarium |
| 2 — Cell Division & Genetics | 6–8 | Division Chamber · Shuffle Vault · Mendel's Greenhouse |
| 3 — Molecular Biology & Biotech | 9–10 | Helix Archive · Gene Lab |
| 4 — Evolution & the Diversity of Life | 11–15 | Selection Gallery · Tree of Life Hall · Microcosm · Conservatory · Menagerie |
| 5 — Animal Structure & Function | 16–18 | Anatomy Theater · Defense Grid · Genesis Chamber |
| 6 — Ecology | 19–21 | Field Station · Biosphere Core · Vault of Life |

Each chamber features a bespoke, animated 3D visualization of its concepts —
the levels of organization, a polar water molecule, an explorable cell, a
mitochondrion minting ATP, a chloroplast under sunlight, mitosis and meiosis,
a 3D Punnett square, a rotating DNA double helix, gel electrophoresis, finch
beaks under selection, the three-domain tree of life, an energy pyramid, a
living globe of biomes, and more.

## Tech

- **Three.js** (loaded from CDN via an import map — no build step)
- Vanilla ES modules: `js/main.js`, `curriculum.js`, `world.js`, `visuals.js`,
  `player.js`, `ui.js`
- `server.js` is a ~15-line static file server for local play.

## Attribution

Curriculum outline (chapter sequence and learning objectives) adapted from
**OpenStax, *Concepts of Biology*** — <https://openstax.org/details/books/concepts-biology> —
licensed **CC BY 4.0**. All narrative prose, the BIOSPHERE / HELIX / Withering
storyline, quiz questions, and 3D visualizations are original work created for
this game.
