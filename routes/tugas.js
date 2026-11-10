const express = require('express');
const pool = require('../db');
const router = express.Router();

// READ
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM tugas ORDER BY status ASC, deadline ASC'
    );
    const now = Date.now();
    const data = rows.map((t) => {
      const sisa = new Date(t.deadline).getTime() - now;
      return {
        ...t,
        urgent: t.status !== 'selesai' && sisa > 0 && sisa < 24 * 60 * 60 * 1000,
        terlambat: t.status !== 'selesai' && sisa <= 0,
      };
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
router.post('/', async (req, res) => {
  const { mata_kuliah, judul, deadline } = req.body;
  if (!mata_kuliah || !judul || !deadline) {
    return res.status(400).json({ error: 'Semua field wajib diisi' });
  }
  try {
    const { rows } = await pool.query(
      'INSERT INTO tugas (mata_kuliah, judul, deadline) VALUES ($1, $2, $3) RETURNING *',
      [mata_kuliah, judul, deadline]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { mata_kuliah, judul, deadline, status } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE tugas SET mata_kuliah=$1, judul=$2, deadline=$3, status=$4
       WHERE id=$5 RETURNING *`,
      [mata_kuliah, judul, deadline, status, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Tugas tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM tugas WHERE id=$1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'Tugas tidak ditemukan' });
    res.json({ message: 'Berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;