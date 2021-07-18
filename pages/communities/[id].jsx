import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Box } from '../../src/components/Box'
import { MainGrid } from '../../src/components/MainGrid'
import { ProfileRelationsBoxWrapper } from '../../src/components/ProfileRelations'
import {
  AlurakutCommunitySidebarMenuDefault,
  AlurakutMenu,
} from '../../src/lib/AlurakutCommons'
import { checkUser } from '../../src/utils/checkUser'

function ProfileSidebar({ community }) {
  return (
    <Box as="aside">
      <img src={community?.imageUrl} alt="Community picture" />
      <hr />
      <p>
        <a href={`/communities/${community?.id}`} className="boxLink">
          {community?.title}
        </a>
      </p>
      <p className="smallSubTitle">({community?.members?.length} membros)</p>
      <hr />

      <AlurakutCommunitySidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox({ members, boxTitle }) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {boxTitle} ({members?.length || 0})
      </h2>
      <ul>
        {members?.map(({ name }, index) => {
          if (index <= 5) {
            return (
              <li key={name + index}>
                <a href={`https://github.com/${name}`}>
                  <img
                    src={`https://github.com/${name}.png`}
                    alt="Profile picture"
                  />
                  <span>{name}</span>
                </a>
              </li>
            )
          }
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Communities({ githubUser }) {
  const router = useRouter()
  const { id } = router.query
  const [community, setCommunity] = useState({})

  useEffect(() => {
    async function getCommunityData() {
      if (id) {
        const response = await axios.get('/api/communities', {
          params: {
            id,
          },
        })
        if (response.status === 200) {
          setCommunity(response.data)
        }
      }
    }

    getCommunityData()
  }, [id])

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar community={community} username={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">{community?.title}</h1>
            <ul className="aboutList">
              <li>idioma: Português</li>
              <li>categoria: Pessoas</li>
              <li>
                dono:&nbsp;
                <a
                  href={`/users/${community?.creatorSlug}`}
                  className="boxLink"
                >
                  {' '}
                  {community?.creatorSlug}
                </a>
              </li>
              <li>moderadores: nenhum</li>
              <li>tipo: pública</li>
              <li>privacidade de conteúdo: aberta para não-membros</li>
              <li>local: Brasil</li>
              <li>criado em: Portugues</li>
              <li>membros: {community?.members?.length}</li>
            </ul>
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: 'profileRelationsArea' }}
        >
          <ProfileRelationsBox
            members={community?.members}
            boxTitle="Membros"
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
