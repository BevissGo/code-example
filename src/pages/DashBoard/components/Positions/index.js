import React, { useCallback, useState }  from 'react'
import { CopyOutlined } from '@ant-design/icons'
import { useDispatch, useSelector} from 'react-redux'
import { Table, Dropdown, Menu, message } from 'antd'

import config from 'configs'
import {
  detelePosition,
  fetchDashBoardPositions,
  postPosition,
  putPosition,
} from 'redux/services/dashboard'
import Filter from 'pages/DashBoard/components/Positions/Filter'
import ModalCustom from './Modal'
import { DownArrow, IconMoreThreeDot } from './res/icons'

import './style.scss'

const PositionsComponent = ({ data = [], totalItem = 5, onClickItem = () => {}, getTypeCategory = () => {}, contentPage = {}, isFetching}) => {
  const dispatch = useDispatch()
  const filtersPosition = useSelector(state => state.dashboardReducer.filtersPosition)
  const [isCreate, setIsCreate] = useState(true)
  const [itemSelected, setItemSelected] = useState(null)
  const [expand, setExpand] = useState(false)
  const [categoryTest, setCategoryTest] = useState('disc_test')
  const [modalEditVisible, setModalEditVisible] = useState(false)
  const [testType, setTestType] = useState(contentPage.discResult)
  const [params, setParams] = useState({
    itemPerPage: 10,
    currentPage: 1
  })

  const copyToClipboard = (text) => {
    const textField = document.createElement('textarea')
    textField.innerText = text
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
    message.success('Copied', 2.5)
  }

  const onChange = (pagination) => {
    const newParams = {
      ...params,
      currentPage: pagination?.current,
      categoryTest: categoryTest
    }
    setParams(newParams)
    dispatch(fetchDashBoardPositions(newParams))
  }

  const onChangeCategoryTest = useCallback((value, label) => {
    getTypeCategory(value)
    setCategoryTest(value)
    setTestType(label)
    dispatch(fetchDashBoardPositions({itemPerPage:10, currentPage: 1, categoryTest: value}))
  })

  const onSubmit = async (value) => {
    const rs = {'position': value}
    if(!isCreate){
      rs.position.id = value?._id
    }
    let result = null
    if(isCreate){
      result = await  postPosition(rs)
    } else {
      result = await putPosition(rs)
    }
    if(result){
      setModalEditVisible(false)
      dispatch(fetchDashBoardPositions({itemPerPage:10, currentPage: 1, categoryTest: categoryTest}))
    }
  }

  const menu = (
    <Menu selectedKeys={[categoryTest]}>
      <Menu.Item key='disc_test'>
        <a onClick={()=>{onChangeCategoryTest('disc_test', contentPage.discResult)}}>{contentPage.discResult}</a>
      </Menu.Item>
      <Menu.Item key='iq_test'>
        <a onClick={()=>{onChangeCategoryTest('iq_test', contentPage.iqResult)}}>{contentPage.iqResult}</a>
      </Menu.Item>
    </Menu>
  )

  function handleMenuClick(e) {
    console.log('click', e)
  }

  const deleteItem = (item) => {
    dispatch(detelePosition(item?._id))
  }

  const actions = (item) => {
    return (
    <Menu >
      <Menu.Item key='0'>
        <a onClick={()=> deleteItem(item)}>{contentPage.delete}</a>
      </Menu.Item>
      <Menu.Item key='1'>
        <a onClick={()=>{
          setIsCreate(false)
          setModalEditVisible(true)
          setItemSelected(item)
          }}>{contentPage.edit}</a>
      </Menu.Item>
    </Menu>
  )
  }

  const columns = [
  {
    title: contentPage.column.position,
    dataIndex: 'name',
    width: 20,
    render: (text, record) => {
      return (
        <div onClick={() => onClickItem(record, categoryTest) }>{text}</div>
      )
    }
  },
  {
    title: contentPage.column.linkTest,
    dataIndex: 'link_test',
    width: 200,
    render: (text, record) => {
      const link = `${config.URIClient}/${categoryTest === 'disc_test' ? 'survey':'iq-test'}/${record._id}`
      return(
        <div className='table-test-link' >
          <CopyOutlined size={14} onClick={() => {copyToClipboard(link)}}/>
          <a href={link} target='_blank' rel='noreferrer'>
            {link}
          </a>
        </div>
      )
    }
  },
  {
    title: contentPage.column.fitResult,
    dataIndex: 'fit_iq_score',
    align: 'center',
    width: 10,
    render: (text, record) => {
      const value = categoryTest === 'disc_test' ? (record?.profile_patterns|| []).join(', ') : record?.fit_iq_score
      return(
        <div>{value}</div>
      )
    }
  },
  {
    title: contentPage.column.action,
    dataIndex: '',
    width: '10%',
    align: 'right',
    render: (record) => (
      <Dropdown
        overlayStyle={{ width: 156 }}
        placement='bottomRight'
        overlay={()=> actions(record)}
        trigger={['click']}>
        <a className='ant-dropdown-link' onClick={e => e.preventDefault()}>
          <IconMoreThreeDot/>
        </a>
      </Dropdown>
    ),
  },
]

  return (
    <>
      <Filter
        categoryTest={categoryTest}
        onPressButton={() => setModalEditVisible(true)}
        contentPage={contentPage.filter}
      />
      <div className='container-position-table'>
        <Dropdown
          overlayStyle={{ width: 206 }}
          onVisibleChange={handleMenuClick}
          placement='bottomRight'
          overlay={menu}
          trigger={['click']}>
          <a className='ant-dropdown-link' style={{color:'#000000d9', float: 'right', marginBottom: '20px', borderBottom: 'solid 1px black'}} onClick={() => setExpand(!expand)}>
            {`${testType.toUpperCase()} `}
            <DownArrow isRotage={expand}/>
          </a>
        </Dropdown>
        <Table
          loading={isFetching}
          columns={columns}
          dataSource={data}
          onChange={onChange}
          pagination={{
            total: totalItem,
            pageSize: 10,
            defaultCurrent: filtersPosition?.currentPage || 1,
            current: filtersPosition?.currentPage || 1
          }}
        />
        {modalEditVisible && (
          <ModalCustom
            itemSelected={itemSelected}
            isCreate={isCreate}
            visible={modalEditVisible}
            onOk={onSubmit}
            onCancel={()=> {
              setModalEditVisible(false)
              setItemSelected(null)
              setIsCreate(true)
            }}
            contentPage={contentPage.modal}
          />
        )}
      </div>
    </>
  )
}

export default PositionsComponent
