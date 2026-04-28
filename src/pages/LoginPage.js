import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { apiService } from '../services/api.service.js';
export function LoginPage() {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const handleGitHubLogin = async () => {
        try {
            setLoading(true);
            setError(null);
            const authUrl = await apiService.getAuthorizationUrl();
            window.location.href = authUrl;
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to initiate login');
            setLoading(false);
        }
    };
    return (_jsx("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }, children: _jsxs("div", { style: { textAlign: 'center', maxWidth: '400px' }, children: [_jsx("h1", { children: "Insighta Labs+" }), _jsx("p", { children: "Profile Intelligence Platform" }), _jsx("button", { onClick: handleGitHubLogin, disabled: loading, style: {
                        width: '100%',
                        padding: '12px',
                        fontSize: '16px',
                        marginTop: '20px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        backgroundColor: '#24292e',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        opacity: loading ? 0.6 : 1,
                    }, children: loading ? 'Connecting...' : 'Login with GitHub' }), error && _jsx("p", { style: { color: 'red', marginTop: '15px' }, children: error }), _jsx("p", { style: { marginTop: '30px', fontSize: '14px', color: '#666' }, children: "Secure authentication powered by GitHub OAuth 2.0" })] }) }));
}
