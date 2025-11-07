# File Downloads Web Interface

A simple and elegant web interface for managing and downloading files (APK, PDF, ZIP, etc.) with authentication and real-time notifications.

## Features

- Clean, modern web interface for file downloads
- Password-protected access
- Support for multiple file types (APK, PDF, ZIP, EXE, etc.)
- Auto-refresh to detect new files
- Sound notifications for new uploads
- Responsive design for mobile and desktop
- File metadata display (size, modification date)
- QR code generation for easy mobile downloads

## Requirements

- PHP 7.0 or higher
- Web server (Apache, Nginx, or built-in PHP server)
- Write permissions for session storage

## Installation

### 1. Clone or Download the Project

```bash
git clone <repository-url>
cd file-downloads-webinterface
```

### 2. Configure the Application

Copy the example configuration file to create your own config:

```bash
cp config_example.php config.php
```

### 3. Edit Configuration

Open `config.php` and customize the settings:

```php
// File types to scan and display
define('CONFIG_FILE_TYPES', ['apk']);

// Source folder containing your files
define('CONFIG_SOURCE_FOLDER', __DIR__ . '/downloads');

// Authentication password
define('CONFIG_PASSWORD', 'your-secure-password');

// Enable sound notifications for new uploads
define('CONFIG_ENABLE_NOTIFICATIONS', false);

// Path to notification sound file
define('CONFIG_NOTIFICATION_SOUND', 'assets/newupload.mp3');

// Auto-refresh interval (in seconds)
define('CONFIG_REFRESH_INTERVAL', 30);
```

### 4. Create Downloads Folder

Create a folder to store your downloadable files:

```bash
mkdir downloads
```

Or use an existing folder by updating `CONFIG_SOURCE_FOLDER` in `config.php`.

### 5. Set Permissions (Linux/Mac)

Ensure the web server has read permissions for your files:

```bash
chmod 755 downloads
chmod 644 downloads/*
```

## Usage

### Starting the Application

#### Option 1: Using PHP Built-in Server

```bash
php -S localhost:8000
```

Then open your browser to `http://localhost:8000`

#### Option 2: Using WAMP/XAMPP/MAMP

Place the project in your web server's document root (e.g., `htdocs` or `www`) and access it through your local server URL.

#### Option 3: Deploy to Web Server

Upload the files to your web hosting and configure your web server to serve the application.

### Logging In

1. Open the application in your browser
2. Enter the password configured in `config.php` (default: `downapps`)
3. Click "Login"

### Adding Files

Simply place your files (APK, PDF, ZIP, etc.) in the configured source folder. The application will automatically detect them based on the file types specified in `CONFIG_FILE_TYPES`.

### Downloading Files

1. Click on any file card to download it
2. Use the QR code for easy mobile downloads
3. Files are automatically refreshed based on `CONFIG_REFRESH_INTERVAL`

## Configuration Options

### File Types

Specify which file extensions to scan:

```php
define('CONFIG_FILE_TYPES', ['apk', 'pdf', 'zip']);
```

### Source Folder

Configure where your files are stored:

```php
// Relative path
define('CONFIG_SOURCE_FOLDER', __DIR__ . '/downloads');

// Absolute path
define('CONFIG_SOURCE_FOLDER', 'D:/Downloads');
```

### Notifications

Enable sound alerts when new files are uploaded:

```php
define('CONFIG_ENABLE_NOTIFICATIONS', true);
define('CONFIG_NOTIFICATION_SOUND', 'assets/newupload.mp3');
```

Place your sound file (MP3, WAV, or OGG) in the `assets` folder.

### Refresh Interval

Set how often the page checks for new files (in seconds):

```php
define('CONFIG_REFRESH_INTERVAL', 30);
```

## Security Notes

- Change the default password in `config.php` immediately
- Use a strong password for production environments
- Ensure `config.php` is not publicly accessible (it's protected by `.htaccess` if using Apache)
- Keep the application updated
- Consider using HTTPS for production deployments

## Troubleshooting

### Files Not Showing Up

- Check that files are in the correct folder specified in `CONFIG_SOURCE_FOLDER`
- Verify file extensions match those in `CONFIG_FILE_TYPES`
- Ensure the web server has read permissions for the files

### Cannot Login

- Verify the password in `config.php` matches what you're entering
- Check that sessions are working (PHP sessions must be enabled)

### Permission Errors

- Ensure the web server user has read access to your files
- On Linux/Mac, check file permissions with `ls -la`

## License

This project is provided as-is for personal and commercial use.

## Support

For issues or questions, please open an issue in the project repository.
