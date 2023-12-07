import React from 'react'
import ScrollAnimation from 'react-animate-on-scroll'
import { useSelector, useDispatch } from 'react-redux'

import { decryptText } from 'helpers'
import i18nPremiumVN from 'i18n/locales/premiumVN.js'
import ProfileExample from '../../components/CardProfilePattern'

import './style.scss'

const Influencer = () => {
  const dispatch = useDispatch()
  const keyCode = useSelector((state) => state.profile.keyCode)
  const profilePattern = useSelector((state) => state.report.profilePattern)

  const {
    pages: {
      result: { analyzeCharacter: contentContainerPremium },
    },
  } = i18nPremiumVN.src

  const listFamous =
    contentContainerPremium.premium.listFamous[profilePattern?.value] || []

  return (
    <div className='influencer'>
      <div className='influencer__summary'>
        <div className='influencer__summary__intro'>
          <div className='influencer__summary__intro__title'>
            <ScrollAnimation
              offset={0}
              animateIn='animate__fadeIn'
              duration={0.75}
              animateOnce={true}
            >
              <span>Những nhân vật nổi tiếng mang nét tính cách của bạn</span>
            </ScrollAnimation>
          </div>
          <div className='influencer__summary__intro__description'>
            <ScrollAnimation
              offset={0}
              animateIn='animate__fadeIn'
              duration={0.75}
              animateOnce={true}
            >
              <span>
                Tính cách của bạn được thể hiện nhiều ở những người nổi tiếng
                hoạt động trên các lĩnh vực ngoại giao, kinh tế, luật pháp. Hãy
                xem họ là ai qua danh sách bên dưới
              </span>
            </ScrollAnimation>
          </div>
        </div>
        <div className='influencer__summary__list-example'>
          <div className='influencer__summary__list-example__background left'>
            <ScrollAnimation
              offset={0}
              animateIn='animate__fadeInLeft'
              duration={0.75}
              animateOnce={true}
            >
              <ProfileExample
                avatar={
                  listFamous[0]?.avatar ||
                  'https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80'
                }
                name={dispatch(decryptText(listFamous[0]?.name, keyCode))}
                major={dispatch(decryptText(listFamous[0]?.major, keyCode))}
              />
            </ScrollAnimation>
          </div>
          <div className='influencer__summary__list-example__background'>
            <ScrollAnimation
              offset={0}
              animateIn='animate__fadeInRight'
              duration={0.75}
              animateOnce={true}
            >
              <ProfileExample
                avatar={
                  listFamous[1]?.avatar ||
                  'https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80'
                }
                name={dispatch(decryptText(listFamous[1]?.name, keyCode))}
                major={dispatch(decryptText(listFamous[1]?.major, keyCode))}
              />
            </ScrollAnimation>
          </div>
        </div>
      </div>
      <div className='line-break'></div>
    </div>
  )
}

export default Influencer
