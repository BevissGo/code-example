import React from 'react'
import { Button, Form, Input, Select, Space } from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons'
import { Option } from 'antd/es/mentions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import i18nVN from 'i18n/locales/vn'

import './style.scss'

function ExtraInfo() {
  const { edit: contentPage } = i18nVN.src.pages.business.profile

  const handleChange = (value) => {
    console.log(`selected ${value}`)
  }

  return (
    <div className='business-edit-profile-page-extra-info'>
      <div className='business-edit-profile-page-extra-info__address'>
        <Form.List name='address'>
          {(fields, { add, remove }) => (
            <>
              <div className='business-edit-profile-page-extra-info__address-wrapper'>
                <p className='business-edit-profile-page-extra-info__address-text'>Address</p>
                <Form.Item>
                  <Button
                    className='business-edit-profile-page-extra-info__address-button'
                    onClick={() => add()}
                  >
                    <FontAwesomeIcon icon={faPlus} style={{ marginRight: '4px' }} />
                    Add address
                  </Button>
                </Form.Item>
              </div>
              {fields.map(({ key, name, ...restField }) => (
                <Space.Compact key={key} style={{ display: 'flex', alignItems: 'baseline' }}>
                  <Form.Item
                    {...restField}
                    name={[name, 'text']}
                    rules={[
                      {
                        required: true,
                        message: 'Missing address',
                      },
                    ]}
                    style={{ width: '100%' }}
                  >
                    <Input
                      className='business-edit-profile-page-extra-info__address-input'
                      placeholder={contentPage.addressPlaceholder}
                    />
                  </Form.Item>
                  <MinusCircleOutlined style={{ marginLeft: '8px' }} onClick={() => remove(name)} />
                </Space.Compact>
              ))}
            </>
          )}
        </Form.List>
      </div>
      <div className='business-edit-profile-page-extra-info__services'>
        <p className='business-edit-profile-page-extra-info__services-text'>Services</p>
        <Form.Item name='services'>
          <Select
            className='business-edit-profile-page-extra-info__services-select'
            placeholder={contentPage.servicesPlaceholder}
            mode='multiple'
            optionLabelProp='label'
            bordered={false}
            placement='bottomLeft'
            onChange={handleChange}
          >
            <Option value='Web Development' label='Web Development'>
              Web Development
            </Option>
            <Option value='UI/UX Service' label='UI/UX Service'>
              UI/UX Service
            </Option>
            <Option value='Mobile Development' label='Mobile Development'>
              Mobile Development
            </Option>
            <Option value='Micro-services' label='Micro-services'>
              Micro-services
            </Option>
            <Option value='Automation Testing' label='Automation Testing'>
              Automation Testing
            </Option>
            <Option value='Odoo ERP' label='Odoo ERP'>
              Odoo ERP
            </Option>
            <Option value='Project Management' label='Project Management'>
              Project Management
            </Option>
            <Option value='Data Analytics' label='Data Analytics'>
              Data Analytics
            </Option>
            <Option value='IT Solutions Consulting' label='IT Solutions Consulting'>
              IT Solutions Consulting
            </Option>
            <Option value='Digital Transformations' label='Digital Transformations'>
              Digital Transformations
            </Option>
            <Option value='Cyber Security' label='Cyber Security'>
              Cyber Security
            </Option>s
          </Select>
        </Form.Item>
      </div>
      <div className='business-edit-profile-page-extra-info__keyskills'>
        <p className='business-edit-profile-page-extra-info__keyskills-text'>Key skills</p>
        <Form.Item name='key_skills'>
          <Select
            className='business-edit-profile-page-extra-info__keyskills-select'
            placeholder={contentPage.keySkillsPlaceholder}
            mode='multiple'
            optionLabelProp='label'
            bordered={false}
            placement='bottomLeft'
            onChange={handleChange}
          >
            <Option value='Ruby' label='Ruby'>
              Ruby
            </Option>
            <Option value='PHP' label='PHP'>
              PHP
            </Option>
            <Option value='NodeJS' label='NodeJS'>
              NodeJS
            </Option>
            <Option value='Javascript' label='Javascript'>
              Javascript
            </Option>
            <Option value='Business Analysis' label='Business Analysis'>
              Business Analysis
            </Option>
            <Option value='HTML' label='HTML'>
              HTML
            </Option>
            <Option value='Marketing' label='Marketing'>
              Marketing
            </Option>
            <Option value='Product Management' label='Product Management'>
              Product Management
            </Option>
            <Option value='UI/UX Design' label='UI/UX Design'>
              UI/UX Design
            </Option>
          </Select>
        </Form.Item>
      </div>
    </div >
  )
}

export default ExtraInfo
