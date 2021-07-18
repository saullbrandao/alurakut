import axios from 'axios'

export default async function handler(request, response) {
  const { id } = request.query
  const datoResponse = await axios.post(
    'https://graphql.datocms.com/',
    {
      query: `query { 
          community(filter: {id: {eq: ${id}}}) { 
            title
            id
            imageUrl
            creatorSlug
            members {
              name
            }
          } 
        }`,
    },
    {
      headers: {
        Authorization: `BEARER ${process.env.NEXT_DATO_API_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  )

  response.json(datoResponse.data.data.community)
}
