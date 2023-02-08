import Sidebar from '../components/Sidebar'
import { auth, provider } from '../firebase'
import Login from '../components/Login'
import { useState } from 'react'
import { signInWithPopup } from 'firebase/auth'

export default function Home() {
  return (
    <main>
      <Sidebar />
    </main>
  )
}
