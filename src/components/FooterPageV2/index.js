import React from 'react'
import { Link } from 'react-router-dom'
import ScrollAnimation from 'react-animate-on-scroll'

import LogoFacebook from 'assets/images/logos/logo-fb.png'
import LogoDiscLg from 'assets/images/logos/logo-disc-lg.png'
import LogoLinkedin from 'assets/images/logos/logo-linkedin.png'

import './style.scss'

const FooterPage = () => {
  return (
    <div className='footer-page-v2'>
      <div className='footer-page-v2__background'>
        <ScrollAnimation offset={0} duration={0.75} animateOnce={true} animateIn='animate__fadeIn'>
          <div className='footer-page-v2__container'>
            <div className='footer-page-v2__logo'>
              <img className='footer-page-v2__logo-img' src={LogoDiscLg} alt='logo-disc' />
              <p className='footer-page-v2__logo-text'>tracnghiemtinhcach.vn</p>
            </div>
            <div className='footer-page-v2__main'>
              <div className='footer-page-v2__navs'>
                <ul>
                  <li>
                    <Link to='/what-disc'>Dành cho doanh nghiệp</Link>
                  </li>
                  <li>
                    <Link to={'/personalities-group'}>Nhóm tính cách</Link>
                  </li>
                  <li>
                    <Link to='/blog'>Blog</Link>
                  </li>
                  <li>
                    <Link to='/policy-terms'>Chính sách và Điều khoản</Link>
                  </li>
                </ul>
                <div className='footer-page-v2__socials'>
                  <a target='_blank' rel='noopener noreferrer' href='https://www.facebook.com/tracnghiemtinhcachdisc'>
                    <img className='footer-page-v2__socials__fb-img' src={LogoFacebook} alt='logo-facebook' />
                  </a>
                  <a
                    target='_blank'
                    rel='noopener noreferrer'
                    href='https://www.linkedin.com/company/tr%E1%BA%AFc-nghi%E1%BB%87m-t%C3%ADnh-c%C3%A1ch-disc/'
                  >
                    <img className='footer-page-v2__socials__linkedin-img' src={LogoLinkedin} alt='logo-linkedin' />
                  </a>
                </div>
              </div>
              <div className='footer-page-v2__company-info'>
                <p className='footer-page-v2__company-info__name'>Golden Owl Solutions</p>
                <ul>
                  <li>
                    <p>
                      &#8226; Trụ sở: Tòa nhà MBAMC, Tầng 07, Số 538 Cách Mạng Tháng Tám, Phường 11, Quận 3, Thành Phố
                      Hồ Chí Minh.
                    </p>
                  </li>
                  <li>
                    <p>&#8226; Email: admin@goldenowl.asia</p>
                  </li>
                  <li>
                    <p>&#8226; Giấy chứng nhận đăng ký kinh doanh số: 0313459810</p>
                  </li>
                  <li>
                    <p>&#8226; Cấp ngày: 28/09/2015</p>
                  </li>
                  <li>
                    <p>&#8226; Nơi cấp: Sở kế hoạch đầu tư Thành Phố Hồ Chí Minh.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
      <div className='footer-page-v2__copyright'>
        <p className='footer-page-v2__copyright__text'>Copyright &#169; 2023 DiSC</p>
      </div>
    </div>
  )
}

export default FooterPage
