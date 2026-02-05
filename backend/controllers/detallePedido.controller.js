const db = require('../db/database');

exports.getByPedido = (req, res) => {
  db.all(
    'SELECT * FROM detalle_pedido WHERE pedido_id=?',
    [req.params.pedidoId],
    (err, rows) => {
      res.json(rows);
    }
  );
};

exports.create = (req, res) => {
  const { pedido_id, producto_id, cantidad } = req.body;
  db.run(
    'INSERT INTO detalle_pedido VALUES (NULL,?,?,?)',
    [pedido_id, producto_id, cantidad]
  );
  res.json({ ok: true });
};
