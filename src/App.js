import React, { useEffect } from 'react'
import swal from 'sweetalert'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { QueryClientProvider } from '@tanstack/react-query'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom'
import IQTestCampaignResultPage from 'pages/CampaignTestPage/IQTest/IQTestCampaignResultPage'
import EQTestCampaignResultPage from 'pages/CampaignTestPage/EQTest/EQTestCampaignResultPage'
import config from 'configs'
import { queryClient } from 'api/queryClient'
import { getValueFromStorage, removeValueFromStorage, disableScrollAfterOpenModal } from 'utils'
import { isWebviewIOS } from 'helpers'
import useWindowSize from 'hooks/useWindowSize'
import HomePage from 'pages/HomePage'
import PrivateRoute from 'PrivateRoute'
import DashBoard from 'pages/DashBoard'
import BusinessRoute from 'BusinessRoute'
import SignupPage from 'pages/SignupPage'
import SurveyPage from 'pages/SurveyPage'
import ResultPage from 'pages/ResultPage'
import IQTestPage from 'pages/IQTestPage'
import EQTestPage from 'pages/EQTestPage'
// import PaymentPage from 'pages/PaymentPage'
import IQResultPage from 'pages/IQResultPage'
import WhatDISCPage from 'pages/WhatDISCPage'
import NotFoundPage from 'pages/NotFoundPage'
import EQResultPage from 'pages/EQResultPage'
import MyProfilePage from 'pages/MyProfilePage'
import WhichDISCPage from 'pages/WhichDISCPage'
import MyIQResultPage from 'pages/MyIQResultPage'
import MyEQResultPage from 'pages/MyEQResultPage'
import BlogListPage from 'pages/BlogPage/BlogList'
import BlogItemPage from 'pages/BlogPage/BlogItem'
import StatisticsPage from 'pages/Statistics'
import ShareResultPage from 'pages/ShareResultPage'
import MyDISCResultPage from 'pages/MyDISCResultPage'
import BusinessSignUp from 'pages/BusinessPage/SignUp'
import BusinessSignIn from 'pages/BusinessPage/SignIn'
import MyBrainResultPage from 'pages/MyBrainResultPage'
import PolicyAndTermsPage from 'pages/PolicyAndTermsPage'
// import ResultMoMoPaymentPage from 'pages/ResultPaymentPage/momo'
import LeftRightBrainTestPage from 'pages/LeftRightBrainTestPage'
// import ResultVnPayPaymentPage from 'pages/ResultPaymentPage/vnpay'
import LinkedinPopup from 'pages/SignupPage/containers/LinkedInPopup'
import LeftRightBrainTestResultPage from 'pages/LeftRightBrainResultPage'
import BrainTestCampaignResultPage from 'pages/CampaignTestPage/BrainTest/BrainTestCampaignResultPage'
import IQTestCampaignPage from 'pages/CampaignTestPage/IQTest/IQTestCampaignPage'
import SingleChoiceTestCampaignPage from 'pages/CampaignTestPage/SingleChoiceTest/SingleChoiceTestCampaignPage'
import SingleChoiceTestCampaignResultPage from 'pages/CampaignTestPage/SingleChoiceTest/SingleChoiceTestCampaignResultPage'
import EQTestCampaignPage from 'pages/CampaignTestPage/EQTest/EQTestCampaignPage'
import DiscTestCampaignPage from 'pages/CampaignTestPage/DiscTest/DiscTestCampaignPage'
import DiscTestCampaignResultPage from 'pages/CampaignTestPage/DiscTest/DiscTestCampaignResultPage'
import BrainTestCampaignPage from 'pages/CampaignTestPage/BrainTest/BrainTestCampaignPage'
import CustomTestCampaignPage from 'pages/CampaignTestPage/CustomTest/CustomTestCampaignPage'
import CustomTestCampaignResultPage from 'pages/CampaignTestPage/CustomTest/CustomTestCampaignResultPage'
import PersonalityRouter from 'pages/PersonalitiesGroup/containers/PersonalityRouter'
import ResultCampaignPublicPage from 'pages/ResultCampaignPublicPage'
import BusinessEditProfilePage from 'pages/BusinessEditProfilePage'
import BusinessProfilePage from 'pages/BusinessProfilePage'
import PersonalitiesGroup from 'pages/PersonalitiesGroup'
import configureStore from './configureStore'

import 'react-toastify/dist/ReactToastify.css'
import 'animate.css/animate.min.css'
import 'assets/stylesheets/global.scss'
import 'assets/stylesheets/content-styles.css'

const { store, persistor } = configureStore()

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    disableScrollAfterOpenModal(false)
  }, [pathname])

  return null
}

