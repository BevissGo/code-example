import React, { useEffect } from 'react'
import { Col, Form, Row, Select } from 'antd'
import { useSelector } from 'react-redux'
import ButtonDefault from 'components/Button/Default'
import './style.scss'
import InputAntd from 'components/Input/InputAntd'
import { ruleNumberPhone, ruleFacebookLink } from 'helpers'
import { sexOption } from 'pages/CampaignPage/utils'

const { Option } = Select

const AddInformationProfile = ({ loading, onClick }) => {
  const [form] = Form.useForm()

  const profileData = useSelector((state) => state.profile.profile)

  const { name, sex, phone, facebook_profile_url } = profileData

  useEffect(() => {
    form.setFieldsValue({
      name,
      sex,
      phone,
      facebook_profile_url,
    })
  }, [facebook_profile_url, form, name, phone, sex])

  const handleSubmit = (values) => {
    onClick(values)
  }

  return (
    <Col>
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
        <Col>
          <Form.Item label='Họ tên' name='name' rules={[{ required: true, message: 'Trường này bắt buộc phải nhập!' }]}>
            <InputAntd placeholder='Vui lòng nhập họ tên...' />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label='Giới tính'
            name='sex'
            rules={[{ required: true, message: 'Trường này bắt buộc phải chọn!' }]}
          >
            <Select className='select-sex' style={{ width: '100%' }} placeholder='Vui lòng chọn giới tính'>
              {sexOption?.map((sex) => (
                <Option key={sex.value} value={sex.value}>
                  {sex.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item
            label='Số điện thọại'
            name='phone'
            rules={[
              { required: true, message: 'Trường này bắt buộc phải nhập!' },
              ruleNumberPhone('Định dạng phải là 1 số điện thoại!'),
            ]}
          >
            <InputAntd placeholder='Vui lòng nhập số điện thoại...' />
          </Form.Item>
        </Col>
        {/* <Col>
          <Form.Item
            label='Địa chỉ'
            name='address'
            rules={[{ required: true, message: 'Truing này bắt buộc phải nhập!' }]}
          >
            <InputAntd placeholder='Vui lòng nhập địa chỉ...' />
          </Form.Item>
        </Col> */}
        <Col>
          <Form.Item
            label='Link facebook cá nhân'
            name='facebook_profile_url'
            rules={[
              { required: true, message: 'Trường này bắt buộc phải nhập!' },
              ruleFacebookLink('Định dạng phải là link trang cá nhân của bạn'),
            ]}
          >
            <InputAntd placeholder='Vui lòng nhập link facebook cá nhân...' />
          </Form.Item>
        </Col>
        <Row align='center'>
          <ButtonDefault label='Cập nhật' extraClassName='' loading={loading} />
        </Row>
      </Form>
    </Col>
  )
}

export default AddInformationProfile
