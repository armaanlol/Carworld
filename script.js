// script.js - Unified Gallery, Lightbox, and Mobile Swipe

document.addEventListener('DOMContentLoaded', function () {
    
    // --- 1. Mobile Menu Toggle ---
    const toggleButton = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (toggleButton && mobileMenu) {
        toggleButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- 2. Image Gallery & Lightbox Logic ---
    const mainImage = document.getElementById('main-car-image');
    const prevButton = document.getElementById('prev-image');
    const nextButton = document.getElementById('next-image');
    
    // Lightbox Elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    if (mainImage) {
        const totalImages = 10;
        let currentImageIndex = 1;

        // Extract prefix (e.g., 's350', 's580el-a') from src
        // Matches anything between 'images/' and '-Number.jpg'
        function getCarPrefix(src) {
            const match = src.match(/images\/(.+)-\d+\.jpg/);
            return match ? match[1] : null;
        }

        const carPrefix = getCarPrefix(mainImage.src);

        // Initialize index based on current image
        if (carPrefix) {
            const initialIndexMatch = mainImage.src.match(/-(\d+)\.jpg/);
            currentImageIndex = initialIndexMatch ? parseInt(initialIndexMatch[1]) : 1;
        }

        // --- Core Update Function ---
        function updateImage(newIndex) {
            if (!carPrefix) return;

            // Loop logic
            if (newIndex < 1) newIndex = totalImages;
            if (newIndex > totalImages) newIndex = 1;
            
            currentImageIndex = newIndex;
            const newSrc = `images/${carPrefix}-${currentImageIndex}.jpg`;

            // Update Main Image
            mainImage.src = newSrc;
            
            // Update Lightbox Image if open
            if (lightbox && !lightbox.classList.contains('hidden')) {
                lightboxImg.src = newSrc;
            }

            // Update Thumbnails
            document.querySelectorAll('.thumbnail').forEach(img => {
                img.classList.remove('border-2', 'border-cw-blue/50', 'active-thumb');
                
                // Check if this thumbnail matches the current index
                // We use includes() because src might be absolute
                if (img.src.includes(`${carPrefix}-${currentImageIndex}.jpg`)) {
                    img.classList.add('border-2', 'border-cw-blue/50', 'active-thumb');
                }
            });
        }

        // --- Event Listeners (Main Gallery) ---
        if (prevButton) prevButton.addEventListener('click', (e) => { e.stopPropagation(); updateImage(currentImageIndex - 1); });
        if (nextButton) nextButton.addEventListener('click', (e) => { e.stopPropagation(); updateImage(currentImageIndex + 1); });

        // Thumbnails
        document.querySelectorAll('.thumbnail, .grid.grid-cols-5 img').forEach(img => {
            img.classList.add('thumbnail'); // Ensure class exists
            img.onclick = function() {
                const parts = this.src.match(/-(\d+)\.jpg/);
                const index = parts ? parseInt(parts[1]) : 1;
                updateImage(index);
            };
        });

        // --- Lightbox Functionality ---
        if (lightbox && lightboxImg) {
            // Open Lightbox on Main Image Click
            mainImage.style.cursor = 'zoom-in';
            mainImage.addEventListener('click', () => {
                lightboxImg.src = mainImage.src;
                lightbox.classList.remove('hidden');
                lightbox.classList.add('flex');
            });

            // Close Lightbox
            function closeLightbox() {
                lightbox.classList.add('hidden');
                lightbox.classList.remove('flex');
            }
            if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
            
            // Close on clicking background (but not image)
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });

            // Lightbox Navigation
            if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); updateImage(currentImageIndex - 1); });
            if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); updateImage(currentImageIndex + 1); });
        }

        // --- Swipe Gestures (Mobile) ---
        let touchStartX = 0;
        let touchEndX = 0;

        function handleSwipe() {
            const threshold = 50; // Min distance to be considered a swipe
            if (touchEndX < touchStartX - threshold) {
                // Swipe Left -> Next Image
                updateImage(currentImageIndex + 1);
            }
            if (touchEndX > touchStartX + threshold) {
                // Swipe Right -> Prev Image
                updateImage(currentImageIndex - 1);
            }
        }

        // Add swipe to Main Image
        mainImage.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; });
        mainImage.addEventListener('touchend', e => { touchEndX = e.changedTouches[0].screenX; handleSwipe(); });

        // Add swipe to Lightbox Image
        if (lightboxImg) {
            lightboxImg.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; });
            lightboxImg.addEventListener('touchend', e => { touchEndX = e.changedTouches[0].screenX; handleSwipe(); });
        }

        // --- Keyboard Navigation ---
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') updateImage(currentImageIndex - 1);
            if (e.key === 'ArrowRight') updateImage(currentImageIndex + 1);
            if (e.key === 'Escape' && lightbox) {
                lightbox.classList.add('hidden');
                lightbox.classList.remove('flex');
            }
        });

        // Initialize Highlight
        updateImage(currentImageIndex);
    }
});