import argparse
import rasterio
import numpy as np
from rasterio.enums import ColorInterp
from tqdm import tqdm

# Farbzuordnung für Crop-Klassen
colormap = {
    200:  (105, 194, 41),
    1101: (251, 251, 22),
    1102: (228, 206, 63),
    1103: (234, 127, 18),
    1201: (194, 75, 45),
    1202: (180, 23, 23),
    1300: (55, 237, 216),
    1401: (195, 125, 238),
    1402: (154, 12, 238),
    1501: (238, 67, 156),
    1502: (227, 0, 247),
    1602: (145, 255, 0),
    1603: (251, 33, 17),
    1611: (94, 176, 132),
    1612: (91, 240, 158),
    1613: (157, 245, 163),
    1614: (212, 237, 177),
    3001: (5, 131, 5),
    3002: (212, 212, 212),
    3003: (178, 206, 68),
    3004: (111, 111, 111),
    4001: (130, 128, 186),
    4002: (74, 20, 134),
    4003: (106, 81, 163),
}

# Argumente parsen
parser = argparse.ArgumentParser(description="Convert single-band crop class raster to RGBA GeoTIFF.")
parser.add_argument("--input", required=True, help="Input single-band GeoTIFF file")
parser.add_argument("--output", required=True, help="Output RGBA GeoTIFF file")
args = parser.parse_args()

input_path = args.input
output_path = args.output

# Öffne Eingabe und starte Verarbeitung
with rasterio.open(input_path) as src:
    profile = src.profile.copy()
    profile.update({
        "count": 4,
        "dtype": "uint8",
        "photometric": "RGB",
        "compress": "lzw"
    })
    profile.pop("nodata", None)  # remove nodata for uint8

    windows = list(src.block_windows(1))  # Liste aller Blöcke vorab holen

    with rasterio.open(output_path, "w", **profile) as dst:
        for ji, window in tqdm(windows, desc="Processing blocks"):
            block = src.read(1, window=window)

            r = np.zeros(block.shape, dtype=np.uint8)
            g = np.zeros(block.shape, dtype=np.uint8)
            b = np.zeros(block.shape, dtype=np.uint8)
            a = np.zeros(block.shape, dtype=np.uint8)

            for code, (rr, gg, bb) in colormap.items():
                mask = block == code
                r[mask] = rr
                g[mask] = gg
                b[mask] = bb
                a[mask] = 255  # sichtbar

            dst.write(r, 1, window=window)
            dst.write(g, 2, window=window)
            dst.write(b, 3, window=window)
            dst.write(a, 4, window=window)

        dst.colorinterp = [
            ColorInterp.red,
            ColorInterp.green,
            ColorInterp.blue,
            ColorInterp.alpha
        ]
