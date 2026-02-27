import urllib.request
import os
import concurrent.futures

BASE_URL = "https://www.serebii.net/pokemon30/{:03d}.png"
SAVE_DIR = "images"

if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

def download_image(i):
    url = BASE_URL.format(i)
    filename = os.path.join(SAVE_DIR, f"{i:03d}.png")
    
    # Skip if already downloaded
    if os.path.exists(filename):
        return True
        
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    
    try:
        with urllib.request.urlopen(req) as response, open(filename, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        return True
    except Exception as e:
        print(f"Failed to download {i}: {e}")
        return False

def main():
    pokemon_count = 1025
    success = 0
    print(f"Starting download of {pokemon_count} Pokemon images...")
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(download_image, i): i for i in range(1, pokemon_count + 1)}
        for future in concurrent.futures.as_completed(futures):
            if future.result():
                success += 1
                if success % 100 == 0:
                    print(f"Downloaded {success}/{pokemon_count} images.")
                    
    print(f"Completed! Successfully downloaded {success}/{pokemon_count} images.")

if __name__ == "__main__":
    main()
