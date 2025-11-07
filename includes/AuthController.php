<?php
/**
 * Authentication Controller
 * Handles login and logout requests
 */
class AuthController {

    /**
     * Handle login POST request
     */
    public static function handleLogin() {
        if (isset($_POST['password'])) {
            if (Session::login($_POST['password'])) {
                header('Location: ' . $_SERVER['PHP_SELF']);
                exit;
            }
        }
    }

    /**
     * Handle logout GET request
     */
    public static function handleLogout() {
        if (isset($_GET['logout'])) {
            Session::logout();
            header('Location: ' . $_SERVER['PHP_SELF']);
            exit;
        }
    }
}
