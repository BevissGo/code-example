import React from 'react'
import { BarChartOutlined, DownOutlined } from '@ant-design/icons'
import { Layout, Menu, Dropdown, Space } from 'antd'
import { Link, Route, BrowserRouter as Router } from 'react-router-dom'

// Pages
import PositionPage from 'pages/PositionPage'
import YourTestsPage from 'pages/YourTestsPage'
import CampaignPage from 'pages/CampaignPage'
import CandidatesPage from 'pages/CandidatesPage'
import DashboardPage from 'pages/DashBoard/containers/DashboardPage'
// Assets
import IconMenu from 'assets/images/dashboard/menu.svg'
import LogoDISC from 'assets/images/dashboard/disc-logo.svg'
// import TNTC from 'assets/images/dashboard/tracnghiemtinhcach.vn.svg'
import { ReactComponent as IconNew } from 'assets/images/dashboard/new_icon.svg'
import { ReactComponent as IconHelp } from 'assets/images/dashboard/help_icon.svg'
import { ReactComponent as IconTest } from 'assets/images/dashboard/test_icon.svg'
import { ReactComponent as IconSetup } from 'assets/images/dashboard/setup_icon.svg'
import { ReactComponent as IconEvent } from 'assets/images/dashboard/event_icon.svg'
// import { ReactComponent as IconSummary } from 'assets/images/dashboard/summary_icon.svg'
import { ReactComponent as IconPosition } from 'assets/images/dashboard/position_icon.svg'
import { ReactComponent as IconCandidate } from 'assets/images/dashboard/candidate_icon.svg'
import { ReactComponent as IconCampaign } from 'assets/images/dashboard/campaign.svg'

import 'antd/dist/reset.css'
import './style.scss'

const { Header, Sider } = Layout

export default function Dashboard() {
  const [collapsed, setCollapsed] = React.useState(false)

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  // Router config object
  const prefixRoute = '/business'
  const routerItems = {
    dashboard: {
      text: 'Dashboard',
      icon: <BarChartOutlined />,
      path: `${prefixRoute}/dashboard`,
      component: <DashboardPage />,
    },
    campaign: {
      text: 'Campaign',
      icon: <IconCampaign />,
      component: <CampaignPage />,
      path: `${prefixRoute}/campaigns`,
    },
    candidates: {
      path: `${prefixRoute}/candidates`,
      text: 'Candidates',
      icon: <IconCandidate />,
      component: <CandidatesPage />,
    },
    positionList: {
      text: 'Position',
      icon: <IconPosition />,
      component: <PositionPage />,
      path: `${prefixRoute}/position`,
    },
    tests: {
      text: 'Your Tests',
      icon: <IconTest />,
      path: `${prefixRoute}/your-tests`,
      component: <YourTestsPage />,
    },
    events: {
      text: 'Events',
      icon: <IconEvent />,
      children: {
        schedule: {
          path: `${prefixRoute}/events/schedule`,
          text: 'Schedule',
        },
        'send-email': {
          path: `${prefixRoute}/events/send-email`,
          text: 'Send email',
        },
      },
    },
    setup: {
      text: 'Setup',
      icon: <IconSetup />,
      children: {
        import: {
          path: `${prefixRoute}/setup/import`,
          text: 'Import',
        },
        'add-team': {
          path: `${prefixRoute}/setup/add-team`,
          text: 'Add team',
        },
      },
    },
    help: {
      text: 'Help guides',
      icon: <IconHelp />,
      path: `${prefixRoute}/help`,
    },
    new: {
      text: "What's new",
      icon: <IconNew />,
      path: `${prefixRoute}/new`,
    },
  }

  const routeItems = []
  const genSideMenu = (routerItem) => {
    if (routerItem.children) {
      return (
        <Menu.SubMenu key={routerItem.text} title={routerItem.text} icon={routerItem.icon}>
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
          {routerItem.component}
        </Route>,
      )
    }
    return (
      <Menu.Item key={routerItem.path} icon={routerItem.icon}>
        <Link to={routerItem.path}>{routerItem.text}</Link>
      </Menu.Item>
    )
  }
  const sideMenuItems = (
    <>
      {Object.keys(routerItems).map((key) => {
        return genSideMenu(routerItems[key])
      })}
    </>
  )

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

  const companyMenu = (
    <Menu>
      <Menu.Item key='1'>
        <span>Profile</span>
      </Menu.Item>
      <Menu.Item key='2'>
        <span>Log Out</span>
      </Menu.Item>
    </Menu>
  )

  return (
    <Router>
      <Layout className='dashboard-layout'>
        <Header className='header'>
          <div className='header__left'>
            <div className='header__menu'>
              <img src={IconMenu} onClick={toggleCollapsed} alt='icon-menu' />
            </div>
            <div className='header__brand'>
              <div className='brand__logo'>
                <img height={30} width={30} src={LogoDISC} alt='disc-logo' />
              </div>
              {/* <div className='brand__name'>
                <img src={TNTC} alt='branch-name' />
              </div> */}
            </div>
          </div>
          <div className='header__right'>
            <Dropdown overlay={companyMenu} trigger={['click']}>
              <span onClick={(e) => e.preventDefault()}>
                <Space>
                  <div className='header__company'>
                    <div className='company__logo'>
                      <img src={LogoDISC} alt='disc-logo' />
                    </div>
                  </div>
                  <DownOutlined />
                </Space>
              </span>
            </Dropdown>
          </div>
        </Header>
        <Layout>
          <Sider width={2500} className='sider' trigger={null} collapsible collapsed={collapsed}>
            <Layout>
              <div className='menu__container'>
                <Menu
                  className='sider__menu'
                  mode='inline'
                  inlineIndent={30}
                  defaultSelectedKeys={[window.location.pathname]}
                  defaultOpenKeys={defaultOpenKeys}
                >
                  {sideMenuItems}
                </Menu>
              </div>
            </Layout>
          </Sider>
        </Layout>
      </Layout>
    </Router>
  )
}

export const DashboardLayout = ({ children }) => {
  return <div className='children__content'>{children}</div>
}
