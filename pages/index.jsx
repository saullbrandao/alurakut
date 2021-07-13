import { MainGrid } from '../src/components/MainGrid'
import { Box } from '../src/components/Box'
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import styled from 'styled-components'

const ProfileImage = styled(Image)`
  border-radius: 8px;
`

function ProfileSidebar({ githubUser }) {
  return (
    <Box as="aside">
      <ProfileImage
        src={`https://github.com/${githubUser}.png`}
        alt="Profile picture"
        width="128"
        height="128"
      />
      <hr />
      <p>
        <a href={`https://github.com/${githubUser}`} className="boxLink">
          @{githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

export default function Home() {
  const githubUser = 'torvalds'
  const [communities, setCommunities] = useState([
    {
      id: 'gergerherthrthrthjrthjrtyrtyjtyjktym514614',
      title: 'Eu odeio acordar cedo',
      url: 'https://github.com',
    },
  ])
  const [followers, setFollowers] = useState([])

  useEffect(() => {
    async function getFollowers(githubUser) {
      const response = await axios.get(
        `https://api.github.com/users/${githubUser}/followers`,
      )
      const followers = []
      response.data.map(user => {
        followers.push({ user: user.login, url: user.html_url })
      })

      setFollowers(followers)
    }

    getFollowers(githubUser)
  }, [githubUser])

  function handleCreateCommunity(event) {
    event.preventDefault()
    const formData = new FormData(event.target)

    const newCommunity = {
      id: new Date().toISOString(),
      title: formData.get('title'),
      url: formData.get('url'),
    }
    setCommunities([...communities, newCommunity])

    for (let key of formData.keys()) {
      formData.delete(key)
    }
    document.getElementById('addCommunityForm').reset()
  }

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>
            <OrkutNostalgicIconSet confiavel={3} legal={2} sexy={1} />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form id="addCommunityForm" onSubmit={handleCreateCommunity}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                  required
                />
              </div>

              <div>
                <input
                  placeholder="Coloque a URL de acesso da sua comunidade"
                  name="url"
                  aria-label="Coloque a URL de acesso da sua comunidade"
                  type="url"
                />
              </div>

              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: 'profileRelationsArea' }}
        >
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({followers.length})
            </h2>
            <ul>
              {followers.map(({ user, url }, index) => {
                if (index <= 5) {
                  return (
                    <li key={user}>
                      <a href={url} target="_blank" rel="noreferrer">
                        <Image
                          src={`https://github.com/${user}.png`}
                          alt="Profile picture"
                          layout="fill"
                          objectFit="cover"
                        />
                        <span>{user}</span>
                      </a>
                    </li>
                  )
                }
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Comunidades ({communities.length})</h2>
            <ul>
              {communities.map(({ title, id, url }, index) => {
                if (index <= 5) {
                  return (
                    <li key={id}>
                      <a href={url} target="blank" rel="external">
                        <Image
                          src={`https://picsum.photos/300?${title}`}
                          alt="Community picture"
                          layout="fill"
                          objectFit="cover"
                        />
                        <span>{title}</span>
                      </a>
                    </li>
                  )
                }
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}
