// Distribución del interior de la librería, medida sobre la imagen
// public/assets/libreria-dentro.png (512x384). Todas las medidas son en
// píxeles de esa imagen: { x, y, ancho, alto } con x, y = esquina de arriba a la izquierda.

export const IMAGEN = { ancho: 512, alto: 384 };

// Zonas por donde no se puede caminar
export const MUROS = [
  { x: 0, y: 0, ancho: 512, alto: 150 }, // pared del fondo
  { x: 0, y: 150, ancho: 305, alto: 45 }, // estanterías, aparador y plantas del fondo
  { x: 0, y: 195, ancho: 173, alto: 61 }, // barra: tramo de arriba
  { x: 130, y: 195, ancho: 43, alto: 77 }, // barra: columna de la derecha
  { x: 60, y: 272, ancho: 113, alto: 78 }, // barra: tramo de abajo
  { x: 180, y: 236, ancho: 26, alto: 54 }, // taburetes junto a la barra
  { x: 180, y: 304, ancho: 26, alto: 26 },
  { x: 82, y: 358, ancho: 22, alto: 12 }, // taburetes de delante (se puede pasar por debajo)
  { x: 130, y: 358, ancho: 22, alto: 12 },
  { x: 243, y: 214, ancho: 75, alto: 58 }, // mesa redonda de arriba con sillas
  { x: 272, y: 300, ancho: 93, alto: 80 }, // mesa redonda de abajo con sillas
  { x: 377, y: 160, ancho: 135, alto: 112 }, // rincón de tatami
  { x: 466, y: 272, ancho: 46, alto: 22 }, // planta de la derecha
];

// Trozos de la imagen que se dibujan "delante" del protagonista cuando
// está detrás de ellos (su base marca quién tapa a quién)
export const FRENTES = [
  { x: 0, y: 192, ancho: 176, alto: 64, base: 256 }, // barra (arriba)
  { x: 128, y: 256, ancho: 48, alto: 16, base: 272 },
  { x: 58, y: 270, ancho: 120, alto: 82, base: 350 }, // barra (abajo)
  { x: 176, y: 226, ancho: 34, alto: 66, base: 290 }, // taburetes
  { x: 176, y: 294, ancho: 34, alto: 38, base: 330 },
  { x: 76, y: 326, ancho: 82, alto: 52, base: 374 },
  { x: 238, y: 200, ancho: 86, alto: 76, base: 272 }, // mesas
  { x: 266, y: 288, ancho: 104, alto: 96, base: 380 },
  { x: 374, y: 150, ancho: 138, alto: 124, base: 272 }, // tatami
  { x: 462, y: 218, ancho: 50, alto: 78, base: 294 }, // planta de la derecha
];

// Sitios importantes
export const PUERTA = { x: 236, y: 384 }; // la puerta está en el borde de abajo
export const CORTINA = { x: 333, y: 168 }; // la noren del fondo, que sube a casa
export const BARISTA = { x: 32, y: 270 }; // rincón detrás de la barra (se entra por abajo a la izquierda)
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
