# Life & Finance Tracker PWA

A modern, mobile-responsive Progressive Web App for tracking yearly goals, life recaps, and personal finances. Built with React, Vite, Tailwind CSS, and Firebase.

## Features

### 🎯 Yearly Goals
- Create and track goals categorized by Health, Career, Personal, Financial, Education, and Relationships
- Status tracking: Not Started, In Progress, Completed
- Year-based organization with progress visualization
- Beautiful card-based layout with category filtering

### 📖 Life Recaps
- Journal your thoughts with Daily, Weekly, Monthly, and Yearly recaps
- Rich text support for detailed reflections
- Date-based organization and filtering
- Easy-to-use CRUD interface

### 💰 Financial Tracking
- Track income and expenses with detailed categorization
- Monthly summaries with visual breakdowns
- Category-based spending analysis
- Filter by month and transaction type
- Real-time balance calculations

### 🎨 Modern UI/UX
- Dark/Light mode support (defaults to dark)
- Responsive design (mobile-first approach)
- Smooth animations and transitions
- Bottom navigation on mobile, sidebar on desktop
- Beautiful gradient cards and modern aesthetics

### 📱 PWA Features
- Installable on mobile and desktop
- Offline support with service workers
- Fast loading with optimized caching
- Native app-like experience

## Tech Stack

- **Frontend Framework:** React 18 with Vite
- **Styling:** Tailwind CSS with custom design system
- **Backend/Database:** Firebase (Firestore)
- **Authentication:** Firebase Auth (Email/Password + Google Sign-in)
- **State Management:** Zustand
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **PWA:** vite-plugin-pwa

## Project Structure

```
yearly-recap/
├── public/                    # Static assets
├── src/
│   ├── components/           # React components
│   │   ├── Layout.jsx       # Main layout with navigation
│   │   └── ProtectedRoute.jsx # Auth guard component
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js       # Authentication hook
│   │   └── useFirestore.js  # Firestore CRUD hooks
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   ├── Finance.jsx      # Financial tracking
│   │   ├── Goals.jsx        # Goals management
│   │   ├── Login.jsx        # Login/Signup page
│   │   └── Recaps.jsx       # Life recaps/journal
│   ├── store/               # State management
│   │   └── useStore.js      # Zustand store
│   ├── App.jsx              # Main app component
│   ├── firebase.js          # Firebase configuration
│   ├── index.css            # Global styles
│   └── main.jsx             # App entry point
├── .env.example             # Environment variables template
├── index.html               # HTML template
├── package.json             # Dependencies
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind configuration
└── vite.config.js           # Vite + PWA configuration
```

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd yearly-recap
npm install
```

### 2. Firebase Setup

#### Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Once created, click on the web icon (</>) to add a web app
4. Register your app and copy the configuration

#### Enable Authentication
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Enable **Google** provider
4. Add your domain to authorized domains (for production)

#### Set Up Firestore Database
1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Start in **production mode** (we'll add security rules next)
4. Choose a location close to your users

#### Configure Security Rules
In Firestore Database > Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User document rules
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Goals subcollection
      match /goals/{goalId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Recaps subcollection
      match /recaps/{recapId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Transactions subcollection
      match /transactions/{transactionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

Click **Publish** to save the rules.

### 3. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

### 6. Deploy to Firebase Hosting (Optional)

#### Install Firebase CLI
```bash
npm install -g firebase-tools
```

#### Login to Firebase
```bash
firebase login
```

#### Initialize Firebase Hosting
```bash
firebase init hosting
```

Select:
- Use an existing project (select your project)
- Public directory: `dist`
- Configure as single-page app: `Yes`
- Set up automatic builds with GitHub: `No` (or Yes if you want)

#### Deploy
```bash
npm run build
firebase deploy
```

Your app will be live at `https://your-project-id.web.app`

## Firestore Data Schema

### Users Collection
```
/users/{userId}
  - email: string
  - displayName: string
  - createdAt: timestamp
```

### Goals Subcollection
```
/users/{userId}/goals/{goalId}
  - title: string
  - category: string (Health, Career, Personal, Financial, Education, Relationships)
  - status: string (not-started, in-progress, completed)
  - year: number
  - createdAt: timestamp
  - updatedAt: timestamp
```

### Recaps Subcollection
```
/users/{userId}/recaps/{recapId}
  - title: string
  - content: string
  - type: string (Daily, Weekly, Monthly, Yearly)
  - date: timestamp
  - createdAt: timestamp
  - updatedAt: timestamp
```

### Transactions Subcollection
```
/users/{userId}/transactions/{transactionId}
  - description: string
  - amount: number
  - type: string (income, expense)
  - category: string
  - date: timestamp
  - createdAt: timestamp
  - updatedAt: timestamp
```

## PWA Installation

### On Mobile (iOS/Android)
1. Open the app in your mobile browser
2. Tap the share/menu button
3. Select "Add to Home Screen"
4. The app will now work like a native app

### On Desktop (Chrome/Edge)
1. Open the app in your browser
2. Look for the install icon in the address bar
3. Click "Install"
4. The app will open in its own window

## Features Breakdown

### Authentication
- Email/Password registration and login
- Google Sign-in integration
- Protected routes (auto-redirect to login if not authenticated)
- Persistent sessions

### Dashboard
- Monthly financial summary (Income, Expenses, Balance)
- Goals progress visualization
- Quick action buttons
- Recent transactions and recaps preview

### Goals Module
- CRUD operations for goals
- Category-based organization
- Status tracking with visual indicators
- Year filtering
- Progress percentage calculation

### Recaps Module
- CRUD operations for journal entries
- Type-based filtering (Daily, Weekly, Monthly, Yearly)
- Date-based sorting
- Rich text content support

### Finance Module
- CRUD operations for transactions
- Monthly filtering and summaries
- Category breakdown visualization
- Income vs Expense tracking
- Real-time balance calculations

## Customization

### Changing Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

### Adding New Categories
Edit the category arrays in the respective page files:
- Goals: `src/pages/Goals.jsx` - `CATEGORIES` array
- Finance: `src/pages/Finance.jsx` - `TRANSACTION_CATEGORIES` object
- Recaps: `src/pages/Recaps.jsx` - `RECAP_TYPES` array

## Troubleshooting

### Firebase Connection Issues
- Verify your `.env` file has the correct Firebase configuration
- Check that Firebase services are enabled in the console
- Ensure security rules are properly configured

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check that all dependencies are installed
- Verify Node.js version (v16 or higher recommended)

### PWA Not Installing
- Ensure you're using HTTPS (required for PWA)
- Check that manifest.webmanifest is being generated
- Verify service worker is registered in browser DevTools

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please check the Firebase documentation:
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Firestore](https://firebase.google.com/docs/firestore)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
