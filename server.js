const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Log every request: time, method, route
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// In-memory data
let resources = [];
let nextId = 1;

// GET all
app.get('/api/resources', (req, res) => {
  res.json(resources);
});

// GET one
app.get('/api/resources/:id', (req, res) => {
  const item = resources.find(r => r.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

// CREATE
app.post('/api/resources', (req, res) => {
  const item = { id: nextId++, ...req.body };
  resources.push(item);
  res.status(201).json(item);
});

// UPDATE
app.put('/api/resources/:id', (req, res) => {
  const item = resources.find(r => r.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not found' });
  Object.assign(item, req.body, { id: item.id });
  res.json(item);
});

// DELETE
app.delete('/api/resources/:id', (req, res) => {
  const i = resources.findIndex(r => r.id === Number(req.params.id));
  if (i === -1) return res.status(404).json({ error: 'Not found' });
  resources.splice(i, 1);
  res.json({ deleted: true });
});

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
