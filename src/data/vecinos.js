// Los vecinos que vienen a la cafetería: cómo se mueven y qué dicen.
// Frases cortas; el farolero habla poco y deja las frases a medias.

const FAROLERO = { quien: 'El farolero' };
const linea = (texto) => ({ ...FAROLERO, texto });

export const VECINOS = {
  farolero: {
    nombre: 'El farolero',
    velocidad: 28, // muy despacio, con el bastón
    pies: 62 / 64, // dónde están los pies en sus imágenes (64x64)
    alturaMarca: 70,
    precio: 300, // 💴 lo que paga por su té
    llegaTrasSegundos: 6, // cuánto tarda en llegar después de abrir
    tomandoTeSegundos: 8, // cuánto se queda en la barra después de servirle

    // Lo que dice al pedirle desde la barra. Cambia un poco cada día.
    pedidos: [
      [linea('…'), linea('Té.'), linea('Solo. Sin nada.')],
      [linea('Buenos…'), linea('Lo de siempre.')],
      [linea('…'), linea('Tu abuela también…'), linea('No. Nada. Un té.')],
    ],
    servir: ['Le sirves un té verde, caliente, sin nada más.'],
    gracias: [linea('Hm.'), linea('…Gracias.')],

    // Si le hablas sin estar detrás de la barra, o después de servirle
    charla: [
      [linea('…'), linea('La niebla está igual que ayer.')],
      [linea('Hm.'), linea('Este té… está bien.')],
      [linea('…'), linea('No hace falta que me mires así.'), linea('Estoy bien.')],
    ],
  },
};

// Elige una variante distinta según el día, para que no repita siempre lo mismo
export function segunDia(lista, dia) {
  return lista[(dia - 1) % lista.length];
}
