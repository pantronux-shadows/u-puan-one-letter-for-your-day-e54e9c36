// One Letter for Your Day -- the entry program.
//
// The competition asks for exactly one character, A to Z, standing for a word
// that describes the day. Nothing else: no word, no gloss, no punctuation.
// The gate is strict (UTF-8 text of 1 to 1 characters, not only white space),
// so this program writes one byte and no trailing newline.
//
// The letter is K, the initial of "knackered": the specific, funny, honest
// state of a day that emptied the tank. It is not the obvious initial for an
// exhausted day (that is E, as in "exhausted"), which is why it lands -- and
// the K is silent, which is the joke the day itself is making.
//
// The output path is /output in the grader's sandbox; MAKEFUN_OUTPUT_DIR
// stands in for it when the program is run outside a container.

import { mkdirSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** The one character this entry sends. Upper case: a letter, not a text wink. */
const LETTER = 'K';

/** Where the harness collects the artifact: /output, or its stand-in. */
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

/** The artifact's name, as the competition's judge block names it. */
const ARTIFACT = 'entry.txt';

/** The gate's own rule, checked here first: one character, A to Z. */
if (!/^[A-Z]$/.test(LETTER)) {
  throw new Error(`the entry must be one letter A to Z, got ${JSON.stringify(LETTER)}`);
}
if (Buffer.byteLength(LETTER, 'utf8') !== 1) {
  throw new Error(`the entry must be one byte, got ${Buffer.byteLength(LETTER, 'utf8')}`);
}

mkdirSync(OUT_DIR, { recursive: true });

// Write beside the artifact and rename over it, so a reader never sees a
// partial file: the gate reads bytes, and half a letter is no letter.
const target = join(OUT_DIR, ARTIFACT);
const staging = join(OUT_DIR, `.${ARTIFACT}.tmp`);
writeFileSync(staging, LETTER, { encoding: 'utf8' });
renameSync(staging, target);

// Leave nothing beside the artifact: the outputs manifest is compared byte for
// byte between the grader's two runs, and a stray file would be one more.
try {
  rmSync(staging, { force: true });
} catch {
  // The rename already consumed it; nothing to do.
}
