<?php
/**
 * Helper Functions
 * Utility functions for formatting and data manipulation
 */

/**
 * Format file size in human-readable format
 *
 * @param int $bytes
 * @return string
 */
function formatFileSize($bytes) {
    $units = ['B', 'KB', 'MB', 'GB'];
    $i = 0;
    while ($bytes >= 1024 && $i < count($units) - 1) {
        $bytes /= 1024;
        $i++;
    }
    return round($bytes, 1) . ' ' . $units[$i];
}

/**
 * Escape HTML to prevent XSS
 *
 * @param string $text
 * @return string
 */
function escapeHtml($text) {
    return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
}

/**
 * Format timestamp as relative time (e.g., "5 minutes ago")
 *
 * @param int $timestamp Unix timestamp
 * @return string
 */
function formatRelativeTime($timestamp) {
    $now = time();
    $diff = $now - $timestamp;

    // Handle future dates
    if ($diff < 0) {
        return 'just now';
    }

    // Less than 60 seconds
    if ($diff < 60) {
        return $diff === 1 ? '1 second ago' : "$diff seconds ago";
    }

    // Less than 60 minutes
    $minutes = floor($diff / 60);
    if ($minutes < 60) {
        return $minutes === 1 ? '1 minute ago' : "$minutes minutes ago";
    }

    // Less than 24 hours
    $hours = floor($diff / 3600);
    if ($hours < 24) {
        return $hours === 1 ? '1 hour ago' : "$hours hours ago";
    }

    // Less than 7 days
    $days = floor($diff / 86400);
    if ($days < 7) {
        return $days === 1 ? '1 day ago' : "$days days ago";
    }

    // Less than 4 weeks
    $weeks = floor($days / 7);
    if ($weeks < 4) {
        return $weeks === 1 ? '1 week ago' : "$weeks weeks ago";
    }

    // Less than 12 months
    $months = floor($days / 30);
    if ($months < 12) {
        return $months === 1 ? '1 month ago' : "$months months ago";
    }

    // 12 months or more
    $years = floor($days / 365);
    return $years === 1 ? '1 year ago' : "$years years ago";
}

/**
 * Get full date/time string for tooltip
 *
 * @param int $timestamp Unix timestamp
 * @return string
 */
function getFullDateTime($timestamp) {
    return date('M j, Y, H:i', $timestamp);
}
