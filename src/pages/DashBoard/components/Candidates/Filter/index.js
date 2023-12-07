import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Select, Button, Radio } from 'antd'

import { DATA_RADIO } from 'pages/DashBoard/constants'
import { fetchDashBoardCandidate } from 'redux/services/dashboard'

import './style.scss'

const { Option } = Select

const  Filter = ({ data = [], contentPage = {}}) => {
  const [value, setValue] = React.useState({
    filter: 'all',
    profilePattern: ''
  })
  const dispatch = useDispatch()
  const onChange = type => (e) =>{
    const params = {...value}
    if (type === 'select') {
      if ( e === 'All') {
        params.profilePattern = ''
      } else {
        params.profilePattern = e
      }
    }
    if (type === 'radio') {
      params.filter = e.target.value
    }

    setValue(params)
  }

  useEffect(() => {
    dispatch(fetchDashBoardCandidate(value))
  }, [value.filter])

  const onFilter = () => {
    dispatch(fetchDashBoardCandidate(value))
  }

  return (
    <div className='wrapper-filter-candidate'>
      <Radio.Group style={{  }} onChange={onChange('radio')} value={value.filter}>
        {DATA_RADIO.map((item, index) => (
          <Radio style={{ marginRight: index === 0 ? 45 : 42 }} key={item.id} value={item.id}>{item.name}</Radio>
        ))}
      </Radio.Group>
      <div style={{ marginTop: 15}}>
        <Select defaultValue='All' style={{ width: 318, marginRight: 15 }} onChange={onChange('select')}>
          <Option value={'All'}>{contentPage.all}</Option>
          {data.map(item => (
            <Option key={item._id} value={item.value}>{item.name}</Option>
          ))}
        </Select>
        <Button onClick={onFilter} color='black' style={{ backgroundColor: '#E5C47C', borderColor: '#E5C47C', width: 115 }} >{contentPage.filter}</Button>
      </div>
    </div>
  )
}

export default Filter
