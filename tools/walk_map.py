"""Dibuja por dónde puede caminar la protagonista en la librería (para revisar los muros).

Verde = sitios a los que pueden llegar sus pies desde la entrada. Rojo = muros.
Uso: python3 tools/walk_map.py salida.png
"""
import re
import sys
from collections import deque
from pathlib import Path
from PIL import Image, ImageDraw

CUERPO_ANCHO, CUERPO_ALTO = 16, 8  # caja de los pies (como en src/objects/Player.js)


def leer(nombre):
    t = Path('src/data/libraryLayout.js').read_text()
    b = t[t.index(f'export const {nombre}'):]
    b = b[: b.index('];')]
    return [{k: int(v) for k, v in re.findall(r'(\w+): (\d+)', l)} for l in b.splitlines() if 'ancho:' in l]


def main(salida):
    im = Image.open('public/assets/libreria-dentro.png').convert('RGBA')
    W, H = im.size
    muros = leer('MUROS') + [{'x': 0, 'y': H + 8, 'ancho': W, 'alto': 16}]  # pared de abajo
    def libre(x, y):  # x, y = pies (abajo en el centro)
        x0, x1, y0, y1 = x - CUERPO_ANCHO / 2, x + CUERPO_ANCHO / 2, y - CUERPO_ALTO, y
        if x0 < 0 or x1 > W or y0 < 0 or y1 > H + 16:
            return False
        return not any(x0 < m['x'] + m['ancho'] and x1 > m['x'] and y0 < m['y'] + m['alto'] and y1 > m['y'] for m in muros)
    inicio = (333, 182)
    vistos, cola = {inicio}, deque([inicio])
    while cola:
        x, y = cola.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            q = (x + dx, y + dy)
            if q not in vistos and libre(*q):
                vistos.add(q)
                cola.append(q)
    capa = Image.new('RGBA', im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(capa)
    for m in muros:
        d.rectangle((m['x'], m['y'], m['x'] + m['ancho'] - 1, m['y'] + m['alto'] - 1), outline=(255, 0, 0, 255))
    for (x, y) in vistos:
        if y < H:
            capa.putpixel((x, y), (0, 255, 0, 110))
    im.alpha_composite(capa)
    im.convert('RGB').resize((W * 2, H * 2), Image.NEAREST).save(salida)


if __name__ == '__main__':
    main(sys.argv[1])
