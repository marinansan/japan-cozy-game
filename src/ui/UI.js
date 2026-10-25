// Interfaz en HTML: marcador, bocadillos con texto letra a letra,
// preguntas con opciones, pista/botón de acción y avisos cortos.
import { juego, escuchar, faseNiebla } from '../systems/GameState.js';
import { NOMBRE_FASE } from '../config.js';

const VELOCIDAD_TEXTO = 28; // milisegundos por letra

let raiz, pista, boton, velo, caja, quien, texto, flecha, opciones, aviso, esquina, reloj, yenes;
let accionActual = null;
let textoAccion = null;
let alAvanzar = null; // qué hacer al pulsar o tocar mientras hay un diálogo

const esTactil = () =>
  window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

function crear(tag, clase, padre = raiz) {
  const el = document.createElement(tag);
  if (clase) el.className = clase;
  padre.appendChild(el);
  return el;
}

export function iniciarUI({ pantallaCompleta } = {}) {
  raiz = document.getElementById('ui');
  if (esTactil()) raiz.classList.add('tactil');

  // Arriba a la derecha: el reloj, los yenes y el botón de pantalla completa
  esquina = crear('div', 'esquina');
  reloj = crearReloj();
  yenes = crearYenes();
  crearPantallaCompleta(pantallaCompleta);
  // En el móvil en vertical, un aviso para girarlo
  crear('div', 'girar').innerHTML = '<div class="girar-icono">📱</div><p>Gira el móvil para jugar</p>';
  pista = crear('div', 'pista');
  boton = crear('button', 'boton-accion');
  velo = crear('div', 'velo');
  caja = crear('div', 'dialogo');
  quien = crear('div', 'quien', caja);
  texto = crear('div', 'texto', caja);
  opciones = crear('div', 'opciones', caja);
  flecha = crear('div', 'flecha', caja);
  flecha.textContent = '▼';
  aviso = crear('div', 'aviso');

  const usarAccion = (e) => {
    e.preventDefault();
    if (accionActual && !juego.ocupado) accionActual();
  };
  boton.addEventListener('pointerdown', usarAccion);
  pista.addEventListener('pointerdown', usarAccion);

  // Tocar en cualquier sitio (o pulsar E / espacio / Intro) avanza el diálogo
  velo.addEventListener('pointerdown', () => alAvanzar && alAvanzar());
  caja.addEventListener('pointerdown', (e) => {
    if (e.target.tagName !== 'BUTTON' && alAvanzar) alAvanzar();
  });
  window.addEventListener('keydown', (e) => {
    if (!alAvanzar) return;
    if (['KeyE', 'Space', 'Enter'].includes(e.code)) {
      e.preventDefault();
      if (!e.repeat) alAvanzar(e.code);
    } else if (['ArrowUp', 'ArrowLeft', 'KeyW', 'KeyA'].includes(e.code)) {
      alAvanzar('anterior');
    } else if (['ArrowDown', 'ArrowRight', 'KeyS', 'KeyD'].includes(e.code)) {
      alAvanzar('siguiente');
    } else if (/^Digit[1-9]$/.test(e.code)) {
      alAvanzar(e.code);
    }
  });

  escuchar(pintarHUD);
  pintarHUD();
}

// Botón de pantalla completa (PC y Android). En iPhone no existe: allí se usa
// "Añadir a pantalla de inicio" y el juego se abre como una app a pantalla completa.
function crearPantallaCompleta(alternar) {
  const disponible = document.fullscreenEnabled || document.webkitFullscreenEnabled;
  if (!alternar || !disponible) return;
  const boton = crear('button', 'pantalla-completa', esquina);
  boton.type = 'button';
  boton.title = 'Pantalla completa';
  boton.setAttribute('aria-label', 'Pantalla completa');
  boton.textContent = '⛶';
  boton.addEventListener('click', async () => {
    try {
      alternar();
      // En el móvil, intentar dejarlo en horizontal (si el navegador lo permite)
      await screen.orientation?.lock?.('landscape');
    } catch {
      // Si no se puede, se sigue jugando igual
    }
  });
}

// Reloj de cúpula: el cielo de mañana, tarde y noche con una aguja, y en el medallón
// el número de la fase de la niebla. Una imagen por momento del día, con fundido entre ellas.
const IMAGEN_FASE = { mañana: 'manana', tarde: 'tarde', noche: 'noche' };

function crearReloj() {
  const el = crear('div', 'reloj', esquina);
  el.setAttribute('role', 'img');
  for (const [fase, archivo] of Object.entries(IMAGEN_FASE)) {
    const img = crear('img', 'reloj-imagen', el);
    img.src = `assets/ui/reloj-${archivo}.png`;
    img.alt = '';
    img.dataset.fase = fase;
  }
  crear('span', 'reloj-numero', el);
  return el;
}

function pintarReloj() {
  reloj.querySelectorAll('.reloj-imagen').forEach((img) => img.classList.toggle('visible', img.dataset.fase === juego.fase));
  reloj.querySelector('.reloj-numero').textContent = faseNiebla();
  reloj.setAttribute('aria-label', `${NOMBRE_FASE[juego.fase]}. Fase de la niebla ${faseNiebla()}`);
  reloj.title = `${NOMBRE_FASE[juego.fase]} · Fase de la niebla ${faseNiebla()}`;
}

