from PIL import Image
import os

def optimize_image(path, max_size_kb=50):
    img = Image.open(path)
    while os.path.getsize(path) > max_size_kb * 1024:
        width, height = img.size
        img = img.resize((int(width*0.9), int(height*0.9)), Image.Resampling.LANCZOS)
        img.save(path, optimize=True, quality=85)

def main():
    directory = os.path.dirname(os.path.abspath(__file__))
    for filename in os.listdir(directory):
        if filename.startswith('cephalopods_') and filename.endswith('.jpg'):
            file_path = os.path.join(directory, filename)
            print(f"Optimizing {filename}...")
            optimize_image(file_path)
    print("Optimization complete.")

if __name__ == "__main__":
    main()
