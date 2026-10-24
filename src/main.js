import Phaser from 'phaser';
import { ANCHO, ALTO } from './config.js';
import './ui/ui.css';
import { iniciarUI } from './ui/UI.js';
import { BootScene } from './scenes/BootScene.js';
import { LibraryScene } from './scenes/LibraryScene.js';
import { TownScene } from './scenes/TownScene.js';

iniciarUI();

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'juego',
  width: ANCHO,
  height: ALTO,
  pixelArt: true, // mantiene los píxeles nítidos, sin emborronar
  backgroundColor: '#1e1814',
  physics: { default: 'arcade', arcade: { debug: false } },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [BootScene, LibraryScene, TownScene],
});

// Para poder hacer pruebas desde la consola mientras desarrollamos
if (import.meta.env.DEV) window.__juego = game;
