# SlideQuiz

A React-based quiz application with Firebase authentication and real-time database integration. This app allows users to create quizzes with multiple-choice questions and present them in a timed, auto-advancing format.

## Features

### Authentication
- **Login/Signup**: Email and password authentication using Firebase Auth
- **Protected Routes**: Only authenticated users can access quiz features
- **Automatic Redirects**: Logged-in users redirected from auth pages

### Quiz Management
- **Create Quizzes**: Any authenticated user can create quizzes
- **Edit Quizzes**: Only quiz creators can edit their own quizzes
- **Delete Quizzes**: Only quiz creators can delete their own quizzes
- **Add MCQs**: Add multiple-choice questions with 4 options (A, B, C, D)
- **Edit MCQs**: Edit questions, options, and correct answers
- **Quiz Listing**: View all available quizzes in a grid layout

### Quiz Presentation Mode
- **Timed Questions**: Each question displays for a user-defined time period
- **Auto-Advance**: Questions automatically advance after time expires
- **Answer Reveal**: Correct answer is highlighted after timer ends
- **No User Interaction**: Questions are displayed like a presentation
- **Progress Tracking**: Shows current question number and total questions
- **Completion Screen**: Shows summary when quiz ends

### Time Period Settings
- **User-Specific**: Each user can set their own time period
- **Persistent**: Time settings are stored in Firebase user profile
- **Flexible**: Set time from 5 to 300 seconds
- **Global Application**: Time setting applies to all quizzes for that user

## Technology Stack

- **Frontend**: React 19.2 with TypeScript
- **Build Tool**: Vite 7.2
- **Routing**: React Router DOM
- **Backend**: Firebase (Authentication + Realtime Database)
- **Styling**: Custom CSS with modern gradient design

## Project Structure

```
src/
├── firebase/
│   └── config.ts          # Firebase initialization
├── components/
│   ├── Auth/
│   │   ├── Login.tsx      # Login component
│   │   └── Signup.tsx     # Signup component
│   ├── Quiz/
│   │   ├── QuizList.tsx   # Quiz listing with add/edit
│   │   ├── QuizForm.tsx   # Add/Edit quiz form
│   │   ├── MCQForm.tsx    # Add/Edit MCQ form
│   │   └── QuizPlayer.tsx # Presentation mode player
│   └── TimeSetting.tsx    # Time period setting component
├── hooks/
│   └── useAuth.ts         # Authentication hook
├── types/
│   └── index.ts           # TypeScript interfaces
├── utils/
│   └── database.ts        # Database helper functions
├── App.tsx                # Main router component
├── App.css                # Application styles
└── main.tsx               # Application entry point
```

## Database Schema

```
/users/{userId}/
  - timePeriod: number (seconds, default: 30)

/quizzes/{quizId}/
  - title: string
  - creatorId: string
  - createdAt: number
  - mcqs: array
    - id: string
    - question: string
    - options: array
      - id: string (a, b, c, d)
      - text: string
    - answer: string (option id)
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Firebase Configuration**
   - The Firebase configuration is already set up in `src/firebase/config.ts`
   - Ensure your Firebase project has:
     - Authentication enabled (Email/Password)
     - Realtime Database created and rules configured

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Firebase Database Rules

For development, you can use these rules (adjust for production):

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

## Usage Guide

### For Users

1. **Sign Up / Login**
   - Create an account or login with existing credentials
   - You'll be redirected to the quiz listing page

2. **Set Time Period**
   - At the top of the quiz listing page, set your preferred time per question
   - Default is 30 seconds
   - This setting applies to all quizzes you take

3. **Create a Quiz**
   - Click "Add New Quiz" button
   - Enter quiz title
   - Add questions with 4 options each
   - Select the correct answer for each question
   - Save the quiz

4. **Edit Your Quizzes**
   - Click "Edit" on any quiz you created
   - Modify title, questions, options, or answers
   - Save changes

5. **Take a Quiz**
   - Click "Start Quiz" on any quiz card
   - Watch as questions are presented one by one
   - Each question displays for your set time period
   - Correct answer is revealed when time expires
   - Click "Next" to continue to the next question
   - Quiz ends after all questions are completed

### Quiz Features

- **Timer**: Visual countdown timer for each question
- **Warning**: Timer turns red in the last 5 seconds
- **Progress Bar**: Shows time remaining visually
- **Question Counter**: Displays current question number
- **Answer Highlight**: Correct answer is highlighted in green
- **Exit Option**: Can exit quiz at any time

## Design Features

- **Modern UI**: Gradient backgrounds and clean card layouts
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Transitions**: Animated interactions and hover effects
- **Color Coding**: Visual feedback for correct answers and warnings
- **Accessibility**: Clear labels and readable fonts

## Notes

- Users can only edit and delete quizzes they created
- All users can view and take any quiz
- Time period settings are synced across devices via Firebase
- Quiz progress is not saved (intentional for presentation mode)
- No answer selection is required from users during quiz playback

## Future Enhancements

Possible features to add:
- Quiz categories or tags
- Search and filter functionality
- Quiz statistics and analytics
- Leaderboards
- Quiz sharing via links
- Export quiz results
- Dark mode toggle
- Sound effects and animations
