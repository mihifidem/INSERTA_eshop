const db = require('../db/database');

exports.getAll = (req, res) => {
  db.all('SELECT * FROM valoraciones', [], (err, rows) => {
    res.json(rows);
  });
};

exports.create = (req, res) => {
  const { usuario_id, producto_id, puntuacion, comentario } = req.body;
  db.run(
    'INSERT INTO valoraciones VALUES (NULL,?,?,?,?)',
    [usuario_id, producto_id, puntuacion, comentario]
  );
  res.json({ ok: true });
};

exports.update = (req, res) => {
  const { usuario_id, producto_id, puntuacion, comentario } = req.body;
  db.run(
    'UPDATE valoraciones SET usuario_id=?, producto_id=?, puntuacion=?, comentario=? WHERE id=?',
    [usuario_id, producto_id, puntuacion, comentario, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ updated: true });
    }
  );
};

exports.remove = (req, res) => {
  db.run(
    'DELETE FROM valoraciones WHERE id=?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ deleted: true });
    }
  );
};
