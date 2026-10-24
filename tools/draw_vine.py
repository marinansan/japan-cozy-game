"""Dibuja una enredadera colgante (estilo hiedra) en pixel art sobre una imagen.

Uso: python3 tools/draw_vine.py entrada.png salida.png
Las rutas de la enredadera están en RAMAS (coordenadas de la imagen del interior).
"""
import math
import random
import sys
from PIL import Image

# Mismos colores que la hiedra que ya trae la imagen (contorno negro como el resto de plantas)
CONTORNO = (0, 0, 0)
SOMBRA = (58, 94, 52)
MEDIO = (86, 126, 65)
BRILLO = (122, 160, 82)
TALLO = (13, 7, 8)

# Cada rama: lista de puntos (x, y) por los que pasa el tallo
RAMAS = [
    # Tallo principal a lo largo de la viga, por encima de la ventana
    [(364, 44), (390, 40), (412, 45), (440, 41), (470, 46), (496, 41), (510, 44)],
    # Cuelga por el pilar izquierdo
    [(376, 42), (378, 70), (376, 98), (379, 126)],
    [(368, 44), (369, 72), (367, 96)],
    # Cuelga por el pilar derecho
    [(503, 43), (504, 74), (502, 100), (505, 122)],
    [(509, 45), (510, 70), (509, 90)],
    # Gotas cortas sobre la viga (no bajan hasta los cristales)
    [(398, 42), (399, 58)],
    [(462, 45), (461, 59)],
    [(486, 43), (487, 57)],
    # Zarcillos que trepan un poco por la pared
    [(384, 41), (382, 30)],
    [(476, 45), (479, 32)],
]

# Hojas en punta (rombo o lágrima), como la hiedra original. 1 = hoja, 2 = brillo, 3 = sombra
HOJAS = [
    [
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 2, 1, 1, 0, 0],
        [0, 2, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 3],
        [0, 1, 1, 1, 1, 3, 0],
        [0, 0, 1, 1, 3, 0, 0],
        [0, 0, 0, 3, 0, 0, 0],
    ],
    [
        [0, 0, 2, 1, 0, 0],
        [0, 2, 1, 1, 1, 0],
        [2, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 3],
        [0, 1, 1, 1, 3, 0],
        [0, 0, 1, 3, 0, 0],
        [0, 0, 0, 1, 0, 0],
    ],
    [
        [0, 0, 1, 0, 0],
        [0, 2, 1, 1, 0],
        [1, 1, 1, 1, 3],
        [0, 1, 1, 3, 0],
        [0, 0, 3, 0, 0],
    ],
    [
        [0, 2, 1, 0],
        [2, 1, 1, 1],
        [1, 1, 1, 3],
        [0, 1, 3, 0],
        [0, 0, 1, 0],
    ],
    [
        [0, 1, 0],
        [2, 1, 1],
        [0, 1, 3],
    ],
]


def puntos(rama, paso=1.0):
    for (x0, y0), (x1, y1) in zip(rama, rama[1:]):
        n = max(1, int(math.hypot(x1 - x0, y1 - y0) / paso))
        for i in range(n):
            t = i / n
            yield x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
    yield rama[-1]


def pintar(px, w, h, x, y, color):
    if 0 <= x < w and 0 <= y < h:
        px[x, y] = color


def main(entrada, salida):
    random.seed(4)
    im = Image.open(entrada).convert('RGBA')
    px = im.load()
    w, h = im.size
    hojas = []

    def pintar(x, y, color):
        if 0 <= x < w and 0 <= y < h:
            px[x, y] = color

    for rama in RAMAS:
        for i, (x, y) in enumerate(puntos(rama)):
            pintar(round(x), round(y), TALLO)
            if i % 3 == 0:
                forma = random.choice([HOJAS[0], HOJAS[1], HOJAS[1], HOJAS[2], HOJAS[3]])
                ancho = len(forma[0])
                # Hojas a un lado y a otro del tallo, alternando
                ox = round(x) - (ancho - 2 if (i // 3) % 2 else 1) + random.choice([-1, 0, 1])
                oy = round(y) - 2 + random.choice([0, 1, 2])
                hojas.append((ox, oy, forma))

    # Cada hoja con su propio borde negro (así se distinguen aunque se toquen).
    # Las de más arriba primero, para que las de abajo queden delante.
    for ox, oy, forma in sorted(hojas, key=lambda h: h[1]):
        celdas = {(ox + dx, oy + dy): v for dy, fila in enumerate(forma) for dx, v in enumerate(fila) if v}
        for (x, y) in celdas:
            for vx, vy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                if (x + vx, y + vy) not in celdas:
                    pintar(x + vx, y + vy, CONTORNO)
        for (x, y), v in celdas.items():
            pintar(x, y, {1: MEDIO, 2: BRILLO, 3: SOMBRA}[v])
    im.save(salida)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
