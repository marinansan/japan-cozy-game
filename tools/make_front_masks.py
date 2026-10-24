"""Recorta la silueta exacta de los muebles que tapan a la protagonista.

En src/data/libraryLayout.js, FRENTES son rectángulos de la imagen del interior que se
dibujan por delante de la protagonista cuando pasa por detrás de un mueble. Un rectángulo
también lleva el suelo de alrededor, y ese suelo la tapaba. Este script se queda solo con
el mueble: rellena desde los bordes del rectángulo todo lo que no es contorno oscuro
(el suelo) y deja visible lo que queda dentro del contorno (el mueble).

Uso: python3 tools/make_front_masks.py   (crea public/assets/frentes/frente_N.png)
"""
import re
from collections import deque
from pathlib import Path
from PIL import Image

INTERIOR = 'public/assets/libreria-dentro.png'
DESTINO = Path('public/assets/frentes')


def leer_frentes():
    texto = Path('src/data/libraryLayout.js').read_text()
    bloque = texto[texto.index('export const FRENTES'):]
    bloque = bloque[: bloque.index('];')]
    # Se numeran todos (igual que en el juego), pero solo se recortan los que llevan silueta: true
    return [
        {**{k: int(v) for k, v in re.findall(r'(\w+): (\d+)', linea)}, 'silueta': 'silueta: true' in linea}
        for linea in bloque.splitlines()
        if 'base:' in linea
    ]


def es_contorno(c):
    return max(c[:3]) < 40


def main():
    im = Image.open(INTERIOR).convert('RGBA')
    DESTINO.mkdir(parents=True, exist_ok=True)
    for i, f in enumerate(leer_frentes()):
        if not f['silueta']:
            continue
        trozo = im.crop((f['x'], f['y'], f['x'] + f['ancho'], f['y'] + f['alto']))
        px = trozo.load()
        w, h = trozo.size
        suelo = set()
        cola = deque()
        for x in range(w):
            cola.extend([(x, 0), (x, h - 1)])
        for y in range(h):
            cola.extend([(0, y), (w - 1, y)])
        while cola:
            x, y = cola.popleft()
            if (x, y) in suelo or not (0 <= x < w and 0 <= y < h) or es_contorno(px[x, y]):
                continue
            suelo.add((x, y))
            cola.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])
        for (x, y) in suelo:
            px[x, y] = (0, 0, 0, 0)
        trozo.save(DESTINO / f'frente_{i}.png')
        print(i, f, 'píxeles de mueble:', w * h - len(suelo))


if __name__ == '__main__':
    main()
