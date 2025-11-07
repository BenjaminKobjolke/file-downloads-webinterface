/**
 * State Management
 * Global application state
 */
const AppState = {
    // Sorting state
    currentSort: 'name',
    sortDirection: 'asc',

    // Refresh state
    refreshInterval: null,
    countdownInterval: null,
    remainingSeconds: 30,
    refreshIntervalSeconds: 30,  // Configurable refresh interval

    // Notification state
    notificationsEnabled: false,
    notificationSoundPath: null,
    playNotificationSound: null,
    hasLoadedOnce: false,

    // Getters
    getCurrentSort() {
        return this.currentSort;
    },

    getSortDirection() {
        return this.sortDirection;
    },

    getRemainingSeconds() {
        return this.remainingSeconds;
    },

    // Setters
    setCurrentSort(sort) {
        this.currentSort = sort;
    },

    setSortDirection(direction) {
        this.sortDirection = direction;
    },

    setRemainingSeconds(seconds) {
        this.remainingSeconds = seconds;
    },

    // Interval management
    setRefreshInterval(interval) {
        this.refreshInterval = interval;
    },

    setCountdownInterval(interval) {
        this.countdownInterval = interval;
    },

    clearIntervals() {
        if (this.refreshInterval) clearInterval(this.refreshInterval);
        if (this.countdownInterval) clearInterval(this.countdownInterval);
    }
};
