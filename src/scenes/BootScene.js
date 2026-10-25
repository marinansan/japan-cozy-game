// Carga las imágenes y crea las texturas provisionales que aún no tienen arte.
import Phaser from 'phaser';
import { FRENTES } from '../data/libraryLayout.js';
import { VECINOS } from '../data/vecinos.js';
import { crearAnimacionesNpc } from '../objects/Npc.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('libreria-fuera', 'assets/libreria-fuera.png');
    this.load.image('libreria-dentro', 'assets/libreria-dentro.png');
    this.load.image('libreria-noche', 'assets/libreria-noche.png');
    FRENTES.forEach((f, i) => f.silueta && this.load.image(`frente-${i}`, `assets/frentes/frente_${i}.png`));
    this.load.image('okiku', 'assets/okiku.png');
    this.load.image('suelo-hierba', 'assets/suelo-hierba.png');
    // Protagonista (PixelLab): una imagen por dirección
    this.load.image('prota-s', 'assets/prota/south.png');
    this.load.image('prota-n', 'assets/prota/north.png');
    this.load.image('prota-e', 'assets/prota/east.png');
    this.load.image('prota-o', 'assets/prota/west.png');
    // Vecinos: una imagen quieta por dirección y 8 fotogramas de caminar
    for (const clave of Object.keys(VECINOS)) {
      for (const [dir, letra] of [['south', 's'], ['north', 'n'], ['east', 'e'], ['west', 'o']]) {
        this.load.image(`${clave}-${letra}`, `assets/${clave}/${dir}.png`);
        for (let i = 0; i < 8; i++) this.load.image(`${clave}-caminar-${dir}-${i}`, `assets/${clave}/caminar/${dir}_${i}.png`);
      }
    }
    // Animación de caminar: 6 fotogramas por dirección
    for (const dir of ['south', 'east', 'north', 'west']) {
      for (let i = 0; i < 6; i++) this.load.image(`caminar-${dir}-${i}`, `assets/prota/caminar/${dir}_${i}.png`);
    }
  }

  create() {
    this.crearDegradado('nube', 256, 'rgba(232,231,236,0.95)');
    this.crearDegradado('brillo', 128, 'rgba(255,255,255,1)');
    this.crearSombra();
    this.crearAnimaciones();
    // El farolero da pasos lentos
    for (const clave of Object.keys(VECINOS)) crearAnimacionesNpc(this, clave, 8, 6);
    this.scene.start('Library', { entrada: 'inicio' });
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

  crearAnimaciones() {
    const claves = { south: 'caminar-s', north: 'caminar-n', east: 'caminar-e', west: 'caminar-o' };
    for (const [dir, clave] of Object.entries(claves)) {
      this.anims.create({
        key: clave,
        frames: [0, 1, 2, 3, 4, 5].map((i) => ({ key: `caminar-${dir}-${i}` })),
        frameRate: 7, // pasos al ritmo de la velocidad tranquila
        repeat: -1,
      });
    }
  }

  // Sombra suave y cálida bajo los pies (marrón oscuro, nunca gris)
  crearSombra() {
    const g = this.make.graphics({ add: false });
    g.fillStyle(0xffffff).fillEllipse(10, 4, 20, 8); // blanca: el color lo pone el tinte
    g.generateTexture('sombra', 20, 8);
    g.destroy();
  }
}
