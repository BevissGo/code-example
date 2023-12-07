function wrapRule(rule) {
  return { validator: rule, trigger: ['blur', 'change'] }
}

function parseMessage(message) {
  return message || Promise.reject(message)
}

export function ruleNumber(message) {
  message = message || 'invalid_number'
  const pattern = /^[0-9]*$/

  return wrapRule((_rule, value) => {
    if (pattern.test(value)) {
      return Promise.resolve()
    }

    if (!!value && !pattern.test(value)) {
      return Promise.reject(parseMessage(message || ''))
    }
    return Promise.reject()
  })
}

export function ruleNumberThanZero(message) {
  message = message || 'invalid_number'
  const pattern = /^[1-9][0-9]*$/

  return wrapRule((_rule, value) => {
    if (pattern.test(value)) {
      return Promise.resolve()
    }

    if (!!value && !pattern.test(value)) {
      return Promise.reject(parseMessage(message || ''))
    }
    return Promise.reject()
  })
}

export function ruleNumberByCorrect(questionNumber, message) {
  message = message || 'invalid_number'
  const pattern = /^[1-9][0-9]*$/

  return wrapRule((_rule, value) => {
    if (pattern.test(value) && value <= questionNumber) {
      return Promise.resolve()
    }

    if (!!value && !pattern.test(value) && value > questionNumber) {
      return Promise.reject(parseMessage(message || ''))
    }

    if (value > questionNumber) {
      return Promise.reject(parseMessage(message || ''))
    }

    return Promise.reject()
  })
}

export function ruleNumberRange(message) {
  message = message || 'invalid_number'
  const pattern = /\b([1-9]|[1-9][0-9]|100)\b/

  return wrapRule((_rule, value) => {
    if (pattern.test(value)) {
      return Promise.resolve()
    }

    if (!!value && !pattern.test(value)) {
      return Promise.reject(parseMessage(message || ''))
    }
    return Promise.reject()
  })
}

export function ruleNumberPhone(message) {
  message = message || 'invalid_number'
  const pattern = /(84|0[3|5|7|8|9])+([0-9]{8})\b/

  return wrapRule((_rule, value) => {
    if (pattern.test(value)) {
      return Promise.resolve()
    }

    if (!!value && !pattern.test(value)) {
      return Promise.reject(parseMessage(message || ''))
    }
    return Promise.reject()
  })
}

export function ruleFacebookLink(message) {
  message = message || 'invalid_number'
  const pattern =
    /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w-]*)?/

  return wrapRule((_rule, value) => {
    if (pattern.test(value)) {
      return Promise.resolve()
    }

    if (!!value && !pattern.test(value)) {
      return Promise.reject(parseMessage(message || ''))
    }
    return Promise.reject()
  })
}

export function ruleValidateLink(message) {
  message = message || 'Invalid'
  const pattern = /^(https?:\/\/)?[a-z0-9-]*\.?[a-z0-9-]+\.[a-z0-9-]+(\/[^<>]*)?$/

  return wrapRule((_rule, value) => {
    if (pattern.test(value)) {
      return Promise.resolve()
    }
    if (!!value && !pattern.test(value)) {
      return Promise.reject(parseMessage(message || ''))
    }
    return Promise.reject()
  })
}

export function ruleValidateImage(message) {
  message = message || 'Invalid'
  const pattern = ['image/jpg', 'image/jpeg', 'image/png']

  return wrapRule((_rule, value) => {
    if (pattern.includes(`${value.file.type}`)) {
      return Promise.resolve()
    }
    if (!!value && !pattern.includes(value?.file?.type)) {
      return Promise.reject(parseMessage(message || ''))
    }
    return Promise.reject()
  })
}

export function ruleCheckSizeFile(message) {
  message = message || 'Invalid'

  return wrapRule((_rule, value) => {
    if (value.file.size <= 5 * 1024 * 1024) {
      return Promise.resolve()
    } else {
      return Promise.reject(parseMessage(message || ''))
    }
  })
}
