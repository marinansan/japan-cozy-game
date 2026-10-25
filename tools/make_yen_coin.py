"""Pone el símbolo del yen (¥) en pixel art en el centro de la moneda dorada de PixelLab.

Uso: python3 tools/make_yen_coin.py  (crea public/assets/ui/moneda-yen.png)
"""
from PIL import Image

ORIGEN = 'art/source/ui/moneda-peque.png'  # moneda reducida con PixelLab (22x22)
DESTINO = 'public/assets/ui/moneda-yen.png'
HUECO = (7, 7, 15, 15)  # el agujero cuadrado de la moneda, que se rellena
CARA = (239, 174, 0, 255)
TRAZO = (140, 58, 4, 255)

YEN = [  # ¥ pequeño pero con trazo marcado, para la moneda de 22 px
    'X....X',
    '.X..X.',
    'XXXXXX',
    '..XX..',
    'XXXXXX',
    '..XX..',
]


def main():
    im = Image.open(ORIGEN).convert('RGBA')
    px = im.load()
    for y in range(HUECO[1], HUECO[3]):
        for x in range(HUECO[0], HUECO[2]):
            px[x, y] = CARA
    x0, y0 = 8, 8
    for dy, fila in enumerate(YEN):
        for dx, c in enumerate(fila):
            if c == 'X':
                px[x0 + dx, y0 + dy] = TRAZO
                # (sin brillo alrededor: en la moneda pequeña le quitaba contraste al ¥)
    im.save(DESTINO)


if __name__ == '__main__':
    main()
