/**
 * Storage Management
 * Handles localStorage operations for user preferences
 */
const StorageManager = {
    KEYS: {
        SORT_TYPE: 'apk_sort_type',
        SORT_DIRECTION: 'apk_sort_direction',
        NOTIFIED_FILES: 'apk_notified_files'
    },

    /**
     * Load sort preferences from localStorage
     */
    loadSortPreferences() {
        const savedSort = localStorage.getItem(this.KEYS.SORT_TYPE);
        const savedDirection = localStorage.getItem(this.KEYS.SORT_DIRECTION);

        if (savedSort) {
            AppState.setCurrentSort(savedSort);
        }
        if (savedDirection) {
            AppState.setSortDirection(savedDirection);
        }
    },

    /**
     * Save sort preferences to localStorage
     */
    saveSortPreferences() {
        localStorage.setItem(this.KEYS.SORT_TYPE, AppState.getCurrentSort());
        localStorage.setItem(this.KEYS.SORT_DIRECTION, AppState.getSortDirection());
    },

    /**
     * Clear all preferences
     */
    clearPreferences() {
        localStorage.removeItem(this.KEYS.SORT_TYPE);
        localStorage.removeItem(this.KEYS.SORT_DIRECTION);
    },

    /**
     * Get notified files (files that have already triggered notifications)
     * Returns object with filename as key and timestamp as value
     */
    getNotifiedFiles() {
        const stored = localStorage.getItem(this.KEYS.NOTIFIED_FILES);
        return stored ? JSON.parse(stored) : {};
    },

    /**
     * Save notified files to localStorage
     */
    saveNotifiedFiles(notifiedFiles) {
        localStorage.setItem(this.KEYS.NOTIFIED_FILES, JSON.stringify(notifiedFiles));
    },

    /**
     * Check if a file should trigger a notification
     * Returns true if:
     * - File is new (never seen before)
     * - File timestamp has changed (file was reuploaded)
     */
    shouldNotify(filename, timestamp) {
        const notifiedFiles = this.getNotifiedFiles();
        const lastNotified = notifiedFiles[filename];

        // Never seen this file before
        if (lastNotified === undefined) {
            return true;
        }

        // File timestamp changed (reuploaded/modified)
        if (lastNotified !== timestamp) {
            return true;
        }

        // Same file, same timestamp - no notification
        return false;
    },

    /**
     * Mark a file as notified
     */
    markAsNotified(filename, timestamp) {
        const notifiedFiles = this.getNotifiedFiles();
        notifiedFiles[filename] = timestamp;
        this.saveNotifiedFiles(notifiedFiles);
    },

    /**
     * Clear notification history (for testing/debugging)
     */
    clearNotificationHistory() {
        localStorage.removeItem(this.KEYS.NOTIFIED_FILES);
    }
};
