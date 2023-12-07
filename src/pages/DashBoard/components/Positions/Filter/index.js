import React from 'react'
import { Button, Input } from 'antd'
import { useDispatch} from 'react-redux'
import debounce from 'lodash/debounce'
import { fetchDashBoardPositions } from 'redux/services/dashboard'
import {Search} from '../res/icons'
import './style.scss'

const  Filter = ({ categoryTest = 'disc_test',  onPressButton = () => {}, contentPage = {}}) => {
  const dispatch = useDispatch()
  const onChange = (event) =>{
    fetchApiDebounce(event.target.value)
  }

  const fetchApiDebounce = debounce((value) => {
    dispatch(fetchDashBoardPositions({search: value, categoryTest}))
  }, 300)

  return (
    <div className='wrapper-filter-position'>
      <Input
        style={{ marginRight: 118, borderRadius: '5px', height: 36, paddingLeft: 25, paddingRight: 13 }}
        onChange={onChange}
        placeholder={contentPage.find}
        suffix={<Search style={{ marginLeft: 12 }}/>}
      />
      <Button onClick={onPressButton} color='black' style={{ backgroundColor: '#E5C47C', borderColor: '#E5C47C', height: 36 }} >
        {contentPage.addPositionRecruitment}
      </Button>
    </div>
  )
}

export default Filter
