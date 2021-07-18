import axios from 'axios'
import { SiteClient } from 'datocms-client'

export default async function handler(request, response) {
  if (request.method === 'POST') {
    const client = new SiteClient(process.env.NEXT_DATO_API_TOKEN)

    const record = await client.items.create({
      itemType: process.env.NEXT_DATO_COMMUNITY_MODEL_ID,
      ...request.body.data,
    })

    response.json(record)
  } else {
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
}
