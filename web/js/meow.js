let autoRefreshEnabled = true;
let refreshInterval = 3000; // milliseconds (3 seconds)
let refreshTimer;

const image = document.getElementById('canvas-image');
const statusEle = document.getElementById('status');
const toggleBtn = document.getElementById('toggle-auto');
const intervalInput = document.getElementById('refresh-interval');

function refreshImage() {
    if (!autoRefreshEnabled) return;
    
    // Refresh the image with a timestamp to bypass cache :3
    const timestamp = new Date().getTime();
    image.src = `latest.png?t=${timestamp}`;
}

function forceRefresh() {
    const timestamp = new Date().getTime();
    image.src = `latest.png?t=${timestamp}`;
    statusEle.className = 'status';
}

function toggleAutoRefresh() {
    autoRefreshEnabled = !autoRefreshEnabled;
    
    if (autoRefreshEnabled) {
        toggleBtn.textContent = 'Pause auto-refreshing';
        startAutoRefresh();
        statusEle.textContent = 'Auto-refreshing enabled';
    } else {
        toggleBtn.textContent = 'Resume auto-refreshing';
        stopAutoRefresh();
        statusEle.textContent = 'Auto-refreshing paused';
    }
    statusEle.className = 'status';
}

function updateRefreshInterval() {
    refreshInterval = parseFloat(intervalInput.value) * 1000;
    if (autoRefreshEnabled) {
        stopAutoRefresh();
        startAutoRefresh();
    }
}

function startAutoRefresh() {
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = setInterval(refreshImage, refreshInterval);
}

function stopAutoRefresh() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
    }
}

// Handle image load events
image.onload = function() {
    statusEle.textContent = `Image refreshed at ${new Date().toLocaleTimeString()}`;
    statusEle.className = 'status';
};

image.onerror = function() {
    statusEle.textContent = 'Failed to load image - make sure latest.png exists';
    statusEle.className = 'status error';
};

// Initialize
startAutoRefresh();
refreshImage(); // Initial load

// Handle page visibility changes to pause/resume when tab is hidden
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopAutoRefresh();
    } else if (autoRefreshEnabled) {
        startAutoRefresh();
        refreshImage();
    }
});