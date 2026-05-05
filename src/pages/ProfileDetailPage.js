import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiService } from '../services/api.service.js';
export function ProfileDetailPage() {
    const { id } = useParams();
    const [profile, setProfile] = React.useState(null);
    const [error, setError] = React.useState(null);
    React.useEffect(() => {
        if (!id)
            return;
        apiService.getProfile(id).then(setProfile).catch((err) => setError(err instanceof Error ? err.message : 'Failed to load profile'));
    }, [id]);
    if (error)
        return _jsxs("main", { style: { padding: 24 }, children: [_jsx("p", { style: { color: 'red' }, children: error }), _jsx(Link, { to: "/profiles", children: "Back" })] });
    if (!profile)
        return _jsx("main", { style: { padding: 24 }, children: "Loading profile..." });
    return (_jsxs("main", { style: { padding: 24 }, children: [_jsx(Link, { to: "/profiles", children: "Back to profiles" }), _jsx("h1", { children: profile.name }), _jsxs("dl", { children: [_jsx("dt", { children: "Age" }), _jsx("dd", { children: profile.age }), _jsx("dt", { children: "Gender" }), _jsx("dd", { children: profile.gender }), _jsx("dt", { children: "Age group" }), _jsx("dd", { children: profile.age_group }), _jsx("dt", { children: "Country" }), _jsxs("dd", { children: [profile.country_name, " (", profile.country_id, ")"] }), _jsx("dt", { children: "Gender confidence" }), _jsx("dd", { children: profile.gender_probability }), _jsx("dt", { children: "Country confidence" }), _jsx("dd", { children: profile.country_probability })] })] }));
}
