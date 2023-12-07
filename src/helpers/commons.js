import { useEffect } from 'react'
import Crypto from 'crypto-js'
import randomColor from 'randomcolor'
import { toast } from 'react-toastify'

import { handleOpenModalFailure } from 'redux/services/modalError'

export const isSuccessResponse = (res, payloadFunction, pathname) => {
  const { statusCode, message } = res.data
  switch (statusCode) {
    case 200:
    case 201:
      return true
    case 204:
      toastifyNotify('warning', message)

      if (payloadFunction && pathname === '/result') {
        payloadFunction['doSurvey']()
      }

      return false
    case 401:
      toastifyNotify('error', message)

      if (payloadFunction) {
        payloadFunction['logOut']()
      }

      return false
    default:
      toastifyNotify('error', message)

      return false
  }
}

export const isAnswered = (groupQuestion) => {
  return Object.values(groupQuestion.answer).every((answer) => answer.keyIdQuestion)
}
/**
 * Show toast notification based on react-toastify
 * @param {string} type 'info' | 'success' | 'warning' | 'error' | 'default'
 * @param {*} err
 */
export const toastifyNotify = (type, err) => {
  toast[type](err, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
}

export const convertListGroupQuestionArrayToObject = (listGroupQuestion) => {
  const listEntriesGroupQuestion = listGroupQuestion.map((groupQuestion) => [
    groupQuestion.keyIdGroupQuestion,
    groupQuestion,
  ])

  return Object.fromEntries(listEntriesGroupQuestion)
}

export const renewListGroupQuestion = (listObjectGroupQuestion) => {
  const listArrayGroupQuestion = Object.values(listObjectGroupQuestion).map((groupQuestion) => ({
    ...groupQuestion,
    answer: {
      most: { keyIdQuestion: null },
      least: { keyIdQuestion: null },
    },
  }))

  return convertListGroupQuestionArrayToObject(listArrayGroupQuestion)
}

export const generateNameChart = (listValue) => {
  const listPoint = {
    D: listValue.D,
    i: listValue.I,
    S: listValue.S,
    C: listValue.C,
  }

  const filterListType = Object.entries(listPoint)
    .filter((typeDisc) => typeDisc[1] > 12)
    .sort((x, y) => y[1] - x[1])

  if (filterListType.length === 4) {
    const countValuesOfFilterListType = filterListType.reduce((object, type) => {
      // eslint-disable-next-line no-param-reassign
      object[type[1]] = object[type[1]] ? object[type[1]] + 1 : 1
      return object
    }, {})

    const sortedListType = Object.keys(countValuesOfFilterListType).sort((x, y) => y - x)

    if (sortedListType.length === 2) {
      return Object.keys(Object.fromEntries(filterListType.filter((type) => type[1].toString() === sortedListType[0])))
    } else {
      if (sortedListType.length === 3 && countValuesOfFilterListType[sortedListType[2]] === 2) {
        filterListType.splice(2, 4)
      } else {
        filterListType.pop()
      }
    }
  }
  return Object.keys(Object.fromEntries(filterListType))
}

export const getCurrentListGroupQuestion = (index, listGroupQuestion, maxGroupQuestionPerPage) => {
  return listGroupQuestion.slice(
    index * maxGroupQuestionPerPage,
    index * maxGroupQuestionPerPage + maxGroupQuestionPerPage,
  )
}

export const decryptText = (text, code) => (dispatch) => {
  try {
    if (!text || !code) {
      return
    }
    return Crypto.AES.decrypt(text, code).toString(Crypto.enc.Utf8)
  } catch (error) {
    useEffect(() => {
      dispatch(
        handleOpenModalFailure('notifyError', {
          msg: 'Something wrong happened',
        }),
      )
    }, [dispatch])
  }
}

export const getCurrentListQuestion = (index, listQuestion, maxQuestionPerPage) => {
  return listQuestion?.slice(index * maxQuestionPerPage, index * maxQuestionPerPage + maxQuestionPerPage)
}

export const generateDoughnutChartData = (total, data, labels) => {
  const colorArr = randomColor({
    hue: 'blue',
    count: total,
  })

  const labelsWithColor = labels?.map((label, index) => ({
    label: label,
    color: colorArr[index],
  }))

  return {
    datasets: [
      {
        data: data,
        backgroundColor: colorArr,
      },
    ],
    labels: labelsWithColor,
  }
}

export const generateColorWithValue = (startColor, endColor, value) => {
  /*
      Return color in gradient range from startColor 
      to endColor based on the passed value
  */
  let res = '#'
  for (let i = 0; i < 3; i++) {
    const start = i * 2 + 1
    const end = start + 2
    const reverseValue = 1 - value
    let color = Math.floor(
      (parseInt(startColor.substring(start, end), 16) - parseInt(endColor.substring(start, end), 16)) * reverseValue,
    )
    color += parseInt(endColor.substring(start, end), 16)
    res += color.toString(16).length === 1 ? '0' + color.toString(16) : color.toString(16)
  }

  return res
}

export const generateCVInfo = async (data) => {
  const cvInfo = {
    name: '',
    avt: '/images/avt1.png',
    role: '',
    address: '',
    socialAccounts: [],
    education: [],
    experience: [],
    skills: [],
    email: '',
    phoneNumber: '',
    certifications: [],
    dob: '',
  }

  cvInfo.name = data.name?.raw

  if (data.headShot) {
    const imgFile = await fetch(`data:image/png;base64,${data.headShot}`)
    cvInfo.avt = await imgFile.blob()
  }
  cvInfo.address = data.location?.rawInput
  cvInfo.socialAccounts = data.websites
  cvInfo.education = data.education?.map((edu) => ({
    feature: edu.grade?.value,
    location: edu.organization,
    field: edu.accreditation.education,
    startDate: edu.dates?.startDate || '',
    endDate: edu.dates?.completionDate || '',
  }))
  cvInfo.experience = data.workExperience?.map((exp) => ({
    field: exp.jobTitle,
    location: exp.organization,
    endDate: exp.dates?.endDate,
    startDate: exp.dates?.startDate,
  }))
  cvInfo.skills = data.skills?.map((skill) => skill.name)
  cvInfo.email = data.emails?.[0]
  cvInfo.phoneNumber = data.phoneNumbers?.[0]
  cvInfo.certifications = data.certifications?.map((certification) => ({
    feature: '',
    endDate: '',
    location: '',
    startDate: '',
    field: certification,
  }))
  cvInfo.dob = data.dateOfBirth

  return cvInfo
}

export const onlyUpperFirstLetter = (text) => {
  if (!text) {
    return text
  }
  return text?.charAt(0)?.toUpperCase() + text?.slice(1).toLowerCase()
}

export const calcTotalResultPassedOrFailed = (candidate) => {
  let iqResult = 'Passed'
  let eqResult = 'Passed'
  let brainResult = 'Passed'
  let discResult = 'Passed'

  const position = candidate.campaignId.positions.filter((pos) => pos.positionId === candidate.positionId.Id)[0]

  if (candidate.iqScoreId) {
    if (candidate.iqScoreId.score < position.iqScore) {
      iqResult = 'Failed'
    }
  }

  if (candidate.eqScoreId) {
    if (candidate.eqScoreId.score < position.eqScore.min) {
      eqResult = 'Failed'
    }
  }

  if (candidate.brainScoreId) {
    if (position.brainScore[0] === 'all') {
      brainResult = 'Passed'
    } else if (!position.brainScore.includes(candidate.brainScoreId.sideOfBrain)) {
      brainResult = 'Failed'
    }
  }

  if (candidate.discScoreId) {
    if (position.discScore[0] === 'all') {
      discResult = 'Passed'
    } else if (!position.discScore.includes(candidate.discScoreId.profilePattern.value)) {
      discResult = 'Failed'
    }
  }

  const resultList = candidate.customTestScoreId?.map((result) => result.score >= result.fitCorrect)

  const finalResult = [
    iqResult === 'Passed' ? true : false,
    eqResult === 'Passed' ? true : false,
    brainResult === 'Passed' ? true : false,
    discResult === 'Passed' ? true : false,
    ...resultList,
  ].every(Boolean)

  if (!finalResult) {
    return 'Failed'
  }

  return 'Passed'
}

export const isWebviewIOS = () => /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent)
