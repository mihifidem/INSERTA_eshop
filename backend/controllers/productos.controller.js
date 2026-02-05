const db = require('../db/database');

exports.getAll = (req, res) => {
  db.all('SELECT * FROM productos', [], (err, rows) => {
    res.json(rows);
  });
};

exports.create = (req, res) => {
  const { nombre, precio, categoria_id } = req.body;
  db.run(
    'INSERT INTO productos (nombre,precio,categoria_id) VALUES (?,?,?)',
    [nombre, precio, categoria_id]
  );
  res.json({ ok: true });
};

exports.update = (req, res) => {
  const { nombre, precio, categoria_id } = req.body;
  db.run(
    'UPDATE productos SET nombre=?, precio=?, categoria_id=? WHERE id=?',
    [nombre, precio, categoria_id, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ updated: true });
    }
  );
};

exports.remove = (req, res) => {
  db.run(
    'DELETE FROM productos WHERE id=?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ deleted: true });
    }
  );
};
