// Interior de la librería-cafetería, con el arte de PixelLab.
// La distribución (muros, muebles, sitios) está en src/data/libraryLayout.js.
import Phaser from 'phaser';
import { BaseScene } from './BaseScene.js';
import { ANCHO, ALTO } from '../config.js';
import { juego, cambiarFase, nuevoDia } from '../systems/GameState.js';
import { hablar, preguntar, avisar } from '../ui/UI.js';
import { Spirit } from '../objects/Spirit.js';
import { TEXTOS } from '../data/textos.js';
import * as L from '../data/libraryLayout.js';

const PARED_DELANTE = 16; // franja de pared de abajo
// La imagen va centrada en la pantalla
const OX = Math.round((ANCHO - L.IMAGEN.ancho) / 2);
const OY = Math.round((ALTO - L.IMAGEN.alto - PARED_DELANTE) / 2);

// De medidas de la imagen a posiciones en la pantalla
const p = ({ x, y }) => ({ x: OX + x, y: OY + y });

export class LibraryScene extends BaseScene {
  constructor() {
    super('Library');
  }

  create(datos = {}) {
    this.crearBase(ANCHO, ALTO, 'interior');
    this.cameras.main.setBackgroundColor('#1e1814');
    this.physics.world.setBounds(OX, OY, L.IMAGEN.ancho, L.IMAGEN.alto + PARED_DELANTE);

    this.add.image(OX, OY, 'libreria-dentro').setOrigin(0).setDepth(-10);
    this.colocarFrentes();
    this.dibujarParedDelantera();
    L.MUROS.forEach((m) => this.muro(OX + m.x, OY + m.y, m.ancho, m.alto));
    this.crearNoche();
    this.crearInteracciones();

    // Al despertar se aparece junto a la puerta de casa; si no, en la entrada
    const inicio = datos.entrada === 'despertar' ? p({ x: L.CASA.x - 10, y: L.CASA.y }) : p(L.ENTRADA);
    this.crearJugador(inicio.x, inicio.y + 6);
    if (datos.entrada === 'inicio') this.presentacion();
    if (juego.fase === 'noche') this.empezarNoche();
  }

  // ---------- Dibujo ----------

  // Copias recortadas de la imagen que tapan al protagonista cuando pasa por detrás
  colocarFrentes() {
    L.FRENTES.forEach((f) => {
      this.add
        .image(OX, OY, 'libreria-dentro')
        .setOrigin(0)
        .setCrop(f.x, f.y, f.ancho, f.alto)
        .setDepth(OY + f.base);
    });
  }

  dibujarParedDelantera() {
    const g = this.add.graphics().setDepth(OY + L.IMAGEN.alto + PARED_DELANTE);
    const y = OY + L.IMAGEN.alto;
    g.fillStyle(0x4a3426).fillRect(OX, y, L.IMAGEN.ancho, PARED_DELANTE);
    g.fillStyle(0x5b3f2b).fillRect(OX, y, L.IMAGEN.ancho, 3);
    this.muro(OX, y + 8, L.IMAGEN.ancho, PARED_DELANTE);

    // Cartel de abierto/cerrado, colgado encima de la entrada
    const c = p(L.CARTEL);
    this.cartel = this.add
      .text(c.x, c.y, '', {
        fontFamily: 'Georgia',
        fontSize: '11px',
        color: '#f7efdf',
        backgroundColor: '#5b3f2b',
        padding: { x: 5, y: 2 },
      })
      .setOrigin(0.5)
      .setDepth(OY + L.ENTRADA.y);
    this.pintarCartel();
  }

  pintarCartel() {
    this.cartel.setText(juego.fase === 'mañana' ? 'ABIERTO' : 'CERRADO');
  }

