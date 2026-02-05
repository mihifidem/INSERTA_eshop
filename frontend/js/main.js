const API = 'http://localhost:3000/api';
let carrito = [];
let productosCache = [];

function alerta(msg, tipo='success') {
  alertas.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show">
      ${msg}
      <button class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
}

function crearUsuario() {
  if (!userName.value.trim() || !userEmail.value.trim()) {
    alerta('Completa nombre y email', 'danger');
    return;
  }

  fetch(`${API}/usuarios`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      nombre: userName.value,
      email: userEmail.value
    })
  }).then(() => {
    alerta('Usuario creado');
    cargarUsuarios();
  });
}

function cargarUsuarios() {
  fetch(`${API}/usuarios`)
    .then(r => r.json())
    .then(data => {
      tablaUsuarios.innerHTML = data.map(u => `
        <tr>
          <td>${u.id}</td>
          <td>${u.nombre}</td>
          <td>${u.email}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary me-1" onclick="editarUsuario(${u.id}, '${encodeURIComponent(u.nombre ?? '')}', '${encodeURIComponent(u.email ?? '')}')">Editar</button>
            <button class="btn btn-sm btn-outline-danger" onclick="borrarUsuario(${u.id})">Borrar</button>
          </td>
        </tr>
      `).join('');

      valUser.innerHTML = '<option value="">Usuario</option>' + data.map(u => `
        <option value="${u.id}">${u.nombre} (${u.email})</option>
      `).join('');

      pedidoUser.innerHTML = '<option value="">Seleccione usuario</option>' + data.map(u => `
        <option value="${u.id}">${u.nombre}</option>
      `).join('');
    });
}

function crearCategoria() {
  if (!catName.value.trim()) {
    alerta('Completa el nombre de la categoría', 'danger');
    return;
  }

  fetch(`${API}/categorias`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({nombre:catName.value})
  }).then(()=>{
    alerta('Categoría creada');
    cargarCategorias();
  });
}

function crearProducto() {
  if (!prodName.value.trim() || !prodPrice.value.trim() || !prodCat.value) {
    alerta('Completa nombre, precio y categoría', 'danger');
    return;
  }

  fetch(`${API}/productos`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      nombre:prodName.value,
      precio:prodPrice.value,
      categoria_id:prodCat.value
    })
  }).then(()=>{
    alerta('Producto creado');
    cargarProductos();
  });
}

function agregarProductoPedido() {
  const productoId = pedidoProducto.value;
  const cantidad = parseInt(pedidoCantidad.value, 10);

  if (!productoId || !cantidad || cantidad < 1) {
    alerta('Selecciona producto y cantidad válida', 'danger');
    return;
  }

  const producto = productosCache.find(p => String(p.id) === String(productoId));
  if (!producto) {
    alerta('Producto no encontrado', 'danger');
    return;
  }

  const existente = carrito.find(i => String(i.producto_id) === String(productoId));
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({
      producto_id: producto.id,
      nombre: producto.nombre,
      precio: Number(producto.precio) || 0,
      cantidad
    });
  }

  renderDetallePedido();
}

function quitarProductoPedido(productoId) {
  carrito = carrito.filter(i => String(i.producto_id) !== String(productoId));
  renderDetallePedido();
}

function calcularTotal() {
  return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}

function renderDetallePedido() {
  tablaDetallePedido.innerHTML = carrito.map(item => {
    const subtotal = item.precio * item.cantidad;
    return `
      <tr>
        <td>${item.nombre}</td>
        <td>${item.precio}</td>
        <td>${item.cantidad}</td>
        <td>${subtotal}</td>
        <td>
          <button class="btn btn-sm btn-outline-danger" onclick="quitarProductoPedido(${item.producto_id})">Quitar</button>
        </td>
      </tr>
    `;
  }).join('');

  totalPedido.textContent = calcularTotal().toFixed(2);
}

function crearPedidoConDetalles() {
  if (!pedidoUser.value) {
    alerta('Selecciona un usuario', 'danger');
    return;
  }

  if (carrito.length === 0) {
    alerta('Añade productos al pedido', 'danger');
    return;
  }

  if (!pedidoFecha.value) {
    alerta('Selecciona fecha del pedido', 'danger');
    return;
  }

  const fecha = pedidoFecha.value || new Date().toISOString().slice(0, 10);

  fetch(`${API}/pedidos`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      usuario_id: pedidoUser.value,
      fecha
    })
  })
    .then(r => r.json())
    .then(({ id }) => {
      const requests = carrito.map(item => fetch(`${API}/detalle`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          pedido_id: id,
          producto_id: item.producto_id,
          cantidad: item.cantidad
        })
      }));

      return Promise.all(requests).then(() => id);
    })
    .then(() => {
      alerta('Pedido creado','warning');
      carrito = [];
      renderDetallePedido();
      cargarPedidos();
    });
}

