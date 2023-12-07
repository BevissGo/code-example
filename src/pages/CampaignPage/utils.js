import i18VN from 'i18n/locales/vn'
const { common: contentCommon } = i18VN.src

export const campaignStatus = {
  processing: {
    title: 'PROCESSING',
    background: '#EBF9EE',
    color: '#4DAF4B',
  },
  expired: {
    title: 'EXPIRED',
    background: '#FFECEC',
    color: '#F12A2A',
  },
  pending: {
    title: 'PENDING',
    background: '#FFF5D5',
    color: '#AE8603',
  },
  cancelled: {
    title: 'CANCELLED',
    background: '#E9E9EB',
    color: '#000000',
  },
}

export const eqScoreRange = {
  '': {},
  24: {
    min: 0,
    max: 24,
  },
  '25-32': {
    min: 25,
    max: 32,
  },
  '33-44': {
    min: 33,
    max: 44,
  },
  '45-64': {
    min: 45,
    max: 64,
  },
}

export const TEST_OPTIONS = [
  {
    label: contentCommon.iqTest,
    mode: '',
    value: 'iq_score',
    resultOption: [
      {
        label: '≥ 73 (Very Low)',
        value: 73,
      },
      {
        label: '≥ 77 (Low)',
        value: 77,
      },
      {
        label: '≥ 84 (Middle Low)',
        value: 84,
      },
      {
        label: '≥ 94 (Middle)',
        value: 94,
      },
      {
        label: '≥ 101 (High)',
        value: 101,
      },
      {
        label: '≥ 108 (Very High)',
        value: 108,
      },
      {
        label: '≥ 114 (Great)',
        value: 114,
      },
      {
        label: '≥ 125 (Very Great)',
        value: 125,
      },
      {
        label: '≥ 146 (Genius)',
        value: 146,
      },
    ],
  },
  {
    label: contentCommon.eqTest,
    mode: '',
    value: 'eq_score',
    resultOption: [
      {
        label: '≥ 0 (Low)',
        value: '24',
      },
      {
        label: '≥ 25 (Middle)',
        value: '25-32',
      },
      {
        label: '≥ 33 (High)',
        value: '33-44',
      },
      {
        label: '≥ 45 (Great)',
        value: '45-64',
      },
    ],
  },
  {
    label: contentCommon.brainTest,
    mode: 'multiple',
    value: 'brain_score',
    resultOption: [
      {
        label: 'All',
        value: 'all',
      },
      {
        label: 'Left brain',
        value: 'L',
      },
      {
        label: 'Right brain',
        value: 'R',
      },
    ],
  },
  {
    label: contentCommon.discTest,
    mode: 'multiple',
    value: 'disc_score',
    resultOption: [{ label: 'All', value: 'All' }],
  },
]

export const requiredAnswerOption = [
  {
    label: 'Required',
    value: true,
  },
  {
    label: 'Optional',
    value: false,
  },
]

export const typeAnswerOption = [
  {
    label: 'Text',
    value: 'text',
  },
  {
    label: 'Link',
    value: 'link',
  },
  {
    label: 'Image',
    value: 'image',
  },
  {
    label: 'File',
    value: 'file',
  },
]

export const sexOption = [
  {
    label: 'Nam',
    value: 'male',
  },
  {
    label: 'Nữ',
    value: 'female',
  },
]

export const UPLOAD_OPTIONS = [
  {
    label: 'CV',
    value: 'cv',
    requireValue: 'require_attach_cv',
    resultOption: [
      {
        label: 'Required',
        value: true,
      },
      {
        label: 'Optional',
        value: false,
      },
    ],
  },
  {
    label: 'Cover Letter',
    value: 'cover_letter',
    requireValue: 'require_attach_cover_letter',
    resultOption: [
      {
        label: 'Required',
        value: true,
      },
      {
        label: 'Optional',
        value: false,
      },
    ],
  },
]

export const convertEqScoreRange = (range) => {
  if (range.min === 0) {
    return '24'
  }
  return `${range.min}-${range.max}`
}
