# Phase 1: Project Kickoff & Research

## Feature List & Scope

### Core Features
- Vietnamese-English lyric translation (and vice versa)
- Enrichment of translated lyrics with cultural/contextual data from Sonar API
- Rhythmic alignment to maintain flow and syllable count
- Bilingual lyric display with synchronized karaoke-style highlighting
- Toggle between original and translated lyrics on UI
- Annotation panel showing Sonar API insights (idioms, references)
- Human review workflow for translation quality control (future scope)

### Scope Boundaries
- Focus on Vietnamese-English translation initially
- Karaoke sync limited to timestamped lyrics, no full audio editing
- Sonar API integration limited to metadata and contextual enrichment only
- Deployment as web app with backend API and React frontend

---

## Translation & Rhythmic Alignment Tools

- Selected Google Translate API / DeepL API for automated translation
- Planned rhythmic alignment using Python libraries:
  - NLTK for linguistic analysis (syllable counting)
  - Librosa for audio processing and beat detection
- Node.js backend to combine translation and Sonar API enrichment

---

## Wireframes

- Created wireframes using Visily with Media Player template
- Key UI components designed:
  - Side-by-side bilingual lyric display with highlighting overlays
  - Language toggle buttons for original, translation, or both
  - Annotation panel for Sonar API contextual insights
  - Media player controls with sing-along mode toggle
- Wireframes images and prototypes located in `/docs/wireframes/` folder

---

*End of Phase 1 summary.*
