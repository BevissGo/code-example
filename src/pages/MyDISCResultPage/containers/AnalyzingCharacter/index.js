import React from 'react'
import { useSelector } from 'react-redux'
import ScrollAnimation from 'react-animate-on-scroll'

import './style.scss'

const AnalyzingCharacter = () => {
  const profilePattern = useSelector((state) => state.report.profilePattern)

  const listPros = profilePattern.listProsAndCons?.pros || []

  const listCons = profilePattern.listProsAndCons?.cons || []

  const relationship = profilePattern?.relationship || []

  const listKeySuccess = profilePattern?.keySuccess || []

  return (
    <div className='analyzing-character'>
      <div className='analyzing-character__summary'>
        <div className='analyzing-character__summary__pros-and-cons'>
          <div className='analyzing-character__summary__pros-and-cons--pros'>
            <ScrollAnimation
              offset={0}
              animateIn='animate__fadeInLeft'
              duration={0.75}
              animateOnce={true}
            >
              <div className='analyzing-character__summary__pros-and-cons--pros__background'>
                <p className='analyzing-character__summary__pros-and-cons--pros__title'>
                  Ưu điểm
                </p>

                <ul className='analyzing-character__summary__pros-and-cons--pros__list-pros'>
                  {listPros.map((pros, inx) => (
                    <li key={inx}>
                      <span>{pros}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollAnimation>
          </div>
          <div className='analyzing-character__summary__pros-and-cons--cons'>
            <ScrollAnimation
              offset={0}
              animateIn='animate__fadeInRight'
              duration={0.75}
              animateOnce={true}
            >
              <div className='analyzing-character__summary__pros-and-cons--cons__background'>
                <p className='analyzing-character__summary__pros-and-cons--cons__title'>
                  Nhược điểm
                </p>

                <ul className='analyzing-character__summary__pros-and-cons--cons__list-pros'>
                  {listCons.map((cons, inx) => (
                    <li key={inx}>
                      <span>{cons}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
      <div className='line-break'></div>
      <div className='analyzing-character__relationship-and-key'>
        <div className='analyzing-character__relationship-and-key--relationship'>
          <ScrollAnimation
            offset={0}
            animateIn='animate__fadeInLeft'
            duration={0.75}
            animateOnce={true}
          >
            <p className='analyzing-character__relationship-and-key--relationship__title'>
              Mối quan hệ
            </p>
            <p className='analyzing-character__relationship-and-key--relationship__description'>
              {relationship}
            </p>
          </ScrollAnimation>
        </div>
        <div className='analyzing-character__relationship-and-key--key-success'>
          <ScrollAnimation
            offset={0}
            animateIn='animate__fadeInRight'
            duration={0.75}
            animateOnce={true}
          >
            <p className='analyzing-character__relationship-and-key--key-success__title'>
              Chìa khóa thành công của bạn là đây
            </p>
            <div className='analyzing-character__relationship-and-key--key-success__list-description'>
              {listKeySuccess.map((keySuccess, inx) => (
                <p
                  key={inx}
                  className='analyzing-character__relationship-and-key--key-success__description'
                >
                  {keySuccess}
                </p>
              ))}
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </div>
  )
}

export default AnalyzingCharacter
