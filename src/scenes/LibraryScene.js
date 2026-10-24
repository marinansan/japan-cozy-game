// Interior de la librería-cafetería. Provisional: dibujado con bloques de color
// hasta tener el arte definitivo, pero con la distribución real del local.
import Phaser from 'phaser';
import { BaseScene } from './BaseScene.js';
import { ANCHO, ALTO } from '../config.js';
import { juego, cambiarFase, nuevoDia } from '../systems/GameState.js';
import { hablar, preguntar, avisar } from '../ui/UI.js';
import { Spirit } from '../objects/Spirit.js';
import { TEXTOS } from '../data/textos.js';

// Medidas del local (en píxeles de la vista)
const SALA = { x: 180, y: 70, ancho: 600, alto: 430 };
const SUELO_Y = 185; // donde termina la pared del fondo y empieza el suelo
const PUERTA = { x: 480, y: 500 };
const BARRA = { x: 520, y: 288, ancho: 200, alto: 48 };
const CORTINA = { x: 690, y: 92, ancho: 70 };
const FAROLILLOS = [
  { x: 300, y: 92 },
  { x: 620, y: 92 },
  { x: 548, y: 150 }, // lámpara del banco de la ventana
];

export class LibraryScene extends BaseScene {
  constructor() {
    super('Library');
  }

  create(datos = {}) {
    this.crearBase(ANCHO, ALTO, 'interior');
    this.cameras.main.setBackgroundColor('#241c18');
    this.azar = new Phaser.Math.RandomDataGenerator(['libreria']);

    this.dibujarSala();
    this.dibujarMuebles();
    this.crearBrillos();
    this.crearInteracciones();

    this.crearJugador(PUERTA.x, PUERTA.y - 34);
    if (datos.entrada === 'inicio') this.presentacion();
    if (juego.fase === 'noche') this.empezarNoche();
  }

  // ---------- Dibujo ----------

