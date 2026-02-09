# Setup Checklist

Use this checklist to ensure your Life & Finance Tracker PWA is properly configured and running.

## ☐ Prerequisites

- [ ] Node.js installed (v16 or higher)
- [ ] npm installed
- [ ] Modern web browser (Chrome, Firefox, Safari, Edge)
- [ ] Google account (for Firebase and Google Sign-in)

## ☐ Firebase Setup

### Create Project
- [ ] Go to https://console.firebase.google.com/
- [ ] Create new project
- [ ] Note down project ID

### Configure Authentication
- [ ] Navigate to Authentication → Sign-in method
- [ ] Enable Email/Password provider
- [ ] Enable Google provider
- [ ] Add authorized domain (localhost for development)

### Set Up Firestore
- [ ] Navigate to Firestore Database
- [ ] Create database in production mode
- [ ] Choose database location
- [ ] Copy security rules from `firestore.rules`
- [ ] Paste and publish rules in Firebase Console

### Get Configuration
- [ ] Go to Project Settings → General
- [ ] Scroll to "Your apps"
- [ ] Click web icon (</>) if no app exists
- [ ] Register app
- [ ] Copy Firebase configuration object

## ☐ Local Setup

### Install Dependencies
- [ ] Navigate to project directory
- [ ] Run `npm install`
- [ ] Wait for installation to complete
- [ ] Verify no errors

### Configure Environment
- [ ] Copy `.env.example` to `.env`
- [ ] Open `.env` file
- [ ] Paste Firebase configuration values:
  - [ ] VITE_FIREBASE_API_KEY
  - [ ] VITE_FIREBASE_AUTH_DOMAIN
  - [ ] VITE_FIREBASE_PROJECT_ID
  - [ ] VITE_FIREBASE_STORAGE_BUCKET
  - [ ] VITE_FIREBASE_MESSAGING_SENDER_ID
  - [ ] VITE_FIREBASE_APP_ID
- [ ] Save `.env` file

### Start Development Server
- [ ] Run `npm run dev`
- [ ] Open browser to http://localhost:5173
- [ ] Verify app loads without errors

## ☐ Test Core Features

### Authentication
- [ ] Click "Sign up"
- [ ] Create account with email/password
- [ ] Verify successful registration
- [ ] Sign out
- [ ] Sign in with same credentials
- [ ] Try Google Sign-in
- [ ] Verify user profile displays correctly

### Dashboard
- [ ] Navigate to Dashboard
- [ ] Verify all cards display
- [ ] Check quick action buttons work
- [ ] Verify responsive layout (resize browser)

### Goals Module
- [ ] Click "Add Goal" button
- [ ] Fill in goal details
- [ ] Submit form
- [ ] Verify goal appears in list
- [ ] Edit a goal
- [ ] Change goal status
- [ ] Delete a goal
- [ ] Test year filter

### Recaps Module
- [ ] Click "New Recap" button
- [ ] Fill in recap details
- [ ] Submit form
- [ ] Verify recap appears in list
- [ ] Test type filters (Daily, Weekly, etc.)
- [ ] Edit a recap
- [ ] Delete a recap

### Finance Module
- [ ] Click "Add Transaction" button
- [ ] Add an income transaction
- [ ] Add an expense transaction
- [ ] Verify monthly summary updates
- [ ] Test month filter
- [ ] Test type filter (all, income, expense)
- [ ] Verify category breakdown displays
- [ ] Edit a transaction
- [ ] Delete a transaction

## ☐ UI/UX Testing

### Theme
- [ ] Toggle dark/light mode
- [ ] Verify theme persists on refresh
- [ ] Check all pages in both themes
- [ ] Verify readability in both modes

### Responsive Design
- [ ] Test on mobile viewport (375px)
- [ ] Test on tablet viewport (768px)
- [ ] Test on desktop viewport (1920px)
- [ ] Verify navigation adapts correctly
- [ ] Check bottom nav on mobile
- [ ] Check sidebar on desktop

### Navigation
- [ ] Test all navigation links
- [ ] Verify active states
- [ ] Test mobile menu toggle
- [ ] Test back button behavior
- [ ] Verify protected routes redirect

## ☐ PWA Features

### Installation
- [ ] Look for install prompt in browser
- [ ] Install app on desktop
- [ ] Install app on mobile
- [ ] Verify app opens in standalone mode
- [ ] Check app icon displays correctly

### Offline Support
- [ ] Load app while online
- [ ] Disconnect from internet
- [ ] Refresh app
- [ ] Verify app still loads
- [ ] Try to add data offline
- [ ] Reconnect to internet
- [ ] Verify data syncs

## ☐ Security

### Firestore Rules
- [ ] Try to access another user's data (should fail)
- [ ] Verify own data is accessible
- [ ] Test unauthenticated access (should fail)
- [ ] Verify data validation works

### Authentication
- [ ] Test invalid email format
- [ ] Test weak password
- [ ] Test sign out
- [ ] Verify session persistence
- [ ] Test protected route access when logged out

## ☐ Performance

### Load Time
- [ ] Check initial load time (< 3 seconds)
- [ ] Verify subsequent loads are faster
- [ ] Test on slow 3G connection
- [ ] Check bundle size

### Real-time Updates
- [ ] Open app in two browser tabs
- [ ] Add data in one tab
- [ ] Verify it appears in other tab
- [ ] Test with goals, recaps, and transactions

## ☐ Production Build

### Build
- [ ] Run `npm run build`
- [ ] Verify build completes without errors
- [ ] Check dist/ folder created
- [ ] Run `npm run preview`
- [ ] Test production build locally

## ☐ Deployment (Optional)

### Firebase Hosting
- [ ] Install Firebase CLI: `npm install -g firebase-tools`
- [ ] Run `firebase login`
- [ ] Run `firebase init hosting`
- [ ] Select correct project
- [ ] Set public directory to `dist`
- [ ] Configure as SPA: Yes
- [ ] Run `npm run deploy`
- [ ] Visit deployed URL
- [ ] Test all features on live site

## ☐ Final Checks

### Documentation
- [ ] Read README.md
- [ ] Read QUICKSTART.md
- [ ] Review PROJECT_STRUCTURE.md
- [ ] Understand data schema

### Customization
- [ ] Update author name in package.json
- [ ] Customize colors if desired
- [ ] Add custom categories if needed
- [ ] Update app name/branding

### Maintenance
- [ ] Set up Git repository
- [ ] Create initial commit
- [ ] Push to GitHub (optional)
- [ ] Set up backups for Firebase data
- [ ] Monitor Firebase usage

## 🎉 Completion

- [ ] All core features working
- [ ] All tests passing
- [ ] Documentation reviewed
- [ ] App deployed (if applicable)
- [ ] Ready to use!

---

**Congratulations!** Your Life & Finance Tracker PWA is ready to use. 🚀

If you encounter any issues, refer to the README.md troubleshooting section.
