/* eslint-disable react/react-in-jsx-scope */
import React from 'react'
import {
  UserOutlined,
  BellOutlined,
} from '@ant-design/icons'
import i18nVN from 'i18n/locales/vn'

const {
  pages: { business: { dashboard }}
} = i18nVN.src

export const MENUS = [
  {
    id:1,
    label: dashboard.menu.candidate,
    icon: <UserOutlined/>
  },
  {
    id:2,
    label: dashboard.menu.positionRecruitment,
    icon: <BellOutlined />
  },
]


export const DATA_CANDIDATE_MOCK = [
  {
    id: '1',
    name: 'John Brown',
    position_recruiment:'Ux-Ui Designer',
    email: 'example@gmail.com',
    facebook_url: 'https://facebook.com',
    avt: '/images/avt1.png',
    result: {
      disc: 1,
      iq: 1
    }
  },
  {
    id: '2',
    name: 'Jim Green',
    position_recruiment:'Development',
    email: 'example@gmail.com',
    facebook_url: 'https://facebook.com',
    avt: '/images/avt1.png',
    result: {
      disc: 1,
      iq: 1
    }
  },
  {
    id: '3',
    name: 'Joe Black',
    position_recruiment:'Product Manager',
    email: 'example@gmail.com',
    facebook_url: 'https://facebook.com',
    avt: '/images/avt1.png',
    result: {
      disc: 1,
      iq: 1
    }
  },
  {
    id: '4',
    name: 'John Brown',
    position_recruiment:'Business Analytis',
    email: 'example@gmail.com',
    facebook_url: 'https://facebook.com',
    avt: '/images/avt1.png',
    result: {
      disc: 1,
      iq: 1
    }
  },
  {
    id: '5',
    name: 'Jim Green',
    position_recruiment:'Business Developer',
    email: 'example@gmail.com',
    facebook_url: 'https://facebook.com',
    avt: '/images/avt1.png',
    result: {
      disc: 1,
      iq: 1
    }
  },
]

export const DATA_RADIO = [
  {
    id: 'all',
    name: dashboard.candidate.filter.all
  },
  {
    id: 'complete',
    name: dashboard.candidate.filter.completedSurvey
  },
  {
    id: 'incomplete',
    name: dashboard.candidate.filter.incompletedSurvey
  },
]



export const DATA_POSITIONS_MOCK = [
  {
    key: '1',
    name: 'John Brown',
    chinese: 98,
    math: 60,
    english: 70,
  },
  {
    key: '2',
    name: 'Jim Green',
    chinese: 98,
    math: 66,
    english: 89,
  },
  {
    key: '3',
    name: 'Joe Black',
    chinese: 98,
    math: 90,
    english: 70,
  },
  {
    key: '4',
    name: 'Jim Red',
    chinese: 88,
    math: 99,
    english: 89,
  },
]
