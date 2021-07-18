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

  const response = await axios.get(`${process.env.NEXT_BASE_URL}/api/auth`, {
    headers: {
      Authorization: USER_TOKEN,
    },
  })

  const { isAuthenticated } = response.data

  if (!isAuthenticated) {
    return { isAuth: false }
  }

  const { githubUser } = jwt.decode(USER_TOKEN)
  const datoResponse = await axios.get(
    `${process.env.NEXT_BASE_URL}/api/users`,
    {
      params: {
        name: githubUser,
      },
    },
  )

  let userId = datoResponse.data.id

  if (!datoResponse.data.isAuth) {
    const response = await axios.post(
      `${process.env.NEXT_BASE_URL}/api/users`,
      {
        data: { name: githubUser },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
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
