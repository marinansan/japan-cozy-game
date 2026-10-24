// Un espíritu de los recuerdos: translúcido, flota y tiene un halo lavanda.
import Phaser from 'phaser';

export class Spirit {
  constructor(scene, x, y, textura) {
    this.scene = scene;
    this.halo = scene.add.image(0, -30, 'brillo').setTint(0xc4a8ff).setAlpha(0.55).setScale(1.4);
    this.halo.setBlendMode(Phaser.BlendModes.ADD);
    this.figura = scene.add.image(0, 0, textura).setOrigin(0.5, 1).setAlpha(0.78);
    this.marca = scene.add
      .text(0, -74, '!', {
        fontFamily: 'Georgia',
        fontSize: '26px',
        fontStyle: 'bold',
        color: '#ffe2a0',
        stroke: '#3b2f5c',
        strokeThickness: 5,
      })
      .setOrigin(0.5)
      .setVisible(false);
    this.cuerpo = scene.add.container(x, y, [this.halo, this.figura, this.marca]).setAlpha(0);

    // Flota arriba y abajo sin parar; el halo respira
    scene.tweens.add({ targets: [this.figura, this.marca], y: '-=5', duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    scene.tweens.add({ targets: this.halo, alpha: 0.35, scale: 1.25, duration: 2000, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }

  get x() {
    return this.cuerpo.x;
  }

  get y() {
    return this.cuerpo.y;
  }

  aparecer(duracion = 1200) {
    return new Promise((resolver) =>
      this.scene.tweens.add({ targets: this.cuerpo, alpha: 1, duration: duracion, onComplete: resolver }),
    );
  }

  ir(x, y, duracion = 3000) {
    return new Promise((resolver) =>
      this.scene.tweens.add({ targets: this.cuerpo, x, y, duration: duracion, ease: 'Sine.inOut', onComplete: resolver }),
    );
  }

  mostrarMarca(si) {
    this.marca.setVisible(si);
  }

  update() {
    this.cuerpo.setDepth(this.cuerpo.y);
  }
}
