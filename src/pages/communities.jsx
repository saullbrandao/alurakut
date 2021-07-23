import axios from 'axios'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Box } from '../components/Box'
import { MainGrid } from '../components/MainGrid'
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
} from '../lib/AlurakutCommons'
import { chunkArray } from '../utils/chunkArray'
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
function CommunitiesNav({
  page,
  communities,
  handlePagination,
  totalCommunities,
}) {
  return (
    <nav className="communitiesNav">
      <span>
        mostrando{' '}
        <strong>
          {page === 0 ? '1' : page * 6 + 1}-
          {page === 0
            ? communities[page]?.length
            : page * 6 + communities[page]?.length}
        </strong>{' '}
        de <strong>{totalCommunities}</strong>
      </span>
      <div className="">
        <a onClick={() => handlePagination('FIRST')}>&lt;&lt; primeira</a>
        <a onClick={() => handlePagination('PREVIOUS')}>&lt; anterior</a>
        <a onClick={() => handlePagination('NEXT')}>próxima &gt;</a>
        <a onClick={() => handlePagination('LAST')}>última &gt;&gt;</a>
      </div>
    </nav>
  )
}

const TwoColumnsGrid = styled(MainGrid)`
  @media (min-width: 860px) {
    grid-template-areas: 'profileArea communitiesArea';
    grid-template-columns: 160px 1fr;
  }
`

export default function Communities({ githubUser, userId }) {
  const [communities, setCommunities] = useState([])
  const [totalCommunities, setTotalCommunities] = useState(0)
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getCommunities() {
      const response = await axios.get('/api/users/communities', {
        params: {
          userId,
        },
      })

      const result = chunkArray(response.data.allCommunities, 6)
      setTotalCommunities(response.data.allCommunities.length)
      setCommunities(result)
      setIsLoading(false)
    }

    getCommunities()
  }, [userId])

  function handlePagination(command) {
    switch (command) {
      case 'FIRST':
        setPage(0)
        break
      case 'PREVIOUS':
        if (page > 0) {
          setPage(prevState => prevState - 1)
        }
        break
      case 'NEXT':
        if (page < communities.length - 1) {
          setPage(prevState => prevState + 1)
        }
        break
      case 'LAST':
        setPage(communities.length - 1)
        break
    }
  }

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <TwoColumnsGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>
        <div
          className="communitiesArea"
          style={{ gridArea: 'communitiesArea' }}
        >
          <Box>
            <h1 className="title">Minhas Comunidades</h1>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <>
                <CommunitiesNav
                  page={page}
                  communities={communities}
                  totalCommunities={totalCommunities}
                  handlePagination={handlePagination}
                />

                <ul className="communitiesList">
                  {communities[page]?.map(
                    ({ id, title, imageUrl, members }) => {
                      return (
                        <li key={id}>
                          <img src={imageUrl} alt={title} />
                          <div className="communityInfo">
                            <a href={`/communities/${id}`} className="listLink">
                              {title}
                            </a>
                            <p className="smallSubTitle">
                              {members.length} membros
                            </p>
                          </div>
                        </li>
                      )
                    },
                  )}
                </ul>

                <CommunitiesNav
                  page={page}
                  communities={communities}
                  totalCommunities={totalCommunities}
                  handlePagination={handlePagination}
                />
              </>
            )}
          </Box>
        </div>
      </TwoColumnsGrid>
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

  return { props }
}
