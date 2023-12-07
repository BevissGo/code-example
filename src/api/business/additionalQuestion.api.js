import axios from 'axios'
import config from 'configs'

const convertKey = (originalname) => {
  const lastDot = originalname.lastIndexOf('.') // exactly what it says on the tin
  const name = originalname.slice(0, lastDot) // characters from the start to the last dot
  const extension = originalname.slice(lastDot + 1) // characters after the last dot

  return `${name}-${new Date().getTime()}.${extension}`
}

const getPresignedUrl = async (file, { keyFile, update = false } = {}) => {
  try {
    const key = update ? keyFile : convertKey(file.name)

    const response = await axios.get(`${config.URIServer}/api/v2/file/upload/`, {
      params: {
        key,
        type: file.type,
      },
    })

    const options = {
      headers: { 'Content-Type': file.type, acl: 'public-read' },
    }

    await axios.put(response.data, file, options)

    return { success: true, key, url: `${config.S3Path}/${keyFile}` }
  } catch (error) {
    return { success: false, message: error }
  }
}

export { getPresignedUrl }
