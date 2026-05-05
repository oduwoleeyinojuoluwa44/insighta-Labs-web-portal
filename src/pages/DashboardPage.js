import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api.service.js';
export function DashboardPage() {
    const [profiles, setProfiles] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        apiService
            .getProfiles({ limit: 5, page: 1 })
            .then(setProfiles)
            .finally(() => setLoading(false));
    }, []);
    return (_jsxs("main", { style: { padding: 24 }, children: [_jsx("h1", { children: "Dashboard" }), loading ? (_jsx("p", { children: "Loading metrics..." })) : (_jsxs("div", { style: { display: 'flex', gap: 16, flexWrap: 'wrap' }, children: [_jsxs("section", { style: { border: '1px solid #ddd', padding: 16, borderRadius: 8, minWidth: 180 }, children: [_jsx("strong", { children: "Recent profiles" }), _jsx("div", { style: { fontSize: 32 }, children: profiles.length })] }), _jsxs("section", { style: { border: '1px solid #ddd', padding: 16, borderRadius: 8, minWidth: 180 }, children: [_jsx("strong", { children: "Interface" }), _jsx("div", { children: "Web portal" })] })] })), _jsxs("nav", { style: { marginTop: 24, display: 'flex', gap: 12 }, children: [_jsx(Link, { to: "/profiles", children: "Profiles" }), _jsx(Link, { to: "/search", children: "Search" }), _jsx(Link, { to: "/account", children: "Account" })] })] }));
}
