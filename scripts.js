function copiarTexto(id, btn) {
  const texto = document.getElementById(id).innerText;
  
  navigator.clipboard.writeText(texto).then(() => {
    // Seleccionamos el icono dentro del botón pulsado
    const icono = btn.querySelector('i');
    
    // Cambiamos el icono al tick y añadimos la clase de animación
    icono.className = 'fas fa-check';
    btn.classList.add('btn-copiado');

    // Tras 2 segundos, devolvemos el botón a su estado original
    setTimeout(() => {
      icono.className = 'far fa-copy';
      btn.classList.remove('btn-copiado');
    }, 2000);

  }).catch(err => {
    console.error('Error al copiar: ', err);
  });
}