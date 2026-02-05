const db = require('../db/database');

exports.getAll = (req, res) => {
  db.all('SELECT * FROM categorias', [], (err, rows) => {
    res.json(rows);
  });
};

exports.create = (req, res) => {
  db.run(
    'INSERT INTO categorias (nombre) VALUES (?)',
    [req.body.nombre]
  );
  res.json({ ok: true });
};

exports.update = (req, res) => {
  db.run(
    'UPDATE categorias SET nombre=? WHERE id=?',
    [req.body.nombre, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ updated: true });
    }
  );
};

exports.remove = (req, res) => {
  db.run(
    'DELETE FROM categorias WHERE id=?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ deleted: true });
    }
  );
};
