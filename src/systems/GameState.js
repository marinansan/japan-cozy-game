// Estado compartido de la partida: lo leen las escenas y la interfaz.
export const juego = {
  dia: 1,
  fase: 'mañana', // 'mañana' | 'tarde' | 'noche'
  recuerdos: 0,   // 🌙 la única forma de abrir zonas nuevas
  yenes: 0,       // 💴 para construir y decorar más adelante
  ocupado: false, // true mientras hay un diálogo o una transición
  vistos: {},     // cosas que ya han pasado (presentaciones, charlas…)
};

const oyentes = new Set();

// Para enterarse de cualquier cambio (lo usa el marcador de arriba)
export function escuchar(fn) {
  oyentes.add(fn);
  return () => oyentes.delete(fn);
}

export function avisar() {
  oyentes.forEach((fn) => fn(juego));
}

export function cambiarFase(fase) {
  juego.fase = fase;
  avisar();
}

export function nuevoDia() {
  juego.dia += 1;
  juego.fase = 'mañana';
  avisar();
}
