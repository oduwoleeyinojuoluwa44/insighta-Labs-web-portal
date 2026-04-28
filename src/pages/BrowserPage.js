import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useAuth, useProfiles } from '../hooks/index.js';
export function BrowserPage() {
    const { user, logout } = useAuth();
    const { profiles, loading, error, fetchProfiles, searchProfiles, exportProfiles, setFilters } = useProfiles();
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setLocalFilters] = useState({ gender: '', location: '', occupation: '' });
    React.useEffect(() => {
        fetchProfiles();
    }, []);
    const handleSearch = () => {
        if (searchQuery.trim()) {
            searchProfiles(searchQuery);
        }
        else {
            fetchProfiles();
        }
    };
    const handleFilter = () => {
        const filterObj = {
            gender: filters.gender || undefined,
            location: filters.location || undefined,
            occupation: filters.occupation || undefined,
            limit: 10,
            offset: 0,
        };
        setFilters(filterObj);
        if (searchQuery.trim()) {
            searchProfiles(searchQuery, filterObj);
        }
        else {
            fetchProfiles(filterObj);
        }
    };
    const handleExport = () => {
        exportProfiles();
    };
    return (_jsxs("div", { style: { padding: '20px' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }, children: [_jsx("h1", { children: "Profile Browser" }), _jsxs("div", { style: { display: 'flex', gap: '10px', alignItems: 'center' }, children: [_jsx("span", { children: user?.username }), _jsx("button", { onClick: logout, style: { padding: '8px 16px', cursor: 'pointer' }, children: "Logout" })] })] }), _jsxs("div", { style: {
                    backgroundColor: '#f5f5f5',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                }, children: [_jsx("div", { style: { marginBottom: '15px' }, children: _jsx("input", { type: "text", placeholder: "Search profiles...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleSearch(), style: {
                                width: '100%',
                                padding: '10px',
                                fontSize: '14px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                            } }) }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }, children: [_jsx("input", { type: "text", placeholder: "Gender", value: filters.gender, onChange: (e) => setLocalFilters({ ...filters, gender: e.target.value }), style: { padding: '8px', border: '1px solid #ddd', borderRadius: '4px' } }), _jsx("input", { type: "text", placeholder: "Location", value: filters.location, onChange: (e) => setLocalFilters({ ...filters, location: e.target.value }), style: { padding: '8px', border: '1px solid #ddd', borderRadius: '4px' } }), _jsx("input", { type: "text", placeholder: "Occupation", value: filters.occupation, onChange: (e) => setLocalFilters({ ...filters, occupation: e.target.value }), style: { padding: '8px', border: '1px solid #ddd', borderRadius: '4px' } })] }), _jsxs("div", { style: { marginTop: '15px', display: 'flex', gap: '10px' }, children: [_jsx("button", { onClick: handleSearch, style: { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }, children: "Search" }), _jsx("button", { onClick: handleFilter, style: { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }, children: "Apply Filters" }), _jsx("button", { onClick: handleExport, style: { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }, children: "Export CSV" })] })] }), error && _jsx("div", { style: { color: 'red', marginBottom: '20px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }, children: error }), loading && _jsx("div", { style: { textAlign: 'center', padding: '40px' }, children: "Loading profiles..." }), !loading && profiles.length > 0 && (_jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }, children: profiles.map((profile) => (_jsxs("div", { style: {
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '15px',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }, children: [_jsxs("h3", { children: [profile.first_name, " ", profile.last_name] }), _jsxs("p", { children: [_jsx("strong", { children: "Age:" }), " ", profile.age || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Gender:" }), " ", profile.gender || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Location:" }), " ", profile.location || 'N/A'] }), _jsxs("p", { children: [_jsx("strong", { children: "Occupation:" }), " ", profile.occupation || 'N/A'] }), profile.bio && _jsxs("p", { style: { fontSize: '12px', color: '#666' }, children: [profile.bio.substring(0, 100), "..."] })] }, profile.id))) })), !loading && profiles.length === 0 && (_jsx("div", { style: { textAlign: 'center', padding: '40px', color: '#999' }, children: "No profiles found" }))] }));
}
