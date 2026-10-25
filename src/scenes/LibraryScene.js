// Interior de la librería-cafetería, con el arte de PixelLab.
// La distribución (muros, muebles, sitios) está en src/data/libraryLayout.js.
import Phaser from 'phaser';
import { BaseScene } from './BaseScene.js';
import { juego, cambiarFase, nuevoDia, avisar as avisarCambio } from '../systems/GameState.js';
import { hablar, preguntar, avisar } from '../ui/UI.js';
import { Spirit } from '../objects/Spirit.js';
import { Npc } from '../objects/Npc.js';
import { VECINOS, segunDia } from '../data/vecinos.js';
import { TEXTOS } from '../data/textos.js';
import * as L from '../data/libraryLayout.js';

const PARED_DELANTE = 16; // franja de pared de abajo
// La sala empieza en la esquina del mundo; la cámara sigue a la protagonista
// y, si la pantalla es más grande que la sala, la deja centrada
const OX = 0;
const OY = 0;

// De medidas de la imagen a posiciones en la pantalla
const p = ({ x, y }) => ({ x: OX + x, y: OY + y });

export class LibraryScene extends BaseScene {
  constructor() {
    super('Library');
  }

  create(datos = {}) {
    this.crearBase(L.IMAGEN.ancho, L.IMAGEN.alto + PARED_DELANTE, 'interior');
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
    this.cameras.main.startFollow(this.jugador.sprite, true, 0.12, 0.12);
    // La sala llena toda la pantalla: la cámara se acerca lo justo para cubrir el ancho y el alto
    this.ajustarCamara();
    this.scale.on('resize', this.ajustarCamara, this);
    this.events.once('shutdown', () => this.scale.off('resize', this.ajustarCamara, this));
    if (datos.entrada === 'inicio') this.presentacion();
    if (juego.fase === 'noche') this.empezarNoche();
    if (juego.fase === 'mañana') this.programarFarolero();
  }

  ajustarCamara() {
    const ancho = L.IMAGEN.ancho;
    const alto = L.IMAGEN.alto + PARED_DELANTE;
    this.cameras.main.setZoom(Math.max(1, this.scale.width / ancho, this.scale.height / alto));
  }

  // ---------- Dibujo ----------

  // Copias recortadas de la imagen que tapan al protagonista cuando pasa por detrás
  colocarFrentes() {
    L.FRENTES.forEach((f, i) => {
      if (f.silueta) {
        // Solo el mueble, sin el suelo de alrededor
        this.add.image(OX + f.x, OY + f.y, `frente-${i}`).setOrigin(0).setDepth(OY + f.base);
      } else {
        this.add
          .image(OX, OY, 'libreria-dentro')
          .setOrigin(0)
          .setCrop(f.x, f.y, f.ancho, f.alto)
          .setDepth(OY + f.base);
      }
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
      radio: 140,
      texto: 'Barra',
      // Solo se atiende desde detrás de la barra
      activa: () => this.detrasDeLaBarra(),
      accion: async () => {
        // Primero camina hasta su sitio, mirando a los taburetes
        const sitio = p(L.BARISTA);
        // Desde el rincón, primero sube hasta el hueco para no chocar con la esquina de la barra
        if (this.jugador.pies().x < OX + 60) await this.jugador.irA(OX + 40, sitio.y);
        await this.jugador.irA(sitio.x, sitio.y);
        this.jugador.mirar('e');
        if (this.farolero?.esperando) await this.atenderFarolero();
        else await hablar(juego.fase === 'noche' ? TEXTOS.barraNoche : TEXTOS.barraVacia);
      },
    });
  }

  detrasDeLaBarra() {
    const { x, y } = this.jugador.pies();
    return L.ZONA_BARISTA.some((z) => x >= OX + z.x && x <= OX + z.x + z.ancho && y >= OY + z.y && y <= OY + z.y + z.alto);
  }

  async usarPuerta() {
    if (juego.fase === 'mañana') {
      const r = await preguntar(TEXTOS.preguntaCerrarManana);
      if (r !== 0) return;
      cambiarFase('tarde');
      this.despedirFarolero();
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

  // ---------- El farolero (por las mañanas) ----------

  programarFarolero() {
    if (juego.vistos.faroleroDia === juego.dia) return; // solo viene una vez por mañana
    const datos = VECINOS.farolero;
    // Espera a que termine cualquier diálogo (como la presentación del primer día)
    const intentar = () => {
      if (juego.ocupado || juego.fase !== 'mañana') return this.time.delayedCall(1000, intentar);
      this.llegaFarolero();
    };
    this.time.delayedCall(datos.llegaTrasSegundos * 1000, intentar);
  }

  async llegaFarolero() {
    const datos = VECINOS.farolero;
    juego.vistos.faroleroDia = juego.dia;
    const entrada = p(L.ENTRADA);
    const f = new Npc(this, 'farolero', entrada.x, entrada.y, datos);
    this.farolero = f;
    this.charlaFarolero = {
      get x() {
        return f.x;
      },
      get y() {
        return f.y;
      },
      radio: 46,
      texto: 'Hablar',
      activa: () => !this.detrasDeLaBarra() && !f.yendose,
      accion: () => hablar(segunDia(datos.charla, juego.dia)),
    };
    this.interaccion(this.charlaFarolero);
    await f.caminarPor(L.CAMINO_CLIENTE.map(p));
    if (f.yendose) return;
    f.mirar('o'); // mira hacia la barra
    f.esperando = true;
    f.mostrarMarca(true);
  }

  async atenderFarolero() {
    const f = this.farolero;
    const datos = VECINOS.farolero;
    f.esperando = false;
    f.mostrarMarca(false);
    await hablar(segunDia(datos.pedidos, juego.dia));
    await hablar(datos.servir);
    await hablar(datos.gracias);
    juego.yenes += datos.precio;
    avisarCambio();
    avisar(`+${datos.precio} ¥`);
    // Se toma el té en silencio y se va
    await f.esperar(datos.tomandoTeSegundos * 1000);
    this.despedirFarolero();
  }

  async despedirFarolero() {
    const f = this.farolero;
    if (!f || f.yendose) return;
    f.yendose = true;
    f.esperando = false;
    f.mostrarMarca(false);
    this.tweens.killTweensOf(f.sprite); // por si aún estaba entrando
    await f.caminarPor([...L.CAMINO_CLIENTE].reverse().map(p).concat(p(L.ENTRADA)));
    this.tweens.add({ targets: [f.sprite, f.sombra], alpha: 0, duration: 600, onComplete: () => f.destruir() });
    this.interacciones = this.interacciones.filter((it) => it !== this.charlaFarolero);
    this.farolero = null;
  }

  update() {
    super.update();
    this.espiritu?.update();
    this.farolero?.update();
  }
}
