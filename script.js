// Al cargar la página, se muestran los comentarios guardados
window.onload = function () {
  const comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
  comentariosGuardados.forEach(mostrarComentario);
};

// Función para agregar un nuevo comentario
function agregarComentario(event) {
  event.preventDefault(); // Evita que se recargue la página

  const nombre = document.getElementById('nombre').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();
  const imagenInput = document.getElementById('imagen');
  const archivo = imagenInput.files[0];

  if (!nombre || !mensaje) {
    alert('Por favor, completa todos los campos requeridos.');
    return;
  }

  // Si se sube imagen, convertirla a Base64 para almacenarla
  if (archivo) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imagenBase64 = e.target.result;
      const nuevoComentario = { nombre, mensaje, imagen: imagenBase64, id: Date.now() };
      guardarYMostrar(nuevoComentario);
    };
    reader.readAsDataURL(archivo);
  } else {
    const nuevoComentario = { nombre, mensaje, imagen: null, id: Date.now() };
    guardarYMostrar(nuevoComentario);
  }

  // Reiniciar el formulario
  document.getElementById('form-comentario').reset();
}

// Guarda el comentario en localStorage y lo muestra en pantalla
function guardarYMostrar(comentario) {
  const comentarios = JSON.parse(localStorage.getItem('comentarios')) || [];
  comentarios.push(comentario);
  localStorage.setItem('comentarios', JSON.stringify(comentarios));
  mostrarComentario(comentario);
}

// Crea el elemento visual de un comentario
function mostrarComentario(comentario) {
  const contenedor = document.getElementById('comentarios');

  const div = document.createElement('div');
  div.classList.add('comentario');

  const header = document.createElement('div');
  header.classList.add('comentario-header');
  header.innerHTML = <strong>${comentario.nombre}</strong> <span>${new Date(comentario.id).toLocaleString()}</span>;

  const p = document.createElement('p');
  p.textContent = comentario.mensaje;

  div.appendChild(header);
  div.appendChild(p);

  if (comentario.imagen) {
    const img = document.createElement('img');
    img.src = comentario.imagen;
    img.alt = Imagen subida por ${comentario.nombre};
    div.appendChild(img);
  }

  const btnEliminar = document.createElement('button');
  btnEliminar.textContent = '❌ Eliminar';
  btnEliminar.classList.add('btn-eliminar');
  btnEliminar.onclick = function () {
    eliminarComentario(comentario.id);
    div.remove();
  };

  div.appendChild(btnEliminar);
  contenedor.appendChild(div);
}

// Elimina un solo comentario del localStorage
function eliminarComentario(id) {
  let comentarios = JSON.parse(localStorage.getItem('comentarios')) || [];
  comentarios = comentarios.filter(c => c.id !== id);
  localStorage.setItem('comentarios', JSON.stringify(comentarios));
}

// Borra todos los comentarios
function borrarComentarios() {
  if (confirm('¿Estás seguro de que deseas borrar todos los comentarios?')) {
    localStorage.removeItem('comentarios');
    document.getElementById('comentarios').innerHTML = '<h3>Comentarios</h3>';
  }
}
