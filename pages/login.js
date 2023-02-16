import { signInWithPopup } from 'firebase/auth'
import Login from '../components/Login'
import { auth, provider } from '../firebase'

const LoginPage = ({ loading, setLoadApp }) => {
  const handleSignInEmail = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setLoadApp(true)
      })
      .catch(alert)
  }
  if (loading) return <Login loading />
  return <Login handleSignInEmail={handleSignInEmail} setLoadApp={setLoadApp} />
}

export default LoginPage