function valorar() {
  if (!valUser.value || !valProd.value) {
    alerta('Selecciona usuario y producto', 'danger');
    return;
  }

  const puntuacion = parseInt(valScore.value, 10);
  if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
    alerta('Selecciona una puntuación de 1 a 5', 'danger');
    return;
  }

  if (!valComment.value.trim()) {
    alerta('Escribe un comentario', 'danger');
    return;
  }

  fetch(`${API}/valoraciones`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      usuario_id:valUser.value,
      producto_id:valProd.value,
      puntuacion,
      comentario:valComment.value
    })
  }).then(()=>{
    alerta('Valoración guardada','info');
    cargarValoraciones();
    valComment.value = '';
    setRating(0);
  });
}

cargarUsuarios();

function cargarCategorias() {
  fetch(`${API}/categorias`)
    .then(r => r.json())
    .then(data => {
      tablaCategorias.innerHTML = data.map(c => `
        <tr>
          <td>${c.id}</td>
          <td>${c.nombre}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary me-1" onclick="editarCategoria(${c.id}, '${encodeURIComponent(c.nombre ?? '')}')">Editar</button>
            <button class="btn btn-sm btn-outline-danger" onclick="borrarCategoria(${c.id})">Borrar</button>
          </td>
        </tr>
      `).join('');

      prodCat.innerHTML = '<option value="">Seleccione categoría</option>' + data.map(c => `
        <option value="${c.id}">${c.nombre}</option>
      `).join('');
    });
}

function cargarProductos() {
  fetch(`${API}/productos`)
    .then(r => r.json())
    .then(data => {
      productosCache = data;
      tablaProductos.innerHTML = data.map(p => `
        <tr>
          <td>${p.id}</td>
          <td>${p.nombre}</td>
          <td>${p.precio}</td>
          <td>${p.categoria_id ?? ''}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary me-1" onclick="editarProducto(${p.id}, '${encodeURIComponent(p.nombre ?? '')}', '${p.precio ?? ''}', '${p.categoria_id ?? ''}')">Editar</button>
            <button class="btn btn-sm btn-outline-danger" onclick="borrarProducto(${p.id})">Borrar</button>
          </td>
        </tr>
      `).join('');

      pedidoProducto.innerHTML = '<option value="">Seleccione producto</option>' + data.map(p => `
        <option value="${p.id}">${p.nombre}</option>
      `).join('');

      valProd.innerHTML = '<option value="">Producto</option>' + data.map(p => `
        <option value="${p.id}">${p.nombre}</option>
      `).join('');
    });
}

function cargarPedidos() {
  fetch(`${API}/pedidos`)
    .then(r => r.json())
    .then(data => {
      tablaPedidos.innerHTML = data.map(p => `
        <tr>
          <td>${p.id}</td>
          <td>${p.usuario_id}</td>
          <td>${p.fecha ?? ''}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary me-1" onclick="editarPedido(${p.id}, '${p.usuario_id ?? ''}', '${encodeURIComponent(p.fecha ?? '')}')">Editar</button>
            <button class="btn btn-sm btn-outline-danger" onclick="borrarPedido(${p.id})">Borrar</button>
          </td>
        </tr>
      `).join('');
    });
}

function cargarValoraciones() {
  fetch(`${API}/valoraciones`)
    .then(r => r.json())
    .then(data => {
      tablaValoraciones.innerHTML = data.map(v => `
        <tr>
          <td>${v.id}</td>
          <td>${v.usuario_id}</td>
          <td>${v.producto_id}</td>
          <td>${v.puntuacion}</td>
          <td>${v.comentario ?? ''}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary me-1" onclick="editarValoracion(${v.id}, '${v.usuario_id ?? ''}', '${v.producto_id ?? ''}', '${v.puntuacion ?? ''}', '${encodeURIComponent(v.comentario ?? '')}')">Editar</button>
            <button class="btn btn-sm btn-outline-danger" onclick="borrarValoracion(${v.id})">Borrar</button>
          </td>
        </tr>
      `).join('');
    });
}

cargarCategorias();
cargarProductos();
cargarPedidos();
cargarValoraciones();

pedidoFecha.value = new Date().toISOString().slice(0, 10);
renderDetallePedido();
initRating();

