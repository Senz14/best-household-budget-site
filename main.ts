// Hearthside — best household budget site (Node 22, standard library only).
//
// The site is plain static files in app/ (index.html, CSS, ES modules, no
// build step, no network request). This program hands it in: it copies app/
// and screenshots/ from beside this file into the output directory and
// writes /output/dossier.json with the vendored make.fun library, so the
// judge reads the screenshots, the first load's files and bytes, and the
// site's source. vendor/makefun-frontend.ts is the kit's copy, unchanged:
// the scorer rebuilds the dossier with its own copy and compares the two
// byte for byte, so this file must not invent its own dossier format.
//
// Run it outside the grader with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

// Read the dossier back and confirm it is well-formed JSON: both grader
// runs must produce the same bytes, so a corrupt write must fail loudly
// here instead of silently handing in a broken entry.
const dossierRaw = readFileSync(join(out, 'dossier.json'), 'utf8');
JSON.parse(dossierRaw);
console.log(`Hearthside handed in: dossier.json is ${Buffer.byteLength(dossierRaw)} bytes.`);
