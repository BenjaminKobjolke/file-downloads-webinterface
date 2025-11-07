<?php
/**
 * Session Management Class
 * Handles user session, authentication state
 */
class Session {

    /**
     * Start the session
     */
    public static function start() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    /**
     * Check if user is authenticated
     *
     * @return bool
     */
    public static function isAuthenticated() {
        self::start();
        return isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
    }

    /**
     * Log in the user
     *
     * @param string $password
     * @return bool
     */
    public static function login($password) {
        if ($password === CONFIG_PASSWORD) {
            self::start();
            $_SESSION['logged_in'] = true;
            return true;
        }
        return false;
    }

    /**
     * Log out the user
     */
    public static function logout() {
        self::start();
        session_destroy();
    }
}
