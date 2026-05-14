# GigVarsity

GigVarsity is an Expo React Native app for matching students with companies for gigs and internships.

## What It Does

- Lets users sign in with Firebase auth.
- Routes students and companies to different app areas.
- Stores jobs, applications, chats, and user profiles in Firestore.
- Uses AI helpers for cover-letter and skill-match features.

## Project Layout

- `app/` contains the Expo Router screens.
- `services/` contains Firebase, chat, jobs, auth, and AI service code.
- `components/`, `hooks/`, `store/`, and `constants/` contain shared app logic and UI helpers.
- `docs/firestore-schema.md` describes the intended Firestore collections.

## Run It

```bash
npm install
npx expo start
```

## Environment

Set the Expo public Firebase values before using auth and Firestore features:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`
- `EXPO_PUBLIC_GEMINI_API_KEY`
