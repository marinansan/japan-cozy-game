"""Dibuja una enredadera colgante (estilo hiedra) en pixel art sobre una imagen.

Uso: python3 tools/draw_vine.py entrada.png salida.png
Las rutas de la enredadera están en RAMAS (coordenadas de la imagen del interior).
"""
import math
import random
import sys
from PIL import Image

CONTORNO = (34, 52, 36)
OSCURO = (50, 85, 55)
MEDIO = (66, 106, 59)
CLARO = (98, 140, 70)
BRILLO = (146, 180, 98)
TALLO = (74, 62, 42)

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

# Hojas de hiedra en forma de corazón. 0 = vacío, 1 = contorno, 2 = color, 3 = brillo
HOJA_GRANDE = [
    [0, 1, 1, 0, 1, 1, 0],
    [1, 2, 3, 1, 3, 2, 1],
    [1, 2, 2, 2, 2, 2, 1],
    [0, 1, 2, 2, 2, 1, 0],
    [0, 0, 1, 2, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
]
HOJA_PEQUENA = [
    [0, 1, 0, 1, 0],
    [1, 3, 1, 2, 1],
    [1, 2, 2, 2, 1],
    [0, 1, 2, 1, 0],
    [0, 0, 1, 0, 0],
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
    for rama in RAMAS:
        for i, (x, y) in enumerate(puntos(rama)):
            pintar(px, w, h, round(x), round(y), TALLO)
            if i % 3 == 0:
                forma = random.choice([HOJA_GRANDE, HOJA_GRANDE, HOJA_PEQUENA])
                # Hojas a un lado y a otro del tallo, alternando
                lado = -len(forma[0]) + 1 if (i // 3) % 2 else 0
                hojas.append((round(x) + lado, round(y) - 1, forma, random.choice([OSCURO, MEDIO, MEDIO, CLARO])))
    # Las hojas de más arriba se dibujan antes, para que las de abajo queden delante
    for x, y, forma, color in sorted(hojas, key=lambda h: h[1]):
        for dy, fila in enumerate(forma):
            for dx, v in enumerate(fila):
                if v == 1:
                    pintar(px, w, h, x + dx, y + dy, CONTORNO)
                elif v == 2:
                    pintar(px, w, h, x + dx, y + dy, color)
                elif v == 3:
                    pintar(px, w, h, x + dx, y + dy, BRILLO if color != OSCURO else MEDIO)
    im.save(salida)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
