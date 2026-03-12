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

/* --- SISTEMA DE PARTÍCULAS (FONDO INTERACTIVO) --- */
const canvas = document.getElementById("particles-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// Guarda la posición del ratón
let mouse = {
  x: null,
  y: null,
  radius: 120 // Radio de repulsión (cuanto más grande, desde más lejos huyen)
}

window.addEventListener('mousemove', function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

// Cuando el ratón sale de la pantalla, quitamos la repulsión
window.addEventListener('mouseout', function() {
  mouse.x = undefined;
  mouse.y = undefined;
});

class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  // Dibuja cada punto
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  // Mueve la partícula y comprueba la distancia al ratón
  update() {
    // Rebote en las paredes de la pantalla
    if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
    if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

    // Distancia entre el ratón y el punto
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // Si el punto entra en el radio del ratón, lo empujamos
    if (distance < mouse.radius) {
      const forceDirectionX = dx / distance;
      const forceDirectionY = dy / distance;
      const force = (mouse.radius - distance) / mouse.radius;
      // Multiplicamos por 5 para darle más o menos velocidad a la huida
      const directionX = forceDirectionX * force * 5;
      const directionY = forceDirectionY * force * 5;

      this.x -= directionX;
      this.y -= directionY;
    } else {
      // Movimiento normal y lento
      this.x += this.directionX;
      this.y += this.directionY;
    }

    this.draw();
  }
}

function init() {
  particlesArray = [];
  // Calcula cuántos puntos dibujar basándose en el tamaño de la pantalla
  let numberOfParticles = (canvas.height * canvas.width) / 9000;
  
  for (let i = 0; i < numberOfParticles; i++) {
    let size = (Math.random() * 2) + 0.5; // Tamaño del punto
    let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
    let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
    let directionX = (Math.random() * 1) - 0.5; // Velocidad X
    let directionY = (Math.random() * 1) - 0.5; // Velocidad Y
    let color = 'rgba(255, 255, 255, 0.6)'; // Color blanco al 60% de opacidad

    particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
}

// Reajustar si se cambia el tamaño de la ventana
window.addEventListener('resize', function() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});

/* --- SISTEMA DE CAMBIO DE IDIOMA --- */
function cambiarIdioma(lang) {
    // Guardamos la preferencia en el navegador para futuras visitas
    localStorage.setItem('portfolio_lang', lang);
    
    // Obtenemos la URL actual y la partimos
    // window.location.origin nos da "https://tu-usuario.github.io"
    // Dependiendo de si estás en local o en github pages, construimos la ruta
    
    let basePath = window.location.pathname; // Ej: /tu-repo/es/ o /es/
    
    // Reemplazamos /es/ o /en/ por el nuevo idioma en la URL
    let newPath = basePath.replace(/\/es\/|\/en\//, '/' + lang + '/');
    
    window.location.href = newPath;
}

init();
animate();