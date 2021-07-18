import nookies from 'nookies'
import axios from 'axios'
import jwt from 'jsonwebtoken'

export async function checkUser(context) {
  const { USER_TOKEN } = nookies.get(context)
  if (!USER_TOKEN) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const response = await axios.get('http://localhost:3000/api/auth', {
    headers: {
      Authorization: USER_TOKEN,
    },
  })

  const { isAuthenticated } = response.data

  console.log(response.data)

  if (!isAuthenticated) {
    return { isAuth: false }
  }

  const { githubUser } = jwt.decode(USER_TOKEN)
  const datoResponse = await axios.get('http://localhost:3000/api/users', {
    params: {
      name: githubUser,
    },
  })

  let userId = datoResponse.data.id

  if (!datoResponse.data.isAuth) {
    const response = await axios.post('http://localhost:3000/api/users', {
      data: { name: githubUser },
      headers: {
        'Content-Type': 'application/json',
      },
    })
    userId = response.data.id
  }

  return {
    isAuth: true,
    props: {
      githubUser,
      userId,
    },
  }
}
