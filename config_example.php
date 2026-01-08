<?php
/**
 * Application Configuration
 * Centralized settings for the APK/File Download Manager
 */

// File types to scan and display (array of extensions)
// Examples: ['apk'], ['apk', 'pdf'], ['zip', 'exe', 'apk']
define('CONFIG_FILE_TYPES', ['apk']);

// Source folder to scan for files
// Can be relative to the app root or absolute path
// Examples:
//   __DIR__                   - App root directory (default)
//   __DIR__ . '/downloads'    - Subfolder 'downloads'
//   'D:/Downloads'            - Absolute path
define('CONFIG_SOURCE_FOLDER', __DIR__ . '/downloads');

// Authentication (handled by benjaminkobjolke/php-simple-login)
// Change this to your desired password
define('SIMPLE_LOGIN_PASSWORD', 'your-password-here');

// Optional: Redirect URL after successful login (default: same page)
// define('SIMPLE_LOGIN_REDIRECT', '/dashboard.php');

// Sound notifications for new uploads
// Set to true to play a sound when new files are uploaded or modified
define('CONFIG_ENABLE_NOTIFICATIONS', false);

// Path to notification sound file (relative to app root)
// Place your sound file (MP3, WAV, OGG) in the assets folder
// Example: 'assets/newupload.mp3'
define('CONFIG_NOTIFICATION_SOUND', 'assets/newupload.mp3');

// Auto-refresh interval (in seconds)
// How often the page checks for new/modified files
// Examples: 15, 30, 60, 120
define('CONFIG_REFRESH_INTERVAL', 30);
