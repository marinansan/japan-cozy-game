// El protagonista: se mueve con teclado, con clic (camina hasta el punto)
// o en móvil arrastrando el dedo (joystick flotante).
import Phaser from 'phaser';
import { VELOCIDAD } from '../config.js';
import { juego } from '../systems/GameState.js';

const RADIO_JOYSTICK = 40;

export class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sombra = scene.add.image(x, y, 'sombra').setAlpha(0.35);
    // El punto de apoyo del sprite son los pies, para ordenar bien quién tapa a quién
    // Las imágenes miden 84x84 y los pies están a 73 px de arriba
    this.sprite = scene.physics.add.sprite(x, y, 'prota-s').setOrigin(0.5, 73 / 84);
    this.sprite.body.setSize(16, 8).setOffset(34, 65);
    this.sprite.setCollideWorldBounds(true);

    this.teclas = scene.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT');
    this.destino = null;
    this.atascado = 0;
    this.paso = 0;

    this.joy = { activo: false, id: null, base: new Phaser.Math.Vector2(), vec: new Phaser.Math.Vector2() };
    this.dibujoJoy = scene.add.graphics().setScrollFactor(0).setDepth(9500);

    scene.input.on('pointerdown', (p) => {
      if (juego.ocupado) return;
      if (p.wasTouch) {
        this.joy.activo = true;
        this.joy.id = p.id;
        this.joy.base.set(p.x, p.y);
        this.joy.vec.set(0, 0);
        this.destino = null;
      } else {
        this.destino = new Phaser.Math.Vector2(p.worldX, p.worldY);
        this.atascado = 0;
      }
    });
    scene.input.on('pointermove', (p) => {
      if (!this.joy.activo || p.id !== this.joy.id) return;
      this.joy.vec.set(p.x - this.joy.base.x, p.y - this.joy.base.y);
      if (this.joy.vec.length() > RADIO_JOYSTICK) this.joy.vec.setLength(RADIO_JOYSTICK);
    });
    const soltar = (p) => {
      if (p.id !== this.joy.id) return;
      this.joy.activo = false;
      this.joy.vec.set(0, 0);
    };
    scene.input.on('pointerup', soltar);
    scene.input.on('pointerupoutside', soltar);
  }

  // Posición de los pies (para medir distancias a puertas, objetos…)
  pies() {
    return { x: this.sprite.x, y: this.sprite.y };
  }

  parar() {
    this.destino = null;
    this.sprite.setVelocity(0, 0);
  }

  update() {
    const t = this.teclas;
    let vx = 0;
    let vy = 0;

    if (!juego.ocupado) {
      if (t.A.isDown || t.LEFT.isDown) vx -= 1;
      if (t.D.isDown || t.RIGHT.isDown) vx += 1;
      if (t.W.isDown || t.UP.isDown) vy -= 1;
      if (t.S.isDown || t.DOWN.isDown) vy += 1;

      if (vx || vy) {
        this.destino = null;
      } else if (this.joy.activo && this.joy.vec.length() > 8) {
        vx = this.joy.vec.x;
        vy = this.joy.vec.y;
      } else if (this.destino) {
        const dx = this.destino.x - this.sprite.x;
        const dy = this.destino.y - this.sprite.y;
        if (Math.hypot(dx, dy) < 4) {
          this.destino = null;
        } else {
          vx = dx;
          vy = dy;
          // Si algo le bloquea el paso un rato, se para (sin quedarse empujando)
          const b = this.sprite.body;
          const movido = Math.hypot(b.deltaX(), b.deltaY());
          this.atascado = movido < 0.3 ? this.atascado + 1 : 0;
          if (this.atascado > 10) this.destino = null;
        }
      }
    } else {
      this.destino = null;
    }

    const v = new Phaser.Math.Vector2(vx, vy);
    if (v.length() > 0) v.setLength(VELOCIDAD);
    this.sprite.setVelocity(v.x, v.y);

    // Mirar hacia donde camina y un pequeño balanceo al andar
    const andando = v.length() > 0;
    if (andando) {
      if (Math.abs(vy) > Math.abs(vx)) this.sprite.setTexture(vy < 0 ? 'prota-n' : 'prota-s');
      else this.sprite.setTexture(vx < 0 ? 'prota-o' : 'prota-e');
      // Balanceo provisional hasta tener la animación de caminar
      this.paso += this.scene.game.loop.delta;
      this.sprite.setAngle(Math.sin(this.paso / 70) * 2);
    } else {
      this.sprite.setAngle(0);
    }

    this.sprite.setDepth(this.sprite.y);
    this.sombra.setPosition(this.sprite.x, this.sprite.y - 1).setDepth(this.sprite.y - 1);
    this.pintarJoystick();
  }

  pintarJoystick() {
    const g = this.dibujoJoy;
    g.clear();
    if (!this.joy.activo) return;
    const { base, vec } = this.joy;
    g.fillStyle(0xf7efdf, 0.25).fillCircle(base.x, base.y, RADIO_JOYSTICK);
    g.lineStyle(2, 0xf7efdf, 0.5).strokeCircle(base.x, base.y, RADIO_JOYSTICK);
    g.fillStyle(0xf7efdf, 0.7).fillCircle(base.x + vec.x, base.y + vec.y, 16);
  }
}
