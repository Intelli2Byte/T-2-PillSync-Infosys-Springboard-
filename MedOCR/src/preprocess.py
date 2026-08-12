"""Image preprocessing for scanned prescription OCR."""

from PIL import Image, ImageEnhance, ImageFilter


def preprocess_image(image_path, output_path, enhance_contrast=1.4, sharpen=True):
    img = Image.open(image_path)
    img = img.convert("L")
    img = ImageEnhance.Contrast(img).enhance(enhance_contrast)
    if sharpen:
        img = img.filter(ImageFilter.SHARPEN)
    img.save(output_path)
    return output_path