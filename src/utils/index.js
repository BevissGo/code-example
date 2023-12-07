import { toastifyNotify } from 'helpers'

export const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$')

export const phoneRegExp = /^$|((84|0)[3|5|7|8|9]|0(2[4|8]|[0-9]{3}))+([0-9]{8})\b$/

export const websiteRegExp =
  /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/

export const emailRegExp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const validateEmail = (email) => {
  return !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/gm.test(email)
}

export const setValueToStorage = (name, value) => {
  localStorage.setItem(name, value)
}

export const getValueFromStorage = (name) => {
  const value = localStorage.getItem(`${name}`)
  return value
}

export const removeValueFromStorage = (name) => {
  localStorage.removeItem(`${name}`)
}

export const clearStorage = () => {
  localStorage.clear()
}

export const isAuthenticated = () => {
  return getValueFromStorage('access-token')
}

export const redirectToWithPush = (history, path) => {
  history.push(path)
}

export const redirectToWithReplace = (history, path) => {
  history.replace(path)
}

export function symbolSeparating(value, number, symbol) {
  return value.toString().replace(new RegExp(`\\B(?=(\\d{${number}})+(?!\\d))`, 'g'), symbol)
}

export const copyToClipboard = (text) => {
  const dummy = document.createElement('textarea')
  document.body.appendChild(dummy)
  dummy.value = text
  dummy.select()
  document.execCommand('copy')
  document.body.removeChild(dummy)

  toastifyNotify('success', 'Copied to clipboard')
}

export const uppercaseFirstText = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const disableScrollAfterOpenModal = (status) => {
  const body = document.body
  status ? body.classList.add('modal-open') : body.classList.remove('modal-open')
}

export const formatLetterToAlphabetEN = (text) => {
  let str = text
  str = str.normalize('NFD')
  str = str.replace(/[\u0300-\u036f]/g, '')
  str = str.replace(/[đĐ]/g, (m) => (m === 'đ' ? 'd' : 'D'))
  str = str.replace(/[0-9-!@#$%^&*()_+|~=`{}\\[\]:";'<>?,.\\/]/g, '')

  return str
}

export const convertTotalTestTimeToString = (time = '', unit = {}) => {
  const { totalTimeDescription = 'với thời gian', minute = 'phút', second = 'giây', connector = 'và' } = unit
  const [totalMinute, totalSecond] = time.toString().split(':').map(Number)
  const showMinute = totalMinute === 0 ? '' : `${totalMinute} ${minute}`
  const showSecond = totalSecond === 0 ? '' : `${totalSecond} ${second}`
  return `${totalTimeDescription} ${showMinute} ${
    totalSecond !== 0 && totalMinute !== 0 ? connector : ''
  } ${showSecond}.`
}

export const formatSeconds = (seconds = 0) => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0')
  return `${minutes}:${remainingSeconds}`
}
