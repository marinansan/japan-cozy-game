import Phaser from 'phaser';
import { ANCHO, ALTO } from './config.js';
import '@fontsource/silkscreen/400.css'; // letra pixelada de los números (incluida en el juego)
import './ui/ui.css';
import { iniciarUI } from './ui/UI.js';
import { BootScene } from './scenes/BootScene.js';
import { LibraryScene } from './scenes/LibraryScene.js';
import { TownScene } from './scenes/TownScene.js';


const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'juego',
  width: ANCHO,
  height: ALTO,
  pixelArt: true, // mantiene los píxeles nítidos, sin emborronar
  roundPixels: true,
  backgroundColor: '#1e1814',
  physics: { default: 'arcade', arcade: { debug: false } },
  // EXPAND: ocupa toda la pantalla; si es más alargada que 16:9, se ve un poco más de mundo
  scale: {
    mode: Phaser.Scale.EXPAND,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    // Pantalla completa de toda la página: así se ven también el libro, el reloj, los yenes y los diálogos,
    // que son HTML por encima del juego (si no, solo se pondría a pantalla completa el lienzo del juego)
    fullscreenTarget: document.body,
  },
  scene: [BootScene, LibraryScene, TownScene],
});

iniciarUI({ pantallaCompleta: () => game.scale.toggleFullscreen() });

// Para poder hacer pruebas desde la consola mientras desarrollamos
if (import.meta.env.DEV) window.__juego = game;
