"""Pone el libro de Recuerdos (PixelLab) dentro de un círculo claro con borde oscuro, en pixel art,
como el resto de botones del juego.

Uso: python3 tools/make_book_icon.py  (crea public/assets/ui/libro-recuerdos.png)
"""
from PIL import Image

ORIGEN = 'art/source/ui/libro-piel.png'
DESTINO = 'public/assets/ui/libro-recuerdos.png'
LADO = 62  # diámetro del círculo (el libro mide 46x41 y debe caber con margen)
PAPEL = (247, 239, 223, 255)
SOMBRA_PAPEL = (226, 212, 184, 255)
BORDE = (59, 36, 24, 255)
CONTORNO = (20, 12, 10, 255)


def main():
    libro = Image.open(ORIGEN).convert('RGBA')
    libro = libro.crop(libro.getbbox())
    im = Image.new('RGBA', (LADO, LADO))
    px = im.load()
    c = (LADO - 1) / 2
    for y in range(LADO):
        for x in range(LADO):
            d = ((x - c) ** 2 + (y - c) ** 2) ** 0.5
            if d <= c - 0.0:
                if d > c - 1.2:
                    px[x, y] = CONTORNO
                elif d > c - 3.2:
                    px[x, y] = BORDE
                elif y > c and d > c - 6:
                    px[x, y] = SOMBRA_PAPEL  # un poco de sombra abajo, dentro del borde
                else:
                    px[x, y] = PAPEL
    im.alpha_composite(libro, ((LADO - libro.width) // 2, (LADO - libro.height) // 2 + 1))
    im.save(DESTINO)
    print('libro', libro.size, '-> icono', im.size)


if __name__ == '__main__':
    main()