  dibujarSala() {
    const g = this.add.graphics().setDepth(-10);
    const { x, y, ancho, alto } = SALA;

    // Suelo de tablones
    g.fillStyle(0xb98c5f).fillRect(x, SUELO_Y, ancho, y + alto - SUELO_Y);
    for (let fy = SUELO_Y, fila = 0; fy < y + alto; fy += 20, fila++) {
      g.fillStyle(0xa47a50).fillRect(x, fy, ancho, 2);
      for (let fx = x + (fila % 2) * 45; fx < x + ancho; fx += 90) g.fillRect(fx, fy, 2, 20);
    }

    // Pared del fondo: yeso cálido, viga arriba y zócalo de madera
    g.fillStyle(0xd9c4a0).fillRect(x, y, ancho, SUELO_Y - y);
    g.fillStyle(0x5b3f2b).fillRect(x, y, ancho, 12);
    g.fillStyle(0x6b4a33).fillRect(x, SUELO_Y - 10, ancho, 10);
    for (let px = x + 100; px < x + ancho; px += 150) g.fillStyle(0x7a5638).fillRect(px, y + 12, 6, SUELO_Y - y - 22);

    // Paredes de los lados y de delante (con el hueco de la puerta)
    g.fillStyle(0x4a3426);
    g.fillRect(x - 20, y, 20, alto + 20);
    g.fillRect(x + ancho, y, 20, alto + 20);
    g.fillRect(x - 20, y + alto, PUERTA.x - 30 - (x - 20), 20);
    g.fillRect(PUERTA.x + 30, y + alto, x + ancho + 20 - (PUERTA.x + 30), 20);
    g.fillStyle(0x7a6a5a).fillRect(PUERTA.x - 30, y + alto, 60, 20); // felpudo

    this.muro(x, y, ancho, SUELO_Y - y);
    this.muro(x - 20, y, 20, alto + 20);
    this.muro(x + ancho, y, 20, alto + 20);
    this.muro(x - 20, y + alto, PUERTA.x - 30 - (x - 20), 20);
    this.muro(PUERTA.x + 30, y + alto, x + ancho + 20 - (PUERTA.x + 30), 20);
    this.muro(PUERTA.x - 30, y + alto + 10, 60, 10);

    // Ventana con su banco y la lámpara
    g.fillStyle(0x5b3f2b).fillRect(426, 92, 98, 62);
    g.fillStyle(0xcfe0e6).fillRect(432, 98, 40, 50).fillRect(478, 98, 40, 50);

    // Estantería grande del fondo, llena de libros
    g.fillStyle(0x6b4a33).fillRect(196, 84, 208, 100);
    for (let balda = 0; balda < 3; balda++) {
      const by = 90 + balda * 31;
      g.fillStyle(0x4a3426).fillRect(200, by, 200, 26);
      this.libros(g, 202, by + 2, 196, 24);
    }

    // Repisa detrás de la barra con tazas y teteras
    g.fillStyle(0x6b4a33).fillRect(560, 136, 110, 8);
    const tazas = [0xefe6d2, 0x8fa88a, 0xc9a96e, 0xefe6d2, 0x6a6f8f, 0xefe6d2];
    tazas.forEach((c, i) => g.fillStyle(c).fillRect(566 + i * 17, 126, 10, 10));

    // Cortina del fondo, que sube a casa
    g.fillStyle(0x2f2620).fillRect(CORTINA.x - 4, CORTINA.y - 4, CORTINA.ancho + 8, SUELO_Y - CORTINA.y);
    g.fillStyle(0x3f4f7a).fillRect(CORTINA.x, CORTINA.y, CORTINA.ancho, 62);
    g.fillStyle(0x56689a).fillRect(CORTINA.x, CORTINA.y + 18, CORTINA.ancho, 6);
    g.fillStyle(0x2f2620).fillRect(CORTINA.x + CORTINA.ancho / 2 - 1, CORTINA.y, 2, 62);

    // Farolillos de papel en la pared
    FAROLILLOS.slice(0, 2).forEach(({ x: fx, y: fy }) => {
      g.fillStyle(0x5b3f2b).fillRect(fx - 1, fy - 10, 2, 8);
      g.fillStyle(0xf3e3c0).fillRoundedRect(fx - 9, fy - 2, 18, 24, 6);
      g.fillStyle(0xd9c4a0).fillRect(fx - 9, fy + 6, 18, 2).fillRect(fx - 9, fy + 13, 18, 2);
    });
  }

  libros(g, x, y, ancho, alto) {
    const colores = [0x8c5a4a, 0x5f7a6b, 0xc9a96e, 0x6a6f8f, 0xa86b5a, 0x7f8f5a, 0xd8c7a6];
    for (let bx = x; bx < x + ancho - 4; ) {
      const w = this.azar.between(4, 8);
      const h = this.azar.between(alto - 8, alto);
      g.fillStyle(this.azar.pick(colores)).fillRect(bx, y + alto - h, w, h);
      bx += w + 1;
    }
  }

  // Cada mueble va en su propia capa para que el protagonista pueda pasar por detrás
  mueble(dibujar, profundidad) {
    const g = this.add.graphics().setDepth(profundidad);
    dibujar(g);
    return g;
  }

