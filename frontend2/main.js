const urlProductos = 'http://localhost:3000/api/productos';
const urlCategorias = 'http://localhost:3000/api/categorias';
const urlUsuarios = 'http://localhost:3000/api/usuarios';

const listaUsuarios = document.getElementById('listaUsuarios');
const listaProductos = document.getElementById('listaProductos');


// Cache de categorías
let categorias = [];

// Cargar categorías al inicio
async function cargarCategorias() {
  try {
    const response = await fetch(urlCategorias);
    if (!response.ok) {
      throw new Error('Error al cargar categorías');
    }
    categorias = await response.json();
  } catch (error) {
    console.error('Error cargando categorías:', error);
  }
}

// Función que devuelve el nombre de la categoría a partir del categoria_id
function getNombreCategoria(categoria_id) {
  const categoria = categorias.find(cat => cat.id === categoria_id);
  return categoria ? categoria.nombre : 'Sin categoría';
}

async function cargarProductos() {
  try {
    const response = await fetch(urlProductos);

    if (!response.ok) {
      throw new Error('Error al cargar los datos');
    }

    const productos = await response.json();

    listaProductos.innerHTML = '';

    productos.forEach(producto => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${producto.nombre}</strong><br>
        ${producto.precio}€<br>
        ${getNombreCategoria(producto.categoria_id)}
      `;
      listaProductos.appendChild(li);
    });
  } catch (error) {
    listaProductos.innerHTML = '<li>Error al cargar productos</li>';
    console.error(error);
  }
}

async function cargarUsuarios() {
  try {
    const response = await fetch(urlUsuarios);

    if (!response.ok) {
      throw new Error('Error al cargar los datos');
    }

    const usuarios = await response.json();

    listaUsuarios.innerHTML = '';

    usuarios.forEach(usuario => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${usuario.nombre}</strong><br>
        ${usuario.email}<br>     `;
      listaUsuarios.appendChild(li);
    });

  } catch (error) {
    listaUsuarios.innerHTML = '<li>Error al cargar usuarios</li>';
    console.error(error);
  }
}

// Inicializar: primero cargar categorías, luego productos
(async () => {
  await cargarCategorias();
  await cargarProductos();
  await cargarUsuarios();
})();