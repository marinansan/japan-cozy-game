"""Corta la placa de madera de PixelLab en tres piezas (izquierda, centro y derecha)
para que el marcador de yenes pueda estirarse según las cifras sin deformar los clavos.

Uso: python3 tools/make_plaque_parts.py  (crea public/assets/ui/placa-{izq,centro,der}.png)
"""
from PIL import Image

ORIGEN = 'art/source/ui/placa-peque.png'  # placa reducida con PixelLab
BORDE = 8  # ancho de cada extremo (con sus clavos)


def main():
    im = Image.open(ORIGEN).convert('RGBA')
    im = im.crop(im.getbbox())
    w, h = im.size
    im.crop((0, 0, BORDE, h)).save('public/assets/ui/placa-izq.png')
    im.crop((BORDE, 0, BORDE + 12, h)).save('public/assets/ui/placa-centro.png')
    im.crop((w - BORDE, 0, w, h)).save('public/assets/ui/placa-der.png')
    print('alto de la placa', h)


if __name__ == '__main__':
    main()
