const express = require('express');
const path = require('path');
const tugasRoutes = require('./routes/tugas');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/tugas', tugasRoutes);

// Untuk lokal saja, Vercel tidak butuh listen
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => console.log('Jalan di http://localhost:3000'));
}

module.exports = app;