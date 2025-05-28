// scripts/ingest.js
const fs        = require('fs').promises;
const path      = require('path');
const sqlite3   = require('sqlite3');
const { parseSrt } = require('subtitle'); // npm install subtitle sqlite3

const ROOT         = process.cwd();
const DB_PATH      = path.join(ROOT, 'remixmate.db');
const FAIL_DIR     = path.join(ROOT, 'rhythm-aligner', 'failed_transcripts');
const TITLE_FILE   = path.join(ROOT, 'rhythm-aligner', 'remix_screenshots', 'extracted_titles.json');
const TRANSCRIBE_DIR = path.join(ROOT, 'rhythm-aligner', 'transcribed_lyrics');

async function main() {
  // --- open & init DB
  const db     = new sqlite3.Database(DB_PATH);
  const schema = await fs.readFile(
    path.join(ROOT, 'backend', 'db', 'schema.sql'),
    'utf-8'
  );
  await run(db, schema);

  // --- ingest titles
  const titles = JSON.parse(await fs.readFile(TITLE_FILE, 'utf8'));
  for (let { video_id, title } of titles) {
    await run(db,
      `INSERT OR IGNORE INTO remixes (tiktok_id, title_vi)
       VALUES (?, ?)`,
      [video_id, title]
    );
  }

  // --- ingest OCR from failed_transcripts/*.txt
  const ocrFiles = await fs.readdir(FAIL_DIR);
  for (let fn of ocrFiles) {
    if (!fn.endsWith('.txt')) continue;
    const video_id = path.basename(fn, '.txt');
    const row = await getRow(db, `SELECT id FROM remixes WHERE tiktok_id = ?`, [video_id]);
    if (!row) continue;

    const lines = (await fs.readFile(path.join(FAIL_DIR, fn), 'utf8'))
                    .split('\n').filter(l => l.trim());
    for (let i = 0; i < lines.length; i++) {
      await run(db,
        `INSERT INTO ocr_lines (remix_id, line_index, text)
         VALUES (?, ?, ?)`,
        [row.id, i, lines[i].trim()]
      );
    }
  }

  // --- ingest STT from .srt / .txt
  const trFiles = await fs.readdir(TRANSCRIBE_DIR);
  for (let fn of trFiles) {
    const ext      = path.extname(fn);
    const video_id = path.basename(fn, ext);
    const row      = await getRow(db, `SELECT id FROM remixes WHERE tiktok_id = ?`, [video_id]);
    if (!row) continue;

    if (ext === '.srt') {
      const cues = parseSrt(await fs.readFile(path.join(TRANSCRIBE_DIR, fn), 'utf8'));
      for (let i = 0; i < cues.length; i++) {
        const c = cues[i];
        await run(db,
          `INSERT INTO stt_lines (remix_id, start_ms, end_ms, line_index, text)
           VALUES (?, ?, ?, ?, ?)`,
          [row.id, c.start, c.end, i, c.text.trim()]
        );
      }
    } else if (ext === '.txt') {
      const lines = (await fs.readFile(path.join(TRANSCRIBE_DIR, fn), 'utf8'))
                      .split('\n').filter(l => l.trim());
      for (let i = 0; i < lines.length; i++) {
        await run(db,
          `INSERT INTO stt_lines (remix_id, start_ms, end_ms, line_index, text)
           VALUES (?, NULL, NULL, ?, ?)`,
          [row.id, i, lines[i].trim()]
        );
      }
    }
  }

  console.log('ingestion complete');
  db.close();
}

// promisified helpers
function run(db, sql, params = []) {
  return new Promise((res, rej) =>
    db.run(sql, params, function(err) {
      if (err) rej(err);
      else res(this);
    })
  );
}
function getRow(db, sql, params = []) {
  return new Promise((res, rej) =>
    db.get(sql, params, (err, row) => err ? rej(err) : res(row))
  );
}

main().catch(console.error);
