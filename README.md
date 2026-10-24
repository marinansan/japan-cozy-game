# Japan Cozy Game

Juego cozy: heredas la librería-cafetería de tu abuela en un pueblo rural japonés cubierto de niebla.
De día atiendes a los vecinos, por la tarde exploras el pueblo y de noche recibes a los espíritus
de los recuerdos olvidados.

## Jugar

- **En la web:** https://marinansan.github.io/japan-cozy-game/ (se actualiza solo con cada cambio en `main`).
- **En local:** `npm install` y después `npm run dev`; abre la dirección que aparece en la terminal.

## Controles

- **PC:** WASD o flechas, o clic para caminar hasta un punto. E / espacio para actuar.
- **Móvil:** arrastra el dedo para moverte y usa el botón grande para actuar.

## Estructura

- `src/scenes/`: `BootScene` (carga), `BaseScene` (lo común), `LibraryScene` (interior) y `TownScene` (pueblo).
- `src/objects/`: protagonista y espíritus.
- `src/systems/GameState.js`: estado compartido (día, fase, recuerdos, yenes).
- `src/ui/`: interfaz en HTML (marcador, diálogos, preguntas, botón de acción).
- `src/data/`: textos del juego y distribución de la librería.
- `tools/`: scripts para preparar el arte (noche, hiedra, puerta, limpieza de la protagonista).
- `art/source/`: imágenes originales de PixelLab.
- `docs/`: el prompt con la visión del juego y el boceto del pueblo.
