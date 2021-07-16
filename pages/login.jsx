/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { setCookie } from 'nookies'

export default function LoginScreen() {
  const router = useRouter()
  const [githubUser, setGithubUser] = useState('saullbrandao')
  const [validUser, setValidUser] = useState(true)

  return (
    <main
      style={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="loginScreen">
        <section className="logoArea">
          <img src="https://alurakut.vercel.app/logo.svg" alt="alurakut" />

          <p>
            <strong>Conecte-se</strong> aos seus amigos e familiares usando
            recados e mensagens instantâneas
          </p>
          <p>
            <strong>Conheça</strong> novas pessoas através de amigos de seus
            amigos e comunidades
          </p>
          <p>
            <strong>Compartilhe</strong> seus vídeos, fotos e paixões em um só
            lugar
          </p>
        </section>

        <section className="formArea">
          <form
            className="box"
            onSubmit={async event => {
              event.preventDefault()
              const response = await axios.post(
                'https://alurakut.vercel.app/api/login',
                {
                  githubUser,
                },
              )

              const token = response.data.token
              setCookie(null, 'USER_TOKEN', token, {
                path: '/',
                maxAge: 86400 * 7,
              })

              router.push('/')
              if (token) setValidUser(false)
            }}
          >
            <p>
              Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!
            </p>
            <input
              placeholder="Usuário"
              value={githubUser}
              onChange={event => setGithubUser(event.target.value)}
            />
            {!validUser && (
              <>
                <p>Usuário inválido</p>
                <br />
              </>
            )}
            <button type="submit">Login</button>
          </form>

          <footer className="box">
            <p>
              Ainda não é membro? <br />
              <a href="/login">
                <strong>ENTRAR JÁ</strong>
              </a>
            </p>
          </footer>
        </section>

        <footer className="footerArea">
          <p>
            © 2021 alura.com.br - <a href="/">Sobre o Orkut.br</a> -{' '}
            <a href="/">Centro de segurança</a> - <a href="/">Privacidade</a> -{' '}
            <a href="/">Termos</a> - <a href="/">Contato</a>
          </p>
        </footer>
      </div>
    </main>
  )
}
