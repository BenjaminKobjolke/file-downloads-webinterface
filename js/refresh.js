/**
 * Auto-Refresh & Countdown
 * Handles automatic file list refresh and countdown timer
 */
const RefreshManager = {
    COUNTDOWN_INTERVAL: 1000, // 1 second

    /**
     * Start auto-refresh functionality
     */
    start() {
        // Initial countdown
        this.startCountdown();

        // Refresh at configured interval
        const refreshInterval = setInterval(() => {
            this.refreshFileList();
        }, AppState.refreshIntervalSeconds * 1000);

        AppState.setRefreshInterval(refreshInterval);
    },

    /**
     * Start countdown timer
     */
    startCountdown() {
        AppState.setRemainingSeconds(AppState.refreshIntervalSeconds);
        this.updateCountdownDisplay();

        const countdownInterval = setInterval(() => {
            const remaining = AppState.getRemainingSeconds() - 1;
            AppState.setRemainingSeconds(remaining);
            this.updateCountdownDisplay();

            if (remaining <= 0) {
                AppState.setRemainingSeconds(AppState.refreshIntervalSeconds);
            }
        }, this.COUNTDOWN_INTERVAL);

        AppState.setCountdownInterval(countdownInterval);
    },

    /**
     * Update countdown display (both timer badge and footer)
     */
    updateCountdownDisplay() {
        const remaining = AppState.getRemainingSeconds();

        // Update timer badge in header
        const timerElement = document.getElementById('refresh-timer');
        if (timerElement) {
            timerElement.textContent = `${remaining}s`;
        }

        // Update live countdown in footer
        const nextRefreshElement = document.getElementById('next-refresh');
        if (nextRefreshElement) {
            nextRefreshElement.textContent = `${remaining}s`;
        }

        // Update all relative times every second
        DOMManager.updateAllRelativeTimes();
    },

    /**
     * Refresh file list from server
     */
    async refreshFileList() {
        try {
            const response = await fetch('?api=files');

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const files = await response.json();

            // Check for new/modified files and trigger notifications
            this.checkForNewFiles(files);

            DOMManager.updateFileList(files);
            this.updateLastUpdateTime();

            // Reset countdown
            AppState.setRemainingSeconds(AppState.refreshIntervalSeconds);
        } catch (error) {
            console.error('Error refreshing file list:', error);
        }
    },

    /**
     * Check for new or modified files and trigger notifications
     */
    checkForNewFiles(files) {
        // Skip if notifications disabled or files is error state
        if (!AppState.notificationsEnabled || !files || files.error) {
            return;
        }

        // Skip on first load (prevent notifications when page first opens)
        if (!AppState.hasLoadedOnce) {
            // Mark all current files as notified (don't notify on initial load)
            files.forEach(file => {
                StorageManager.markAsNotified(file.name, file.modified);
            });
            AppState.hasLoadedOnce = true;
            return;
        }

        // Check each file for notifications
        let hasNewFiles = false;
        files.forEach(file => {
            if (StorageManager.shouldNotify(file.name, file.modified)) {
                hasNewFiles = true;
                StorageManager.markAsNotified(file.name, file.modified);
            }
        });

        // Play notification sound if there are new/modified files
        if (hasNewFiles && AppState.playNotificationSound) {
            AppState.playNotificationSound();
        }
    },

    /**
     * Update last update time in footer
     */
    updateLastUpdateTime() {
        const lastUpdateElement = document.getElementById('last-update');
        if (lastUpdateElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            lastUpdateElement.textContent = timeString;
        }
    }
};
