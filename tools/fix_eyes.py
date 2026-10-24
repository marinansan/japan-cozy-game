"""Deja los ojos de la protagonista siempre marrones.

PixelLab a veces pinta el iris azul o gris en las vistas de lado o en algunos
fotogramas. Este script cambia esos colores por marrones solo en la zona de la cara.

Uso: python3 tools/fix_eyes.py imagen.png [más imágenes...]
"""
import sys
from PIL import Image

# Colores del ojo que no son marrones -> su equivalente marrón
CAMBIOS = {
    (73, 85, 128): (90, 48, 36),    # iris azul -> marrón
    (89, 94, 130): (90, 48, 36),
    (46, 58, 62): (58, 30, 24),     # iris oscuro azulado -> marrón oscuro
    (157, 157, 161): (151, 85, 59), # parte baja gris -> marrón claro
    (199, 219, 227): (252, 246, 221),  # brillo azulado -> brillo cálido
    (40, 38, 83): (58, 30, 24),
}


def es_azulado(c):
    r, g, b = c[:3]
    return b > r + 12 and b > g


def arreglar(ruta):
    im = Image.open(ruta).convert('RGBA')
    px = im.load()
    w, h = im.size
    # Zona de la cara: la mitad de arriba del personaje
    caja = im.getbbox() or (0, 0, w, h)
    y_fin = caja[1] + (caja[3] - caja[1]) * 0.35
    n = 0
    for y in range(caja[1], int(y_fin)):
        for x in range(w):
            c = px[x, y]
            if not c[3]:
                continue
            nuevo = CAMBIOS.get(c[:3])
            if nuevo is None and es_azulado(c):
                # cualquier otro azul en la cara: marrón con la misma luminosidad
                l = (c[0] * 3 + c[1] * 6 + c[2]) / 10
                nuevo = (int(min(255, l * 1.35)), int(l * 0.75), int(l * 0.55))
            if nuevo:
                px[x, y] = (*nuevo, c[3])
                n += 1
    im.save(ruta)
    return n


if __name__ == '__main__':
    for ruta in sys.argv[1:]:
        print(ruta, arreglar(ruta), 'píxeles cambiados')
