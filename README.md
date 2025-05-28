# RemixMate: Vietnamese-to-English Lyrics Translator System

RemixMate is a bilingual lyrics translator and karaoke-sync application built during the Perplexity AI Hackathon. It translates Vietnamese song lyrics into English—enriched with cultural and contextual insights via the Sonar API—while preserving rhythmic flow and offering a karaoke-style sing-along experience.

---

## Project Overview

- **Goal**: Automate extraction, translation, and alignment of Vietnamese remix lyrics from TikTok/YouTube videos.
- **Hackathon Window**: tight time constraints forced me to prioritize core data pipelines over front-end sync and translation tables.
- **Key Phases**:
  1. **Research & Wireframes**  
  2. **Translation Model & Sonar API**  
  3. **Dynamic Lyrics Extraction**  
  4. **Backend Remix Management (SQLite + REST API)**  
  5. **Frontend Karaoke Viewer (deferred)**  
  6. **Testing, Deployment & Documentation**

---

## Phase 3 Case Study: Dynamic Lyrics Extraction Journey

### Background  
Remix videos often embed stylized, animated lyrics—no clean subtitle files. I needed a multimodal pipeline to capture raw Vietnamese text.

### Objective  
Automatically pull Vietnamese lyrics from remix video frames or audio, with fallbacks, to feed into my translation engine later.

### Experimentation & Insights  

#### What Worked  
- **OCR (pytesseract & PaddleOCR)** extracted partial lines from static frames.  
- **Whisper STT** achieved ~80% accuracy on one clean remix.  
- **Title & Thumbnail Parsing** let us build dynamic playlists and metadata.

#### What Didn’t  
- Stylized or animated text often broke OCR (duplicates, cut-off words).  
- Whisper struggled on noisy remixes with heavy beats or distortion.  
- No single method reliably covered > 80% of lyrics across eight remix videos.

#### Solution Architecture  
1. **`extract_remix_titles.py`** — parse Vietnamese remix titles from screenshots.  
2. **`extract_frames.py`** — ffmpeg frame captures.  
3. **`detect_bad_frames.py`** — filter out empty/duplicate frames.  
4. **`extract_lyrics_from_frames.py`** — run OCR on good frames.  
5. **`transcribe_audio.py`** — Whisper STT transcription; log failures.  
6. **Outputs**  
   - `rhythm-aligner/failed_transcripts/` for OCR failures  
   - `rhythm-aligner/transcribed_lyrics/` for Whisper outputs  

#### Key Takeaways  
- **Multimodal pipelines** are essential for noisy UGC content.  
- **Graceful fallbacks** (logging & skipping) beat hard failures in hackathon sprints.  
- Extraction accuracy limits translation quality—prompting me to defer translations until upstream data is cleaner.

#### Future Improvements  
- Fine-tune Whisper on Vietnamese remixes or use a Vietnamese-specific STT.  
- Beat-detection (librosa) to isolate clearer vocal segments.  
- Pull lyric metadata from crowdsourced APIs or external remix databases.

---

## Phase 4 & 6: Backend, Testing & Docs

I implemented a **SQLite**-backed REST API to serve:
- Remix metadata (`/api/remixes`)
- OCR lines (`/api/remixes/:id/ocr`)
- STT lines (`/api/remixes/:id/stt`)

**Translations** are _deferred_—given my OCR/STT noise, translating now would produce garbage. I’ll add a `translations` table in a future phase once extraction is robust.

### Project Structure

```

.
├── backend/
│   ├── db/
│   │   └── schema.sql
│   ├── routes/
│   │   ├── lyrics.js
│   │   └── remixes.js
│   ├── services/
│   │   └── remixService.js
│   └── server.js
├── rhythm-aligner/
│   ├── failed\_transcripts/
│   ├── remix\_screenshots/
│   │   └── extract\_titles.json
│   └── transcribed\_lyrics/
├── scripts/
│   └── ingest.js
├── .gitignore
├── package.json
└── README.md

````

### Getting Started

1. **Clone & install**  
   ```bash
   git clone https://github.com/…/perplexity-remix.git
   cd perplexity-remix
   npm install
````

2. **Seed the database**

   ```bash
   node scripts/ingest.js
   ```
3. **Start the server**

   ```bash
   npm start
   ```
4. **Explore the API**

   ```bash
   curl http://localhost:3000/api/remixes
   curl http://localhost:3000/api/remixes/1/ocr
   curl http://localhost:3000/api/remixes/1/stt
   ```

### Testing

* Run **integration tests** with Jest & Supertest:

  ```bash
  npm test
  ```

### Failure Logs & Debugging

* **OCR Failures**: see `rhythm-aligner/failed_transcripts/`
* **STT Logs**: see `rhythm-aligner/transcribed_lyrics/`
* Ilog and skip problematic frames/cues to keep the pipeline moving under hackathon time pressure.

---

## Next Steps

* **Translation pipeline**: add `translations` table once Vietnamese lyrics input is cleaned.
* **Karaoke-style frontend**: re-activate Phase 5 for synchronized lyric highlighting.
* **External metadata**: integrate crowdsourced lyric APIs for better coverage.

---

*Thanks for checking out RemixMate! Any questions or feedback, feel free to open an issue.*

```
```
