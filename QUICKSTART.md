# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Set Up Firebase

1. **Create a Firebase Project**
   - Go to https://console.firebase.google.com/
   - Click "Add project"
   - Name it (e.g., "life-tracker")
   - Disable Google Analytics (optional)
   - Click "Create project"

2. **Add Web App**
   - Click the web icon `</>` 
   - Register app name: "Life Tracker"
   - Copy the Firebase configuration

3. **Enable Authentication**
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
   - Enable "Google"

4. **Create Firestore Database**
   - Go to Firestore Database
   - Click "Create database"
   - Start in production mode
   - Choose a location

5. **Set Security Rules**
   - Go to Firestore → Rules
   - Copy the rules from `firestore.rules` file
   - Click "Publish"

### Step 2: Configure Environment

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 3: Run the App

```bash
npm run dev
```

Open http://localhost:5173 in your browser!

### Step 4: Create Your Account

1. Click "Sign up"
2. Enter your name, email, and password
3. Or use "Continue with Google"

### Step 5: Start Using the App

- **Dashboard**: View your financial summary and goals progress
- **Goals**: Add and track your yearly goals
- **Recaps**: Journal your daily/weekly/monthly thoughts
- **Finance**: Track income and expenses

## 📱 Install as PWA

### On Mobile
1. Open the app in your browser
2. Tap the share button
3. Select "Add to Home Screen"

### On Desktop
1. Look for the install icon in the address bar
2. Click "Install"

## 🎨 Features to Try

1. **Toggle Dark/Light Mode**: Click the sun/moon icon
2. **Add a Goal**: Go to Goals → Add Goal
3. **Track Finances**: Go to Finance → Add Transaction
4. **Write a Recap**: Go to Recaps → New Recap
5. **View Dashboard**: See all your data summarized

## 🔥 Deploy to Firebase (Optional)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
npm run deploy
```

Your app will be live at `https://your-project.web.app`!

## 💡 Tips

- **Dark Mode**: The app defaults to dark mode for better battery life
- **Mobile First**: Designed to work great on phones
- **Offline Support**: Works offline after first load
- **Real-time Sync**: All data syncs across devices instantly

## 🆘 Need Help?

Check the full README.md for detailed documentation and troubleshooting.

## 🎯 Next Steps

1. Customize colors in `tailwind.config.js`
2. Add more transaction categories
3. Invite friends to use it
4. Star the repo if you like it! ⭐
