// Simple Node.js static server for local development.
// Run: npm install && npm start  →  http://localhost:3000
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => console.log(`✨ Site running at http://localhost:${PORT}`));
