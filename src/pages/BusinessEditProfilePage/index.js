import { Link, Redirect, Route, Switch, useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Dropdown, Form, Layout, Menu, Space } from 'antd'
import { BarChartOutlined, DownOutlined } from '@ant-design/icons'
import { redirectToWithPush } from 'utils'
import { toastifyNotify } from 'helpers'

import i18nVN from 'i18n/locales/vn'
import instance from 'api'

import { businessLogout } from 'redux/actions/auth'
import CampaignPage from 'pages/CampaignPage'
import WhatsNewPage from 'pages/WhatsNewPage'
import YourTestsPage from 'pages/YourTestsPage'
import HelpGuidesPage from 'pages/HelpGuidesPage'
import CandidatesPage from 'pages/CandidatesPage'
import DashboardBar from 'pages/DashBoard/containers/DashboardBar'
import DashboardPage from 'pages/DashBoard/containers/DashboardPage'
import IconMenu from 'assets/images/dashboard/menu.svg'
import LogoDISC from 'assets/images/dashboard/disc-logo.svg'
import PositionPage from 'pages/PositionPage'
import { ReactComponent as IconNew } from 'assets/images/dashboard/new_icon.svg'
import { ReactComponent as IconTest } from 'assets/images/dashboard/test_icon.svg'
import { ReactComponent as IconHelp } from 'assets/images/dashboard/help_icon.svg'
import { ReactComponent as IconPosition } from 'assets/images/dashboard/position_icon.svg'
import { ReactComponent as IconCandidate } from 'assets/images/dashboard/candidate_icon.svg'
import { ReactComponent as IconCampaign } from 'assets/images/dashboard/campaign.svg'

import BasicInfo from './BasicInfo'
import ExtraInfo from './ExtraInfo'
import './style.scss'

const { Header, Sider, Content } = Layout

const BusinessEditProfilePage = () => {
  const { edit: contentPage } = i18nVN.src.pages.business.profile
  const dispatch = useDispatch()
  const history = useHistory()
  const [collapsed, setCollapsed] = useState(false)
  const [form] = Form.useForm()
  const [business, setBusiness] = useState()

  useEffect(() => {
    const fetchBusiness = async () => {
      const res = await instance.get('/v2/business')

      setBusiness(res.data.result)
    }

    fetchBusiness()
  }, [])

  useEffect(() => {
    const addresses = business?.address.map((e, inx) => ({ key: inx, text: e }))

    form.setFieldsValue({
      company_name: business?.company_name,
      employee_amount: business?.employee_amount,
      phone: business?.phone,
      website: business?.website,
      email: business?.email,
      location: business?.location,
      work_day: business?.work_day,
      work_hour: business?.work_hour,
      specialty: business?.specialty,
      address: addresses,
      services: business?.services,
      key_skills: business?.key_skills,
    })
  }, [business, form])

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  const handleCancelUpdate = () => {
    history.push('/business/profile')
  }

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
      path: `${prefixRoute}/campaigns`,
      component: <CampaignPage />,
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
      path: `${prefixRoute}/position/list`,
    },
    tests: {
      text: 'Your Tests',
      icon: <IconTest />,
      path: `${prefixRoute}/your-tests`,
      component: <YourTestsPage />,
    },
    help: {
      text: 'Help guides',
      icon: <IconHelp />,
      path: `${prefixRoute}/help`,
      component: <HelpGuidesPage />,
      subtitle: 'Welcome back!',
    },
    new: {
      text: "What's new",
      icon: <IconNew />,
      path: `${prefixRoute}/new`,
      component: <WhatsNewPage />,
      subtitle: 'Welcome back!',
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
          <div className='dashboard-header'>
            <div className='dashboard-header__subtitle'>{routerItem.subtitle}</div>
          </div>
          {routerItem.component}
        </Route>,
      )
    }

    if (!routerItem.hiddenFromSidebar) {
      return (
        <Menu.Item key={routerItem.path} icon={routerItem.icon}>
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

  const onFinish = async (values) => {
    const updateValues = { ...values, address: values.address.map((e) => e.text) }

    await instance.put('/v2/business', updateValues)

    toastifyNotify('success', 'Update successfully!')

    history.push('/business/profile')
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

  const headerGroup = (
    <div className='business-edit-profile-page__header'>
      <div className='business-edit-profile-page__button-group'>
        <Button ghost className='business-edit-profile-page__button-cancel' onClick={handleCancelUpdate}>
          <p className='business-edit-profile-page__button-cancel-text'>Cancel</p>
        </Button>
        <Button className='business-edit-profile-page__button-update' htmlType='submit'>
          <p className='business-edit-profile-page__button-update-text'>Update</p>
        </Button>
      </div>
    </div>
  )

  return (
    <Layout className='dashboard-layout'>
      <Header className='header'>
        <div className='header__left'>
          <div className='header__menu'>
            <img src={IconMenu} onClick={toggleCollapsed} alt='menu-icon' />
          </div>
          <div className='header__brand'>
            <div className='brand__logo'>
              <button className='header-page__logo-btn' onClick={() => redirectToWithPush(history, '/')}>
                <img height={40} width={40} src={LogoDISC} alt='disc-logo' />
              </button>
            </div>
            {/* <div className='brand__name'>
                <img src={TNTC} alt='tntc' />
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
        <Sider width={250} className='sider' trigger={null} collapsible collapsed={collapsed}>
          <Layout>
            <div className='menu__container'>
              <Menu
                className='sider__menu'
                mode='inline'
                inlineIndent={30}
                defaultSelectedKeys={[window.location.pathname]}
                defaultOpenKeys={defaultOpenKeys}
              >
                {Object.keys(routerItems).map((key) => {
                  return genSideMenu(routerItems[key])
                })}
              </Menu>
            </div>
          </Layout>
        </Sider>
        <Content className='content'>
          <Switch>
            {routeItems}
            <Redirect exact from='/business' to='/business/dashboard' />
          </Switch>
          <div className='business-edit-profile-page'>
            <Form
              form={form}
              scrollToFirstError={{
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
              }}
              onFinish={onFinish}
            >
              <DashboardBar title={contentPage.title} rightItem={headerGroup} />
              <BasicInfo />
              <ExtraInfo />
            </Form>
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default BusinessEditProfilePage
