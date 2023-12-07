import dayjs from 'dayjs'

export const formatDate = (date, opts = {}) => {
  const { format = 'DD/MM/YYYY', defaultValue = '' } = opts

  return date ? dayjs(date).format(format) : defaultValue
}