function App() {
  const [, windowHeight] = useWindowSize()
  document.documentElement.style.setProperty('--app-height', `${windowHeight}px`)

  const isAuthenticated = getValueFromStorage(config.authentication.NORMAL_USER_ACCESS_TOKEN_KEY)
  const isBusinessAuthenticated = getValueFromStorage(config.authentication.BUSINESS_ACCESS_TOKEN_KEY)

  // detect it using ios webview -> show warning alert
  useEffect(() => {
    if (isWebviewIOS()) {
      swal(
        'Không thể đăng nhập bằng Google trên trình duyệt này',
        'Để đăng nhập bằng Google, vui lòng truy cập link bằng trình duyệt khác (Safari/Chrome)',
        'warning',
      )
    }
  }, [])

  if (isAuthenticated && isBusinessAuthenticated) {
    removeValueFromStorage(config.authentication.BUSINESS_ACCESS_TOKEN_KEY)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastContainer closeButton={false} />
          <div className='App'>
            <Router>
              <ScrollToTop />
              <Switch>
                <PrivateRoute exact path='/iq-test-campaign/:campaign_id/:position_id' component={IQTestCampaignPage} />
                <PrivateRoute
                  exact
                  path='/iq-test-campaign-result/:campaign_id/:position_id'
                  component={IQTestCampaignResultPage}
                />
                <PrivateRoute exact path='/eq-test-campaign/:campaign_id/:position_id' component={EQTestCampaignPage} />
                <PrivateRoute
                  exact
                  path='/eq-test-campaign-result/:campaign_id/:position_id'
                  component={EQTestCampaignResultPage}
                />
                <PrivateRoute
                  exact
                  path='/disc-test-campaign/:campaign_id/:position_id'
                  component={DiscTestCampaignPage}
                />
                <PrivateRoute
                  exact
                  path='/disc-test-campaign-result/:campaign_id/:position_id'
                  component={DiscTestCampaignResultPage}
                />
                <PrivateRoute
                  exact
                  path='/brain-test-campaign/:campaign_id/:position_id'
                  component={BrainTestCampaignPage}
                />
                <PrivateRoute
                  exact
                  path='/brain-test-campaign-result/:campaign_id/:position_id'
                  component={BrainTestCampaignResultPage}
                />
                <PrivateRoute
                  exact
                  path='/custom-test-campaign/:campaign_id/:position_id/:test_id'
                  component={CustomTestCampaignPage}
                />
                <PrivateRoute
                  exact
                  path='/custom-test-campaign-result/:campaign_id/:position_id/:test_id'
                  component={CustomTestCampaignResultPage}
                />
                <PrivateRoute
                  exact
                  path='/single-choice-test-campaign/:campaign_id/:position_id'
                  component={SingleChoiceTestCampaignPage}
                />
                <PrivateRoute
                  exact
                  path='/single-choice-test-campaign-result/:campaign_id/:position_id'
                  component={SingleChoiceTestCampaignResultPage}
                />
                <PrivateRoute exact path='/survey/:position_id' component={SurveyPage} />
                <PrivateRoute exact path='/result' component={ResultPage} />
                {/* <PrivateRoute exact path='/payment' component={PaymentPage} /> */}
                <PrivateRoute exact path='/iq-test/:position_id' component={IQTestPage} />
                <PrivateRoute exact path='/iq-result' component={IQResultPage} />
                <PrivateRoute exact path='/my-profile' component={MyProfilePage} />
                <PrivateRoute exact path='/my-disc-result' component={MyDISCResultPage} />
                <PrivateRoute exact path='/my-iq-result' component={MyIQResultPage} />
                <PrivateRoute exact path='/my-brain-result' component={MyBrainResultPage} />
                <PrivateRoute exact path='/brain-result' component={LeftRightBrainTestResultPage} />
                <PrivateRoute exact path='/eq-result' component={EQResultPage} />
                <PrivateRoute exact path='/my-eq-result' component={MyEQResultPage} />
                <PrivateRoute exact path='/left-right-brain-test/:position_id' component={LeftRightBrainTestPage} />
                <PrivateRoute exact path='/eq-test/:position_id' component={EQTestPage} />
                <Route exact path='/result/:campaignId/:positionId/:userId' component={ResultCampaignPublicPage} />
                <Route exact path='/' component={HomePage} />
                <Route exact path='/survey' component={SurveyPage} />
                <Route exact path='/iq-test' component={IQTestPage} />
                <Route exact path='/left-right-brain-test' component={LeftRightBrainTestPage} />
                <Route exact path='/eq-test' component={EQTestPage} />
                <Route exact path='/login' component={SignupPage} />
                {/* <Route exact path='/payment-result/vnpay' component={ResultVnPayPaymentPage} />
                <Route exact path='/payment-result/momo' component={ResultMoMoPaymentPage} /> */}
                <Route exact path='/blog/:title' component={BlogItemPage} />
                <Route exact path='/blog' component={BlogListPage} />
                <Route exact path='/statistics' component={StatisticsPage} />
                <Route exact path='/which-disc' component={WhichDISCPage} />
                <Route exact path='/policy-terms' component={PolicyAndTermsPage} />
                <Route exact path='/what-disc' component={WhatDISCPage} />
                <Route exact path='/linkedin' component={LinkedinPopup} />
                <Route exact path='/result/:uid' component={ShareResultPage} />
                <Route exact path='/personalities-group' component={PersonalitiesGroup} />
                <Route exact path='/personalities-group/:personality' component={PersonalityRouter} />
                <Route exact path='/business/sign-up' component={BusinessSignUp} />
                <Route exact path='/business/sign-in' component={BusinessSignIn} />
                <BusinessRoute exact path='/business/profile' component={BusinessProfilePage} />
                <BusinessRoute exact path='/business/profile/edit' component={BusinessEditProfilePage} />
                <BusinessRoute exact path='/business' component={DashBoard} />
                <BusinessRoute exact path='/business/:page' component={DashBoard} />
                <BusinessRoute exact path='/business/:page/:sub' component={DashBoard} />
                <BusinessRoute exact path='/business/*' component={DashBoard} />
                <Route exact path='*' component={NotFoundPage} />
              </Switch>
            </Router>
          </div>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  )
}

export default App
