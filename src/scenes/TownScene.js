// El pueblo. De momento solo la zona 0 (la estación y la librería);
// todo lo demás está cubierto por la niebla del olvido.
import Phaser from 'phaser';
import { BaseScene } from './BaseScene.js';
import { hablar, preguntar } from '../ui/UI.js';
import { TEXTOS } from '../data/textos.js';

const MUNDO = { ancho: 1600, alto: 1100 };
const LIMITE_NIEBLA = { norte: 440, este: 1320 }; // hasta dónde se puede caminar
const LIBRERIA = { x: 560, y: 720 }; // centro de la base del edificio
const PUERTA_LIBRERIA = { x: 557, y: 712 };
const VIA_Y = 960;

export class TownScene extends BaseScene {
  constructor() {
    super('Town');
  }

  create() {
    this.crearBase(MUNDO.ancho, MUNDO.alto, 'exterior');
    this.azar = new Phaser.Math.RandomDataGenerator(['pueblo']);

    this.add.tileSprite(0, 0, MUNDO.ancho, MUNDO.alto, 'suelo-hierba').setOrigin(0).setDepth(-20);
    this.dibujarCaminos();
    this.dibujarViaYBosque();
    this.colocarLibreria();
    this.casaProvisional(805, 900, 240, 100, 0x6d4c3d, 0xd8c7a6, 'Estación');
    this.casaProvisional(1060, 720, 160, 90, 0x5d6b6e, 0xcdb99a);
    this.casaProvisional(300, 880, 150, 80, 0x6e5a4e, 0xc4b08c);
    this.casaProvisional(1190, 870, 140, 76, 0x5d6b6e, 0xd8c7a6);
    this.plantarArboles();
    this.crearNiebla();

    this.interaccion({ x: PUERTA_LIBRERIA.x, y: PUERTA_LIBRERIA.y, texto: 'Entrar', accion: () => this.entrarLibreria() });
    this.interaccion({ x: 805, y: 912, radio: 50, texto: 'Mirar', accion: () => hablar(TEXTOS.estacion) });

    const j = this.crearJugador(PUERTA_LIBRERIA.x, PUERTA_LIBRERIA.y + 30);
    j.sprite.setTexture('prota-s');
    this.cameras.main.startFollow(j.sprite, true, 0.12, 0.12);
  }

  async entrarLibreria() {
    const r = await preguntar(TEXTOS.preguntaEntrar);
    if (r === 0) this.cambiarEscena('Library', { entrada: 'pueblo' });
  }

  // ---------- Dibujo ----------

  dibujarCaminos() {
    const g = this.add.graphics().setDepth(-15);
    const tramos = [
      [530, 700, 60, 110], // de la librería al camino
      [530, 770, 600, 50], // camino de este a oeste
      [780, 300, 50, 640], // camino principal, de la estación hacia el norte
    ];
    // Borde un poco más oscuro y luego la tierra
    g.fillStyle(0xb79d74);
    tramos.forEach(([x, y, w, h]) => g.fillRoundedRect(x - 4, y - 4, w + 8, h + 8, 10));
    g.fillStyle(0xcdb48a);
    tramos.forEach(([x, y, w, h]) => g.fillRoundedRect(x, y, w, h, 8));
    // Piedrecitas sueltas
    g.fillStyle(0xb8a07a);
    for (let i = 0; i < 160; i++) {
      const [x, y, w, h] = this.azar.pick(tramos);
      g.fillRect(this.azar.between(x + 4, x + w - 6), this.azar.between(y + 4, y + h - 6), 3, 2);
    }
  }

  dibujarViaYBosque() {
    const g = this.add.graphics().setDepth(-14);
    g.fillStyle(0x8f8577).fillRect(0, VIA_Y, MUNDO.ancho, 44);
    g.fillStyle(0x6b4a33);
    for (let x = 0; x < MUNDO.ancho; x += 14) g.fillRect(x, VIA_Y + 8, 6, 28);
    g.fillStyle(0x5e5a55).fillRect(0, VIA_Y + 12, MUNDO.ancho, 4).fillRect(0, VIA_Y + 28, MUNDO.ancho, 4);
    // Andén de la estación
    g.fillStyle(0xa79d8d).fillRect(660, VIA_Y - 18, 290, 18);

    // Bosque al otro lado de la vía: el final del mapa
    g.fillStyle(0x3f5a3c).fillRect(0, VIA_Y + 44, MUNDO.ancho, MUNDO.alto - VIA_Y - 44);
    for (let x = -10; x < MUNDO.ancho + 20; x += 26) {
      const y = VIA_Y + 60 + this.azar.between(0, 30);
      g.fillStyle(this.azar.pick([0x4c6b45, 0x557a4c, 0x466340])).fillCircle(x, y, this.azar.between(18, 26));
    }
    this.muro(0, VIA_Y - 10, MUNDO.ancho, MUNDO.alto - VIA_Y + 10);
  }

  colocarLibreria() {
    const img = this.add.image(LIBRERIA.x, LIBRERIA.y, 'libreria-fuera').setOrigin(0.5, 1);
    // La base de las paredes marca quién tapa a quién
    img.setDepth(LIBRERIA.y - 30);
    const izq = LIBRERIA.x - 128;
    const arriba = LIBRERIA.y - 256;
    this.muro(izq + 28, arriba + 120, 200, 106);
  }

