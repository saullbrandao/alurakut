import jwt from 'jsonwebtoken'

export default async function githubAuth(req, res) {
  const { authorization } = req.headers

  const tokenDecoded = jwt.verify(authorization, 'example')

  if (!tokenDecoded) {
    return res.send({
      isAuthenticated: false,
    })
  }

  res.send({
    isAuthenticated: true,
  })
}
