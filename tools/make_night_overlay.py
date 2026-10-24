"""Crea la capa de noche de la librería: cielo estrellado en las ventanas
y farolillos encendidos en ámbar. Se dibuja por encima de la luz nocturna.

Uso: python3 tools/make_night_overlay.py
"""
import random
from PIL import Image

ORIGEN = 'public/assets/libreria-dentro.png'
DESTINO = 'public/assets/libreria-noche.png'

# Zonas de la imagen (x0, y0, x1, y1)
# (la puerta del jardín, tras la noren, no entra: taparía al protagonista)
# (solo los cristales, para no tocar la enredadera de los pilares)
VENTANAS = [(387, 64, 497, 162), (200, 10, 286, 36)]
FAROLILLOS = [(64, 80, 100, 124), (122, 146, 165, 190), (181, 80, 219, 122), (412, 26, 452, 70)]

CIELO_ARRIBA = (48, 40, 108)
CIELO_ABAJO = (156, 96, 168)  # violeta rosado cerca del horizonte
SILUETA = (24, 26, 52)  # árboles del jardín, casi negros


def mezcla(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def luz(c):
    return 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2]


def cerca_de_contorno(px, x, y, radio=2):
    for dy in range(-radio, radio + 1):
        for dx in range(-radio, radio + 1):
            try:
                if max(px[x + dx, y + dy][:3]) < 16:
                    return True
            except IndexError:
                pass
    return False


def main():
    random.seed(7)
    im = Image.open(ORIGEN).convert('RGBA')
    capa = Image.new('RGBA', im.size, (0, 0, 0, 0))
    px, out = im.load(), capa.load()

    for x0, y0, x1, y1 in VENTANAS:
        for y in range(y0, y1):
            cielo = mezcla(CIELO_ARRIBA, CIELO_ABAJO, (y - y0) / (y1 - y0))
            for x in range(x0, x1):
                r, g, b, _ = px[x, y]
                # Solo los cristales: el jardín es verde claro; los marcos y las plantas son más oscuros
                if not (g > r + 15 and g >= b - 8 and luz((r, g, b)) > 80):
                    continue
                # Las hojas de la hiedra tienen contorno negro: lo que está junto a uno no es cristal
                if cerca_de_contorno(px, x, y):
                    continue
                t = min(1, max(0, (luz((r, g, b)) - 95) / 100))
                c = mezcla(SILUETA, cielo, t)
                if t > 0.6 and random.random() < 0.035:
                    c = random.choice([(255, 250, 230), (230, 225, 255), (255, 226, 170)])
                out[x, y] = (*c, 255)

    for x0, y0, x1, y1 in FAROLILLOS:
        for y in range(y0, y1):
            for x in range(x0, x1):
                r, g, b, _ = px[x, y]
                # Papel del farolillo: tonos crema claros
                if r > 180 and r > b + 30 and luz((r, g, b)) > 170:
                    f = luz((r, g, b)) / 255
                    out[x, y] = (255, int(120 + 95 * f), int(50 + 70 * f), 255)

    capa.save(DESTINO)
    print('Guardado', DESTINO)


if __name__ == '__main__':
    main()
