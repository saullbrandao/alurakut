import axios from 'axios'
import { SiteClient } from 'datocms-client'

export default async function handler(request, response) {
  if (request.method === 'POST') {
    const client = new SiteClient(process.env.NEXT_DATO_API_TOKEN)

    const record = await client.items.create({
      itemType: process.env.NEXT_DATO_USER_MODEL_ID,
      ...request.body.data,
    })

    response.json(record)
  } else {
    const { name } = request.query
    const datoResponse = await axios.post(
      'https://graphql.datocms.com/',
      {
        query: `query { 
        user(filter: {name: {eq: ${name}}}) {
          id
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

    if (datoResponse.data.data.user) {
      response.send({ isAuth: true, id: datoResponse.data.data.user.id })
    } else {
      response.send({ isAuth: false })
    }
  }
}
