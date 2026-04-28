# Insighta Labs+ Web Portal

Modern React-based web interface for the Profile Intelligence Platform with OAuth authentication, role-based access control, and advanced filtering.

## Features

- 🔐 GitHub OAuth authentication with HTTP-only cookies
- 📊 Interactive profile browser with real-time filtering
- 🔍 Natural language search with advanced filters
- 📤 CSV export with role-based access
- 🎨 Modern React UI with Zustand state management
- ✨ Real-time token management and auto-refresh
- 📱 Responsive design (desktop-first, mobile-friendly)
- 🛡️ CSRF protection for all mutations

## Quick Start

### Prerequisites

- Node.js 16+
- React 18
- Vite

### Installation

```bash
git clone https://github.com/oduwoleeyinojuoluwa44/insighta-Labs-web-portal.git
cd insighta-Labs-web-portal
npm install
```

### Development

```bash
npm run dev
```

Opens http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Architecture

### State Management (Zustand)

```tsx
// stores/auth.store.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

// stores/profiles.store.ts
interface ProfilesState {
  profiles: Profile[];
  loading: boolean;
  error: string | null;
  filters: FilterOptions;
  fetchProfiles: (filters: FilterOptions) => Promise<void>;
  setFilters: (filters: FilterOptions) => void;
}
```

### API Service (Axios)

```tsx
// services/api.service.ts
class APIService {
  async getAuthorizationUrl(): Promise<string>
  async handleCallback(code: string, state: string): Promise<void>
  async refreshToken(): Promise<void>
  async logout(): Promise<void>
  async getProfiles(filters: FilterOptions): Promise<Profile[]>
  async searchProfiles(query: string, filters: FilterOptions): Promise<Profile[]>
  async exportProfiles(filters: FilterOptions): Promise<Blob>
}
```

### Protected Routes

```tsx
// components/ProtectedRoute.tsx
export function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return children;
}
```

## Project Structure

```
src/
├── types/
│   └── index.ts            # TypeScript interfaces
│
├── services/
│   └── api.service.ts      # Axios HTTP client
│
├── stores/
│   ├── auth.store.ts       # Zustand auth state
│   └── profiles.store.ts   # Zustand profiles state
│
├── hooks/
│   ├── useAuth.ts          # Auth hook
│   └── useProfiles.ts      # Profiles hook
│
├── pages/
│   ├── LoginPage.tsx       # OAuth login
│   ├── CallbackPage.tsx    # OAuth callback handler
│   ├── BrowserPage.tsx     # Profile browser
│   └── NotFoundPage.tsx    # 404
│
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── ProfileCard.tsx     # Profile display
│   ├── FilterPanel.tsx     # Search filters
│   ├── ProtectedRoute.tsx  # Protected route wrapper
│   └── LoadingSpinner.tsx  # Loading indicator
│
├── utils/
│   └── api-config.ts       # API endpoint config
│
├── styles/
│   └── globals.css         # Global styles
│
├── App.tsx                 # Main app component
├── main.tsx                # React entry point
└── vite-env.d.ts          # Vite type definitions
```

## Configuration

### Environment Variables

Create `.env` file in project root:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

