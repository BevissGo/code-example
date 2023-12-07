require('dotenv').config()
const axios = require('axios')
const serverDomain = process.env.REACT_APP_DOMAIN

const getBlogsForSitemap = async () => {
  try {
    const res = await axios.get(`${serverDomain}/api/v2/blog/slug-list`)

    const { slugBlogList } = res.data
    return slugBlogList
  } catch (error) {
    console.log('error: ', error)
    return
  }
}

module.exports = getBlogsForSitemap
