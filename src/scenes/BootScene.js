// Carga las imágenes y crea las texturas provisionales que aún no tienen arte.
import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('libreria-fuera', 'assets/libreria-fuera.png');
    this.load.image('libreria-dentro', 'assets/libreria-dentro.png');
    this.load.image('okiku', 'assets/okiku.png');
    this.load.image('suelo-hierba', 'assets/suelo-hierba.png');
  }

  create() {
    this.crearProtagonista();
    this.crearDegradado('nube', 256, 'rgba(232,231,236,0.95)');
    this.crearDegradado('brillo', 128, 'rgba(255,255,255,1)');
    this.crearSombra();
    this.scene.start('Library', { entrada: 'inicio' });
  }

  // Protagonista provisional (24x40) hasta tener su arte definitivo
  crearProtagonista() {
    const pelo = 0x6b4a33;
    const piel = 0xf3d2b3;
    const camisa = 0xefe6d2;
    const delantal = 0x4f6b4a;
    const pantalon = 0x8f9e80;
    const zapato = 0x4a3a2e;

    const cuerpo = (g) => {
      g.fillStyle(camisa).fillRoundedRect(4, 16, 16, 14, 4);
      g.fillStyle(piel).fillRect(3, 26, 3, 3).fillRect(18, 26, 3, 3);
      g.fillStyle(pantalon).fillRect(7, 30, 4, 7).fillRect(13, 30, 4, 7);
      g.fillStyle(zapato).fillRect(6, 36, 5, 3).fillRect(13, 36, 5, 3);
    };

    // De frente
    let g = this.make.graphics({ add: false });
    g.fillStyle(pelo).fillRoundedRect(4, 1, 16, 14, 6);
    g.fillStyle(piel).fillRoundedRect(6, 6, 12, 10, 3);
    g.fillStyle(pelo).fillRect(5, 3, 14, 4).fillRect(4, 6, 2, 7).fillRect(18, 6, 2, 7);
    g.fillStyle(0x3a2a22).fillRect(8, 10, 2, 3).fillRect(14, 10, 2, 3);
    g.fillStyle(0xe8a99a).fillRect(7, 13, 2, 1).fillRect(15, 13, 2, 1);
    cuerpo(g);
    g.fillStyle(delantal).fillRect(7, 18, 10, 13).fillRect(9, 16, 6, 2);
    g.generateTexture('prota-s', 24, 40);
    g.destroy();

    // De espaldas
    g = this.make.graphics({ add: false });
    g.fillStyle(pelo).fillRoundedRect(4, 1, 16, 15, 6);
    cuerpo(g);
    g.fillStyle(delantal).fillRect(7, 22, 10, 2);
    g.generateTexture('prota-n', 24, 40);
    g.destroy();
  }

  // Círculo difuminado (niebla, brillos de farolillos y halos)
  crearDegradado(clave, lado, color) {
    const t = this.textures.createCanvas(clave, lado, lado);
    const ctx = t.getContext();
    const r = lado / 2;
    const grad = ctx.createRadialGradient(r, r, 0, r, r, r);
    grad.addColorStop(0, color);
    grad.addColorStop(1, color.replace(/[\d.]+\)$/, '0)'));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, lado, lado);
    t.refresh();
    // Suave a propósito: la niebla y la luz no deben verse pixeladas
    t.setFilter(Phaser.Textures.FilterMode.LINEAR);
  }

  crearSombra() {
    const g = this.make.graphics({ add: false });
    g.fillStyle(0x000000).fillEllipse(10, 4, 20, 8);
    g.generateTexture('sombra', 20, 8);
    g.destroy();
  }
}