### Vite Config

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    cors: true
  }
})
```

## Authentication Flow

### Step 1: User Clicks "Login with GitHub"

```tsx
function LoginPage() {
  const handleGitHubLogin = async () => {
    const authUrl = await apiService.getAuthorizationUrl();
    window.location.href = authUrl;
  };
  
  return <button onClick={handleGitHubLogin}>Login</button>;
}
```

### Step 2: User Authorizes on GitHub

GitHub redirects back to:
```
http://localhost:5173/callback?code=abc123&state=xyz789
```

### Step 3: Callback Handler Exchanges Code

```tsx
function CallbackPage() {
  useEffect(() => {
    const code = new URLSearchParams(location.search).get('code');
    const state = new URLSearchParams(location.search).get('state');
    
    apiService.handleCallback(code, state)
      .then(() => navigate('/profiles'))
      .catch(() => navigate('/login'));
  }, []);
  
  return <div>Authenticating...</div>;
}
```

### Step 4: Backend Sets HTTP-Only Cookie

Backend responds with:
```json
{
  "access_token": "...",
  "user": {...}
}
```

Stored in HTTP-only, Secure cookie by Axios interceptor.

### Step 5: All Requests Include Token

Axios interceptor automatically includes token in Authorization header:

```tsx
apiClient.interceptors.request.use((config) => {
  const token = getTokenFromCookie();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

## CSRF Protection

Every mutation request includes CSRF token:

```tsx
// Get CSRF token from cookie or meta tag
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

// Include in mutation requests
const response = await axios.post('/profiles', data, {
  headers: { 'X-CSRF-Token': csrfToken }
});
```

## Token Refresh

Automatic refresh when token expires:

```tsx
apiClient.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await apiService.refreshToken();
        // Retry original request
        return apiClient(error.config);
      } catch (e) {
        // Redirect to login
        navigate('/login');
      }
    }
    return Promise.reject(error);
  }
);
```

## Usage Examples

### List All Profiles

```tsx
function BrowserPage() {
  const { profiles, loading, fetchProfiles } = useProfiles();
  
  useEffect(() => {
    fetchProfiles({ limit: 10, offset: 0 });
  }, []);
  
  return (
    <div>
      {loading && <LoadingSpinner />}
      {profiles.map(p => <ProfileCard key={p.id} profile={p} />)}
    </div>
  );
}
```

### Search with Filters

```tsx
function FilteredSearch() {
  const { setFilters, fetchProfiles } = useProfiles();
  
  const handleSearch = (gender: string, location: string) => {
    const filters = { gender, location, limit: 10, offset: 0 };
    setFilters(filters);
    fetchProfiles(filters);
  };
  
  return <FilterPanel onSearch={handleSearch} />;
}
```

### Export as CSV

```tsx
async function handleExport(filters: FilterOptions) {
  const blob = await apiService.exportProfiles(filters);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `profiles-${Date.now()}.csv`;
  a.click();
}
```

## Deployment

### Vercel

```bash
# Connect GitHub repo to Vercel
# Set environment variables in Vercel dashboard:
# VITE_API_URL=https://your-backend-domain.com/api/v1
# VITE_GITHUB_CLIENT_ID=your_client_id

# Deploy
git push origin main
```

### Netlify

```bash
# Connect GitHub repo to Netlify
# Set build command: npm run build
# Set publish directory: dist

# Deploy
npm run build
```

## Styling

### Tailwind CSS Integration (Optional)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### CSS Modules

```tsx
import styles from './ProfileCard.module.css';

export function ProfileCard() {
  return <div className={styles.card}>...</div>;
}
```

## Error Handling

All API requests include error handling:

```tsx
async function fetchData() {
  try {
    const data = await apiService.getProfiles(filters);
    setProfiles(data);
  } catch (error) {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      navigate('/login');
    } else if (error.response?.status === 403) {
      // Forbidden - insufficient permissions
      setError('You do not have permission to access this');
    } else {
      setError(error.message);
    }
  }
}
```

## Performance

### Code Splitting

Routes are lazy-loaded:

```tsx
const ProfilesPage = lazy(() => import('./pages/BrowserPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

export function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/profiles" element={<ProfilesPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Suspense>
  );
}
```

### Memoization

Components are memoized to prevent unnecessary re-renders:

```tsx
export const ProfileCard = memo(function ProfileCard({ profile }: Props) {
  return <div>...</div>;
});
```

## Development

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Build Optimization

```bash
npm run build  # Optimized production build
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

## Support

For issues or feature requests, visit:
https://github.com/oduwoleeyinojuoluwa44/insighta-Labs-web-portal/issues

---

**Backend API**: https://github.com/oduwoleeyinojuoluwa44/Data-persistence-api
**CLI**: https://github.com/oduwoleeyinojuoluwa44/CLI-for-insighta-labs-