  dibujarMuebles() {
    // Banco bajo la ventana
    this.mueble((g) => {
      g.fillStyle(0x7a5638).fillRect(424, 168, 102, 26);
      g.fillStyle(0x9fb08f).fillRect(428, 166, 94, 10);
    }, 194);
    this.muro(424, 168, 102, 26);

    // Lámpara de pie junto al banco
    this.mueble((g) => {
      g.fillStyle(0x4a3426).fillRect(546, 152, 4, 40);
      g.fillStyle(0xf3e3c0).fillTriangle(536, 156, 560, 156, 548, 140);
    }, 192);
    this.muro(540, 184, 16, 8);

    // La barra de la cafetería (se entra a la zona del barista por la derecha)
    const b = BARRA;
    this.mueble((g) => {
      g.fillStyle(0x6b4a33).fillRect(b.x, b.y + 14, b.ancho, b.alto - 14);
      g.fillStyle(0x8a5f3c).fillRect(b.x - 4, b.y, b.ancho + 4, 16);
      g.fillStyle(0x5b3f2b).fillRect(b.x, b.y + 30, b.ancho, 3);
      g.fillStyle(0xefe6d2).fillRect(b.x + 30, b.y + 2, 10, 8); // una taza
      g.fillStyle(0x7f8f5a).fillRect(b.x + 150, b.y - 6, 20, 14); // tarro de té
    }, b.y + b.alto);
    this.muro(b.x - 4, b.y, b.ancho + 4, b.alto);

    // Taburetes
    [550, 600, 650, 700].forEach((tx) => {
      this.mueble((g) => {
        g.fillStyle(0x4a3426).fillRect(tx - 2, 352, 4, 14);
        g.fillStyle(0x5b3f2b).fillEllipse(tx, 352, 22, 10);
      }, 366);
    });

    // Mesas redondas y la mesa grande, con sus sillas
    [
      { x: 270, y: 300 },
      { x: 270, y: 420 },
    ].forEach(({ x, y }) => {
      this.silla(x - 38, y);
      this.silla(x + 38, y);
      this.mueble((g) => {
        g.fillStyle(0x4a3426).fillRect(x - 3, y, 6, 18);
        g.fillStyle(0x8a5f3c).fillEllipse(x, y, 54, 30);
        g.fillStyle(0xefe6d2).fillRect(x - 5, y - 6, 10, 7);
      }, y + 18);
      this.muro(x - 27, y - 10, 54, 28);
    });
    this.mueble((g) => {
      g.fillStyle(0x4a3426).fillRect(372, 410, 6, 20).fillRect(468, 410, 6, 20);
      g.fillStyle(0x8a5f3c).fillRect(364, 384, 118, 30);
      g.fillStyle(0x6b4a33).fillRect(364, 410, 118, 6);
    }, 430);
    this.muro(364, 384, 118, 40);
    [390, 456].forEach((sx) => {
      this.silla(sx, 372);
      this.silla(sx, 446);
    });

    // Estantería baja y expositor de novedades
    this.mueble((g) => {
      g.fillStyle(0x6b4a33).fillRect(330, 236, 120, 30);
      this.libros(g, 334, 220, 112, 16);
    }, 266);
    this.muro(330, 236, 120, 30);
    this.mueble((g) => {
      g.fillStyle(0x6b4a33).fillRect(590, 430, 70, 26);
      g.fillStyle(0xc9a96e).fillRect(596, 424, 16, 12);
      g.fillStyle(0x8c5a4a).fillRect(616, 424, 16, 12);
      g.fillStyle(0x5f7a6b).fillRect(636, 424, 16, 12);
    }, 456);
    this.muro(590, 430, 70, 26);

    // Plantas en las esquinas
    [
      { x: 205, y: 210 },
      { x: 205, y: 480 },
      { x: 758, y: 480 },
    ].forEach(({ x, y }) => {
      this.mueble((g) => {
        g.fillStyle(0xa86b5a).fillRect(x - 9, y - 12, 18, 14);
        g.fillStyle(0x5f7a4c).fillCircle(x - 6, y - 20, 8).fillCircle(x + 6, y - 22, 8).fillCircle(x, y - 30, 8);
      }, y);
      this.muro(x - 9, y - 10, 18, 12);
    });

    // Cartel de abierto/cerrado junto a la puerta
    this.cartel = this.add
      .text(PUERTA.x + 58, PUERTA.y - 20, '', {
        fontFamily: 'Georgia',
        fontSize: '11px',
        color: '#f7efdf',
        backgroundColor: '#5b3f2b',
        padding: { x: 5, y: 2 },
      })
      .setOrigin(0.5)
      .setDepth(PUERTA.y);
    this.pintarCartel();
  }

  silla(x, y) {
    this.mueble((g) => {
      g.fillStyle(0x6b4a33).fillRect(x - 8, y - 6, 16, 14);
      g.fillStyle(0x9fb08f).fillRect(x - 7, y - 5, 14, 5);
    }, y + 8);
    this.muro(x - 8, y - 2, 16, 10);
  }

