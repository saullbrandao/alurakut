import axios from 'axios'
import jwt from 'jsonwebtoken'

export default async function Login(req, res) {
  if (req.method === 'POST') {
    const { githubUser } = req.body
    try {
      const response = await axios.get(
        `https://api.github.com/users/${githubUser}`,
      )
      const { login } = response.data
      const token = jwt.sign(
        { githubUser: login, roles: ['user'] },
        'example',
        {
          expiresIn: 60 * 60 * 24 * 7,
        },
      )

      res.json({ token, ok: true })
    } catch (err) {
      res.json({ message: 'invalid user', ok: false })
    }
  }
}
