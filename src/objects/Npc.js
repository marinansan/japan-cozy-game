// Un vecino o cliente: camina por una lista de puntos con su animación,
// mira hacia un lado y puede mostrar el "!" encima de la cabeza.
// No choca con nada: sus caminos se eligen a mano para que pasen por sitios libres.
import Phaser from 'phaser';

export class Npc {
  /**
   * @param {string} clave  prefijo de sus imágenes (p. ej. 'farolero': farolero-s, farolero-caminar-s…)
   * @param {object} opciones  { velocidad (px/s), pies (fracción de alto donde están los pies), alturaMarca }
   */
  constructor(scene, clave, x, y, opciones = {}) {
    this.scene = scene;
    this.clave = clave;
    this.velocidad = opciones.velocidad ?? 40;
    this.mirando = 's';
    this.sombra = scene.add.image(x, y, 'sombra').setTint(0x3b2418).setAlpha(0.28);
    this.sprite = scene.add.sprite(x, y, `${clave}-s`).setOrigin(0.5, opciones.pies ?? 1);
    this.marca = scene.add
      .text(x, y - (opciones.alturaMarca ?? 70), '!', {
        fontFamily: 'Georgia',
        fontSize: '24px',
        fontStyle: 'bold',
        color: '#ffe2a0',
        stroke: '#3b2f28',
        strokeThickness: 5,
      })
      .setOrigin(0.5)
      .setVisible(false);
    this.alturaMarca = opciones.alturaMarca ?? 70;
    scene.tweens.add({ targets: this.marca, scale: 1.15, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }

  get x() {
    return this.sprite.x;
  }

  get y() {
    return this.sprite.y;
  }

  mirar(dir) {
    this.mirando = dir;
    this.sprite.anims.stop();
    this.sprite.setTexture(`${this.clave}-${dir}`);
  }

  mostrarMarca(si) {
    this.marca.setVisible(si);
  }

  // Camina de un punto a otro, por orden. Termina al llegar al último.
  async caminarPor(puntos) {
    for (const { x, y } of puntos) {
      const dx = x - this.sprite.x;
      const dy = y - this.sprite.y;
      const distancia = Math.hypot(dx, dy);
      if (distancia < 1) continue;
      this.mirando = Math.abs(dy) > Math.abs(dx) ? (dy < 0 ? 'n' : 's') : dx < 0 ? 'o' : 'e';
      this.sprite.anims.play(`${this.clave}-caminar-${this.mirando}`, true);
      await new Promise((resolver) =>
        this.scene.tweens.add({
          targets: this.sprite,
          x,
          y,
          duration: (distancia / this.velocidad) * 1000,
          onComplete: resolver,
        }),
      );
    }
    this.mirar(this.mirando);
  }

  esperar(ms) {
    return new Promise((resolver) => this.scene.time.delayedCall(ms, resolver));
  }

  destruir() {
    this.sprite.destroy();
    this.sombra.destroy();
    this.marca.destroy();
  }

  update() {
    this.sprite.setDepth(this.sprite.y);
    this.sombra.setPosition(this.sprite.x, this.sprite.y - 1).setDepth(this.sprite.y - 1);
    this.marca.setPosition(this.sprite.x, this.sprite.y - this.alturaMarca).setDepth(this.sprite.y + 1);
  }
}

// Crea las animaciones de caminar de un vecino (se llama una vez al cargar el juego)
export function crearAnimacionesNpc(scene, clave, fotogramas, frameRate) {
  const dirs = { south: 's', north: 'n', east: 'e', west: 'o' };
  for (const [dir, letra] of Object.entries(dirs)) {
    scene.anims.create({
      key: `${clave}-caminar-${letra}`,
      frames: Phaser.Utils.Array.NumberArray(0, fotogramas - 1).map((i) => ({ key: `${clave}-caminar-${dir}-${i}` })),
      frameRate,
      repeat: -1,
    });
  }
}
