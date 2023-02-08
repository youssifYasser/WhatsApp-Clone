import Login from '../components/Login'

const LoginPage = ({ loading }) => {
  if (loading) return <Login loading />
  return <Login />
}

export default LoginPage
