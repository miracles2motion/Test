import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Proper mime-types definition for webmanifest and modules
express.static.mime.define({
  'application/manifest+json': ['webmanifest'],
  'application/javascript': ['js', 'mjs'],
  'image/svg+xml': ['svg']
});

// Cache control headers for dev iteration
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// Serve static assets from root
app.use(express.static(__dirname));

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Doodle Strike server running at http://0.0.0.0:${PORT}`);
});