  // Edificio provisional (pared, tejado y puerta) hasta tener su arte
  casaProvisional(cx, base, ancho, alto, colorTejado, colorPared, rotulo) {
    const x = cx - ancho / 2;
    const y = base - alto;
    const g = this.add.graphics().setDepth(base);
    g.fillStyle(0x000000, 0.15).fillEllipse(cx, base + 2, ancho + 20, 14);
    g.fillStyle(colorPared).fillRect(x, y + alto * 0.45, ancho, alto * 0.55);
    g.fillStyle(colorTejado).fillRect(x - 10, y, ancho + 20, alto * 0.5);
    g.fillStyle(Phaser.Display.Color.ValueToColor(colorTejado).darken(15).color).fillRect(x - 10, y + alto * 0.5 - 6, ancho + 20, 6);
    g.fillStyle(0x5b3f2b).fillRect(cx - 12, base - 30, 24, 30);
    g.fillStyle(0x8a5f3c).fillRect(x + 14, base - 32, 22, 16).fillRect(x + ancho - 36, base - 32, 22, 16);
    if (rotulo) {
      this.add
        .text(cx, y + alto * 0.25, rotulo, { fontFamily: 'Georgia', fontSize: '14px', color: '#f7efdf' })
        .setOrigin(0.5)
        .setDepth(base + 1);
    }
    this.muro(x - 6, y + 10, ancho + 12, alto - 10);
  }

  plantarArboles() {
    const sitios = [
      [120, 520], [210, 610], [90, 720], [160, 980 - 60], [420, 520], [640, 500],
      [980, 560], [1120, 600], [1260, 700], [720, 560], [380, 760], [980, 860], [1250, 540],
    ];
    sitios.forEach(([x, y]) => {
      const g = this.add.graphics().setDepth(y);
      g.fillStyle(0x000000, 0.15).fillEllipse(x, y, 40, 12);
      g.fillStyle(0x6b4a33).fillRect(x - 4, y - 22, 8, 22);
      const verdes = [0x5f7a4c, 0x6d8a57, 0x557048];
      g.fillStyle(verdes[2]).fillCircle(x, y - 38, 22);
      g.fillStyle(verdes[0]).fillCircle(x - 10, y - 46, 15).fillCircle(x + 10, y - 44, 15);
      g.fillStyle(verdes[1]).fillCircle(x - 2, y - 56, 13);
      this.muro(x - 6, y - 8, 12, 8);
    });
  }

  // Degradado de niebla: espesa en un lado y transparente en el otro (sin bordes duros)
  bordeNiebla(direccion) {
    const clave = 'niebla-' + direccion;
    if (this.textures.exists(clave)) return clave;
    // Tamaño que no es potencia de 2 para que el borde no "dé la vuelta" y deje una línea
    const lado = 250;
    const t = this.textures.createCanvas(clave, lado, lado);
    const ctx = t.getContext();
    const grad = direccion === 'vertical' ? ctx.createLinearGradient(0, 0, 0, lado) : ctx.createLinearGradient(lado, 0, 0, 0);
    grad.addColorStop(0, 'rgba(230,228,232,0.95)');
    grad.addColorStop(0.55, 'rgba(230,228,232,0.95)');
    grad.addColorStop(0.97, 'rgba(230,228,232,0)');
    grad.addColorStop(1, 'rgba(230,228,232,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, lado, lado);
    t.refresh();
    t.setFilter(Phaser.Textures.FilterMode.LINEAR);
    return clave;
  }

  // La niebla del olvido: nubes suaves que se mueven despacio y no dejan pasar
  crearNiebla() {
    const { norte, este } = LIMITE_NIEBLA;
    // Una sola capa por lado: espesa al fondo y difuminada hacia el pueblo
    this.add.image(0, 0, this.bordeNiebla('vertical')).setOrigin(0).setDisplaySize(MUNDO.ancho, norte + 30).setDepth(7999);
    this.add.image(este - 30, 0, this.bordeNiebla('horizontal')).setOrigin(0).setDisplaySize(MUNDO.ancho - este + 30, VIA_Y).setDepth(7999);

    const nube = (x, y) => {
      const n = this.add.image(x, y, 'nube').setScale(this.azar.realInRange(1.2, 1.8)).setAlpha(this.azar.realInRange(0.6, 0.9)).setDepth(8000);
      this.tweens.add({
        targets: n,
        x: x + this.azar.between(-30, 30),
        alpha: n.alpha * 0.7,
        duration: this.azar.between(4000, 8000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.inOut',
      });
    };
    for (let x = -60; x < MUNDO.ancho + 60; x += 110) nube(x + this.azar.between(-20, 20), norte - 60 + this.azar.between(-20, 20));
    for (let y = norte; y < VIA_Y; y += 110) nube(este + 60 + this.azar.between(-20, 20), y + this.azar.between(-20, 20));

    this.muro(0, 0, MUNDO.ancho, norte);
    this.muro(este, 0, MUNDO.ancho - este, VIA_Y);
    // Al acercarse a la niebla, una frase amable
    this.interaccion({ x: 805, y: norte + 10, radio: 70, texto: 'Niebla', accion: () => hablar(TEXTOS.niebla) });
  }
}