function editarUsuario(id, nombreEnc, emailEnc) {
  const nombre = prompt('Nombre', decodeURIComponent(nombreEnc));
  if (nombre === null) return;
  const email = prompt('Email', decodeURIComponent(emailEnc));
  if (email === null) return;

  fetch(`${API}/usuarios/${id}`, {
    method:'PUT',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({ nombre, email })
  }).then(()=>{
    alerta('Usuario actualizado');
    cargarUsuarios();
  });
}

function borrarUsuario(id) {
  if (!confirm('¿Borrar usuario?')) return;
  fetch(`${API}/usuarios/${id}`, { method:'DELETE' })
    .then(()=>{
      alerta('Usuario borrado');
      cargarUsuarios();
    });
}

function editarCategoria(id, nombreEnc) {
  const nombre = prompt('Nombre categoría', decodeURIComponent(nombreEnc));
  if (nombre === null) return;

  fetch(`${API}/categorias/${id}`, {
    method:'PUT',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({ nombre })
  }).then(()=>{
    alerta('Categoría actualizada');
    cargarCategorias();
  });
}

function borrarCategoria(id) {
  if (!confirm('¿Borrar categoría?')) return;
  fetch(`${API}/categorias/${id}`, { method:'DELETE' })
    .then(()=>{
      alerta('Categoría borrada');
      cargarCategorias();
    });
}

function editarProducto(id, nombreEnc, precio, categoriaId) {
  const nombre = prompt('Nombre producto', decodeURIComponent(nombreEnc));
  if (nombre === null) return;
  const nuevoPrecio = prompt('Precio', precio);
  if (nuevoPrecio === null) return;
  const nuevaCategoria = prompt('ID Categoría', categoriaId);
  if (nuevaCategoria === null) return;

  fetch(`${API}/productos/${id}`, {
    method:'PUT',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      nombre,
      precio: nuevoPrecio,
      categoria_id: nuevaCategoria
    })
  }).then(()=>{
    alerta('Producto actualizado');
    cargarProductos();
  });
}

function borrarProducto(id) {
  if (!confirm('¿Borrar producto?')) return;
  fetch(`${API}/productos/${id}`, { method:'DELETE' })
    .then(()=>{
      alerta('Producto borrado');
      cargarProductos();
    });
}

function editarPedido(id, usuarioId, fechaEnc) {
  const nuevoUsuario = prompt('ID Usuario', usuarioId);
  if (nuevoUsuario === null) return;
  const nuevaFecha = prompt('Fecha (YYYY-MM-DD o ISO)', decodeURIComponent(fechaEnc));
  if (nuevaFecha === null) return;

  fetch(`${API}/pedidos/${id}`, {
    method:'PUT',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      usuario_id: nuevoUsuario,
      fecha: nuevaFecha
    })
  }).then(()=>{
    alerta('Pedido actualizado','warning');
    cargarPedidos();
  });
}

function borrarPedido(id) {
  if (!confirm('¿Borrar pedido y su detalle?')) return;
  fetch(`${API}/pedidos/${id}`, { method:'DELETE' })
    .then(()=>{
      alerta('Pedido borrado','warning');
      cargarPedidos();
    });
}

function editarValoracion(id, usuarioId, productoId, puntuacion, comentarioEnc) {
  const nuevoUsuario = prompt('ID Usuario', usuarioId);
  if (nuevoUsuario === null) return;
  const nuevoProducto = prompt('ID Producto', productoId);
  if (nuevoProducto === null) return;
  const nuevaPuntuacion = prompt('Puntuación (1-5)', puntuacion);
  if (nuevaPuntuacion === null) return;
  const nuevoComentario = prompt('Comentario', decodeURIComponent(comentarioEnc));
  if (nuevoComentario === null) return;

  fetch(`${API}/valoraciones/${id}`, {
    method:'PUT',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      usuario_id: nuevoUsuario,
      producto_id: nuevoProducto,
      puntuacion: nuevaPuntuacion,
      comentario: nuevoComentario
    })
  }).then(()=>{
    alerta('Valoración actualizada','info');
    cargarValoraciones();
  });
}

function borrarValoracion(id) {
  if (!confirm('¿Borrar valoración?')) return;
  fetch(`${API}/valoraciones/${id}`, { method:'DELETE' })
    .then(()=>{
      alerta('Valoración borrada','info');
      cargarValoraciones();
    });
}

function initRating() {
  const stars = document.querySelectorAll('.rating-star');
  stars.forEach(star => {
    star.addEventListener('click', () => {
      const value = parseInt(star.dataset.value, 10);
      setRating(value);
    });
  });
}

function setRating(value) {
  valScore.value = value;
  const stars = document.querySelectorAll('.rating-star');
  stars.forEach(star => {
    const starValue = parseInt(star.dataset.value, 10);
    star.classList.toggle('active', starValue <= value);
  });
}
