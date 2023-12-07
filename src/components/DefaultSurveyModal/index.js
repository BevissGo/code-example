import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Row, DatePicker } from 'antd'
import 'dayjs/locale/zh-cn'

import InputAntd from 'components/Input/InputAntd'
import ButtonDefault from 'components/Button/Default'
import { fetchProfileIfNeeded, updateProfile } from 'redux/services/profile'
import { ruleNumberPhone } from 'helpers'
import { DATE } from 'constants/date'
import './style.scss'
import { getValueFromStorage } from 'utils'

const DefaultSurveyModal = ({ onSubmit, isAuthenticated }) => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const profile = useSelector((state) => state.profile.profile)

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values) => {
    setLoading(true)
    const profileInfo = {
      name: values.fullName,
      phone: values.phoneNumber,
      email: values.email,
      dob: new Date(values.dob).toISOString(),
    }
    const status = await dispatch(updateProfile(profileInfo))

    if (status) {
      await onSubmit()
    }

    setLoading(false)
  }

  useEffect(() => {
    if (isAuthenticated) {
      getValueFromStorage('access-token') && dispatch(fetchProfileIfNeeded())
    }
  }, [isAuthenticated, dispatch])

  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        fullName: profile?.name,
        phoneNumber: profile?.phone,
        email: profile?.email,
        dob: dayjs(profile?.dob || dayjs(new Date()).subtract(1, 'day')),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile])

  return (
    <div className='modal'>
      <div className='modal-wrap'>
        <Form
          layout='vertical'
          form={form}
          scrollToFirstError={{
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
          }}
          onFinish={handleSubmit}
        >
          <Form.Item
            label='Họ và tên'
            name='fullName'
            initialValue={profile.name}
            rules={[
              {
                required: true,
                message: 'Câu hỏi này bắt buộc phải trả lời',
              },
            ]}
          >
            <InputAntd placeholder='Vui lòng điền đáp án vào đây...' />
          </Form.Item>
          <Form.Item
            label='Số điện thoại'
            name='phoneNumber'
            initialValue={profile.phone}
            rules={[
              {
                required: true,
                message: 'Câu hỏi này bắt buộc phải trả lời',
              },
              ruleNumberPhone('Số điện thoại không hợp lệ'),
            ]}
          >
            <InputAntd placeholder='Vui lòng điền đáp án vào đây...' />
          </Form.Item>
          <Form.Item
            label='Email'
            name='email'
            type='email'
            initialValue={profile.email}
            rules={[
              {
                required: true,
                message: 'Câu hỏi này bắt buộc phải trả lời',
              },
            ]}
          >
            <InputAntd disabled placeholder='Vui lòng điền đáp án vào đây...' />
          </Form.Item>

          <Form.Item
            label='Ngày sinh'
            name='dob'
            initialValue={dayjs(profile.dob || dayjs(new Date()).subtract(1, 'day'))}
            rules={[
              {
                required: true,
                message: 'Câu hỏi này bắt buộc phải trả lời',
              },
            ]}
          >
            <DatePicker format={DATE} disabledDate={(current) => dayjs(current).isAfter(dayjs().subtract(1, 'day'))} />
          </Form.Item>

          <Row align='center'>
            <ButtonDefault loading={loading} label='Tiếp tục' type='submit' />
          </Row>
        </Form>
      </div>
    </div>
  )
}

export default DefaultSurveyModal
