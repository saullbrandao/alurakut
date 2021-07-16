import { useEffect, useState } from 'react'
import { parseCookies, destroyCookie } from 'nookies'
import { useRouter } from 'next/router'

export default function Logout() {
  const [countdown, setCountdown] = useState(5)
  const router = useRouter()
  useEffect(() => {
    const { USER_TOKEN } = parseCookies()
    if (USER_TOKEN) {
      destroyCookie(null, 'USER_TOKEN')
    }

    if (countdown === 0) {
      router.push('/login')
    }

    const interval = setInterval(() => {
      setCountdown(prevState => prevState - 1)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [countdown, router])

  return <p>Você será redirecionado em {countdown}... </p>
}
