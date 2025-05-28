// backend/services/remixService.js
const sqlite3 = require('sqlite3').verbose();
const db      = new sqlite3.Database('remixmate.db');

function listAllRemixes() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id, tiktok_id, title_vi AS title, created_at
       FROM remixes
       ORDER BY created_at DESC`,
      [],
      (err, rows) => err ? reject(err) : resolve(rows)
    );
  });
}

function getRemixMetadata(id) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT id, tiktok_id, title_vi AS title, created_at
       FROM remixes
       WHERE id = ?`,
      [id],
      (err, row) => err ? reject(err) : resolve(row)
    );
  });
}

function getOcrLines(id) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT line_index, text
       FROM ocr_lines
       WHERE remix_id = ?
       ORDER BY line_index`,
      [id],
      (err, rows) => err ? reject(err) : resolve(rows)
    );
  });
}

function getSttLines(id) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT start_ms, end_ms, line_index, text
       FROM stt_lines
       WHERE remix_id = ?
       ORDER BY COALESCE(start_ms, line_index)`,
      [id],
      (err, rows) => err ? reject(err) : resolve(rows)
    );
  });
}

module.exports = {
  listAllRemixes,
  getRemixMetadata,
  getOcrLines,
  getSttLines
};
