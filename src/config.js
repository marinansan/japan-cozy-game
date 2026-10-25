// Tamaño lógico mínimo del juego (16:9). Se amplía a la pantalla: x2 en 1280x720, x3 en 1920x1080.
// En pantallas más alargadas (móviles) la vista se ensancha para ocuparlo todo, sin bandas negras.
export const ANCHO = 640;
export const ALTO = 360;

// Velocidad al caminar (píxeles por segundo). Despacio: es un juego sin prisa.
export const VELOCIDAD = 85;

// Color de la luz en cada momento del día (se multiplica sobre la escena).
// Dentro de la librería la luz es más cálida; fuera, más suave.
export const LUZ = {
  interior: { mañana: 0xfff3e2, tarde: 0xffd9a8, noche: 0x5a52a0 },
  exterior: { mañana: 0xffffff, tarde: 0xffe6c4, noche: 0x5a5a9a },
};

export const NOMBRE_FASE = { mañana: 'Mañana', tarde: 'Tarde', noche: 'Noche' };
