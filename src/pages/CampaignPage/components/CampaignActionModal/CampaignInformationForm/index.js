import React from 'react'
import dayjs from 'dayjs'
import { Col, DatePicker, Form, Input, Radio, Row } from 'antd'

import CustomRadio from 'components/CustomRadio'
import { checkIsEdittingAndCampaignNotPending } from 'pages/CampaignPage/helpers'

import './style.scss'

const CampaignInformationForm = ({ form, actionType, campaignStatus, basicInfoCampaignRef }) => {
  const disabledStartDate = (current) => {
    const endDate = form.getFieldValue('end_date')

    if (endDate) {
      return current && current > dayjs(endDate).add(1, 'day').startOf('day')
    }

    return false
  }

  const disableEndDate = (current) => {
    const startDate = form.getFieldValue('start_date')

    if (startDate) {
      return current && current < dayjs(startDate).subtract(1, 'day').endOf('day')
    }

    return false
  }

  return (
    <Col className='campaign-information-form' ref={basicInfoCampaignRef}>
      <Row gutter={[40, 8]}>
        <Col span={12}>
          <Form.Item
            label={<span className='campaign-information-form__form-label'>Campaign name</span>}
            name='campaign_name'
            rules={[{ required: true, message: 'Please fill in campaign name!' }]}
          >
            <Input bordered={false} placeholder='Please fill in...' />
          </Form.Item>
        </Col>
        <Col span={9}>
          <Form.Item
            label={<span className='campaign-information-form__form-label--short'>Range</span>}
            name='range'
            rules={[{ required: true, message: 'Please fill in range!' }]}
          >
            <Radio.Group className='campaign-information-form__radio-group'>
              <CustomRadio className='campaign-information-form__radio' value='global'>
                <span className='campaign-information-form__radio__text'>Global</span>
              </CustomRadio>
              <CustomRadio className='campaign-information-form__radio' value='local'>
                <span className='campaign-information-form__radio__text'>Local</span>
              </CustomRadio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[40, 8]}>
        <Col span={12}>
          <Form.Item
            label={<span className='campaign-information-form__form-label'>Recruiter&apos;s name</span>}
            name='recruiter'
            rules={[{ required: true, message: 'Please fill in recruiter!' }]}
          >
            <Input bordered={false} placeholder='Please fill in...' />
          </Form.Item>
        </Col>
        <Col span={9}>
          <Form.Item
            label={<span className='campaign-information-form__form-label--short'>Start date</span>}
            name='start_date'
            rules={[{ required: true, message: 'Please select start date!' }]}
          >
            <DatePicker
              format='DD/MM/YYYY'
              placeholder='Select start date'
              disabledDate={disabledStartDate}
              disabled={checkIsEdittingAndCampaignNotPending({ actionType, campaignStatus })}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[40, 8]}>
        <Col span={12}>
          <Form.Item
            label={<span className='campaign-information-form__form-label'>Purpose</span>}
            name='purpose'
            rules={[{ required: true, message: 'Please fill in purpose!' }]}
          >
            <Input bordered={false} placeholder='Please fill in...' />
          </Form.Item>
        </Col>
        <Col span={9}>
          <Form.Item
            label={<span className='campaign-information-form__form-label--short'>End date</span>}
            name='end_date'
            rules={[{ required: true, message: 'Please select start date!' }]}
          >
            <DatePicker format='DD/MM/YYYY' placeholder='Select end date' disabledDate={disableEndDate} />
          </Form.Item>
        </Col>
      </Row>
    </Col>
  )
}

export default CampaignInformationForm
