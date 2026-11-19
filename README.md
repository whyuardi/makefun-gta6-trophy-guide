# Leonida Trophy Guide — GTA VI: all 55 trophies, tracker & platinum roadmap

![Bounty](https://make.fun/badge/gta6-trophy-guide-01.svg)
![Rank](https://make.fun/badge/gta6-trophy-guide-01/whyuardi/makefun-gta6-trophy-guide/rank.svg)
![Reward](https://make.fun/badge/gta6-trophy-guide-01/whyuardi/makefun-gta6-trophy-guide/reward.svg)

Built for the [GTA 6 trophy guide bounty](https://make.fun/bounty/gta6-trophy-guide-01) on make.fun.

## What this is

A complete, offline trophy guide and tracker for Grand Theft Auto VI on PlayStation 5: all **55 official trophies** (1 platinum, 2 gold, 6 silver, 46 bronze — 28 of them hidden), each with a guide written in our own words, plus an interactive checklist, a step-by-step platinum roadmap, filters, and a spoiler mode that keeps story and hidden trophies masked until you choose to see them.

## How to open it

No install, no account, no network. Serve the `app/` folder any static way, for example:

```sh
node serve.ts
```

then open http://localhost:8080 — or just open `app/index.html` directly in a browser. Everything (page, script, styles, trophy data) is local; the page fetches nothing from the internet.

## Features

- **All 55 trophies** — names, descriptions and grades exactly as the official list shown on PlayStation Network (reported 18 November 2026 via Exophase, cross-checked against PSNProfiles and TrueAchievements).
- **A real guide per trophy** — what to do, where and how, and when it can be missed. Where no guide has confirmed a method yet (10 trophies, mostly the hidden one-offs), the entry says so plainly and labels the approach an estimate — speculation is never presented as fact.
- **Checklist that remembers** — tick trophies off; progress is stored in the browser (localStorage) and survives reloads. Export and import your progress as JSON.
- **Progress bar and grade counts** — how far you are overall and per grade, at a glance.
- **Filters** — by grade, by type (story / side / collectible / everything else), by earned vs unearned, and free-text search by name.
- **Spoiler mode** — on by default: story and hidden trophies show as “Hidden trophy” until earned or until you turn the setting off.
- **Platinum roadmap** — eight phases in order, from the pre-run setup (manual saves, the one missable trophy) through the story, side strands, activities, collectibles, robberies, money and the strange ones, to 100% completion and the platinum.
- **Missable flag** — Positive Mental Attitude (meditate at all 18 spots) is the one trophy guides flag as possibly missable, and it is flagged everywhere it appears.
- **Sources on every trophy** — the guides and list pages each entry was checked against (Planet GTA 6, GTA Zone, KeenGamer, Output Lag, WikiGTAVI), shown as text in the detail view.

## Facts the guide is built on

- 55 trophies: 1 platinum, 2 gold, 6 silver, 46 bronze. 27 visible, 28 hidden. Same 55 as achievements on Xbox Series X|S, worth 1,000 Gamerscore.
- All single-player, no online trophies. No difficulty trophies, no mission medals.
- Platinum estimate: roughly 200 hours (PowerPyx, via GTA Zone). Hardest trophy: A Long Road (100% completion).
- Cheats disable trophies; reports say there is no mission replay, so the guide tells you to keep a manual save at the start of every chapter.
- The game launched 19 November 2026; the trophy list went public 18 November 2026.

## Files

- `app/index.html` — the page
- `app/app.js` — checklist, filters, spoiler mode, roadmap, detail view
- `app/style.css` — dark Vice City styling, no external assets
- `app/data/trophies.json` — the 55 trophies with guides, flags and sources
- `screenshots/` — renders of the running app
- `main.ts` — copies `app/` and `screenshots/` to the output directory and writes `dossier.json`
- `serve.ts` — tiny static server for local development

## License

MIT — see `LICENSE`.
