import React from 'react'
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min'

import i18nVN from 'i18n/locales/vn'
import DashboardBar from 'pages/DashBoard/containers/DashboardBar'

import YourTestsLayout from './components/YourTestsLayout'

import './style.scss'

function YourTestsPage({ campaignRef }) {
  const { yourTests: contentPage } = i18nVN.src.pages.business.dashboard

  return (
    <div className='your-tests-page'>
      <DashboardBar title={contentPage.title} />
      <Switch>
        <Route path='/business/your-tests' exact>
          <YourTestsLayout campaignRef={campaignRef} />
        </Route>
        <Route path='/business/your-tests/survey' component={YourTestsLayout} />
      </Switch>
    </div>
  )
}

export default YourTestsPage
