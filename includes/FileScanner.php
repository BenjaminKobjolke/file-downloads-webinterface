<?php
/**
 * File Scanner Class
 * Scans directory for files and returns file information
 */
class FileScanner {

    private $directory;
    private $appRoot;
    private $urlPrefix;

    /**
     * Constructor
     *
     * @param string $directory
     */
    public function __construct($directory = null) {
        $this->directory = $directory ?? CONFIG_SOURCE_FOLDER;

        // Store app root (where index.php is located)
        // When called from index.php, __DIR__ points to the includes folder
        // So we need to go up one level
        $this->appRoot = dirname(__DIR__);

        // Calculate URL prefix (relative path from app root to source folder)
        $this->urlPrefix = $this->calculateUrlPrefix();
    }

    /**
     * Calculate URL prefix for files
     * Returns the relative path from app root to source folder
     *
     * @return string
     */
    private function calculateUrlPrefix() {
        // Normalize paths
        $appRoot = rtrim(str_replace('\\', '/', realpath($this->appRoot)), '/');
        $sourceFolder = rtrim(str_replace('\\', '/', realpath($this->directory) ?: $this->directory), '/');

        // If source folder is same as app root, no prefix needed
        if ($sourceFolder === $appRoot) {
            return '';
        }

        // If source folder is inside app root, extract relative path
        if (strpos($sourceFolder, $appRoot) === 0) {
            $relativePath = substr($sourceFolder, strlen($appRoot) + 1);
            return $relativePath . '/';
        }

        // If source folder is outside app root, files won't be web-accessible
        // Return empty prefix and hope for the best
        return '';
    }

    /**
     * Check if directory exists and try to create it if not
     *
     * @return bool
     */
    private function ensureDirectoryExists() {
        if (!is_dir($this->directory)) {
            // Try to create the directory
            return @mkdir($this->directory, 0755, true);
        }
        return true;
    }

    /**
     * Get error information about the directory
     *
     * @return array|null
     */
    public function getDirectoryError() {
        if (!is_dir($this->directory)) {
            return [
                'error' => true,
                'message' => 'Directory not found',
                'path' => $this->directory,
                'suggestion' => 'Please create the directory or update CONFIG_SOURCE_FOLDER in config.php'
            ];
        }
        if (!is_readable($this->directory)) {
            return [
                'error' => true,
                'message' => 'Directory is not readable',
                'path' => $this->directory,
                'suggestion' => 'Please check directory permissions'
            ];
        }
        return null;
    }

    /**
     * Scan directory for configured file types
     *
     * @return array
     */
    public function getFiles() {
        $files = [];
        $fileTypes = CONFIG_FILE_TYPES;

        // Try to ensure directory exists
        if (!$this->ensureDirectoryExists()) {
            // Return error state if directory doesn't exist and can't be created
            return [
                'error' => true,
                'message' => 'Source folder not found',
                'path' => $this->directory,
                'suggestion' => 'Please create the folder manually or update config.php'
            ];
        }

        // Check if directory is readable
        if (!is_readable($this->directory)) {
            return [
                'error' => true,
                'message' => 'Cannot read source folder',
                'path' => $this->directory,
                'suggestion' => 'Please check folder permissions'
            ];
        }

        // Scan directory for configured file types
        $items = @scandir($this->directory);

        if ($items === false) {
            return [
                'error' => true,
                'message' => 'Failed to scan directory',
                'path' => $this->directory,
                'suggestion' => 'Please check folder permissions'
            ];
        }

        foreach ($items as $item) {
            $extension = strtolower(pathinfo($item, PATHINFO_EXTENSION));
            if (in_array($extension, $fileTypes)) {
                $filepath = $this->directory . DIRECTORY_SEPARATOR . $item;
                $files[] = [
                    'name' => $item,
                    'size' => filesize($filepath),
                    'modified' => filemtime($filepath),
                    'url' => $this->urlPrefix . $item
                ];
            }
        }

        return $files;
    }

    /**
     * Legacy method - kept for backward compatibility
     * @deprecated Use getFiles() instead
     */
    public function getApkFiles() {
        return $this->getFiles();
    }
}
