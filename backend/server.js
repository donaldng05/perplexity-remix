const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const app = express();

app.use(express.json());

// Routes
const remixesRouter = require('./routes/remixes');
const lyricsRouter  = require('./routes/lyrics');
// const translationRouter = require('./routes/translation');
// const sonarRouter       = require('./routes/sonar');

app.use('/api/remixes', remixesRouter);
app.use('/api/lyrics',   lyricsRouter);
// app.use('/api/translation', translationRouter);
// app.use('/api/sonar',       sonarRouter);

// Export the app for testing
module.exports = app;

// If run directly, start the server
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
