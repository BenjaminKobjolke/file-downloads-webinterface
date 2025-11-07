/**
 * Main Application Entry Point
 * Initializes all modules and handles application lifecycle
 */

/**
 * Initialize refresh interval from config
 */
function initializeRefreshInterval() {
    const refreshInterval = parseInt(document.body.dataset.refreshInterval);
    if (refreshInterval && refreshInterval > 0) {
        AppState.refreshIntervalSeconds = refreshInterval;
        AppState.remainingSeconds = refreshInterval;
    }
}

/**
 * Initialize notification system
 */
function initializeNotifications() {
    // Get config from body data attributes
    const notificationsEnabled = document.body.dataset.notificationsEnabled === 'true';
    const soundPath = document.body.dataset.notificationSound;

    AppState.notificationsEnabled = notificationsEnabled;
    AppState.notificationSoundPath = soundPath;

    // Create audio element if notifications enabled
    if (notificationsEnabled && soundPath) {
        const audio = new Audio(soundPath);
        audio.volume = 0.5; // 50% volume

        // Set up sound player function
        AppState.playNotificationSound = function() {
            audio.currentTime = 0; // Reset to start
            audio.play().catch(error => {
                console.warn('Could not play notification sound:', error);
            });
        };

        // Preload the sound
        audio.load();

        // Set up auto-unlock on first interaction
        setupAudioUnlock(audio);
    }
}

/**
 * Setup audio unlock on first user interaction
 */
function setupAudioUnlock(audio) {
    const banner = document.getElementById('notification-banner');
    if (!banner) return;

    // Check if already unlocked
    const audioUnlocked = localStorage.getItem('audio_unlocked') === 'true';
    if (audioUnlocked) {
        // Hide banner immediately if already unlocked
        banner.classList.add('hidden');
        return;
    }

    // Function to unlock audio and hide banner
    const unlockAudio = function() {
        // Play muted audio to unlock browser audio context
        const originalVolume = audio.volume;
        audio.volume = 0;
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
            audio.volume = originalVolume;
        }).catch(error => {
            console.warn('Audio unlock failed:', error);
        });

        // Hide banner with animation
        banner.classList.add('hidden');

        // Save to localStorage
        localStorage.setItem('audio_unlocked', 'true');

        // Remove all event listeners
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
        document.removeEventListener('keydown', unlockAudio);
    };

    // Listen for ANY interaction
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });
    document.addEventListener('keydown', unlockAudio, { once: true });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize refresh interval from config
    initializeRefreshInterval();

    // Initialize notification system
    initializeNotifications();

    // Load user preferences
    StorageManager.loadSortPreferences();

    // Initialize UI components
    UIManager.initializeBurgerMenu();
    UIManager.initializeSortButtons();

    // Start auto-refresh
    RefreshManager.start();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    AppState.clearIntervals();
});
