//Babel allows us to convert modern js code into backwards compatible versions
//This includes converting jsx into browser-readable code

const es2015 = require('babel-preset-es2015')
const presetReact = require('babel-preset-react')
require('babel-register')({
  presets: [es2015, presetReact],
})

const Sitemap = require('react-router-sitemap').default
const router = require('./src/routes').default
const getBlogsForSitemap = require('./src/getBlogsForSitemap')

async function generateSitemap() {
  const titleList = await getBlogsForSitemap()

  let titleMap = []
  titleList.forEach((title) => {
    titleMap.push({ title: title.slug })
  })
  const pathsConfig = {
    '/blog/:title': titleMap,
  }
  return new Sitemap(router())
    .applyParams(pathsConfig)
    .build('https://tracnghiemtinhcach.vn')
    .save('./public/sitemap.xml')
}

generateSitemap()
