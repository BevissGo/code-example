import React from 'react'

import { Button, Tooltip } from 'antd'
import { DeleteFilled } from '@ant-design/icons'

import './style.scss'

const DeleteIconButton = ({ onClick }) => {
  return (
    <Tooltip placement='bottom' title='Delete'>
      <Button style={{ padding: 'revert' }} className='delete-btn' onClick={onClick}>
        <DeleteFilled />
      </Button>
    </Tooltip>
  )
}

export default DeleteIconButton
