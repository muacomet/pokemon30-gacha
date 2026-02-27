import urllib.request
import json
import concurrent.futures

def fetch_single_pokemon(i):
    url = f"https://pokeapi.co/api/v2/pokemon-species/{i}/"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            
            korean_name = f"Unknown-{i}"
            for name_entry in data['names']:
                if name_entry['language']['name'] == 'ko':
                    korean_name = name_entry['name']
                    break
                    
            return str(i), korean_name
    except Exception as e:
        print(f"Failed to fetch ID {i}: {e}")
        return str(i), f"Unknown-{i}"

def fetch_pokemon_names():
    total = 1025
    pokemon_dict = {}
    print(f"Fetching {total} Korean Pokemon names from PokeAPI REST using Threads...")
    
    success = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        futures = {executor.submit(fetch_single_pokemon, i): i for i in range(1, total + 1)}
        for future in concurrent.futures.as_completed(futures):
            pkmn_id, name = future.result()
            pokemon_dict[pkmn_id] = name
            success += 1
            if success % 100 == 0:
                print(f"Fetched {success}/{total} names...")
                
    with open('pokemon_names.json', 'w', encoding='utf-8') as f:
        json.dump(pokemon_dict, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully saved {len(pokemon_dict)} Pokemon names.")

if __name__ == "__main__":
    fetch_pokemon_names()
