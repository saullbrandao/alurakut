import { MainGrid } from '../src/components/MainGrid'
import { Box } from '../src/components/Box'
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
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
    <Box>
      <ProfileImage
        src={`https://github.com/${githubUser}.png`}
        alt="Profile picture"
        width="128"
        height="128"
      />
    </Box>
  )
}

export default function Home() {
  const githubUser = 'saullbrandao'
  const [followers, setFollowers] = useState([])

  useEffect(() => {
    async function getFollowers(githubUser) {
      const response = await axios.get(
        `https://api.github.com/users/${githubUser}/followers`,
      )
      const followers = []
      response.data.map(user => {
        followers.push(user.login)
      })

      setFollowers(followers)
    }

    getFollowers(githubUser)
  }, [githubUser])

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
              {followers.map((user, index) => {
                if (index <= 5) {
                  return (
                    <li key={user}>
                      <a href={`/users/${user}`}>
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
          <Box>Comunidades</Box>
        </div>
      </MainGrid>
    </>
  )
}
