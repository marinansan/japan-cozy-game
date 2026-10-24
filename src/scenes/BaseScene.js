// Lo que comparten la librería y el pueblo: el protagonista, los muros,
// las cosas con las que se puede interactuar, la luz del día y los cambios de escena.
import Phaser from 'phaser';
import { ANCHO, ALTO, LUZ } from '../config.js';
import { juego } from '../systems/GameState.js';
import { ponerAccion } from '../ui/UI.js';
import { Player } from '../objects/Player.js';

export class BaseScene extends Phaser.Scene {
  crearBase(ancho, alto, tipoLuz) {
    this.tipoLuz = tipoLuz;
    this.physics.world.setBounds(0, 0, ancho, alto);
    this.cameras.main.setBounds(0, 0, ancho, alto);
    this.muros = this.physics.add.staticGroup();
    this.interacciones = [];
    this.teclasAccion = this.input.keyboard.addKeys('E,SPACE,ENTER');

    // Capa de luz que tiñe toda la escena según el momento del día
    this.luz = this.add
      .rectangle(0, 0, ANCHO, ALTO, 0xffffff)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(9000)
      .setBlendMode(Phaser.BlendModes.MULTIPLY);
    this.ponerLuz();

    this.events.once('shutdown', () => ponerAccion(null, null));
    this.cameras.main.fadeIn(400, 30, 24, 20);
  }

  // Un obstáculo invisible (x, y = esquina de arriba a la izquierda)
  muro(x, y, w, h) {
    const r = this.add.rectangle(x + w / 2, y + h / 2, w, h);
    this.physics.add.existing(r, true);
    this.muros.add(r);
    return r;
  }

  crearJugador(x, y) {
    this.jugador = new Player(this, x, y);
    this.physics.add.collider(this.jugador.sprite, this.muros);
    return this.jugador;
  }

  /**
   * Algo con lo que se puede interactuar.
   * { x, y, radio, texto, accion, activa } — texto y activa pueden ser funciones.
   */
  interaccion(def) {
    // Sin copiar el objeto: así x e y pueden ser posiciones que cambian (un espíritu que se mueve)
    if (def.radio == null) def.radio = 40;
    this.interacciones.push(def);
  }

  ponerLuz() {
    this.luz.fillColor = LUZ[this.tipoLuz][juego.fase];
  }

  cambiarEscena(clave, datos) {
    juego.ocupado = true;
    this.jugador?.parar();
    this.cameras.main.fadeOut(400, 30, 24, 20);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      juego.ocupado = false;
      this.scene.start(clave, datos);
    });
  }

  async usar(it) {
    if (juego.ocupado) return;
    this.jugador.parar();
    await it.accion();
  }

  update() {
    if (!this.jugador) return;
    this.jugador.update();

    // Buscar lo más cercano con lo que se pueda interactuar
    const { x, y } = this.jugador.pies();
    let mejor = null;
    let distancia = Infinity;
    for (const it of this.interacciones) {
      if (it.activa && !it.activa()) continue;
      const d = Phaser.Math.Distance.Between(x, y, it.x, it.y);
      if (d < it.radio && d < distancia) {
        mejor = it;
        distancia = d;
      }
    }
    const etiqueta = mejor && !juego.ocupado ? (typeof mejor.texto === 'function' ? mejor.texto() : mejor.texto) : null;
    ponerAccion(etiqueta, mejor ? () => this.usar(mejor) : null);

    // JustDown se consulta siempre para "gastar" la pulsación aunque no se use
    const k = this.teclasAccion;
    const pulsado = [k.E, k.SPACE, k.ENTER].map((t) => Phaser.Input.Keyboard.JustDown(t)).some(Boolean);
    if (pulsado && mejor && !juego.ocupado) this.usar(mejor);
  }
}
