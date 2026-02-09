# Project File Structure

```
yearly-recap/
│
├── public/                          # Static assets (PWA icons will be auto-generated)
│
├── src/                             # Source code
│   │
│   ├── components/                  # Reusable React components
│   │   ├── Layout.jsx              # Main app layout with navigation
│   │   └── ProtectedRoute.jsx      # Authentication guard component
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.js              # Authentication operations
│   │   └── useFirestore.js         # Firestore CRUD operations
│   │
│   ├── pages/                       # Page components (routes)
│   │   ├── Dashboard.jsx           # Main dashboard with summaries
│   │   ├── Finance.jsx             # Financial tracking page
│   │   ├── Goals.jsx               # Goals management page
│   │   ├── Login.jsx               # Login/Signup page
│   │   └── Recaps.jsx              # Life recaps/journal page
│   │
│   ├── store/                       # State management
│   │   └── useStore.js             # Zustand global store
│   │
│   ├── App.jsx                      # Main app component with routing
│   ├── firebase.js                  # Firebase configuration
│   ├── index.css                    # Global styles and Tailwind
│   └── main.jsx                     # App entry point
│
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── firebase.json                    # Firebase hosting configuration
├── firestore.rules                  # Firestore security rules
├── index.html                       # HTML template
├── package.json                     # Dependencies and scripts
├── postcss.config.js                # PostCSS configuration
├── QUICKSTART.md                    # Quick start guide
├── README.md                        # Full documentation
├── tailwind.config.js               # Tailwind CSS configuration
└── vite.config.js                   # Vite + PWA configuration
```

## Key Files Explained

### Configuration Files

- **vite.config.js**: Vite bundler configuration with PWA plugin
- **tailwind.config.js**: Tailwind CSS customization (colors, animations)
- **postcss.config.js**: PostCSS plugins (Tailwind, Autoprefixer)
- **firebase.json**: Firebase hosting and deployment settings
- **firestore.rules**: Database security rules

### Source Code

#### Components (`src/components/`)
- **Layout.jsx**: Main layout with responsive navigation (sidebar on desktop, bottom nav on mobile)
- **ProtectedRoute.jsx**: Wrapper component that redirects unauthenticated users to login

#### Hooks (`src/hooks/`)
- **useAuth.js**: Custom hook for authentication (sign in, sign up, sign out)
- **useFirestore.js**: Custom hooks for Firestore operations (CRUD, real-time subscriptions)

#### Pages (`src/pages/`)
- **Login.jsx**: Authentication page with email/password and Google sign-in
- **Dashboard.jsx**: Overview page with financial summary and recent activity
- **Goals.jsx**: Goals management with categorization and status tracking
- **Recaps.jsx**: Journaling page with type-based filtering
- **Finance.jsx**: Financial tracking with monthly summaries and category breakdown

#### Store (`src/store/`)
- **useStore.js**: Zustand store for global state (user, theme, auth state)

#### Core Files
- **App.jsx**: Main component with React Router setup
- **firebase.js**: Firebase initialization and service exports
- **main.jsx**: React app entry point
- **index.css**: Global styles, Tailwind directives, custom CSS

## Data Flow

```
User Action
    ↓
Page Component
    ↓
Custom Hook (useFirestore/useAuth)
    ↓
Firebase SDK
    ↓
Firestore/Auth Service
    ↓
Real-time Update
    ↓
Component Re-render
```

## Component Hierarchy

```
App
├── BrowserRouter
    ├── Login (public route)
    └── ProtectedRoute
        └── Layout
            ├── Sidebar/Navigation
            ├── Header (mobile)
            ├── Bottom Nav (mobile)
            └── Outlet
                ├── Dashboard
                ├── Goals
                ├── Recaps
                └── Finance
```

## State Management

### Global State (Zustand)
- User authentication state
- Theme preference (dark/light)
- Loading states

### Local State (React useState)
- Form inputs
- UI toggles (modals, menus)
- Filters and selections

### Server State (Firestore)
- Goals data
- Recaps data
- Transactions data
- Real-time subscriptions via useCollection hook

## Styling Architecture

### Tailwind CSS
- Utility-first approach
- Custom color palette in config
- Dark mode support with `dark:` prefix
- Responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`

### Custom CSS Classes (in index.css)
- `.btn`, `.btn-primary`, `.btn-secondary`
- `.card`
- `.input`, `.label`
- Custom animations: `animate-fade-in`, `animate-slide-up`, `animate-shimmer`

## Security

### Authentication
- Firebase Auth handles user authentication
- Protected routes check auth state
- Automatic redirect to login if not authenticated

### Firestore Rules
- Users can only access their own data
- Data validation on create operations
- Subcollections inherit parent document permissions

## Performance Optimizations

### Code Splitting
- React Router lazy loading (can be added)
- Dynamic imports for heavy components

### Caching
- PWA service worker caches assets
- Firestore offline persistence
- Browser caching for static assets

### Optimizations
- useMemo for expensive calculations
- useCallback for event handlers (can be added)
- Debouncing for search/filter inputs (can be added)

## Development Workflow

1. **Local Development**: `npm run dev`
2. **Build**: `npm run build`
3. **Preview**: `npm run preview`
4. **Deploy**: `npm run deploy`

## Testing Checklist

- [ ] Authentication (email/password, Google)
- [ ] CRUD operations for all modules
- [ ] Real-time updates
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Dark/Light mode toggle
- [ ] PWA installation
- [ ] Offline functionality
- [ ] Security rules enforcement
