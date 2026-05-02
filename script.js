window.addEventListener('load', function() {
    const loadOverlay = document.getElementById('load-overlay');
    if (loadOverlay) {
        loadOverlay.classList.add('hide');
    }
});

function openStartOverlay() {
    const startOverlay = document.getElementById('start-overlay');
    if (startOverlay) {
        startOverlay.classList.add('open');
    }
}
