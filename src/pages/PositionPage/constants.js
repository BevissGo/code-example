import i18VN from 'i18n/locales/vn'

const { common: contentCommon } = i18VN.src

export const TEST_OPTIONS = [
  {
    label: contentCommon.discTest,
    mode: 'multiple',
    value: 'DISCScore',
    resultOption: [
      {
        label: 'All',
        value: 'all',
      },
    ],
  },
  {
    label: contentCommon.iqTest,
    value: 'IqScore',
    mode: '',
    resultOption: [
      {
        label: '>73',
        value: 73,
      },
      {
        label: '>92',
        value: 92,
      },
      {
        label: '>108',
        value: 108,
      },
      {
        label: '>111',
        value: 111,
      },
    ],
  },
  {
    label: contentCommon.eqTest,
    value: 'EqScore',
    mode: '',
    resultOption: [
      {
        label: '≤24',
        value: '24',
      },
      {
        label: '25-32',
        value: '25-32',
      },
      {
        label: '33-44',
        value: '33-44',
      },
      {
        label: '45-64',
        value: '45-64',
      },
    ],
  },
  {
    label: contentCommon.brainTest,
    value: 'BrainScore',
    mode: 'multiple',
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
]

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

export const ACTION_TYPE = {
  create: 'CREATE',
  edit: 'EDIT',
}
