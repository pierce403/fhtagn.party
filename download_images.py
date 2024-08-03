# Python script to download and optimize images for the reverse captcha challenge

import requests
import os
from PIL import Image
from io import BytesIO
import re
import random

def download_image(url, save_path):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    response = requests.get(url, headers=headers)
    response.raise_for_status()  # Raise an exception for bad status codes
    img = Image.open(BytesIO(response.content))
    img.save(save_path)

def optimize_image(path, max_size_kb=50):
    img = Image.open(path)
    while os.path.getsize(path) > max_size_kb * 1024:
        width, height = img.size
        img = img.resize((int(width*0.9), int(height*0.9)), Image.Resampling.LANCZOS)
        img.save(path, optimize=True, quality=85)

def is_valid_image_url(url):
    return url.startswith('http') and not url.startswith('data:')

def download_and_optimize_images(urls, category, max_images=100):
    base_path = f'public/images/{category}'
    os.makedirs(base_path, exist_ok=True)

    random.shuffle(urls)
    successful_downloads = 0

    for i, url in enumerate(urls):
        if successful_downloads >= max_images:
            break
        if is_valid_image_url(url):
            try:
                file_name = f'{category}_{successful_downloads+1}.jpg'
                save_path = os.path.join(base_path, file_name)
                download_image(url, save_path)
                optimize_image(save_path)
                print(f'Successfully downloaded and optimized: {file_name}')
                successful_downloads += 1
            except Exception as e:
                print(f'Error processing {url}: {str(e)}')

    print(f'Downloaded {successful_downloads} images for {category}')

# Cephalopod URLs
cephalopod_urls = [
    'https://unsplash.com/photos/tFBjYVy9CwQ/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8Y2VwaGFsb3BvZHxlbnwwfHx8fDE3MjI2NzIwMDh8MA&force=true',
    'https://unsplash.com/photos/8qH4GSYBiSA/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8b2N0b3B1c3xlbnwwfHx8fDE3MjI2NzIwNTN8MA&force=true',
    'https://unsplash.com/photos/WWesmHEgXDs/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8c3F1aWR8ZW58MHx8fHwxNzIyNjcyMDc2fDA&force=true',
    'https://unsplash.com/photos/KKm1ua7MSf0/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y3V0dGxlZmlzaHxlbnwwfHx8fDE3MjI2NzIxMDd8MA&force=true',
    'https://unsplash.com/photos/XmYSlYrupL8/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8Y3V0dGxlZmlzaHxlbnwwfHx8fDE3MjI2NzIxMDd8MA&force=true',
    'https://unsplash.com/photos/1gLdTsX3_70/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8Y3V0dGxlZmlzaHxlbnwwfHx8fDE3MjI2NzIxMDd8MA&force=true',
    'https://unsplash.com/photos/Tn8DLxwuDMA/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTN8fG9jdG9wdXN8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/zcUgjyqEwe8/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTV8fG9jdG9wdXN8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/8Zt0xOOK4nI/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fG9jdG9wdXN8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/Yy2cBOqUN_o/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8Y2VwaGFsb3BvZHxlbnwwfHx8fDE3MjI2NzIwMDh8MA&force=true',
    'https://unsplash.com/photos/uADHk4o3egM/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8Y2VwaGFsb3BvZHxlbnwwfHx8fDE3MjI2NzIwMDh8MA&force=true',
    'https://unsplash.com/photos/7NvKyjeFCJI/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8Y2VwaGFsb3BvZHxlbnwwfHx8fDE3MjI2NzIwMDh8MA&force=true',
    'https://unsplash.com/photos/wEYiIJGKSyc/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8Y2VwaGFsb3BvZHxlbnwwfHx8fDE3MjI2NzIwMDh8MA&force=true',
    'https://unsplash.com/photos/Q7PclNhVRI0/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MjB8fG9jdG9wdXN8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/5JwBbnyZzfc/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MjR8fG9jdG9wdXN8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/Q_3WmguWgYg/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MzR8fG9jdG9wdXN8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/tFBjYVy9CwQ/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Njl8fG9jdG9wdXN8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/WWesmHEgXDs/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NzF8fG9jdG9wdXN8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/XmYSlYrupL8/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NzN8fG9jdG9wdXN8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/KKm1ua7MSf0/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NzV8fG9jdG9wdXN8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/Tn8DLxwuDMA/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nzd8fG9jdG9wdXN8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/zcUgjyqEwe8/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nzl8fG9jdG9wdXN8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/8Zt0xOOK4nI/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8ODF8fG9jdG9wdXN8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/Q_3WmguWgYg/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8ODN8fG9jdG9wdXN8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/5JwBbnyZzfc/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8ODV8fG9jdG9wdXN8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/YoadQb46v6k/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OTF8fG9jdG9wdXN8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/Q_3WmguWgYg/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTAzfHxvY3RvcHVzfGVufDB8fDB8fHww&force=true',
    'https://unsplash.com/photos/5JwBbnyZzfc/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTA1fHxvY3RvcHVzfGVufDB8fDB8fHww&force=true',
    'https://unsplash.com/photos/tFBjYVy9CwQ/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTA3fHxvY3RvcHVzfGVufDB8fDB8fHww&force=true',
    'https://unsplash.com/photos/XmYSlYrupL8/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTA5fHxvY3RvcHVzfGVufDB8fDB8fHww&force=true',
    'https://unsplash.com/photos/1gLdTsX3_70/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTExfHxvY3RvcHVzfGVufDB8fDB8fHww&force=true',
    'https://unsplash.com/photos/9ZZnAWmfAuQ/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTEzfHxvY3RvcHVzfGVufDB8fDB8fHww&force=true',
    'https://unsplash.com/photos/Q7PclNhVRI0/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTE1fHxvY3RvcHVzfGVufDB8fDB8fHww&force=true',
]



