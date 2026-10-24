# Instrucciones para Claude Code

Este es el juego nuevo, hecho desde cero. La visión completa del juego (historia, tono,
personajes, mecánicas, estilo y forma de trabajar conmigo) está en el prompt original:

@docs/prompt-claude-code.md

Las decisiones de abajo son **más recientes** que ese prompt y mandan sobre él.

## Decisiones tomadas en la versión nueva

- **Tecnología:** Phaser 3 + Vite. Vista lógica de 960x540 (`src/config.js`), interfaz en HTML (`src/ui/`).
  Se publica solo en GitHub Pages al subir a `main` (`.github/workflows/pages.yml`).
- **Arte:** se genera con **PixelLab** (API v2, `https://api.pixellab.ai/v2`). La cuenta es gratuita:
  una generación a la vez. Las imágenes de PixelLab se descargan por la API (`/characters/{id}/zip`),
  porque `backblaze.pixellab.ai` está bloqueado en las sesiones en la nube.
  Los originales y bases están en `art/source/`.
- **Interior de la librería:** imagen de PixelLab `public/assets/libreria-dentro.png` (512x384, a tamaño real,
  sin ampliar). Distribución, muros y sitios en `src/data/libraryLayout.js`.
  - La **cortina noren del fondo es la entrada principal** (por ahí entran la protagonista, los clientes y los espíritus).
    El cartel ABIERTO/CERRADO cuelga encima.
  - La **puerta corredera de la pared derecha sube a casa** (dormir). La pared de abajo está cerrada.
  - El **rincón del barista** está detrás de la barra, abajo a la izquierda; solo desde ahí se atiende.
  - Hiedra sobre la ventana shoji (sin tapar los cristales), hecha con PixelLab.
- **Noche:** penumbra azul-violeta, cielo con estrellas en las ventanas, farolillos en **ámbar cálido**
  (no lavanda) con charcos de luz. **Sin luciérnagas ni puntos de luz flotando.**
  La capa de noche se crea con `tools/make_night_overlay.py` (hay que rehacerla si cambia el interior).
- **Protagonista:** chica de 25-30 años (más adelante se podrá elegir chico o chica; de momento solo ella).
  Pelo castaño por los hombros con capas y las puntas hacia fuera, camisa crema, **delantal azul** con una
  **libreta roja** asomando del bolsillo, pantalón beige. El cansancio es solo de la historia, no se le nota.
  - Personaje de PixelLab `8296a179-5485-4913-9726-1e5a63769489`, 84x84, 4 direcciones y animación de caminar
    (6 fotogramas) en `public/assets/prota/`.
  - **Ojos siempre marrones** y **sin sombra gris** bajo los pies: pasar `tools/clean_prota.py` por cada imagen nueva.
- **Espíritus:** translúcidos con halo lavanda (la señora Okiku, `public/assets/okiku.png`).

## Cómo probar

`npm install` y `npm run dev`. Para comprobar cambios, usar Playwright (ya instalado) y hacer capturas.
