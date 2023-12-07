import React from 'react'
import { Option } from 'antd/es/mentions'
import { Form, Input, Select, } from 'antd'
import FormItem from 'antd/es/form/FormItem'

import i18nVN from 'i18n/locales/vn'

import './style.scss'

function BasicInfo() {
  const { edit: contentPage } = i18nVN.src.pages.business.profile

  const handleChange = (value) => {
    console.log(`selected ${value}`)
  }

  return (
    <div className='business-edit-profile-page-basic-info'>
      <div className='business-edit-profile-page-basic-info__column1'>
        <div className='business-edit-profile-page-basic-info__row'>
          <div className='business-edit-profile-page-basic-info__name'>
            <p className='business-edit-profile-page-basic-info__name-text'>Name</p>
            <Form.Item name='company_name'>
              <Input
                className='business-edit-profile-page-basic-info__name-input'
                style={{ marginRight: '10rem' }}
                placeholder={contentPage.namePlaceholder}
              />
            </Form.Item>
          </div>
          <div className='business-edit-profile-page-basic-info__employee-amount'>
            <p className='business-edit-profile-page-basic-info__employee-amount-text'>Employee amount</p>
            <Form.Item
              name='employee_amount'
            >
              <Input
                className='business-edit-profile-page-basic-info__employee-amount-input'
                placeholder={contentPage.amountPlaceholder}
                type='number'
                min={0}
              />
            </Form.Item>
          </div>
        </div>
        <div className='business-edit-profile-page-basic-info__website'>
          <p className='business-edit-profile-page-basic-info__website-text'>Website</p>
          <Form.Item name='website'>
            <Input
              className='business-edit-profile-page-basic-info__website-input'
              placeholder={contentPage.websitePlaceholder}
            />
          </Form.Item>
        </div>
        <div className='business-edit-profile-page-basic-info__location'>
          <p className='business-edit-profile-page-basic-info__location-text'>Location</p>
          <Form.Item name='location'>
            <Input
              className='business-edit-profile-page-basic-info__location-input'
              placeholder={contentPage.locationPlaceholder}
            />
          </Form.Item>
        </div>
        <div className='business-edit-profile-page-basic-info__work-hour'>
          <p className='business-edit-profile-page-basic-info__work-hour-text'>Work hour</p>
          <Form.Item name='work_hour'>
            <Input
              className='business-edit-profile-page-basic-info__work-hour-input'
              placeholder={contentPage.workhourPlaceholder}
            />
          </Form.Item>
        </div>
      </div>
      <div className='business-edit-profile-page-basic-info__column2'>
        <div className='business-edit-profile-page-basic-info__phone'>
          <p className='business-edit-profile-page-basic-info__phone-text'>Phone number</p>
          <Form.Item name='phone'>
            <Input
              className='business-edit-profile-page-basic-info__phone-input'
              placeholder={contentPage.phonePlaceholder}
            />
          </Form.Item>
        </div>
        <div className='business-edit-profile-page-basic-info__email'>
          <p className='business-edit-profile-page-basic-info__email-text'>Email address</p>
          <FormItem name='email'>
            <Input
              className='business-edit-profile-page-basic-info__email-input'
              placeholder={contentPage.emailPlaceholder}
            />
          </FormItem>
        </div>
        <div className='business-edit-profile-page-basic-info__work-day'>
          <p className='business-edit-profile-page-basic-info__work-day-text'>Work day</p>
          <FormItem name='work_day'>
            <Input
              className='business-edit-profile-page-basic-info__work-day-input'
              placeholder={contentPage.workhourPlaceholder}
            />
          </FormItem>
        </div>
        <div className='business-edit-profile-page-basic-info__specialty'>
          <p className='business-edit-profile-page-basic-info__specialty-text'>Specialty</p>
          <FormItem name='specialty'>
            <Select
              className='business-edit-profile-page-basic-info__specialty-select'
              placeholder={contentPage.specialtyPlaceholder}
              mode='multiple'
              bordered={false}
              placement='bottomLeft'
              onChange={handleChange}
            >
              <Option value='Technology' label='Technology'>
                Technology
              </Option>
              <Option value='Sale' label='Sale'>
                Sale
              </Option>
              <Option value='Outsourcing' label='Outsourcing'>
                Outsourcing
              </Option>
              <Option value='Bank' label='Bank'>
                Bank
              </Option>
              <Option value='Logistic' label='Logistic'>
                Logistic
              </Option>
              <Option value='Agency' label='Agency'>
                Agency
              </Option>
            </Select>
          </FormItem>
        </div>
      </div>
    </div>
  )
}

export default BasicInfo
