import React from 'react'

import { Tooltip, Button } from 'antd'
import { EditFilled } from '@ant-design/icons'

const EditIconButton = ({ onClick }) => {
  return (
    <Tooltip placement='bottom' title='Edit'>
      <Button style={{ padding: 'revert' }} onClick={onClick}>
        <EditFilled />
      </Button>
    </Tooltip>
  )
}

export default EditIconButton