// Yenes: moneda dorada con el ¥ y la cantidad, sobre una placa de madera que se estira
function crearYenes() {
  const el = crear('div', 'yenes', esquina);
  const fondo = (pieza, nombre) => (pieza.style.backgroundImage = `url('assets/ui/placa-${nombre}.png')`);
  fondo(crear('span', 'placa-izq', el), 'izq');
  const centro = crear('span', 'placa-centro', el);
  fondo(centro, 'centro');
  const moneda = crear('img', 'yenes-moneda', centro);
  moneda.src = 'assets/ui/moneda-yen.png';
  moneda.alt = '';
  crear('span', 'yenes-cantidad', centro);
  fondo(crear('span', 'placa-der', el), 'der');
  return el;
}

function pintarHUD() {
  pintarReloj();
  yenes.querySelector('.yenes-cantidad').textContent = juego.yenes;
  yenes.setAttribute('aria-label', `${juego.yenes} yenes`);
  yenes.title = `${juego.yenes} yenes`;
}

// La escena dice qué se puede hacer ahora mismo (o null si nada)
export function ponerAccion(etiqueta, fn) {
  accionActual = fn;
  if (etiqueta === textoAccion) return;
  textoAccion = etiqueta;
  if (etiqueta) {
    pista.innerHTML = `<kbd>E</kbd>${etiqueta}`;
    boton.textContent = etiqueta;
  }
  pista.classList.toggle('visible', !!etiqueta);
  boton.classList.toggle('visible', !!etiqueta);
}

function abrirCaja(linea) {
  juego.ocupado = true;
  ponerAccion(null, null);
  const nombre = typeof linea === 'object' ? linea.quien : null;
  quien.textContent = nombre || '';
  quien.style.display = nombre ? 'block' : 'none';
  caja.classList.toggle('espiritu', !!(typeof linea === 'object' && linea.espiritu));
  caja.classList.add('visible');
  velo.classList.add('visible');
  opciones.innerHTML = '';
  flecha.style.visibility = 'hidden';
}

function cerrarCaja() {
  caja.classList.remove('visible');
  velo.classList.remove('visible');
  alAvanzar = null;
  // Pequeña espera para que la misma pulsación no vuelva a activar nada
  setTimeout(() => {
    juego.ocupado = false;
  }, 150);
}

// Escribe el texto letra a letra. Devuelve una función para terminarlo de golpe.
function escribir(cadena, alTerminar) {
  let i = 0;
  texto.textContent = '';
  const id = setInterval(() => {
    i += 1;
    texto.textContent = cadena.slice(0, i);
    if (i >= cadena.length) terminar();
  }, VELOCIDAD_TEXTO);
  let hecho = false;
  function terminar() {
    if (hecho) return;
    hecho = true;
    clearInterval(id);
    texto.textContent = cadena;
    alTerminar();
  }
  return { terminar, escribiendo: () => !hecho };
}

/**
 * Muestra una o varias frases seguidas.
 * Cada línea puede ser un texto o { quien, texto, espiritu }.
 */
export function hablar(lineas) {
  if (!Array.isArray(lineas)) lineas = [lineas];
  return new Promise((resolver) => {
    let n = 0;
    const mostrar = () => {
      const linea = lineas[n];
      abrirCaja(linea);
      const escritura = escribir(typeof linea === 'object' ? linea.texto : linea, () => {
        flecha.style.visibility = 'visible';
      });
      alAvanzar = (tecla) => {
        if (tecla === 'anterior' || tecla === 'siguiente') return;
        if (escritura.escribiendo()) return escritura.terminar();
        n += 1;
        if (n < lineas.length) mostrar();
        else {
          cerrarCaja();
          resolver();
        }
      };
    };
    mostrar();
  });
}

/**
 * Hace una pregunta con botones. Devuelve el número de la opción elegida.
 * Con el teclado: flechas para moverse y E / espacio / Intro para elegir.
 */
export function preguntar(pregunta, lista = ['Sí', 'No']) {
  return new Promise((resolver) => {
    abrirCaja(pregunta);
    let marcada = 0;
    let botones = [];
    const elegir = (i) => {
      cerrarCaja();
      resolver(i);
    };
    const marcar = (i) => {
      marcada = (i + botones.length) % botones.length;
      botones.forEach((b, j) => b.classList.toggle('marcada', j === marcada));
    };
    const escritura = escribir(typeof pregunta === 'object' ? pregunta.texto : pregunta, () => {
      botones = lista.map((etiqueta, i) => {
        const b = crear('button', '', opciones);
        b.textContent = etiqueta;
        b.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          elegir(i);
        });
        return b;
      });
      marcar(0);
    });
    alAvanzar = (tecla) => {
      if (escritura.escribiendo()) return escritura.terminar();
      if (tecla === 'anterior') return marcar(marcada - 1);
      if (tecla === 'siguiente') return marcar(marcada + 1);
      if (tecla && tecla.startsWith('Digit')) {
        const i = Number(tecla.slice(5)) - 1;
        if (i < botones.length) elegir(i);
        return;
      }
      // Un toque fuera de los botones no elige nada
      if (tecla) elegir(marcada);
    };
  });
}

// Mensaje corto arriba que desaparece solo
let temporizadorAviso;
export function avisar(mensaje, ms = 2600) {
  aviso.textContent = mensaje;
  aviso.classList.add('visible');
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => aviso.classList.remove('visible'), ms);
}
