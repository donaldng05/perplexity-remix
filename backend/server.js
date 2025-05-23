require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// Routes
const translationRoutes = require('./routes/translation');
const sonarRoutes = require('./routes/sonar');

app.use('/api/translation', translationRoutes);
app.use('/api/sonar', sonarRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
