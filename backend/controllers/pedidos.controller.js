const db = require('../db/database');

exports.getAll = (req, res) => {
  db.all('SELECT * FROM pedidos', [], (err, rows) => {
    res.json(rows);
  });
};

exports.create = (req, res) => {
  const fecha = req.body.fecha || new Date().toISOString();
  db.run(
    'INSERT INTO pedidos (usuario_id, fecha) VALUES (?,?)',
    [req.body.usuario_id, fecha],
    function () {
      res.json({ id: this.lastID });
    }
  );
};

exports.update = (req, res) => {
  const { usuario_id, fecha } = req.body;
  db.run(
    'UPDATE pedidos SET usuario_id=?, fecha=? WHERE id=?',
    [usuario_id, fecha, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ updated: true });
    }
  );
};

exports.remove = (req, res) => {
  db.run(
    'DELETE FROM detalle_pedido WHERE pedido_id=?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      db.run(
        'DELETE FROM pedidos WHERE id=?',
        [req.params.id],
        (err2) => {
          if (err2) return res.status(500).json(err2);
          res.json({ deleted: true });
        }
      );
    }
  );
};
