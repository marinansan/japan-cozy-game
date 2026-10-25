# Instrucciones para Claude Code

Este es el juego nuevo, hecho desde cero. La visión completa del juego (historia, tono,
personajes, mecánicas, estilo y forma de trabajar conmigo) está en el prompt original:

@docs/prompt-claude-code.md

Las decisiones de abajo son **más recientes** que ese prompt y mandan sobre él.

## Decisiones tomadas en la versión nueva

- **Tecnología:** Phaser 3 + Vite. Vista lógica de 640x360 que se amplía a toda la pantalla (`Scale.EXPAND`,
  `src/config.js`); en la librería la cámara se acerca para que la sala llene la pantalla y sigue a la protagonista.
  Botón de pantalla completa (PC/Android), aviso para girar el móvil en vertical y `manifest.webmanifest`
  para instalarlo como app ("Añadir a pantalla de inicio", también en iPhone). Interfaz en HTML (`src/ui/`).
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
- **Clientes y vecinos** (reparto decidido):
  - Con historia: **el farolero** (~80), **señora Hana** (~75, amiga de la abuela), **Yui** (16, instituto en la ciudad;
    será la ayudante de otoño) y **Kenji** (~38, nieto de Okiku; llega tras su recuerdo y reabre el taller de farolillos).
  - Secundarios: **señor Mori** (~80, jefe de estación), **Sora** (~25, cartera en bici, una vez por semana),
    **Riku** (17, amigo de Yui, béisbol; llega más adelante).
  - Visitantes sin diálogo: senderista, pareja mayor de turistas, fotógrafa.
  - Al empezar vienen el farolero, Hana y Mori.
- **El farolero:** anciano encorvado con bastón nudoso, piel morena, calvo con gorra plana marrón, bigote y perilla blancos,
  chaqueta larga **verde musgo** de cuello alto, pantalón gris, calcetines blancos, zapatillas negras y un
  **farolillo de papel apagado** al cinturón. Imágenes en `public/assets/farolero/` (64x64, 4 direcciones y
  animación de caminar lenta con el bastón, 8 fotogramas). El farolillo se apaga con `tools/dim_lantern.py`.
  Se hizo con `generate-8-rotations-v3` y `animate-with-text-v3` (crear "personaje" pide tener ~20 generaciones libres).
  - **En el juego:** cada mañana entra por la noren a los pocos segundos, camina muy despacio hasta la barra
    (lado de los taburetes, `CAMINO_CLIENTE`), espera con su "!" y se le atiende desde el sitio del barista:
    pide un té solo, paga 300 💴, se queda un rato y se va. Una vez por mañana. Textos en `src/data/vecinos.js`.
  - Los vecinos usan `src/objects/Npc.js` (caminar por puntos, mirar, "!"); sirve para los siguientes clientes.
- **Espíritus:** translúcidos con halo lavanda (la señora Okiku, `public/assets/okiku.png`).

- **Reloj (arriba a la derecha):** cúpula de madera en semicírculo con el cielo de mañana, tarde y noche y una aguja
  (sin hora); el medallón muestra la **fase de la niebla** (`faseNiebla()` = recuerdos + 1), el "nivel" del juego.
  Imágenes `public/assets/ui/reloj-{manana,tarde,noche}.png`, hechas con `tools/make_clock.py` desde la cúpula de PixelLab.
  Debajo del reloj, los **yenes**: moneda dorada con el ¥ (`tools/make_yen_coin.py`) y la cantidad en la letra
  pixelada **Silkscreen** sobre una placa de madera que se estira (`tools/make_plaque_parts.py`).
  Ya no hay marcador a la izquierda: ahí irá el **libro de Recuerdos** (misiones, recuerdos y personajes).
  Todo el texto de la interfaz que sea número va en Silkscreen ("todo en formato pixel").

## Cómo probar

`npm install` y `npm run dev`. Para comprobar cambios, usar Playwright (ya instalado) y hacer capturas.