  pintarCartel() {
    this.cartel.setText(juego.fase === 'mañana' ? 'ABIERTO' : 'CERRADO');
  }

  // Brillos lavanda de las lámparas (solo de noche)
  crearBrillos() {
    this.brillos = FAROLILLOS.map(({ x, y }) =>
      this.add
        .image(x, y + 10, 'brillo')
        .setTint(0xb9a2ff)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setScale(1.6)
        .setAlpha(0.5)
        .setDepth(9001)
        .setVisible(juego.fase === 'noche'),
    );
  }

  // ---------- Interacciones ----------

  crearInteracciones() {
    this.interaccion({
      x: PUERTA.x,
      y: PUERTA.y - 20,
      texto: () => (juego.fase === 'mañana' ? 'Girar el cartel' : 'Puerta'),
      accion: () => this.usarPuerta(),
    });
    this.interaccion({
      x: CORTINA.x + CORTINA.ancho / 2,
      y: SUELO_Y + 12,
      texto: 'Subir a casa',
      accion: () => this.usarCortina(),
    });
    this.interaccion({
      x: 300,
      y: SUELO_Y + 8,
      radio: 60,
      texto: 'Mirar',
      accion: () => hablar(TEXTOS.estanteria),
    });
    this.interaccion({
      x: 620,
      y: BARRA.y - 14,
      radio: 50,
      texto: 'Barra',
      // Solo se atiende desde la zona del barista (detrás de la barra)
      activa: () => this.jugador.pies().y < BARRA.y,
      accion: () => hablar(juego.fase === 'noche' ? TEXTOS.barraNoche : TEXTOS.barraVacia),
    });
  }

  async usarPuerta() {
    if (juego.fase === 'mañana') {
      const r = await preguntar(TEXTOS.preguntaCerrarManana);
      if (r !== 0) return;
      cambiarFase('tarde');
      this.pintarCartel();
      this.ponerLuz();
      avisar('Ya es por la tarde');
      return;
    }
    if (juego.fase === 'tarde') {
      const r = await preguntar('¿Qué quieres hacer?', ['Salir al pueblo', 'Abrir de noche', 'Quedarme aquí']);
      if (r === 0) this.cambiarEscena('Town', { entrada: 'libreria' });
      if (r === 1) {
        cambiarFase('noche');
        this.ponerLuz();
        this.brillos.forEach((b) => b.setVisible(true));
        avisar('Cae la noche sobre la librería');
        this.empezarNoche();
      }
      return;
    }
    await hablar(TEXTOS.puertaNoche);
  }

  async usarCortina() {
    if (juego.fase !== 'noche') {
      await hablar(TEXTOS.prontoParaDormir);
      return;
    }
    const r = await preguntar('¿Subes a dormir?');
    if (r !== 0) return;
    nuevoDia();
    this.cambiarEscena('Library', { entrada: 'despertar' });
  }

  // ---------- Momentos ----------

  async presentacion() {
    if (juego.vistos.presentacion) return;
    juego.vistos.presentacion = true;
    juego.ocupado = true;
    this.time.delayedCall(700, () => hablar(TEXTOS.presentacion));
  }

  // De noche entra un espíritu, se acerca a la barra y espera con su "!"
  empezarNoche() {
    if (this.espiritu) return;
    const e = new Spirit(this, PUERTA.x, PUERTA.y - 10, 'okiku');
    this.espiritu = e;
    e.aparecer().then(() => e.ir(600, BARRA.y + BARRA.alto + 70, 3200)).then(() => e.mostrarMarca(true));
    this.interaccion({
      get x() {
        return e.x;
      },
      get y() {
        return e.y;
      },
      radio: 60,
      texto: 'Escuchar',
      accion: async () => {
        e.mostrarMarca(false);
        await hablar(juego.vistos.okiku ? TEXTOS.okikuOtraVez : TEXTOS.okikuPrimeraVez);
        juego.vistos.okiku = true;
      },
    });
  }

  update() {
    super.update();
    this.espiritu?.update();
  }
}
