document.addEventListener('DOMContentLoaded', () => {
    const drawBtn = document.getElementById('draw-btn');
    const card = document.getElementById('card');
    const pokemonImage = document.getElementById('pokemon-image');
    const pokemonNumberText = document.getElementById('pokemon-number');

    // The total number of Pokémon in the dataset
    const TOTAL_POKEMON = 1025;

    // Prevent multiple clicks while drawing
    let isDrawing = false;

    drawBtn.addEventListener('click', () => {
        if (isDrawing) return;

        drawPokemon();
    });

    function drawPokemon() {
        isDrawing = true;
        drawBtn.disabled = true;

        // If the card is already flipped, flip it back first
        if (card.classList.contains('flipped')) {
            card.classList.remove('flipped');

            // Wait for flip animation to finish
            setTimeout(() => {
                startGachaSequence();
            }, 600);
        } else {
            startGachaSequence();
        }
    }

    function startGachaSequence() {
        // Start shaking animation to build tension
        card.classList.add('shaking');
        drawBtn.querySelector('.button-text').innerText = '뽑는 중...';

        // Simulate an intense draw calculation
        setTimeout(() => {
            // Generate random Pokemon ID
            const randomId = Math.floor(Math.random() * TOTAL_POKEMON) + 1;

            // Format ID with leading zeros (e.g. 1 -> 001, 15 -> 015, 1025 -> 1025)
            const formattedId = String(randomId).padStart(3, '0');

            // Construct the path to our downloaded local image
            // We use Serebii's convention naming '001.png' to '1025.png'
            const imagePath = `images/${formattedId}.png`;

            revealPokemon(imagePath, randomId);
        }, 1500); // 1.5 seconds of tension
    }

    function revealPokemon(imagePath, id) {
        // Preload image to avoid pop-in while card flips
        const img = new Image();
        img.onload = () => {
            // Stop shaking
            card.classList.remove('shaking');

            // Update card DOM
            pokemonImage.src = imagePath;
            pokemonNumberText.innerText = `No. ${String(id).padStart(3, '0')}`;

            // Trigger flip animation
            requestAnimationFrame(() => {
                card.classList.add('flipped');

                // Reset button state
                setTimeout(() => {
                    isDrawing = false;
                    drawBtn.disabled = false;
                    drawBtn.querySelector('.button-text').innerText = '다시 뽑기';
                }, 600);
            });
        };
        img.onerror = () => {
            // If the image fails to load (maybe not downloaded yet?), fallback or retry
            console.error(`Failed to load ${imagePath}`);
            card.classList.remove('shaking');
            isDrawing = false;
            drawBtn.disabled = false;
            drawBtn.querySelector('.button-text').innerText = '포켓몬 뽑기';
            alert(`앗! No. ${id} 이미지를 찾을 수 없습니다. 다운로드 스크립트가 완료되었는지 확인해주세요.`);
        };

        // Start preloading
        img.src = imagePath;
    }
});
