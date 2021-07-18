export function chunkArray(array, chunkSize) {
  const newArray = []

  for (let i = 0; i < array?.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize)
    newArray.push(chunk)
  }

  return newArray
}
