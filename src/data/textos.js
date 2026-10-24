// Textos del juego. Frases cortas; lo emotivo se insinúa.
// Una línea puede ser un texto o { quien, texto, espiritu }.

const OKIKU = { quien: '¿…?', espiritu: true };

export const TEXTOS = {
  presentacion: [
    'La librería de la abuela huele a madera vieja y a té.',
    'Todo sigue como en los veranos de tu infancia. Más silencioso, eso sí.',
    'Cuando quieras terminar la mañana, gira el cartel de la puerta.',
  ],

  estanteria: [
    'Los libros de la abuela. Algunos tienen notas suyas en los márgenes.',
    'En uno pone, con su letra apretada: «Para leer con lluvia».',
  ],

  barraVacia: ['Todo listo detrás de la barra.', 'Aún no ha llegado nadie. Hay tiempo para un té.'],
  barraNoche: ['La tetera todavía está tibia.'],

  preguntaCerrarManana: '¿Giras el cartel a «cerrado» y terminas la mañana?',
  puertaNoche: ['Es de noche. Fuera, la niebla lo cubre todo.', 'Mejor quedarse aquí, donde hay luz.'],
  prontoParaDormir: ['Todavía es pronto para dormir.'],

  okikuPrimeraVez: [
    { ...OKIKU, texto: '…¿Dónde estoy? Huele a té verde.' },
    { ...OKIKU, texto: 'Recuerdo papel. Mucho papel… y luz.' },
    { ...OKIKU, texto: 'Pero no recuerdo mi nombre.' },
    { ...OKIKU, texto: '¿Me dejas quedarme un rato? Aquí la niebla no llega.' },
  ],
  okikuOtraVez: [
    { ...OKIKU, texto: 'Té verde… con algo dulce. Creo que me gustaba así.' },
  ],

  estacion: ['La estación. Aquí bajaste del tren con una maleta y muchas dudas.'],
  niebla: ['La niebla es espesa como la leche.', 'No se puede pasar. Todavía no.'],
  preguntaEntrar: '¿Entras en la librería?',
};
