# Cozy Game (versión nueva)

Juego cozy: heredas la librería-cafetería de tu abuela en un pueblo rural japonés cubierto de niebla.

## Cómo probarlo

`npm install` y después `npm run dev`; abre la dirección que aparece en la terminal.

## Controles

- **PC:** WASD o flechas, o clic para caminar hasta un punto. E / espacio para actuar.
- **Móvil:** arrastra el dedo para moverte y usa el botón grande para actuar.

## Estructura

- `src/scenes/`: `BootScene` (carga), `BaseScene` (lo común), `LibraryScene` (interior) y `TownScene` (pueblo).
- `src/objects/`: protagonista y espíritus.
- `src/systems/GameState.js`: estado compartido (día, fase, recuerdos, yenes).
- `src/ui/`: interfaz en HTML (marcador, diálogos, preguntas, botón de acción).
- `src/data/textos.js`: los textos del juego.
