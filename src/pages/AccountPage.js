import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../hooks/index.js';
export function AccountPage() {
    const { user, logout } = useAuth();
    return (_jsxs("main", { style: { padding: 24 }, children: [_jsx("h1", { children: "Account" }), _jsxs("p", { children: [_jsx("strong", { children: "Username:" }), " ", user?.username || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Email:" }), " ", user?.email || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Role:" }), " ", user?.role || 'N/A'] }), _jsx("button", { onClick: logout, children: "Logout" })] }));
}
