import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/index.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';
import { LoginPage } from './pages/LoginPage.js';
import { CallbackPage } from './pages/CallbackPage.js';
import { BrowserPage } from './pages/BrowserPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { ProfileDetailPage } from './pages/ProfileDetailPage.js';
import { SearchPage } from './pages/SearchPage.js';
import { AccountPage } from './pages/AccountPage.js';
import './App.css';
export function App() {
    const { getCurrentUser, loading } = useAuth();
    useEffect(() => {
        // Check if user is already authenticated
        getCurrentUser().catch(() => {
            // Not authenticated, will redirect via router
        });
    }, []);
    if (loading) {
        return (_jsx("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }, children: _jsx("div", { children: "Loading application..." }) }));
    }
    return (_jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/callback", element: _jsx(CallbackPage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(ProtectedRoute, { children: _jsx(DashboardPage, {}) }) }), _jsx(Route, { path: "/profiles", element: _jsx(ProtectedRoute, { children: _jsx(BrowserPage, {}) }) }), _jsx(Route, { path: "/profiles/:id", element: _jsx(ProtectedRoute, { children: _jsx(ProfileDetailPage, {}) }) }), _jsx(Route, { path: "/search", element: _jsx(ProtectedRoute, { children: _jsx(SearchPage, {}) }) }), _jsx(Route, { path: "/account", element: _jsx(ProtectedRoute, { children: _jsx(AccountPage, {}) }) }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/profiles", replace: true }) })] }) }));
}