# Crustacean URLs
crustacean_urls = [
    'https://unsplash.com/photos/8Zt0xOOK4nI/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8Y3J1c3RhY2VhbnxlbnwwfHx8fDE3MjI2NzIwMDh8MA&force=true',
    'https://unsplash.com/photos/Tn8DLxwuDMA/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8Y3J1c3RhY2VhbnxlbnwwfHx8fDE3MjI2NzIwMDh8MA&force=true',
    'https://unsplash.com/photos/zcUgjyqEwe8/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8Y3J1c3RhY2VhbnxlbnwwfHx8fDE3MjI2NzIwMDh8MA&force=true',
    'https://unsplash.com/photos/KKm1ua7MSf0/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y3J1c3RhY2VhbnxlbnwwfHx8fDE3MjI2NzIwMDh8MA&force=true',
    'https://unsplash.com/photos/Q_3WmguWgYg/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y3JhYnxlbnwwfHx8fDE3MjI2NzIwMDh8MA&force=true',
    'https://unsplash.com/photos/5JwBbnyZzfc/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8Y3JhYnxlbnwwfHx8fDE3MjI2NzIwMDh8MA&force=true',
    'https://unsplash.com/photos/tFBjYVy9CwQ/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8Y3JhYnxlbnwwfHx8fDE3MjI2NzIwMDh8MA&force=true',
    'https://unsplash.com/photos/XmYSlYrupL8/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8Y3JhYnxlbnwwfHx8fDE3MjI2NzIwMDh8MA&force=true',
    'https://unsplash.com/photos/1gLdTsX3_70/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8Y3JhYnxlbnwwfHx8fDE3MjI2NzIwMDh8MA&force=true',
    'https://unsplash.com/photos/9ZZnAWmfAuQ/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8Y3JhYnxlbnwwfHx8fDE3MjI2NzIwMDh8MA&force=true',
    'https://unsplash.com/photos/Q7PclNhVRI0/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8Y3JhYnxlbnwwfHx8fDE3MjI2NzIwMDh8MA&force=true',
    'https://unsplash.com/photos/uADHk4o3egM/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGNyYWJ8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/7NvKyjeFCJI/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fGNyYWJ8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/wEYiIJGKSyc/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTJ8fGNyYWJ8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/Yy2cBOqUN_o/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTN8fGNyYWJ8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/8qH4GSYBiSA/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTR8fGNyYWJ8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/Q_3WmguWgYg/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8bG9ic3RlcnxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/5JwBbnyZzfc/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8bG9ic3RlcnxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/tFBjYVy9CwQ/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8bG9ic3RlcnxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/XmYSlYrupL8/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8bG9ic3RlcnxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/1gLdTsX3_70/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8bG9ic3RlcnxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/9ZZnAWmfAuQ/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8bG9ic3RlcnxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/Q7PclNhVRI0/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8bG9ic3RlcnxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/uADHk4o3egM/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGxvYnN0ZXJ8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/7NvKyjeFCJI/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fGxvYnN0ZXJ8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/wEYiIJGKSyc/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTJ8fGxvYnN0ZXJ8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/Yy2cBOqUN_o/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTN8fGxvYnN0ZXJ8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/8qH4GSYBiSA/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTR8fGxvYnN0ZXJ8ZW58MHx8MHx8fDA&force=true',
    'https://unsplash.com/photos/Q_3WmguWgYg/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8c2hyaW1wfGVufDB8fDB8fHww&force=true',
    'https://unsplash.com/photos/5JwBbnyZzfc/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8c2hyaW1wfGVufDB8fDB8fHww&force=true',
    'https://unsplash.com/photos/tFBjYVy9CwQ/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8c2hyaW1wfGVufDB8fDB8fHww&force=true',
    'https://unsplash.com/photos/XmYSlYrupL8/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8c2hyaW1wfGVufDB8fDB8fHww&force=true',
    'https://unsplash.com/photos/1gLdTsX3_70/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8c2hyaW1wfGVufDB8fDB8fHww&force=true',
    'https://unsplash.com/photos/9ZZnAWmfAuQ/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8c2hyaW1wfGVufDB8fDB8fHww&force=true',
    'https://unsplash.com/photos/Q7PclNhVRI0/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8OXx8c2hyaW1wfGVufDB8fDB8fHww&force=true',
    'https://unsplash.com/photos/uADHk4o3egM/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fHNocmltcHxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/7NvKyjeFCJI/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fHNocmltcHxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/wEYiIJGKSyc/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTJ8fHNocmltcHxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/Yy2cBOqUN_o/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTN8fHNocmltcHxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/8qH4GSYBiSA/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTR8fHN0cmltcHxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/Q_3WmguWgYg/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTZ8fHNocmltcHxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/5JwBbnyZzfc/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTd8fHNocmltcHxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/tFBjYVy9CwQ/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTh8fHNocmltcHxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/XmYSlYrupL8/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MjB8fHNocmltcHxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/1gLdTsX3_70/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MjF8fHNocmltcHxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/9ZZnAWmfAuQ/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MjN8fHNocmltcHxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/Q7PclNhVRI0/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MjR8fHNocmltcHxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/uADHk4o3egM/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MjV8fHNocmltcHxl&force=true',
    'https://unsplash.com/photos/7NvKyjeFCJI/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MjZ8fHNocmltcHxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/wEYiIJGKSyc/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mjd8fHNocmltcHxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/Yy2cBOqUN_o/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mjh8fHNocmltcHxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/8qH4GSYBiSA/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mjl8fHNocmltcHxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/Q_3WmguWgYg/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MzB8fHNocmltcHxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/5JwBbnyZzfc/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MzF8fHNocmltcHxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/tFBjYVy9CwQ/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MzJ8fHNocmltcHxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/XmYSlYrupL8/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MzN8fHNocmltcHxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/1gLdTsX3_70/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MzR8fHNocmltcHxlbnwwfHwwfHx8MA&force=true',
    'https://unsplash.com/photos/9ZZnAWmfAuQ/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MzV8fHNocmltcHxlbnwwfHwwfHx8MA&force=true'
]

# Ensure we have about 100 URLs for each category
print(f"Number of cephalopod images: {len(cephalopod_urls)}")
print(f"Number of crustacean images: {len(crustacean_urls)}")

if len(cephalopod_urls) < 95 or len(crustacean_urls) < 95:
    print("Warning: Less than 95 images for one or both categories. Consider adding more URLs.")

try:
    for category, urls in [('cephalopods', cephalopod_urls), ('crustaceans', crustacean_urls)]:
        download_and_optimize_images(urls, category)
    print("Image download and optimization completed.")
except Exception as e:
    print(f"An error occurred during image processing: {str(e)}")
finally:
    print("Script execution finished.")
