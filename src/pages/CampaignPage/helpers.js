import dayjs from 'dayjs'

export const checkCampaignStatus = (startDate, endDate) => {
  const startFormatted = dayjs(startDate).format('YYYY-MM-DD')
  const endFormatted = dayjs(endDate).format('YYYY-MM-DD')
  const currentDate = dayjs().format('YYYY-MM-DD')

  if (currentDate >= startFormatted && currentDate <= endFormatted) {
    return 'processing'
  } else if (currentDate > startFormatted && currentDate > endFormatted) {
    return 'expired'
  } else {
    return 'pending'
  }
}

export const disabledDate = (current) => {
  return current && current < dayjs().endOf('day')
}

export const compareDate = (dateTimeOne, dateTimeTwo) => {
  const dateTimeOneFormatted = dayjs(dateTimeOne).format('YYYY-MM-DD')
  const dateTimeTwoFormatted = dayjs(dateTimeTwo).format('YYYY-MM-DD')

  if (dateTimeOneFormatted >= dateTimeTwoFormatted) {
    return true
  }
  return false
}

export const checkIsEdittingAndCampaignNotPending = ({ actionType, campaignStatus }) => {
  return actionType === 'edit' && campaignStatus !== 'PENDING'
}
