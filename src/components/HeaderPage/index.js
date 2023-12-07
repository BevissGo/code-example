import React, { useState, useEffect, useMemo } from 'react'
import ScrollAnimation from 'react-animate-on-scroll'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

import config from 'configs'
import logoDISC from 'assets/images/logos/logo-disc-sm.png'
import { fetchProfileIfNeeded } from 'redux/services/profile'
import { fetchBusinessProfileIfNeeded } from 'redux/services/dashboard'
import { redirectToWithPush, getValueFromStorage, disableScrollAfterOpenModal } from 'utils'
import i18VN from 'i18n/locales/vn'
import { logout } from 'redux/services/auth'
import { USER_TYPE } from 'constants/userType'

import './style.scss'
import DefaultButtonV2 from 'components/Button/DefaultV2'
import Test from './components/Test'
import ProfileMini from './components/ProfileMini'
import DropdownTest from './containers/DropdownTest'
import DropdownProfile from './containers/DropdownProfile'

const HeaderPage = ({ typeHeader, isBlur }) => {
  const [openMenu, setOpenMenu] = useState(false)
  const [openDropdownTest, setOpenDropdownTest] = useState(false)
  const [openDropdownProfile, setOpenDropdownProfile] = useState(false)

  const history = useHistory()
  const dispatch = useDispatch()
  const location = useLocation()
  const profile = useSelector((state) => state.profile.profile)
  const loadingProfile = useSelector((state) => state.profile.loadingGet)
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const isBusinessAuthenticated = useSelector((state) => state.auth.isBusinessAuthenticated)
  const businessProfile = useSelector((state) => state.dashboardReducer.profileInfo)

  useEffect(() => {
    getValueFromStorage(config.authentication.NORMAL_USER_ACCESS_TOKEN_KEY) && dispatch(fetchProfileIfNeeded())
    getValueFromStorage(config.authentication.BUSINESS_ACCESS_TOKEN_KEY) && dispatch(fetchBusinessProfileIfNeeded())
  }, [dispatch])

  const { common: contentCommon } = i18VN.src

  const handleOpenMenu = () => {
    setOpenMenu((prev) => {
      disableScrollAfterOpenModal(!prev)
      return !prev
    })
  }

  const handleOpenDropdownTest = () => {
    setOpenDropdownTest((prev) => !prev)
  }
  const handleCloseDropdownTest = () => {
    setOpenDropdownTest(false)
  }

  const handleOpenDropdownProfile = () => {
    setOpenDropdownProfile(!openDropdownProfile)
  }

  const handleSignout = () => {
    handleCloseDropdownProfile()
    dispatch(logout())
  }
  const handleCloseDropdownProfile = () => {
    setOpenDropdownProfile(false)
  }

  const generateClassNameHeader = () => {
    return `header-page${typeHeader === 'expand' || typeHeader === 'share' ? ' expand' : ''}${
      typeHeader === 'payment' ? ' payment' : ''
    }${openMenu ? ' active' : ''} ${isBlur ? 'blur' : ''}`
  }

  const generateClassNameNavbar = () => {
    return `header-page__navbar${!openMenu ? ' hide' : ''}${isAuthenticated ? ' logged-in' : ''}${
      isBlur ? ' blur' : ''
    }`
  }

  const redirectDashboard = () => history.push('/business')

  const renderProfileMini = () => (
    <ProfileMini
      profile={isAuthenticated ? profile : isBusinessAuthenticated ? businessProfile : {}}
      loading={loadingProfile}
      hasDropdown={isAuthenticated}
      openDropdownProfile={openDropdownProfile}
      onCloseDropdown={handleCloseDropdownProfile}
      onOpenDropdown={isAuthenticated ? handleOpenDropdownProfile : redirectDashboard}
    />
  )

  const login = () => {
    history.push('/login', {
      from: { pathname: location.pathname },
    })
  }

  const currentPathname = useMemo(() => location?.pathname, [location])

  return (
    <div className={generateClassNameHeader()}>
      <div className={`header-page__background${isBlur ? '-blur' : ''}`}>
        <div
          className={`header-page__disc-name${openMenu ? ' active' : ''}`}
          style={isBlur && { backgroundColor: 'rgba(255,253,249,0)' }}
        >
          <ScrollAnimation offset={0} duration={0.75} animateOnce={true} animateIn='animate__fadeIn'>
            <button className='header-page__logo-btn' onClick={() => redirectToWithPush(history, '/')}>
              <img src={logoDISC} className='header-page__logo-img' alt='cannot display' />
            </button>
          </ScrollAnimation>
        </div>
        <ScrollAnimation offset={0} duration={0.75} animateOnce={true} animateIn='animate__fadeIn'>
          {typeHeader === 'expand' && (
            <>
              <ul className={generateClassNameNavbar()}>
                <div className={`header-page__navbar__list-nav ${!openMenu ? 'hidden' : ''}`}>
                  {isAuthenticated && (
                    <>
                      <li className='navbar__profile-mini mobile'>
                        <ProfileMini profile={profile} />
                      </li>

                      <li className='bt-1 mobile'>
                        <span className='navbar__item' onClick={() => redirectToWithPush(history, '/my-profile')}>
                          {contentCommon.navbar.profile}
                        </span>
                      </li>
                      <li className='bt-1 bb-1 mobile'>
                        <span className='navbar__item' onClick={() => redirectToWithPush(history, '/my-disc-result')}>
                          {contentCommon.navbar.result}
                        </span>
                      </li>
                    </>
                  )}

                  <li>
                    <span
                      className={`navbar__item ${currentPathname === '/what-disc' ? 'active' : ''}`}
                      onClick={() => redirectToWithPush(history, '/what-disc')}
                    >
                      {contentCommon.navbar.whatDiSC}
                    </span>
                  </li>
                  <li>
                    <span
                      className={`navbar__item ${currentPathname === '/personalities-group' ? 'active' : ''}`}
                      onClick={() => redirectToWithPush(history, '/personalities-group')}
                    >
                      {contentCommon.navbar.personalitiesGroup}
                    </span>
                  </li>
                  {!isBusinessAuthenticated && (
                    <li className='test-option-large-screen'>
                      <Test
                        active={['/survey', '/iq-test', '/eq-test', '/left-right-brain-test'].includes(currentPathname)}
                        openDropdownTest={openDropdownTest}
                        onOpenDropdown={handleOpenDropdownTest}
                        onCloseDropdown={handleCloseDropdownTest}
                      >
                        <div className='header-page__dropdown-test'>
                          {openDropdownTest && (
                            <DropdownTest contentCommon={contentCommon} onClose={handleCloseDropdownTest} />
                          )}
                        </div>
                      </Test>
                    </li>
                  )}
                  {!isBusinessAuthenticated && (
                    <>
                      <li className='test-option-small-screen'>
                        <span className='navbar__item' onClick={() => redirectToWithPush(history, '/survey')}>
                          {contentCommon.navbar.disc}
                        </span>
                      </li>
                      <li className='test-option-small-screen'>
                        <span className='navbar__item' onClick={() => redirectToWithPush(history, '/iq-test')}>
                          {contentCommon.navbar.testIQ}
                        </span>
                      </li>
                      <li className='test-option-small-screen'>
                        <span
                          className='navbar__item'
                          onClick={() => redirectToWithPush(history, '/left-right-brain-test')}
                        >
                          {contentCommon.navbar.testLeftRightBrain}
                        </span>
                      </li>
                      <li className='test-option-small-screen'>
                        <span className='navbar__item' onClick={() => redirectToWithPush(history, '/eq-test')}>
                          {contentCommon.navbar.testEQ}
                        </span>
                      </li>
                    </>
                  )}
                  <li className='blog'>
                    <span
                      className={`navbar__item ${currentPathname === '/blog' ? 'active' : ''}`}
                      onClick={() => redirectToWithPush(history, '/blog')}
                    >
                      {contentCommon.navbar.blog}
                    </span>
                  </li>
                  <li className='statistics'>
                    <span
                      className={`navbar__item ${currentPathname === '/statistics' ? 'active' : ''}`}
                      onClick={() => redirectToWithPush(history, '/statistics')}
                    >
                      {contentCommon.navbar.statistics}
                    </span>
                  </li>
                  {isAuthenticated && (
                    <>
                      {profile.type_user === USER_TYPE.GUESS && (
                        <li className='bt-1 mobile' onClick={() => redirectToWithPush(history, '/payment')}>
                          <span className='navbar__item'>{contentCommon.navbar.payment}</span>
                        </li>
                      )}

                      <li className='bt-1 logout mobile'>
                        <span className='navbar__item text-danger' onClick={handleSignout}>
                          {contentCommon.logOut}
                        </span>
                      </li>
                    </>
                  )}
                </div>
                {!isAuthenticated && !isBusinessAuthenticated && (
                  <li className='mobile action__sign'>
                    <DefaultButtonV2 onClick={login}>{contentCommon.logIn}</DefaultButtonV2>
                  </li>
                )}
                <li className='desktop action__sign'>
                  {!isAuthenticated && !isBusinessAuthenticated ? (
                    <DefaultButtonV2 onClick={login}>{contentCommon.logIn}</DefaultButtonV2>
                  ) : (
                    <>
                      {renderProfileMini()}
                      <div className='header-page__dropdown-profile'>
                        {openDropdownProfile && (
                          <DropdownProfile
                            contentCommon={contentCommon}
                            onSignout={handleSignout}
                            onClose={handleCloseDropdownProfile}
                          />
                        )}
                      </div>
                    </>
                  )}
                </li>
              </ul>

              <div className={`header-page__hamburger${openMenu ? ' active' : ''}`} onClick={handleOpenMenu}>
                <div className='line-1 black'></div>
                <div className='line-2 black'></div>
                <div className='line-3 black'></div>
              </div>
            </>
          )}
        </ScrollAnimation>
      </div>
    </div>
  )
}

export default HeaderPage
