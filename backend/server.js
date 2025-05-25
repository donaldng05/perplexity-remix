require('dotenv').config({ path: __dirname + '/.env' });
console.log("DEBUG: process.env =", process.env);
const express = require('express');
const app = express();

app.use(express.json());

// Routes
// const translationRoutes = require('./routes/translation');
// const sonarRoutes = require('./routes/sonar');

// app.use('/api/translation', translationRoutes);
// app.use('/api/sonar', sonarRoutes);

const lyricsRoutes = require('./routes/lyrics');
app.use('/api/lyrics', lyricsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
