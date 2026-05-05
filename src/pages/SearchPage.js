import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api.service.js';
export function SearchPage() {
    const [query, setQuery] = React.useState('');
    const [profiles, setProfiles] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const runSearch = async () => {
        if (!query.trim())
            return;
        setLoading(true);
        setError(null);
        try {
            setProfiles(await apiService.searchProfiles(query, { limit: 20, page: 1 }));
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Search failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("main", { style: { padding: 24 }, children: [_jsx("h1", { children: "Search" }), _jsxs("div", { style: { display: 'flex', gap: 8 }, children: [_jsx("input", { value: query, onChange: (event) => setQuery(event.target.value), placeholder: "young males from nigeria", style: { flex: 1, padding: 10 } }), _jsx("button", { onClick: runSearch, children: "Search" })] }), loading && _jsx("p", { children: "Searching..." }), error && _jsx("p", { style: { color: 'red' }, children: error }), _jsx("ul", { children: profiles.map((profile) => (_jsxs("li", { children: [_jsx(Link, { to: `/profiles/${profile.id}`, children: profile.name }), " - ", profile.gender, ", ", profile.age, ", ", profile.country_name] }, profile.id))) })] }));
}
