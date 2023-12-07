import React from 'react'
import ScrollAnimation from 'react-animate-on-scroll'

import logoDISC from 'assets/images/logos/logo-disc-sm.png'
import logoBCT from 'assets/images/logos/logo-bo-cong-thuong.png'
import i18VN from 'i18n/locales/vn'

import './style.scss'

const FooterPage = () => {
  const { common: contentCommon } = i18VN.src

  return (
    <div className='footer-page'>
      <div className='footer-page__upper-section'>
        <div className='footer-page__left'>
          <ScrollAnimation offset={0} duration={0.75} animateOnce={true} animateIn='animate__fadeIn'>
            <div className='footer-page__disc-name'>
              <img src={logoDISC} width='50' alt='cannot display' />
              <span className='footer-page__url'>{contentCommon.nameDisc}</span>
            </div>
          </ScrollAnimation>
          <ScrollAnimation offset={0} duration={0.75} animateOnce={true} animateIn='animate__fadeIn'>
            <ul>
              <li>
                <a href='/what-disc'>{contentCommon.navbar.whatDiSC}</a>
              </li>
              <li>
                <a href='/which-disc'>{contentCommon.navbar.whichDiSC}</a>
              </li>
              <li>
                <a href='/blog'>{contentCommon.navbar.blog}</a>
              </li>
              <li>
                <a href='/policy-terms'>{contentCommon.navbar.policyTerm}</a>
              </li>
            </ul>
          </ScrollAnimation>
          <div className='footer-page__BCT hidden-mobile'>
            <a href='http://online.gov.vn/Home/WebDetails/76569'>
              <img alt='' title='' width='267px' height='101px' src={logoBCT} />
            </a>
          </div>
        </div>
        <div className='footer-page__company-info'>
          <ul>
            {contentCommon.companyInfo.map((sentence, index) => (
              <li key={`company-info-${index}`}>{sentence}</li>
            ))}
          </ul>
          <div className='hidden-PC'>
            <a href='http://online.gov.vn/Home/WebDetails/76569'>
              <img alt='' title='' width='267px' height='101px' src={logoBCT} />
            </a>
          </div>
        </div>
      </div>
      <div>
        <hr className='hidden-mobile' />
        <div className='footer-page__copyright-section'>
          <div>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://goldenowl.asia/'
              className='footer-page__copyright'
            >
              Copyright &#169; 2021 DiSC
            </a>
          </div>
          <div>
            <a
              target='_blank'
              rel='noopener noreferrer'
              className='footer-page__icon'
              href='https://www.facebook.com/tracnghiemtinhcachdisc'
            >
              <img src='/1.png' alt='' />
            </a>
            <a
              target='_blank'
              rel='noopener noreferrer'
              className='footer-page__icon'
              href='https://www.linkedin.com/company/tr%E1%BA%AFc-nghi%E1%BB%87m-t%C3%ADnh-c%C3%A1ch-disc/'
            >
              <img src='/3.png' alt='' />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FooterPage
