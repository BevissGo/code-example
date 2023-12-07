import React from 'react'
import { Form } from 'antd'

import CustomUnderlineInput from 'components/CustomUnderlineInput'
import { regexCharVie } from 'constants/position'

import './style.scss'

function SurveyInformation() {
  return (
    <div className='survey-information'>
      <Form.Item
        label={<span className='survey-information__form-label'>Survey name</span>}
        name='survey_name'
        rules={[
          { required: true, message: 'Please fill in survey name!' },
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
    </div>
  )
}

export default SurveyInformation
