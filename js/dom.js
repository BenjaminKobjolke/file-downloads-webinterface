/**
 * DOM Management
 * Handles DOM manipulation, card creation and updates
 */
const DOMManager = {

    /**
     * Update the file list in DOM
     */
    updateFileList(files) {
        const appList = document.getElementById('app-list');
        if (!appList) return;

        // Check if there's an error state
        if (files && files.error === true) {
            appList.innerHTML = `
                <div class="error-state">
                    <div class="error-icon">⚠️</div>
                    <h2>${this.escapeHtml(files.message)}</h2>
                    <p class="error-path">Path: <code>${this.escapeHtml(files.path)}</code></p>
                    <p class="error-suggestion">${this.escapeHtml(files.suggestion)}</p>
                    <p class="error-config">Check your <code>config.php</code> file to update the source folder.</p>
                </div>
            `;
            return;
        }

        if (!files || files.length === 0) {
            appList.innerHTML = '<div class="empty-state">No files found in the source folder</div>';
            return;
        }

        // Create a map of existing cards
        const existingCards = new Map();
        appList.querySelectorAll('.app-card').forEach(card => {
            const name = card.dataset.name;
            existingCards.set(name, card);
        });

        // Create a map of new files
        const newFiles = new Map(files.map(file => [file.name.toLowerCase(), file]));

        // Remove cards that no longer exist
        existingCards.forEach((card, name) => {
            if (!newFiles.has(name)) {
                card.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => card.remove(), 300);
            }
        });

        // Update or add new cards
        files.forEach(file => {
            const name = file.name.toLowerCase();
            const existingCard = existingCards.get(name);

            if (existingCard) {
                // Update existing card if modified time changed
                const currentDate = existingCard.dataset.date;
                if (currentDate !== file.modified.toString()) {
                    this.updateCard(existingCard, file);
                }
            } else {
                // Add new card
                const newCard = this.createCard(file);
                appList.appendChild(newCard);
            }
        });

        // Re-apply current sort
        Sorter.sortAppList();
    },

    /**
     * Create a new card element
     */
    createCard(file) {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.dataset.name = file.name.toLowerCase();
        card.dataset.size = file.size;
        card.dataset.date = file.modified;

        const relativeTime = this.formatRelativeTime(file.modified);
        const fullDateTime = this.getFullDateTime(file.modified);

        card.innerHTML = `
            <div class="app-icon">📦</div>
            <div class="app-info">
                <h2 class="app-name">${this.escapeHtml(file.name)}</h2>
                <div class="app-meta">
                    <span class="meta-item">
                        <span class="meta-icon">💾</span>
                        <span class="meta-value">${this.formatFileSize(file.size)}</span>
                    </span>
                    <span class="meta-item">
                        <span class="meta-icon">📅</span>
                        <span class="meta-value relative-time" title="${fullDateTime}">${relativeTime}</span>
                    </span>
                </div>
            </div>
            <a href="${this.escapeHtml(file.url)}" class="download-btn" download>
                <span class="download-icon">⬇️</span>
                <span class="download-text">Download</span>
            </a>
        `;

        return card;
    },

    /**
     * Update existing card
     */
    updateCard(card, file) {
        card.dataset.size = file.size;
        card.dataset.date = file.modified;

        const relativeTime = this.formatRelativeTime(file.modified);
        const fullDateTime = this.getFullDateTime(file.modified);

        // Update size
        const sizeElement = card.querySelector('.meta-value');
        if (sizeElement) {
            sizeElement.textContent = this.formatFileSize(file.size);
        }

        // Update date
        const metaItems = card.querySelectorAll('.meta-item');
        if (metaItems[1]) {
            const dateElement = metaItems[1].querySelector('.meta-value');
            if (dateElement) {
                dateElement.textContent = relativeTime;
                dateElement.setAttribute('title', fullDateTime);
            }
        }

        // Highlight updated card
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = 'fadeIn 0.3s ease';
        }, 10);
    },

    /**
     * Update all relative times on the page
     */
    updateAllRelativeTimes() {
        const cards = document.querySelectorAll('.app-card');
        cards.forEach(card => {
            const timestamp = parseInt(card.dataset.date);
            if (timestamp) {
                const relativeTime = this.formatRelativeTime(timestamp);
                const fullDateTime = this.getFullDateTime(timestamp);

                const metaItems = card.querySelectorAll('.meta-item');
                if (metaItems[1]) {
                    const dateElement = metaItems[1].querySelector('.meta-value');
                    if (dateElement) {
                        dateElement.textContent = relativeTime;
                        dateElement.setAttribute('title', fullDateTime);
                    }
                }
            }
        });
    },

    /**
     * Format file size
     */
    formatFileSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let i = 0;
        let size = bytes;

        while (size >= 1024 && i < units.length - 1) {
            size /= 1024;
            i++;
        }

        return `${size.toFixed(1)} ${units[i]}`;
    },

    /**
     * Format date
     */
    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    },

    /**
     * Format time
     */
    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    },

    /**
     * Format relative time (e.g., "5 minutes ago")
     */
    formatRelativeTime(timestamp) {
        const now = Math.floor(Date.now() / 1000);
        const diff = now - timestamp;

        // Handle future dates
        if (diff < 0) {
            return 'just now';
        }

        // Less than 60 seconds
        if (diff < 60) {
            return diff === 1 ? '1 second ago' : `${diff} seconds ago`;
        }

        // Less than 60 minutes
        const minutes = Math.floor(diff / 60);
        if (minutes < 60) {
            return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
        }

        // Less than 24 hours
        const hours = Math.floor(diff / 3600);
        if (hours < 24) {
            return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
        }

        // Less than 7 days
        const days = Math.floor(diff / 86400);
        if (days < 7) {
            return days === 1 ? '1 day ago' : `${days} days ago`;
        }

        // Less than 4 weeks
        const weeks = Math.floor(days / 7);
        if (weeks < 4) {
            return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
        }

        // Less than 12 months
        const months = Math.floor(days / 30);
        if (months < 12) {
            return months === 1 ? '1 month ago' : `${months} months ago`;
        }

        // 12 months or more
        const years = Math.floor(days / 365);
        return years === 1 ? '1 year ago' : `${years} years ago`;
    },

    /**
     * Get full date/time string for tooltip
     */
    getFullDateTime(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    },

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Add fadeOut animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(style);
