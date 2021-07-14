import { useEffect, useState } from 'react'
import { MainGrid } from '../src/components/MainGrid'
import { Box } from '../src/components/Box'
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'
import axios from 'axios'
import Image from 'next/image'
import styled from 'styled-components'
import { checkImage } from '../src/utils/checkImage'

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

function CommunityBox({ data, title }) {
  return (
    <>
      <h2 className="smallTitle">
        {title} ({data.length})
      </h2>
      <ul>
        {data.map(({ name, url, imageUrl, id }, index) => {
          if (index <= 5) {
            return (
              <li key={id}>
                <a href={url} target="_blank" rel="noreferrer">
                  <Image
                    src={imageUrl}
                    alt="Profile picture"
                    layout="fill"
                    objectFit="cover"
                  />
                  <span>{name}</span>
                </a>
              </li>
            )
          }
        })}
      </ul>
    </>
  )
}

export default function Home() {
  const githubUser = 'torvalds'
  const [communities, setCommunities] = useState([
    {
      id: 'gergerherthrthrthjrthjrtyrtyjtyjktym514614',
      name: 'Eu odeio acordar cedo',
      imageUrl: 'https://alurakut.vercel.app/capa-comunidade-01.jpg',
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
        followers.push({
          name: user.login,
          url: user.html_url,
          imageUrl: user.avatar_url,
          id: user.id,
        })
      })

      setFollowers(followers)
    }

    getFollowers(githubUser)
  }, [githubUser])

  async function handleCreateCommunity(event) {
    event.preventDefault()
    const formData = new FormData(event.target)

    const imageUrl = formData.get('image')

    const validImage = await checkImage(imageUrl)

    const newCommunity = {
      id: new Date().toISOString(),
      title: formData.get('title'),
      imageUrl: validImage
        ? imageUrl
        : `https://picsum.photos/300?${formData.get('title')}`,
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
            <h1 className="title">Bem vindo(a), {githubUser}</h1>
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
                  placeholder="Coloque a URL da imagem da sua comunidade"
                  name="image"
                  aria-label="Coloque a URL da imagem da sua comunidade"
                  type="url"
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
            <CommunityBox data={followers} title="Pessoas da comunidade" />
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <CommunityBox data={communities} title="Comunidades" />
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}
