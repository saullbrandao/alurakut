import axios from 'axios'

export async function checkImage(url) {
  try {
    const res = await axios.get(url, { responseType: 'blob' })
    return res.data.type.startsWith('image/')
  } catch (err) {
    return false
  }
}
