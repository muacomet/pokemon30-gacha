document.addEventListener('DOMContentLoaded', () => {
    const drawBtn = document.getElementById('draw-btn');
    const card = document.getElementById('card');
    const pokemonImage = document.getElementById('pokemon-image');
    const pokemonNumberText = document.getElementById('pokemon-number');
    const pokemonNameText = document.getElementById('pokemon-name-text');
    const actionButtons = document.getElementById('action-buttons');
    const downloadBtn = document.getElementById('download-btn');
    const shareBtn = document.getElementById('share-btn');

    // The total number of Pokémon in the dataset
    const TOTAL_POKEMON = 1025;

    // Prevent multiple clicks while drawing
    let isDrawing = false;

    // Store current state for sharing/downloading
    let currentId = null;
    let currentName = null;
    let currentImgPath = null;

    // Store Pokemon names
    let pokemonNames = {};

    // Fetch names on load
    fetch('pokemon_names.json')
        .then(response => response.json())
        .then(data => {
            pokemonNames = data;
        })
        .catch(err => console.error("Failed to load pokemon names:", err));

    drawBtn.addEventListener('click', () => {
        if (isDrawing) return;

        drawPokemon();
    });

    // Action button listeners
    downloadBtn.addEventListener('click', () => {
        if (!currentImgPath) return;

        const a = document.createElement('a');
        a.href = currentImgPath;
        a.download = `pokemon_${String(currentId).padStart(3, '0')}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    shareBtn.addEventListener('click', async () => {
        if (!currentId) return;

        const text = `제가 뽑은 포켓몬은 [No.${String(currentId).padStart(3, '0')} ${currentName}] 입니다!\n당신의 포켓몬도 뽑아보세요: https://muacomet.github.io/pokemon30-gacha/`;
        const url = 'https://muacomet.github.io/pokemon30-gacha/';

        if (navigator.share) {
            try {
                await navigator.share({
                    title: '포켓몬 30주년 기념 뽑기',
                    text: text,
                    url: url
                });
            } catch (err) {
                console.log('공유 취소됨 또는 실패:', err);
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            try {
                await navigator.clipboard.writeText(text);
                alert('뽑기 결과가 클립보드에 복사되었습니다! 친구들에게 공유해보세요.');
            } catch (err) {
                alert('클립보드 복사에 실패했습니다.');
            }
        }
    });

    function drawPokemon() {
        isDrawing = true;
        drawBtn.disabled = true;
        actionButtons.classList.add('hidden');

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

            // Get Korean Name
            const koName = pokemonNames[randomId] || '알 수 없음';

            revealPokemon(imagePath, randomId, koName);
        }, 1500); // 1.5 seconds of tension
    }

    function revealPokemon(imagePath, id, name) {
        // Preload image to avoid pop-in while card flips
        const img = new Image();
        img.onload = () => {
            // Stop shaking
            card.classList.remove('shaking');

            // Update state
            currentId = id;
            currentName = name;
            currentImgPath = imagePath;

            // Update card DOM
            pokemonImage.src = imagePath;
            pokemonNumberText.innerText = `No. ${String(id).padStart(3, '0')}`;
            pokemonNameText.innerText = name;

            // Trigger flip animation
            requestAnimationFrame(() => {
                card.classList.add('flipped');
                actionButtons.classList.remove('hidden');

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
            actionButtons.classList.add('hidden');
            alert(`앗! No. ${id} 이미지를 찾을 수 없습니다. 다운로드 스크립트가 완료되었는지 확인해주세요.`);
        };

        // Start preloading
        img.src = imagePath;
    }
});
