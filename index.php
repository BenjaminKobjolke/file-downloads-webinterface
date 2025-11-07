<?php
/**
 * APK Download Manager
 * Front Controller
 */

// Load configuration first
require_once __DIR__ . '/config.php';

// Load dependencies
require_once __DIR__ . '/includes/Session.php';
require_once __DIR__ . '/includes/FileScanner.php';
require_once __DIR__ . '/includes/AuthController.php';
require_once __DIR__ . '/includes/helpers.php';

// Initialize session
Session::start();

// Handle authentication requests
AuthController::handleLogin();
AuthController::handleLogout();

// Check authentication status
$isLoggedIn = Session::isAuthenticated();

// API endpoint for fetching files
if (isset($_GET['api']) && $_GET['api'] === 'files') {
    if (!$isLoggedIn) {
        http_response_code(401);
        exit;
    }
    header('Content-Type: application/json');
    $scanner = new FileScanner();
    echo json_encode($scanner->getFiles());
    exit;
}

// Get files for initial page load
$scanner = new FileScanner();
$files = $scanner->getFiles();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta name="theme-color" content="#1a1a1a">
    <title>APK Downloads</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body data-notifications-enabled="<?= CONFIG_ENABLE_NOTIFICATIONS ? 'true' : 'false' ?>" data-notification-sound="<?= escapeHtml(CONFIG_NOTIFICATION_SOUND) ?>" data-refresh-interval="<?= CONFIG_REFRESH_INTERVAL ?>">
    <?php if (!$isLoggedIn): ?>
    <!-- Login Form -->
    <div class="login-overlay">
        <div class="login-container">
            <div class="login-icon">🔒</div>
            <h2>Enter Password</h2>
            <form method="POST" action="">
                <input type="password" name="password" placeholder="Password" autocomplete="off" autofocus required>
                <button type="submit">Login</button>
            </form>
        </div>
    </div>
    <?php else: ?>
    <!-- Main App -->
    <div class="container">
        <header>
            <button class="burger-menu" id="burger-menu" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <div class="controls" id="controls">
                <div class="sort-controls">
                    <button class="sort-btn active" data-sort="name" title="Sort by name">
                        <span class="icon">📝</span>
                        <span class="label">Name</span>
                    </button>
                    <button class="sort-btn" data-sort="date" title="Sort by date">
                        <span class="icon">📅</span>
                        <span class="label">Date</span>
                    </button>
                    <button class="sort-btn" data-sort="size" title="Sort by size">
                        <span class="icon">💾</span>
                        <span class="label">Size</span>
                    </button>
                </div>
                <div class="status">
                    <span class="auto-refresh-indicator">🔄 Auto-refresh: <span id="refresh-timer">30s</span></span>
                </div>
            </div>
        </header>

        <?php if (CONFIG_ENABLE_NOTIFICATIONS): ?>
        <!-- Sound Notification Banner -->
        <div id="notification-banner" class="notification-banner">
            <span class="notification-icon">🔊</span>
            <span class="notification-text">Click anywhere to enable sound notifications</span>
        </div>
        <?php endif; ?>

        <main>
            <div id="app-list" class="app-list">
                <?php
                // Check if there's an error state
                if (isset($files['error']) && $files['error'] === true) {
                    ?>
                    <div class="error-state">
                        <div class="error-icon">⚠️</div>
                        <h2><?= escapeHtml($files['message']) ?></h2>
                        <p class="error-path">Path: <code><?= escapeHtml($files['path']) ?></code></p>
                        <p class="error-suggestion"><?= escapeHtml($files['suggestion']) ?></p>
                        <p class="error-config">Check your <code>config.php</code> file to update the source folder.</p>
                    </div>
                    <?php
                } elseif (empty($files)) {
                    echo '<div class="empty-state">No files found in the source folder</div>';
                } else {
                    foreach ($files as $file) {
                        $name = escapeHtml($file['name']);
                        $size = formatFileSize($file['size']);
                        $relativeTime = formatRelativeTime($file['modified']);
                        $fullDateTime = getFullDateTime($file['modified']);
                        ?>
                        <div class="app-card" data-name="<?= strtolower($name) ?>" data-size="<?= $file['size'] ?>" data-date="<?= $file['modified'] ?>">
                            <div class="app-icon">📦</div>
                            <div class="app-info">
                                <h2 class="app-name"><?= $name ?></h2>
                                <div class="app-meta">
                                    <span class="meta-item">
                                        <span class="meta-icon">💾</span>
                                        <span class="meta-value"><?= $size ?></span>
                                    </span>
                                    <span class="meta-item">
                                        <span class="meta-icon">📅</span>
                                        <span class="meta-value relative-time" title="<?= $fullDateTime ?>"><?= $relativeTime ?></span>
                                    </span>
                                </div>
                            </div>
                            <a href="<?= escapeHtml($file['url']) ?>" class="download-btn" download>
                                <span class="download-icon">⬇️</span>
                                <span class="download-text">Download</span>
                            </a>
                        </div>
                        <?php
                    }
                }
                ?>
            </div>
        </main>

        <footer>
            <p>
                Last updated: <span id="last-update"><?= date('H:i:s') ?></span>
                &nbsp;•&nbsp;
                Next refresh in: <span id="next-refresh">30s</span>
            </p>
        </footer>
    </div>

    <!-- Load JavaScript modules in order -->
    <script src="js/state.js"></script>
    <script src="js/storage.js"></script>
    <script src="js/sorting.js"></script>
    <script src="js/dom.js"></script>
    <script src="js/refresh.js"></script>
    <script src="js/ui.js"></script>
    <script src="js/app.js"></script>
    <?php endif; ?>
</body>
</html>
