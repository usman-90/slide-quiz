# Quick Start Guide - Timed Quiz App

## Prerequisites
- Node.js installed
- Firebase project set up with:
  - Authentication enabled (Email/Password)
  - Realtime Database created

## Installation (Already Done ✓)

Dependencies have been installed:
```bash
npm install
```

## Run the Application

1. **Start Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

2. **Build for Production**
   ```bash
   npm run build
   ```

## Firebase Setup Required

### 1. Enable Authentication
1. Go to Firebase Console → Authentication
2. Enable "Email/Password" sign-in method

### 2. Set Up Realtime Database
1. Go to Firebase Console → Realtime Database
2. Create database (start in test mode for development)
3. Update rules:

```json
{
  "rules": {
    "users": {
      "$userId": {
        ".read": "$userId === auth.uid",
        ".write": "$userId === auth.uid"
      }
    },
    "quizzes": {
      ".read": "auth != null",
      "$quizId": {
        ".write": "auth != null && (!data.exists() || data.child('creatorId').val() === auth.uid)"
      }
    }
  }
}
```

## First Time Usage

1. **Sign Up**
   - Navigate to `/signup`
   - Create an account with email and password

2. **Set Time Period**
   - On the quiz listing page, set your preferred time per question
   - Default is 30 seconds

3. **Create a Quiz**
   - Click "Add New Quiz"
   - Enter quiz title
   - Add questions with options
   - Mark correct answers
   - Save

4. **Take a Quiz**
   - Click "Start Quiz" on any quiz
   - Watch the presentation
   - Questions auto-advance after timer
   - Answers reveal automatically

## Application Structure

```
/login       - Login page
/signup      - Signup page
/            - Quiz listing (protected)
/quiz/:id    - Quiz player (protected)
```

## Features Overview

✅ **Authentication**
- Login with email/password
- Sign up with email/password
- Protected routes

✅ **Quiz Management**
- Create quizzes
- Edit your quizzes
- Delete your quizzes
- Add MCQs with 4 options

✅ **Quiz Player**
- Timed presentation mode
- Auto-advancing questions
- Automatic answer reveal
- Visual timer with countdown
- Progress tracking

✅ **Settings**
- Customizable time per question
- Saved to user profile
- Applied to all quizzes

## Troubleshooting

### Development Server Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Firebase Connection Issues
- Check Firebase config in `src/firebase/config.ts`
- Verify Authentication is enabled
- Verify Realtime Database is created
- Check database rules

### Build Errors
```bash
# Run TypeScript check
npm run build
```

## Tech Stack
- React 19.2 + TypeScript
- Vite 7.2
- Firebase (Auth + Realtime Database)
- React Router DOM
- Custom CSS

## File Structure
All source files are in `src/`:
- `firebase/` - Firebase configuration
- `components/` - React components
- `hooks/` - Custom React hooks
- `types/` - TypeScript interfaces
- `utils/` - Helper functions

## Need Help?
Check these files:
- `README-APP.md` - Full documentation
- `IMPLEMENTATION-SUMMARY.md` - Complete implementation details
