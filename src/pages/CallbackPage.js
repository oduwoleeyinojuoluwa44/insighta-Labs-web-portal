import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store.js';
import { apiService } from '../services/api.service.js';
export function CallbackPage() {
    const navigate = useNavigate();
    const { setUser, setAuthenticated } = useAuthStore();
    React.useEffect(() => {
        const handleCallback = async () => {
            try {
                const params = new URLSearchParams(location.search);
                const code = params.get('code');
                const state = params.get('state');
                if (!code) {
                    throw new Error('No authorization code in callback');
                }
                // Exchange code for token
                const response = await apiService.handleCallback(code, state || '');
                if (response?.user) {
                    setUser(response.user);
                    setAuthenticated(true);
                    navigate('/profiles');
                }
                else {
                    throw new Error('No user data in response');
                }
            }
            catch (error) {
                console.error('Callback error:', error);
                navigate('/login?error=auth_failed');
            }
        };
        handleCallback();
    }, [navigate, setUser, setAuthenticated]);
    return (_jsx("div", { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }, children: _jsxs("div", { children: [_jsx("div", { children: "Authenticating with GitHub..." }), _jsx("p", { style: { marginTop: '10px', color: '#666' }, children: "Please wait while we complete your login." })] }) }));
}
