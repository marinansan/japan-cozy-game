// Tamaño lógico del juego. Es el doble de nítido en pantallas 1920x1080
// (escala exacta x2), y en el resto se ajusta al tamaño de la ventana.
export const ANCHO = 960;
export const ALTO = 540;

// Velocidad al caminar (píxeles por segundo)
export const VELOCIDAD = 130;

// Color de la luz en cada momento del día (se multiplica sobre la escena).
// Dentro de la librería la luz es más cálida; fuera, más suave.
export const LUZ = {
  interior: { mañana: 0xfff3e2, tarde: 0xffd9a8, noche: 0x7466b8 },
  exterior: { mañana: 0xffffff, tarde: 0xffe6c4, noche: 0x5a5a9a },
};

export const NOMBRE_FASE = { mañana: 'Mañana', tarde: 'Tarde', noche: 'Noche' };
