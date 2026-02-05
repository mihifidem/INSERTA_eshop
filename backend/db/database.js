const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./ecommerce.db');

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      email TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      precio REAL,
      categoria_id INTEGER,
      FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER,
      fecha TEXT,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS detalle_pedido (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido_id INTEGER,
      producto_id INTEGER,
      cantidad INTEGER,
      FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
      FOREIGN KEY (producto_id) REFERENCES productos(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS valoraciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER,
      producto_id INTEGER,
      puntuacion INTEGER,
      comentario TEXT
    )
  `);

});

module.exports = db;
