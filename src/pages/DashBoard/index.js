import React from 'react'
// import { DownOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import './style.scss'

// import { Layout, Menu, Dropdown } from 'antd'
// import { Link } from 'react-router-dom'

//CONTAINER
// import CandidateContainer from 'pages/DashBoard/containers/Candidates'
// import PositionContainer from 'pages/DashBoard/containers/Position'

//CONSTANTST
// import { MENUS } from 'pages/DashBoard/constants'
// import { useDispatch, useSelector } from 'react-redux'
// import { changePassword, fetchDashBoardCandidate, fetchProfilePatterns } from 'redux/services/dashboard'
// import ChangePasswordModal from './components/Modal/changePasswordModal'
// import i18nVN from 'i18n/locales/vn'
import { DashboardLayout } from 'components/Layout/Dashboard'
import DashboardRouter from './containers/DashboardRouter'

// const { Header, Sider, Content } = Layout

const Dashboard = () => {
  // const {
  //   pages: { business: { dashboard: { menu } } }
  // } = i18nVN.src

  // const [collapsed, setCollapsed] = React.useState(false)
  // const [menuActive, setMenuActive] = React.useState(1)
  // const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = React.useState(false)
  // const dispatch = useDispatch()
  // const profileInfo = useSelector(state => state.dashboardReducer.profileInfo)

  // React.useEffect(() => {
  //   dispatch(fetchDashBoardCandidate({ itemPerPage: 10, currentPage: 1 }))
  //   dispatch(fetchProfilePatterns())
  //   // dispatch(fetchChartCandidate())
  //   require('antd/dist/antd.css')
  // }, [])

  // const changeMenu = (menu) => {
  //   setMenuActive(menu.id)
  //   dispatch(fetchDashBoardCandidate({ itemPerPage: 10, currentPage: 1 }))
  // }

  // const onToggle = () => {
  //   setCollapsed(!collapsed)
  // }

  // const handleProfileMenu = (e) => {
  //   switch (e.key) {
  //     case '1':
  //       return setIsChangePasswordModalVisible(true)
  //     default:
  //       return
  //   }
  // }

  // const profileMenu = (
  //   <Menu onClick={handleProfileMenu}>
  //     <Menu.Item key='1'>{menu.dropdown.changePassword}</Menu.Item>
  //   </Menu>
  // )

  // const handleChangePasswordSubmit = (values) => {
  //   setIsChangePasswordModalVisible(false)
  //   dispatch(changePassword(values))
  // }

  // const handleChangePasswordCancel = () => {
  //   setIsChangePasswordModalVisible(false)
  // }

  // const onLogout = () => {
  //   if (window !== undefined) {
  //     window.localStorage.removeItem('business-access-token')
  //     window.location.href = '/'
  //   }
  // }

  // const renderContent = () => {
  //   switch (menuActive) {
  //     case 1:
  //       return <CandidateContainer />
  //     default:
  //       return <PositionContainer />
  //   }
  // }

  return (
    // <Layout>
    //   <Sider trigger={null} collapsible collapsed={collapsed}>
    //     <Menu theme='dark' mode='inline' defaultSelectedKeys={[menuActive.toString()]}>
    //       <div className='container-logo' >
    //         <Link to='/'>
    //           <img src='/icon_dashboard.png' className='icon-logo' />
    //         </Link>
    //       </div>
    //       {MENUS.map(menu => (
    //         <Menu.Item
    //           onClick={() => changeMenu(menu)}
    //           className='icon-selected'
    //           key={menu.id}
    //           icon={menu.icon}>
    //           {menu.label}
    //         </Menu.Item>
    //       ))}
    //     </Menu>
    //     <div className='footer-menu' >
    //       {collapsed ? (
    //         <div className='footer-menu__company-info'>
    //           <img src='/icon_dashboard.png' className='footer-menu__logo' />
    //         </div>
    //       ) : (
    //         <>
    //           <div className='footer-menu__company-info'>
    //             <img src='/icon_dashboard.png' className='footer-menu__logo' />
    //             <Dropdown overlay={profileMenu} trigger={['click']}>
    //               <a className='footer-menu__company-name' onClick={e => e.preventDefault()}>
    //                 {profileInfo?.company_name} <DownOutlined />
    //               </a>
    //             </Dropdown>
    //             <ChangePasswordModal
    //               visible={isChangePasswordModalVisible}
    //               onSubmit={handleChangePasswordSubmit}
    //               onCancel={handleChangePasswordCancel}
    //             />
    //           </div>
    //           <div className='logout' onClick={onLogout}>
    //             Đăng xuất
    //           </div>
    //         </>
    //       )}
    //     </div>
    //   </Sider>
    //   <Layout className='site-layout'>
    //     <Header className='site-layout-background' style={{ padding: 0 }}>
    //       {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
    //         className: 'trigger',
    //         onClick: onToggle,
    //       })}
    //     </Header>
    //     <Content
    //       className='site-layout-background'
    //       style={{
    //         margin: '24px 16px',
    //         padding: 24,
    //       }}
    //     >
    //       {renderContent()}
    //     </Content>
    //   </Layout>
    // </Layout>
    <DashboardLayout>
      <DashboardRouter />
    </DashboardLayout>
  )
}
export default Dashboard
