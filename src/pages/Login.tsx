import { useSearch } from '@tanstack/react-router'
import { LoginContainer, LoginFooter, LoginForm, OrDivider } from './Login/components'

export function Login() {
  const search = useSearch({ from: '/login' })
  const redirectPath = search.redirect

  return (
    <LoginContainer>
      <LoginForm redirectPath={redirectPath} />
      <OrDivider />
      <LoginFooter />
    </LoginContainer>
  )
} 