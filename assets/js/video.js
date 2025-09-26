document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.dcp-video-track');
    const prevBtn = document.querySelector('.dcp-prev-btn');
    const nextBtn = document.querySelector('.dcp-next-btn');
    const videoContainer = document.querySelector('.dcp-video-slider');

    const videos = Array.from(document.querySelectorAll('.dcp-video-item'));
    const videoCount = videos.length;
    let currentIndex = 0;
    let isTransitioning = false;
    let interval;

    // Clone videos to create an infinite loop effect
    videos.forEach(video => {
        const clone = video.parentElement.cloneNode(true);
        track.appendChild(clone);
    });

    // Update the position of the slider
    const updateSliderPosition = () => {
        const offset = -currentIndex * (100 / videoCount);
        track.style.transform = `translateX(${offset}%)`;
    };

    // Auto-scroll functionality
    const startAutoScroll = () => {
        interval = setInterval(() => {
            if (isTransitioning) return;
            isTransitioning = true;
            currentIndex++;
            
            track.style.transition = 'transform 0.5s ease-in-out';
            updateSliderPosition();
        }, 5000); // Adjust this value to change the scroll speed
    };

    const stopAutoScroll = () => {
        clearInterval(interval);
    };

    // Handle transition end for the infinite loop
    track.addEventListener('transitionend', () => {
        isTransitioning = false;
        // Reset the position instantly after the last cloned video
        if (currentIndex >= videoCount) {
            track.style.transition = 'none';
            currentIndex = 0;
            updateSliderPosition();
        }
    });

    // Navigation buttons
    nextBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        stopAutoScroll();
        track.style.transition = 'transform 0.5s ease-in-out';
        currentIndex++;
        updateSliderPosition();
    });

    prevBtn.addEventListener('click', () => {
        if (isTransitioning) return;
        stopAutoScroll();
        // Handle rewind by jumping to the last clone
        if (currentIndex === 0) {
            track.style.transition = 'none';
            currentIndex = videoCount;
            updateSliderPosition();
            // Force a repaint before the next transition
            track.offsetHeight;
        }
        track.style.transition = 'transform 0.5s ease-in-out';
        currentIndex--;
        updateSliderPosition();
    });

    // Pause auto-scroll on hover
    videoContainer.addEventListener('mouseenter', stopAutoScroll);
    videoContainer.addEventListener('mouseleave', startAutoScroll);

    // Initial setup
    startAutoScroll();
    updateSliderPosition();
});