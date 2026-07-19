require('dotenv').config();
const express = require('express');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Log every request: time, method, route
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// GET all
app.get('/api/items', async (req, res) => {
  const result = await pool.query('SELECT * FROM items ORDER BY id');
  res.json(result.rows);
});

// GET one
app.get('/api/items/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM items WHERE id = $1', [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(result.rows[0]);
});

// CREATE
app.post('/api/items', async (req, res) => {
  const { name, status } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const result = await pool.query(
    'INSERT INTO items (name, status) VALUES ($1, $2) RETURNING *',
    [name, status || 'todo']
  );
  res.status(201).json(result.rows[0]);
});

// UPDATE
app.put('/api/items/:id', async (req, res) => {
  const { name, status } = req.body;
  const result = await pool.query(
    `UPDATE items
     SET name = COALESCE($1, name),
         status = COALESCE($2, status)
     WHERE id = $3
     RETURNING *`,
    [name, status, req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(result.rows[0]);
});

// DELETE
app.delete('/api/items/:id', async (req, res) => {
  const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ deleted: true });
});

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));