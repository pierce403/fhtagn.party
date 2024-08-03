# Python script to download and optimize images for the reverse captcha challenge

import requests
import os
from PIL import Image
from io import BytesIO

def download_image(url, save_path):
    response = requests.get(url)
    img = Image.open(BytesIO(response.content))
    img.save(save_path)

def optimize_image(path, max_size_kb=50):
    img = Image.open(path)
    while os.path.getsize(path) > max_size_kb * 1024:
        width, height = img.size
        img = img.resize((int(width*0.9), int(height*0.9)), Image.ANTIALIAS)
        img.save(path, optimize=True, quality=85)

# Usage example
# download_image('https://example.com/image.jpg', 'public/images/cephalopods/image1.jpg')
# optimize_image('public/images/cephalopods/image1.jpg')
