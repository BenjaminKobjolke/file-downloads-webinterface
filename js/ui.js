/**
 * UI Management
 * Handles burger menu and sort controls initialization
 */
const UIManager = {

    /**
     * Initialize burger menu
     */
    initializeBurgerMenu() {
        const burgerMenu = document.getElementById('burger-menu');
        const controls = document.getElementById('controls');

        if (!burgerMenu || !controls) return;

        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('active');
            controls.classList.toggle('show');
        });
    },

    /**
     * Initialize sort buttons
     */
    initializeSortButtons() {
        const sortButtons = document.querySelectorAll('.sort-btn');

        // Restore saved sorting state
        sortButtons.forEach(btn => {
            if (btn.dataset.sort === AppState.getCurrentSort()) {
                btn.classList.add('active');
                this.updateButtonLabel(btn, AppState.getCurrentSort(), AppState.getSortDirection());
            } else {
                btn.classList.remove('active');
                // Reset label to default
                const defaultLabels = {
                    name: 'Name',
                    date: 'Date',
                    size: 'Size'
                };
                const labelElement = btn.querySelector('.label');
                if (labelElement && !btn.classList.contains('active')) {
                    labelElement.textContent = defaultLabels[btn.dataset.sort];
                }
            }
        });

        // Apply initial sort based on saved preferences
        Sorter.sortAppList();

        // Add click listeners
        sortButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleSortClick(button, sortButtons);
            });
        });
    },

    /**
     * Handle sort button click
     */
    handleSortClick(button, allButtons) {
        const sortType = button.dataset.sort;

        // Toggle direction if clicking the same button
        if (AppState.getCurrentSort() === sortType) {
            const newDirection = AppState.getSortDirection() === 'asc' ? 'desc' : 'asc';
            AppState.setSortDirection(newDirection);
        } else {
            AppState.setCurrentSort(sortType);
            AppState.setSortDirection('asc');
        }

        // Update active state
        allButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update button text to show direction
        this.updateButtonLabel(button, sortType, AppState.getSortDirection());

        // Save preferences
        StorageManager.saveSortPreferences();

        // Sort the list
        Sorter.sortAppList();
    },

    /**
     * Update button label to show sort direction
     */
    updateButtonLabel(button, sortType, direction) {
        const labels = {
            name: direction === 'asc' ? 'A → Z' : 'Z → A',
            date: direction === 'asc' ? 'Oldest' : 'Newest',
            size: direction === 'asc' ? 'Smallest' : 'Largest'
        };

        const labelElement = button.querySelector('.label');
        if (labelElement) {
            labelElement.textContent = labels[sortType];
        }
    }
};
