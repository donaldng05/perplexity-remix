const { spawn } = require('child_process');
const path = require('path');

function alignSyllables(original, translated) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../../rhythm-aligner/syllable_aligner.py');
    const input = JSON.stringify({ original, translated });

    const py = spawn('python', [scriptPath, input]);

    let data = '';
    py.stdout.on('data', chunk => (data += chunk.toString()));
    py.stderr.on('data', err => console.error('Python error:', err.toString()));

    py.on('close', code => {
      if (code !== 0) {
        return reject(new Error('Python script failed'));
      }
      try {
        const result = JSON.parse(data);
        resolve(result);
      } catch (err) {
        reject(new Error('Invalid JSON from Python script'));
      }
    });
  });
}

module.exports = { alignSyllables };
