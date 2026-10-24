// Distribución del interior de la librería, medida sobre la imagen
// public/assets/libreria-dentro.png (512x384). Todas las medidas son en
// píxeles de esa imagen: { x, y, ancho, alto } con x, y = esquina de arriba a la izquierda.

export const IMAGEN = { ancho: 512, alto: 384 };

// Zonas por donde no se puede caminar. En esta vista 3/4 los muebles solo bloquean
// su base (lo que toca el suelo): por detrás se puede pasar y el mueble tapa con su silueta.
// Para revisarlos: python3 tools/walk_map.py mapa.png
export const MUROS = [
  { x: 0, y: 0, ancho: 512, alto: 150 }, // pared del fondo
  { x: 0, y: 150, ancho: 305, alto: 45 }, // estanterías, aparador y plantas del fondo
  { x: 0, y: 195, ancho: 173, alto: 55 }, // barra: tramo de arriba
  { x: 130, y: 195, ancho: 43, alto: 83 }, // barra: columna de la derecha
  { x: 60, y: 278, ancho: 113, alto: 72 }, // barra: tramo de abajo
  { x: 182, y: 252, ancho: 22, alto: 10 }, // taburetes junto a la barra (solo las patas)
  { x: 182, y: 280, ancho: 22, alto: 10 },
  { x: 182, y: 320, ancho: 22, alto: 10 },
  { x: 82, y: 360, ancho: 22, alto: 10 }, // taburetes de delante
  { x: 130, y: 360, ancho: 22, alto: 10 },
  { x: 246, y: 244, ancho: 70, alto: 28 }, // mesa redonda de arriba con sus sillas (base)
  { x: 272, y: 334, ancho: 92, alto: 46 }, // mesa redonda de abajo con sus sillas (base)
  { x: 377, y: 160, ancho: 135, alto: 112 }, // rincón de tatami (tarima elevada)
  { x: 470, y: 280, ancho: 42, alto: 14 }, // planta de la derecha (maceta)
  { x: 494, y: 294, ancho: 18, alto: 74 }, // puerta de casa (pared derecha)
];

// Trozos de la imagen que se dibujan "delante" de la protagonista cuando
// está detrás de ellos (su base marca quién tapa a quién). Con silueta: true se usa
// solo el mueble, sin el suelo de alrededor (public/assets/frentes/, tools/make_front_masks.py).
// La barra va en rectángulo porque es casi todo mostrador. El tatami no tapa: es una tarima baja.
export const FRENTES = [
  { x: 0, y: 192, ancho: 176, alto: 64, base: 256 }, // barra (arriba)
  { x: 128, y: 256, ancho: 48, alto: 16, base: 272 },
  { x: 58, y: 270, ancho: 120, alto: 82, base: 350 }, // barra (abajo)
  { x: 176, y: 226, ancho: 34, alto: 66, base: 290, silueta: true }, // taburetes
  { x: 176, y: 294, ancho: 34, alto: 38, base: 330, silueta: true },
  { x: 76, y: 326, ancho: 82, alto: 52, base: 374, silueta: true },
  { x: 238, y: 200, ancho: 86, alto: 76, base: 272, silueta: true }, // mesas
  { x: 266, y: 288, ancho: 104, alto: 96, base: 380, silueta: true },
  { x: 462, y: 218, ancho: 50, alto: 78, base: 294, silueta: true }, // planta de la derecha
]

// Sitios importantes
export const ENTRADA = { x: 333, y: 176 }; // la noren del fondo: entrada principal, desde el jardín
export const CARTEL = { x: 333, y: 64 }; // cartel de abierto/cerrado, encima de la noren
export const CASA = { x: 484, y: 330 }; // puerta corredera de la pared derecha, que sube a casa
// Detrás de la barra: se entra por el rincón de abajo a la izquierda y se sigue por el hueco entre los dos tramos
export const ZONA_BARISTA = [
  { x: 0, y: 256, ancho: 60, alto: 50 }, // rincón
  { x: 60, y: 250, ancho: 72, alto: 28 }, // hueco entre los tramos de la barra
];
export const BARISTA = { x: 120, y: 268 }; // sitio donde se atiende, mirando a los taburetes
export const ESTANTERIAS = { x: 240, y: 200 };
export const TATAMI = { x: 440, y: 282 };
export const SITIO_ESPIRITU = { x: 222, y: 282 }; // donde espera el espíritu, junto a la barra
export const FAROLILLOS = [
  { x: 82, y: 102 },
  { x: 144, y: 168 },
  { x: 200, y: 102 },
  { x: 432, y: 50 },
];

// Ventanas por las que entra el resplandor del cielo de noche
export const VENTANAS_NOCHE = [
  { x: 442, y: 112, escala: 1.6 },
  { x: 243, y: 24, escala: 1 },
];
