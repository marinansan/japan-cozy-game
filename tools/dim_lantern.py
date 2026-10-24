"""Apaga el farolillo que el farolero lleva al cinturón.

PixelLab lo dibuja casi blanco y parece encendido. Este script pasa esos píxeles
a tonos de papel viejo, solo a la altura del cinturón (la barba y los calcetines
también son blancos y no se tocan).

Uso: python3 tools/dim_lantern.py imagen.png [más imágenes...]
"""
import sys
from PIL import Image

PAPEL = [(196, 178, 146), (214, 196, 160), (226, 210, 176)]  # sombra, medio, luz


def apagar(ruta):
    im = Image.open(ruta).convert('RGBA')
    px = im.load()
    caja = im.getbbox()
    if not caja:
        return 0
    alto = caja[3] - caja[1]
    y0, y1 = caja[1] + int(alto * 0.40), caja[1] + int(alto * 0.75)
    n = 0
    for y in range(y0, y1):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if a and r + g + b > 600:
                l = (r + g + b) / 3
                px[x, y] = (*PAPEL[2 if l > 245 else 1 if l > 225 else 0], a)
                n += 1
    im.save(ruta)
    return n


if __name__ == '__main__':
    for ruta in sys.argv[1:]:
        print(ruta, apagar(ruta))
