import React from 'react'
import { Checkbox, Col, Form, Radio, Row, Space } from 'antd'

import CustomRadio from 'components/CustomRadio'
import CustomCheckbox from 'components/CustomCheckbox'
import { UPLOAD_OPTIONS } from 'pages/CampaignPage/utils'
import { checkIsEdittingAndCampaignNotPending } from 'pages/CampaignPage/helpers'

import './style.scss'

const CampaignUpload = ({ form, field, uploadTest, setUploadTest, actionType, campaignStatus }) => {
  const handleChangeUploadTest = (checkedValues) => {
    setUploadTest(checkedValues)
    const positionValues = form.getFieldValue('positions')
    positionValues[field.name] = {
      ...positionValues[field.name],
      upload_test: checkedValues,
    }

    form.setFieldsValue({ positions: positionValues })
  }

  return (
    <Col className='campaign-upload'>
      <Row>
        <Col span={5}>
          <span className='campaign-upload__title'>Profile Requirements</span>
        </Col>
        <Col span={19}>
          <Checkbox.Group
            className='campaign-upload__checkbox-group'
            name={[field.name, 'upload_test']}
            value={uploadTest}
            onChange={handleChangeUploadTest}
          >
            <Space direction='vertical' size='middle'>
              {UPLOAD_OPTIONS.map((option, index) => (
                <Row key={index} gutter={[40]}>
                  <Col span={9}>
                    <CustomCheckbox
                      name={[field.name, option.value]}
                      value={option.value}
                      size='large'
                      checked={uploadTest.includes(option.value)}
                      disabled={checkIsEdittingAndCampaignNotPending({ actionType, campaignStatus })}
                    >
                      {option.label}
                    </CustomCheckbox>
                  </Col>
                  <Col span={8}>
                    {uploadTest.includes(option.value) && (
                      <Form.Item
                        name={[field.name, option.requireValue]}
                        rules={[{ required: true, message: 'Please select required upload!' }]}
                      >
                        <Radio.Group disabled={checkIsEdittingAndCampaignNotPending({ actionType, campaignStatus })}>
                          <Row>
                            {option?.resultOption?.map((result) => (
                              <div key={result.value}>
                                <Col>
                                  <CustomRadio value={result.value}>{result.label}</CustomRadio>
                                </Col>
                              </div>
                            ))}
                          </Row>
                        </Radio.Group>
                      </Form.Item>
                    )}
                  </Col>
                </Row>
              ))}
            </Space>
          </Checkbox.Group>
        </Col>
      </Row>
    </Col>
  )
}

export default CampaignUpload
