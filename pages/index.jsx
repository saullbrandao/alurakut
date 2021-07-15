/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import { MainGrid } from '../src/components/MainGrid'
import { Box } from '../src/components/Box'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from '../src/lib/AlurakutCommons'
import axios from 'axios'
import { checkImage } from '../src/utils/checkImage'

function ProfileSidebar({ githubUser }) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${githubUser}.png`} alt="Profile picture" />
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

function ProfileRelationsBox({ data, boxTitle }) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {boxTitle} ({data?.length || 0})
      </h2>
      <ul>
        {data?.map(({ title, name, url, imageUrl, id }, index) => {
          if (index <= 5) {
            return (
              <li key={id}>
                <a
                  href={url || `/communities/${id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={imageUrl} alt="Profile picture" />
                  <span>{name || title}</span>
                </a>
              </li>
            )
          }
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  const githubUser = 'saullbrandao'
  const [communities, setCommunities] = useState([])
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

    async function getCommunities() {
      const response = await axios.get('/api/communities')
      if (response.status === 200) {
        setCommunities(response.data.allCommunities)
      }
    }

    getCommunities()
    getFollowers(githubUser)
  }, [githubUser])

  async function handleCreateCommunity(event) {
    event.preventDefault()
    const formData = new FormData(event.target)

    const imageUrl = formData.get('image')

    const validImage = await checkImage(imageUrl)

    const newCommunity = {
      title: formData.get('title'),
      imageUrl: validImage
        ? imageUrl
        : `https://picsum.photos/seed/${formData.get('title')}/300`,
      creatorSlug: githubUser,
    }
    const response = await axios.post('/api/communities', {
      data: newCommunity,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.status === 200) {
      setCommunities([...communities, response.data])
    }

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

              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: 'profileRelationsArea' }}
        >
          <ProfileRelationsBox data={followers} boxTitle="Meus Amigos" />
          <ProfileRelationsBox
            data={communities}
            boxTitle="Minhas Comunidades"
          />
        </div>
      </MainGrid>
    </>
  )
}
