import axios from 'axios'
import { SiteClient } from 'datocms-client'

export default async function handler(request, response) {
  if (request.method === 'POST') {
    const client = new SiteClient(process.env.NEXT_DATO_API_TOKEN)

    const record = await client.items.create({
      itemType: '966375',
      ...request.body.data,
    })

    response.json(record)
  } else {
    const datoResponse = await axios.post(
      'https://graphql.datocms.com/',
      {
        query: `query { 
            allCommunities { 
              title
              id
              imageUrl
              creatorSlug 
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

    response.json(datoResponse.data.data)
  }
}
