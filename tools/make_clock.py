"""Crea las tres imágenes del reloj (mañana, tarde y noche) a partir de la cúpula de PixelLab.

- Recoloca el medallón del número pegado al lado derecho de la cúpula.
- Dibuja la aguja en pixel art: a la izquierda (mañana), arriba (tarde) o a la derecha (noche).

Uso: python3 tools/make_clock.py  (crea public/assets/ui/reloj-*.png)
"""
import math
from collections import deque
from PIL import Image

ORIGEN = 'art/source/reloj/cupula-peque.png'  # cúpula reducida con PixelLab (resize)
ORIGEN_MEDALLON = 'art/source/reloj/cupula.png'  # el medallón se toma de la original, más grande, para un número legible
# (la cúpula se recorta sola a su contenido, una vez quitado el medallón)
MEDALLON = (97, 7, 118, 27)  # caja del medallón suelto en la imagen original
MEDALLON_PEQUE = (67, 5, 81, 19)  # caja del medallón pequeño, que se quita de la cúpula reducida
EJE_ORIGINAL = (39, 33)  # centro de la aguja en la cúpula reducida
LARGO = 19
ANGULOS = {'manana': 150, 'tarde': 90, 'noche': 30}  # grados, 0 = derecha, 90 = arriba

CONTORNO = (20, 12, 10, 255)
MADERA = (92, 52, 30, 255)
MADERA_CLARA = (150, 96, 54, 255)
LATON = (226, 182, 96, 255)


def punto(px, w, h, x, y, color):
    if 0 <= x < w and 0 <= y < h:
        px[x, y] = color


def aguja(im, angulo):
    px = im.load()
    w, h = im.size
    ex, ey = EJE
    rad = math.radians(angulo)
    pasos = [(ex + math.cos(rad) * t, ey - math.sin(rad) * t) for t in [i * 0.5 for i in range(LARGO * 2 + 1)]]
    # Aguja fina: un píxel de madera con su contorno negro alrededor
    for x, y in pasos:
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                punto(px, w, h, round(x) + dx, round(y) + dy, CONTORNO)
    for i, (x, y) in enumerate(pasos):
        punto(px, w, h, round(x), round(y), MADERA_CLARA if i % 6 < 2 else MADERA)
    # Eje de latón
    for dx in range(-2, 3):
        for dy in range(-2, 3):
            d = math.hypot(dx, dy)
            if d <= 2.4:
                punto(px, w, h, ex + dx, ey + dy, CONTORNO if d > 1.4 else LATON)


def separar_medallon(base, caja):
    """Devuelve el medallón recortado y la imagen sin él (son piezas que no se tocan)."""
    px = base.load()
    w, h = base.size
    inicio = ((caja[0] + caja[2]) // 2, (caja[1] + caja[3]) // 2)
    pieza, cola = {inicio}, deque([inicio])
    while cola:
        x, y = cola.popleft()
        for q in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if q not in pieza and 0 <= q[0] < w and 0 <= q[1] < h and px[q][3]:
                pieza.add(q)
                cola.append(q)
    medallon = Image.new('RGBA', base.size)
    mp = medallon.load()
    for q in pieza:
        mp[q] = px[q]
        px[q] = (0, 0, 0, 0)
    return medallon.crop(caja), base


def main():
    base = Image.open(ORIGEN).convert('RGBA')
    _, base = separar_medallon(base, MEDALLON_PEQUE)
    medallon, _ = separar_medallon(Image.open(ORIGEN_MEDALLON).convert('RGBA'), MEDALLON)
    caja = base.getbbox()
    cupula = base.crop(caja)
    global EJE
    EJE = (EJE_ORIGINAL[0] - caja[0], EJE_ORIGINAL[1] - caja[1])
    # Lienzo: cúpula a la izquierda y el medallón pegado a su lado derecho, a media altura
    lienzo_w = cupula.width + medallon.width - 9
    lienzo = Image.new('RGBA', (lienzo_w, cupula.height))
    lienzo.alpha_composite(cupula, (0, 0))
    mx, my = cupula.width - 9, cupula.height - medallon.height - 6
    for nombre, angulo in ANGULOS.items():
        im = lienzo.copy()
        aguja(im, angulo)
        im.alpha_composite(medallon, (mx, my))
        im.save(f'public/assets/ui/reloj-{nombre}.png')
    cx, cy = mx + medallon.width / 2, my + medallon.height / 2
    print('tamaño', lienzo.size, 'centro del medallón', (cx, cy), '->', (round(cx / lienzo_w * 100, 2), round(cy / cupula.height * 100, 2)), '%')


if __name__ == '__main__':
    main()
