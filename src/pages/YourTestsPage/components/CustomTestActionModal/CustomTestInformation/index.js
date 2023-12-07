import React, { useEffect, useState } from 'react'
import { Form, InputNumber, Radio, Row } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons'

import CustomRadio from 'components/CustomRadio'
import CustomUnderlineInput from 'components/CustomUnderlineInput'
import { ACTION_TYPE, DURATION_OPTIONS } from 'pages/YourTestsPage/constants'
import { regexCharVie } from 'constants/position'

import './style.scss'

function CustomTestInformation({ type, durationTime }) {
  const [radioOption, setRadioOption] = useState()

  useEffect(() => {
    if (type === ACTION_TYPE.CREATE) {
      setRadioOption(DURATION_OPTIONS.UNLIMITED)
    } else {
      if (durationTime) {
        setRadioOption(DURATION_OPTIONS.LIMITED)
      } else {
        setRadioOption(DURATION_OPTIONS.UNLIMITED)
      }
    }
  }, [durationTime, type])

  const handleChangeDuration = (e) => {
    setRadioOption(e.target.value)
  }

  return (
    <div className='custom-test-information'>
      <Form.Item
        label={<span className='custom-test-information__form-label'>Test name</span>}
        name='test_name'
        rules={[
          { required: true, message: 'Please fill in test name!' },
          {
            message: 'Không được có ký tự đặc biệt',
            pattern: regexCharVie,
          },
          {
            max: 100,
            message: 'Field must be less than 100 characters',
          },
        ]}
      >
        <CustomUnderlineInput />
      </Form.Item>
      <Row>
        <Form.Item name='duration' label={<span className='custom-test-information__form-label'>Duration</span>}>
          <Radio.Group
            defaultValue={type === ACTION_TYPE.CREATE ? DURATION_OPTIONS.UNLIMITED : radioOption}
            onChange={handleChangeDuration}
          >
            <CustomRadio value={DURATION_OPTIONS.UNLIMITED}>
              <span>Unlimited</span>
            </CustomRadio>
            <CustomRadio value={DURATION_OPTIONS.LIMITED}>
              <span>Limited</span>
            </CustomRadio>
          </Radio.Group>
        </Form.Item>
        {radioOption === DURATION_OPTIONS.LIMITED && (
          <Form.Item
            name='duration_time'
            rules={[
              { required: true, message: 'Just accept number! Please fill in time (minutes)!' },
              {
                pattern: new RegExp('^[0-9]+$'),
                message: 'Field only accept integer',
              },
            ]}
          >
            <InputNumber
              className='custom-test-information__input-number'
              placeholder='Time (Minutes)'
              upHandler={<UpOutlined />}
              downHandler={<DownOutlined />}
              min={1}
            />
          </Form.Item>
        )}
      </Row>
      <Form.Item label={<span className='custom-test-information__form-label'>Description</span>} name='description'>
        <CustomUnderlineInput />
      </Form.Item>
    </div>
  )
}

export default CustomTestInformation
