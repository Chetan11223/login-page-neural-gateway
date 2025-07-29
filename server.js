import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

// Mock authentication endpoint
app.post('/api/auth', (req, res) => {
  const { email, password } = req.body;
  
  // In a real app, you would validate credentials against a database
  if (email && password) {
    res.json({
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        email,
        id: 1
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 