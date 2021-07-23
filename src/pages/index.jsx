/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import { MainGrid } from '../components/MainGrid'
import { Box } from '../components/Box'
import { ProfileRelationsBoxWrapper } from '../components/ProfileRelations'
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from '../lib/AlurakutCommons'
import axios from 'axios'
import { checkImage } from '../utils/checkImage'
import { checkUser } from '../utils/checkUser'

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

function ProfileRelationsBox({ data, boxTitle, githubUser }) {
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
                <a href={url || `/communities/${id}`}>
                  <img src={imageUrl} alt="Profile picture" />
                  <span>{name || title}</span>
                </a>
              </li>
            )
          }
        })}
      </ul>
      <hr />
      <a
        href={
          boxTitle === 'Seguidores'
            ? `https://github.com/${githubUser}?tab=followers`
            : boxTitle === 'Seguindo'
            ? `https://github.com/${githubUser}?tab=following`
            : `/communities`
        }
        className="boxLink"
      >
        Ver todos
      </a>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home({ githubUser, userId }) {
  const [communities, setCommunities] = useState([])
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [loading, setLoading] = useState(false)

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
    async function getFollowing(githubUser) {
      const response = await axios.get(
        `https://api.github.com/users/${githubUser}/following`,
      )
      const following = []
      response.data.map(user => {
        following.push({
          name: user.login,
          url: user.html_url,
          imageUrl: user.avatar_url,
          id: user.id,
        })
      })

      setFollowing(following)
    }

    async function getCommunities() {
      const response = await axios.get('/api/users/communities', {
        params: {
          userId,
        },
      })
      setCommunities(response.data.allCommunities)
    }

    getCommunities()
    getFollowers(githubUser)
    getFollowing(githubUser)
  }, [githubUser, userId])

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
      members: [userId],
    }

    setLoading(true)
    const response = await axios.post('/api/communities', {
      data: newCommunity,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.status === 200) {
      setLoading(false)
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

              <button disabled={loading}>Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: 'profileRelationsArea' }}
        >
          <ProfileRelationsBox
            data={followers}
            githubUser={githubUser}
            boxTitle="Seguidores"
          />
          <ProfileRelationsBox
            data={following}
            githubUser={githubUser}
            boxTitle="Seguindo"
          />
          <ProfileRelationsBox
            data={communities}
            githubUser={githubUser}
            boxTitle="Minhas Comunidades"
          />
        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {
  const { isAuth, props } = await checkUser(context)
  if (!isAuth) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props,
  }
}
