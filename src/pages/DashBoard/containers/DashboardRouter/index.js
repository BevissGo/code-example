import React, { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { Layout, Menu, Dropdown, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { Link, Route, BrowserRouter as Router, Switch, Redirect, useHistory } from 'react-router-dom'

import CampaignPage from 'pages/CampaignPage'
import PositionPage from 'pages/PositionPage'
import WhatsNewPage from 'pages/WhatsNewPage'
import YourTestsPage from 'pages/YourTestsPage'
import CandidatesPage from 'pages/CandidatesPage'
import HelpGuidesPage from 'pages/HelpGuidesPage'

import { redirectToWithPush } from 'utils'
import { businessLogout } from 'redux/actions/auth'

import LogoDISC from 'assets/images/dashboard/disc-logo.svg'
import { ReactComponent as IconDashBoard } from 'assets/images/dashboard/dashboard.svg'
import { ReactComponent as IconCampaign } from 'assets/images/dashboard/campaign.svg'
import { ReactComponent as IconCandidate } from 'assets/images/dashboard/candidate_icon.svg'
import { ReactComponent as IconPosition } from 'assets/images/dashboard/position_icon.svg'
import { ReactComponent as IconTest } from 'assets/images/dashboard/test_icon.svg'
import { ReactComponent as IconHelp } from 'assets/images/dashboard/help_icon.svg'
import { ReactComponent as IconNew } from 'assets/images/dashboard/new_icon.svg'

import DashboardPage from '../DashboardPage'

import './style.scss'
import 'antd/dist/reset.css'

const { Header, Sider, Content } = Layout

const DashboardRouter = ({ children }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const prefixRoute = '/business'
  const [selectedKey, setSelectedKey] = useState([
    window.location.pathname === prefixRoute ? '/business/dashboard' : window.location.pathname,
  ])

  const positionRef = useRef(null)
  const yourTestsRef = useRef(null)
  const campaignRef = useRef(null)
  const candidateRef = useRef(null)

  const routerItems = {
    dashboard: {
      text: 'Dashboard',
      icon: <IconDashBoard />,
      path: `${prefixRoute}/dashboard`,
      component: <DashboardPage positionRef={positionRef} />,
    },
    campaign: {
      text: 'Campaign',
      icon: <IconCampaign ref={campaignRef} />,
      path: `${prefixRoute}/campaigns`,
      component: <CampaignPage campaignRef={campaignRef} candidateRef={candidateRef} />,
    },
    candidates: {
      path: `${prefixRoute}/candidates`,
      text: 'Candidates',
      icon: <IconCandidate ref={candidateRef} />,
      component: <CandidatesPage />,
    },
    positionList: {
      text: 'Position',
      icon: <IconPosition ref={positionRef} />,
      component: <PositionPage positionRef={positionRef} yourTestsRef={yourTestsRef} />,
      path: `${prefixRoute}/position`,
    },
    tests: {
      text: 'Your Tests',
      icon: <IconTest ref={yourTestsRef} />,
      path: `${prefixRoute}/your-tests`,
      component: <YourTestsPage campaignRef={campaignRef} yourTestsRef={yourTestsRef} />,
    },
  }

  const subRouterItems = {
    new: {
      text: "What's new",
      icon: <IconNew />,
      path: `${prefixRoute}/new`,
      component: <WhatsNewPage />,
      subtitle: 'Welcome back!',
    },
    help: {
      text: 'Help guides',
      icon: <IconHelp fill='#fff' />,
      path: `${prefixRoute}/help`,
      component: <HelpGuidesPage />,
      subtitle: 'Welcome back!',
    },
  }

  const routeItems = []
  const genSideMenu = (routerItem) => {
    if (routerItem.children) {
      return (
        <Menu.SubMenu key={routerItem.text} title={routerItem.text} icon={routerItem.icon} mar>
          {Object.keys(routerItem.children).map((child) => {
            return genSideMenu(routerItem.children[child])
          })}
        </Menu.SubMenu>
      )
    }
    // Also add path to route list
    if (routerItem.path) {
      routeItems.push(
        <Route key={routerItem.path} path={routerItem.path}>
          <div className='dashboard-header'>
            <div className='dashboard-header__subtitle'>{routerItem.subtitle}</div>
          </div>
          {routerItem.component}
        </Route>,
      )
    }

    if (!routerItem.hiddenFromSidebar) {
      return (
        <Menu.Item key={routerItem.path} icon={routerItem.icon} onClick={(item) => setSelectedKey(item.key)}>
          <Link to={routerItem.path}>{routerItem.text}</Link>
        </Menu.Item>
      )
    }
    return null
  }

  let defaultOpenKeys = []

  const findOpenKeys = (item) => {
    if (item.path === window.location.pathname) {
      return true
    }

    if (item.children) {
      for (let child in item.children) {
        if (findOpenKeys(item.children[child])) {
          defaultOpenKeys.push(item.children[child].text)
          return true
        }
      }
    }

    return false
  }

  Object.keys(routerItems).forEach((key) => {
    if (findOpenKeys(routerItems[key])) {
      defaultOpenKeys.push(routerItems[key].text)
    }
  })

  Object.keys(subRouterItems).forEach((key) => {
    if (findOpenKeys(subRouterItems[key])) {
      defaultOpenKeys.push(subRouterItems[key].text)
    }
  })

  const handleMenuSelect = (info) => {
    switch (info.key) {
      case 'profile-option': {
        history.push('/business/profile')
        break
      }
      case 'sign-out-option': {
        dispatch(businessLogout())
        break
      }
      default:
        break
    }
  }

  const companyMenu = (
    <Menu className='dashboard-company-menu' onClick={handleMenuSelect}>
      <Menu.Item key='profile-option'>
        <div className='dashboard-company-menu-item__content'>
          <div className='dashboard-company-menu-item__content-title'>Profile</div>
        </div>
      </Menu.Item>
      <Menu.Divider className='dashboard-company-menu-divider' />
      <Menu.Item key='sign-out-option'>
        <div className='dashboard-company-menu-item__content'>
          <div className='dashboard-company-menu-item__content-title-red'>Log out</div>
        </div>
      </Menu.Item>
    </Menu>
  )

  return (
    <Router>
      <Layout className='dashboard-layout'>
        <Sider collapsedWidth={88} collapsed className='sider'>
          <div className='sider-container'>
            <div className='brand__logo'>
              <button className='header-page__logo-btn' onClick={() => redirectToWithPush(history, '/')}>
                <img height={40} width={40} src={LogoDISC} alt='disc-logo' />
              </button>
            </div>
            <Menu
              className='sider-menu'
              mode='inline'
              style={{
                width: '100%',
              }}
              inlineIndent={30}
              defaultSelectedKeys={[window.location.pathname]}
              defaultOpenKeys={defaultOpenKeys}
              _internalDisableMenuItemTitleTooltip={false}
              selectedKeys={selectedKey}
            >
              {Object.keys(routerItems).map((key) => {
                return genSideMenu(routerItems[key])
              })}
            </Menu>
            <Menu
              className='sider-menu'
              mode='inline'
              style={{
                width: '100%',
              }}
              inlineIndent={30}
              defaultSelectedKeys={[window.location.pathname]}
              defaultOpenKeys={defaultOpenKeys}
              _internalDisableMenuItemTitleTooltip={false}
              selectedKeys={selectedKey}
            >
              {Object.keys(subRouterItems).map((key) => {
                return genSideMenu(subRouterItems[key])
              })}
            </Menu>
          </div>
        </Sider>
        <Layout>
          <Header className='header'>
            <div className='header__right'>
              <Dropdown overlay={companyMenu} trigger={['click']}>
                <span onClick={(e) => e.preventDefault()}>
                  <Space>
                    <div className='header__company'>
                      <div className='company__logo'>
                        <img src={LogoDISC} alt='disc-logo' style={{ borderRadius: '100%' }} />
                      </div>
                    </div>
                    <DownOutlined />
                  </Space>
                </span>
              </Dropdown>
            </div>
          </Header>
          <Content className='content'>
            <Switch>
              {routeItems}
              <Redirect exact from='/business' to='/business/dashboard' />
            </Switch>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Router>
  )
}

export default DashboardRouter
