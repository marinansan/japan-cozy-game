"""Pone el símbolo del yen (¥) en pixel art en el centro de la moneda dorada de PixelLab.

Uso: python3 tools/make_yen_coin.py  (crea public/assets/ui/moneda-yen.png)
"""
from PIL import Image

ORIGEN = 'art/source/ui/moneda.png'
DESTINO = 'public/assets/ui/moneda-yen.png'
HUECO = (10, 10, 22, 22)  # el agujero cuadrado de la moneda, que se rellena
CARA = (239, 174, 0, 255)
TRAZO = (140, 58, 4, 255)
LUZ = (250, 222, 120, 255)

YEN = [  # trazo grueso para que se lea aunque la moneda sea pequeña
    'XX....XX',
    '.XX..XX.',
    '..XXXX..',
    'XXXXXXXX',
    '...XX...',
    'XXXXXXXX',
    '...XX...',
    '...XX...',
]


def main():
    im = Image.open(ORIGEN).convert('RGBA')
    px = im.load()
    for y in range(HUECO[1], HUECO[3]):
        for x in range(HUECO[0], HUECO[2]):
            px[x, y] = CARA
    x0, y0 = 12, 12
    for dy, fila in enumerate(YEN):
        for dx, c in enumerate(fila):
            if c == 'X':
                px[x0 + dx, y0 + dy] = TRAZO
                # un brillo debajo a la derecha, como grabado en la moneda
                if px[x0 + dx + 1, y0 + dy + 1] == CARA:
                    px[x0 + dx + 1, y0 + dy + 1] = LUZ
    im.save(DESTINO)


if __name__ == '__main__':
    main()
