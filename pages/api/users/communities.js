import axios from 'axios'

export default async function handler(request, response) {
  const { userId } = request.query
  const datoResponse = await axios.post(
    'https://graphql.datocms.com/',
    {
      query: `query { 
        allCommunities(orderBy: _createdAt_ASC, filter: {members: {anyIn: ${userId}}}) {
          title
          imageUrl
          id
          members {
            name
          }
        }}`,
    },
    {
      headers: {
        Authorization: `BEARER ${process.env.NEXT_DATO_API_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  )

  response.json(datoResponse.data.data)
}
