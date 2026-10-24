"""Dibuja la puerta corredera (shoji) de la pared derecha, la que sube a casa.

Uso: python3 tools/draw_side_door.py entrada.png salida.png
"""
import sys
from PIL import Image

X0, X1 = 494, 511  # ancho de la puerta vista de lado
Y0, Y1 = 272, 368  # alto (de arriba a abajo en la imagen)

MARCO = (61, 35, 37)
MARCO_CLARO = (97, 58, 49)
PAPEL = (236, 222, 190)
PAPEL_SOMBRA = (212, 192, 156)
LISTON = (128, 86, 59)
ESCALON = (150, 104, 66)
ESCALON_BORDE = (104, 66, 46)
SOMBRA = (0, 0, 0, 70)


def main(entrada, salida):
    im = Image.open(entrada).convert('RGBA')
    px = im.load()

    # Sombra suave en el suelo, a la izquierda de la puerta
    capa = Image.new('RGBA', im.size, (0, 0, 0, 0))
    cp = capa.load()
    for y in range(Y0 + 6, Y1 + 4):
        for x in range(X0 - 5, X0):
            cp[x, y] = (0, 0, 0, 22 + (x - (X0 - 5)) * 10)
    im.alpha_composite(capa)
    px = im.load()

    for y in range(Y0, Y1 + 1):
        for x in range(X0, X1 + 1):
            borde = x in (X0, X1) or y in (Y0, Y0 + 1, Y1)
            if borde:
                px[x, y] = MARCO
            elif x == X0 + 1 or y == Y0 + 2:
                px[x, y] = MARCO_CLARO
            else:
                # Dos hojas de papel con listones de madera (kumiko)
                medio = (X0 + X1) // 2
                liston = x == medio or (y - Y0) % 12 == 0
                if liston:
                    px[x, y] = LISTON
                else:
                    # el papel más cercano a la pared queda un poco en sombra
                    px[x, y] = PAPEL_SOMBRA if x > medio else PAPEL

    # Tirador
    for y in range(Y0 + 44, Y0 + 52):
        px[X0 + 3, y] = MARCO

    # Escalón de madera delante de la puerta
    for y in range(Y0 + 30, Y1 - 6):
        for x in range(X0 - 9, X0):
            px[x, y] = ESCALON_BORDE if x == X0 - 9 or y in (Y0 + 30, Y1 - 7) else ESCALON

    im.save(salida)


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
