// gta6-clipper-01 entry (Node 22, standard library only).
//
// The entry is the YouTube video, not this program: the clip itself was cut
// from Rockstar Games' official "Grand Theft Auto VI Trailer 2", rendered as
// clip.mp4 in this repository, and uploaded to YouTube as a public Short with
// the bounty's line and the play code in its description. All this program
// has to do is hand the gate the video's address: it copies VIDEO.json from
// the repository root to /output/VIDEO.json, where the gate reads it. Nothing
// this program writes about the video is scored — the house reads the video
// itself through the YouTube Data API and ranks it by views.
//
// VIDEO.json still holds the starter placeholder until the video is uploaded:
// this program refuses to hand in a placeholder, so it exits 1 with a plain
// warning instead of silently submitting a file the gate refuses.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const videoFile = join(BOT_DIR, 'VIDEO.json');
const videoText = readFileSync(videoFile, 'utf8');
if (videoText.includes('<id>')) {
  console.error('VIDEO.json still holds the starter placeholder — upload the clip to YouTube first, then put its real address in VIDEO.json.');
  process.exit(1);
}
let videoUrl: string;
try {
  videoUrl = (JSON.parse(videoText) as { url: string }).url;
} catch {
  console.error('VIDEO.json is not valid JSON with a url field.');
  process.exit(1);
}
if (!/^https:\/\/(www\.|m\.)?(youtube\.com\/(shorts\/|watch\?v=)|youtu\.be\/)/.test(videoUrl)) {
  console.error(`VIDEO.json url is not a YouTube video address: ${videoUrl}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(videoFile, join(OUTPUT_DIR, 'VIDEO.json'));
  console.log(`VIDEO.json copied to ${OUTPUT_DIR}/VIDEO.json`);
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
