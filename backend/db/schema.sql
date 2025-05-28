-- 1) one row per TikTok remix
CREATE TABLE IF NOT EXISTS remixes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  tiktok_id   TEXT    UNIQUE NOT NULL,    -- e.g. "7023456789012345678"
  title_vi    TEXT,                       -- from extract_titles.json
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2) raw OCR attempts from failed_transcripts/*.txt
CREATE TABLE IF NOT EXISTS ocr_lines (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  remix_id    INTEGER  NOT NULL
                 REFERENCES remixes(id)
                 ON DELETE CASCADE,
  line_index  INTEGER  NOT NULL,         -- order of the line
  text        TEXT     NOT NULL
);

-- 3) Whisper transcripts, with optional timing
CREATE TABLE IF NOT EXISTS stt_lines (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  remix_id    INTEGER  NOT NULL
                 REFERENCES remixes(id)
                 ON DELETE CASCADE,
  start_ms    INTEGER,                    -- NULL if from plain .txt
  end_ms      INTEGER,                    -- NULL if from plain .txt
  line_index  INTEGER  NOT NULL,          -- cue index or line number
  text        TEXT     NOT NULL
);
