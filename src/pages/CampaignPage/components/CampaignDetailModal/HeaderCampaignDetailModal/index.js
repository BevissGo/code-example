import React from 'react'
import { Breadcrumb, Row } from 'antd'
import { DoubleRightOutlined } from '@ant-design/icons'

import './style.scss'

function HeaderCampaignDetailModal({ breadcrumbItems, status }) {
  return (
    <Row className='header-campaign-detail-modal' align='middle' justify='space-between'>
      <Row align='middle'>
        <Breadcrumb
          className='header-campaign-detail-modal__title'
          items={breadcrumbItems}
          separator={<DoubleRightOutlined />}
        />
        <span
          style={{ color: status?.color, background: status?.background }}
          className='header-campaign-detail-modal__status'
        >
          {status?.title ?? '--'}
        </span>
      </Row>
    </Row>
  )
}

export default HeaderCampaignDetailModal
