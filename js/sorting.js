/**
 * Sorting Logic
 * Handles sorting of APK file cards
 */
const Sorter = {

    /**
     * Sort the app list based on current sort type and direction
     */
    sortAppList() {
        const appList = document.getElementById('app-list');
        if (!appList) return;

        const cards = Array.from(appList.querySelectorAll('.app-card'));

        // Sort cards based on current sort type
        cards.sort((a, b) => {
            return this.compareCards(a, b, AppState.getCurrentSort(), AppState.getSortDirection());
        });

        // Fade out effect
        appList.style.opacity = '0.5';

        // Reorder DOM elements
        setTimeout(() => {
            cards.forEach(card => appList.appendChild(card));
            appList.style.opacity = '1';
        }, 150);
    },

    /**
     * Compare two cards for sorting
     */
    compareCards(a, b, sortType, direction) {
        let valueA, valueB;

        switch (sortType) {
            case 'name':
                valueA = a.dataset.name;
                valueB = b.dataset.name;
                return direction === 'asc'
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);

            case 'date':
                valueA = parseInt(a.dataset.date);
                valueB = parseInt(b.dataset.date);
                return direction === 'asc'
                    ? valueA - valueB
                    : valueB - valueA;

            case 'size':
                valueA = parseInt(a.dataset.size);
                valueB = parseInt(b.dataset.size);
                return direction === 'asc'
                    ? valueA - valueB
                    : valueB - valueA;

            default:
                return 0;
        }
    }
};