  // La noche: cielo estrellado en las ventanas, farolillos en ámbar
  // y charcos de luz cálida. Todo va por encima de la
  // capa de luz (que oscurece en violeta) para que brille de verdad.
  crearNoche() {
    const cosas = [];
    const ADD = Phaser.BlendModes.ADD;

    cosas.push(this.add.image(OX, OY, 'libreria-noche').setOrigin(0).setDepth(9002));

    // Resplandor violeta del cielo que entra por las ventanas
    L.VENTANAS_NOCHE.forEach((v) => {
      cosas.push(
        this.add.image(OX + v.x, OY + v.y, 'brillo').setTint(0x8f6ad8).setBlendMode(ADD)
          .setScale(v.escala).setAlpha(0.14).setDepth(9001),
      );
    });

    // Farolillos: halo ámbar que tiembla un poco, como una llama
    L.FAROLILLOS.forEach((f, i) => {
      const halo = this.add.image(OX + f.x, OY + f.y, 'brillo').setTint(0xff9a3c).setBlendMode(ADD)
        .setScale(1.5).setAlpha(0.34).setDepth(9001);
      const charco = this.add.image(OX + f.x, OY + f.y + 70, 'brillo').setTint(0xff8a2a).setBlendMode(ADD)
        .setScale(2.4, 1.3).setAlpha(0.12).setDepth(9001);
      this.tweens.add({
        targets: halo,
        alpha: 0.26,
        scale: 1.4,
        duration: 900 + i * 230,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.inOut',
      });
      cosas.push(halo, charco);
    });

    // Que ninguna luz se salga de la sala
    const forma = this.make.graphics({ add: false }).fillStyle(0xffffff).fillRect(OX, OY, L.IMAGEN.ancho, L.IMAGEN.alto);
    const mascara = forma.createGeometryMask();
    cosas.forEach((c) => c.setMask(mascara));

    this.cosasNoche = cosas;
    this.mostrarNoche(juego.fase === 'noche');
  }

  mostrarNoche(si) {
    this.cosasNoche.forEach((c) => c.setVisible(si));
  }

  // ---------- Interacciones ----------

  crearInteracciones() {
    this.interaccion({
      ...p(L.ENTRADA),
      radio: 36,
      texto: () => (juego.fase === 'mañana' ? 'Girar el cartel' : 'Puerta'),
      accion: () => this.usarPuerta(),
    });
    this.interaccion({ ...p(L.CASA), radio: 30, texto: 'Subir a casa', accion: () => this.subirACasa() });
    this.interaccion({ ...p(L.ESTANTERIAS), radio: 44, texto: 'Mirar', accion: () => hablar(TEXTOS.estanteria) });
    this.interaccion({ ...p(L.TATAMI), radio: 40, texto: 'Mirar', accion: () => hablar(TEXTOS.tatami) });
    this.interaccion({
      ...p(L.BARISTA),
      radio: 34,
      texto: 'Barra',
      // Solo se atiende desde el rincón de detrás de la barra
      activa: () => this.jugador.pies().x < OX + 60,
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
        this.mostrarNoche(true);
        avisar('Cae la noche sobre la librería');
        this.empezarNoche();
      }
      return;
    }
    await hablar(TEXTOS.puertaNoche);
  }

  async subirACasa() {
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

  presentacion() {
    if (juego.vistos.presentacion) return;
    juego.vistos.presentacion = true;
    juego.ocupado = true;
    this.time.delayedCall(700, () => hablar(TEXTOS.presentacion));
  }

  // De noche entra un espíritu, se acerca a la barra y espera con su "!"
  empezarNoche() {
    if (this.espiritu) return;
    const entrada = p(L.ENTRADA);
    const sitio = p(L.SITIO_ESPIRITU);
    const e = new Spirit(this, entrada.x, entrada.y, 'okiku');
    this.espiritu = e;
    e.aparecer()
      .then(() => e.ir(sitio.x, sitio.y, 3200))
      .then(() => e.mostrarMarca(true));
    this.interaccion({
      get x() {
        return e.x;
      },
      get y() {
        return e.y;
      },
      radio: 56,
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
