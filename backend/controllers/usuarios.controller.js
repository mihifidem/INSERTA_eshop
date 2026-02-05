const db = require('../db/database');

exports.getAll = (req, res) => {
  db.all('SELECT * FROM usuarios', [], (err, rows) => {
    res.json(rows);
  });
};

exports.create = (req, res) => {
  const { nombre, email } = req.body;
  db.run(
    'INSERT INTO usuarios (nombre,email) VALUES (?,?)',
    [nombre, email],
    function () {
      res.json({ id: this.lastID });
    }
  );
};

// GET BY ID
exports.getById = (req, res) => {
  db.get(
    'SELECT * FROM usuarios WHERE id = ?',
    [req.params.id],
    (err, row) => {
      if (err) return res.status(500).json(err);
      res.json(row);
    }
  );
};


// UPDATE
exports.update = (req, res) => {
  const { nombre, email } = req.body;

  db.run(
    `UPDATE usuarios
     SET nombre = ?, email = ?
     WHERE id = ?`,
    [nombre, email, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ updated: true });
    }
  );
};

// DELETE
exports.remove = (req, res) => {
  db.run(
    'DELETE FROM usuarios WHERE id = ?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ deleted: true });
    }
  );
};
