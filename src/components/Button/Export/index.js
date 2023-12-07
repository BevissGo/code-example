import React from 'react'
import { Button } from 'antd'

import { ReactComponent as IconExport } from 'assets/images/dashboard/export.svg'

import './style.scss'

const ExportButton = () => {
  return (
    <Button className='export-btn' size='large' icon={<IconExport />}>
      Export
    </Button>
  )
}

export default ExportButton
