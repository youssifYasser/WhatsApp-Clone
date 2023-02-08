import { getApp, getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBqgHo8LnlC3E0S5Evsz83tYIwzWM3teT0',
  authDomain: 'whatsapp-clone-3dabe.firebaseapp.com',
  projectId: 'whatsapp-clone-3dabe',
  storageBucket: 'whatsapp-clone-3dabe.appspot.com',
  messagingSenderId: '755085213329',
  appId: '1:755085213329:web:b8b002445ea11a3921c930',
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

const db = getFirestore(app)

const auth = getAuth(app)
auth.languageCode = 'en'

const provider = new GoogleAuthProvider()

export { db, auth, provider }
