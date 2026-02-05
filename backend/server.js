const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/categorias', require('./routes/categorias.routes'));
app.use('/api/productos', require('./routes/productos.routes'));
app.use('/api/pedidos', require('./routes/pedidos.routes'));
app.use('/api/detalle', require('./routes/detallePedido'));
app.use('/api/valoraciones', require('./routes/valoraciones.routes'));

app.listen(3000, () => {
  console.log('Backend activo en http://localhost:3000');
});
