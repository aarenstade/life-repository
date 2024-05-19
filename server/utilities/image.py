from PIL import Image
from pillow_heif import register_heif_opener


def convert_heic_to_jpg(heic_path, output_path):
    register_heif_opener()
    image = Image.open(heic_path)
    image.save(output_path, format="JPEG")
