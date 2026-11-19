// Entry point for the Leonida Trophy Guide hand-in.
//
// The guide itself is a folder of plain static files — app/index.html plus
// its script, stylesheet and trophy data — that a browser opens with no
// build step and no network. This file's only job is to hand those files in:
// it copies app/ and screenshots/ from beside this file into the output
// directory, then writes dossier.json there with the vendored make.fun
// library. The scorer re-runs that library on the handed-in files and
// requires the dossier to match byte for byte, so this file adds nothing of
// its own to the dossier — it just calls the library with the caps the
// bounty’s gate sets.
//
// Run it outside the grader’s container with an output directory of your
// own:   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Run it twice into two directories and the two trees must come out
// byte-identical: the copy is a plain recursive copy and the dossier is a
// deterministic function of the files, so nothing here can vary run to run.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The folder this file lives in, and the folder the hand-in goes to.
const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The whole app, exactly as it stands in the repo.
mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });

// The screenshots, when the folder exists (it should: the cover is the
// first file by name, and the gate refuses an entry with none).
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The dossier: the judge's outline of the entry. The caps are the bounty's
// own (see the starter's reference/gate.json): text_max_bytes shapes how
// much source text the dossier carries, the rest only refuse an entry the
// scorer would refuse — at most 4 screenshots, none over 256 KiB, at most
// 993 files and directories in app/, and app/ under 48 MiB.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
