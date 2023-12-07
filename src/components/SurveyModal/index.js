import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Row, Upload, Button, Col, DatePicker } from 'antd'
import { UploadOutlined, CloseOutlined } from '@ant-design/icons'
import 'dayjs/locale/zh-cn'

import InputAntd from 'components/Input/InputAntd'
import ButtonDefault from 'components/Button/Default'
import { ruleNumberPhone, ruleValidateImage, ruleValidateLink } from 'helpers'
import { updateProfile } from 'redux/services/profile'
import { DATE } from 'constants/date'
import './style.scss'

const SurveyModal = ({ show, onSubmit, position, survey }) => {
  const dispatch = useDispatch()
  const loadingIqSubmit = useSelector((state) => state.IQTest.loadingPost)
  const loadingEqSubmit = useSelector((state) => state.EQTest.loadingPost)
  const loadingDiscSubmit = useSelector((state) => state.report.loadingPost)
  const loadingBrainSubmit = useSelector((state) => state.brainTest.loadingPost)
  const loadingSingleChoiceSubmit = useSelector((state) => state.singleChoiceTest.loadingPost)
  const loadingCustomTestSubmit = useSelector((state) => state.customTest.loadingPost)
  const loadingPutProfile = useSelector((state) => state.profile.loadingPut)

  const uploadTest = position.upload_test ?? []

  const loading = [
    loadingIqSubmit,
    loadingEqSubmit,
    loadingDiscSubmit,
    loadingBrainSubmit,
    loadingSingleChoiceSubmit,
    loadingCustomTestSubmit,
    loadingPutProfile,
  ].some(Boolean)

  const [form] = Form.useForm()
  const [cvFileList, setCvFileList] = useState([])
  const [coverLetterFileList, setCoverLetterFileList] = useState([])
  const [cvName, setCvName] = useState(position?.attach_cv?.name ?? '')
  const [coverLetterName, setCoverLetterName] = useState(position?.attach_cover_letter?.name ?? '')
  const [fileNames, setFileNames] = useState({})

  const profile = useSelector((state) => state.profile.profile)

  useEffect(() => {
    if (position?.answer_additional_question?.length) {
      const answerList = position?.answer_additional_question?.reduce((acc, cur) => {
        if (cur.type_answer === 'image' || cur.type_answer === 'file') {
          setFileNames((prevStates) => ({
            ...prevStates,
            [cur._id]: cur.answer,
          }))
        }
        return { ...acc, [cur._id]: cur.answer }
      }, {})
      form.setFieldsValue(answerList)
    }
  }, [form, position])

  const props = {
    beforeUpload: () => false,
  }

  const handleFileUpload = async (fileId, info) => {
    const { file } = info
    const id = fileId

    setFileNames((prevStates) => ({
      ...prevStates,
      [id]: file.name,
    }))
  }

  const handleRemoveFile = (id) => {
    setFileNames((prevStates) => {
      const newStates = { ...prevStates }
      delete newStates[id]
      return newStates
    })
  }

  const cvProps = {
    multiple: false,
    maxCount: 1,
    accept: '.doc,.docx,.pdf',
    onRemove: () => {
      setCvFileList([])
      setCvName('')
    },
    beforeUpload: () => false,
    fileList: cvFileList,
  }

  const coverLetterProps = {
    multiple: false,
    maxCount: 1,
    accept: '.doc,.docx,.pdf',
    onRemove: () => {
      setCoverLetterFileList([])
      setCoverLetterName('')
    },
    beforeUpload: () => false,
    fileList: coverLetterFileList,
  }

  const handleCvFileUpload = (info) => {
    setCvFileList([info?.file])
    setCvName(info?.file?.name)
  }

  const handleCoverLetterFileUpload = (info) => {
    setCoverLetterFileList([info?.file])
    setCoverLetterName(info?.file?.name)
  }

  const handleRemoveCvFile = () => {
    form.setFieldValue('attach_cv', undefined)
    setCvFileList([])
    setCvName('')
  }

  const handleRemoveCoverLetterFile = () => {
    form.setFieldValue('attach_cover_letter', undefined)
    setCvFileList([])
    setCoverLetterName('')
  }

  const render = (question, index) => {
    if (question?.type_answer) {
      if (question.type_answer === 'text' || question.type_answer === 'link') {
        return (
          <Form.Item
            key={question._id}
            label={question.question}
            name={question._id}
            rules={[
              {
                required: question.required_answer && !fileNames?.[question._id] ? true : false,
                message: question.required_answer ? 'Câu hỏi này bắt buộc phải trả lời' : undefined,
              },
              question.type_answer === 'link' && ruleValidateLink('Định dạng phải là link hợp lệ'),
            ]}
          >
            <InputAntd placeholder='Vui lòng điền đáp án vào đây...' />
          </Form.Item>
        )
      }
      return (
        <Col key={index} style={{ marginBottom: 16 }}>
          <Form.Item
            key={question._id}
            label={question.question}
            name={question._id}
            style={{ margin: 0 }}
            rules={[
              {
                required: question.required_answer && !fileNames?.[question._id] ? true : false,
                message: question.required_answer && !fileNames[question._id] ? 'Vui lòng đính kèm tệp!' : undefined,
              },
              question.type_answer === 'image' ? ruleValidateImage('Định dạng phải là hình ảnh hợp lệ') : undefined,
            ]}
          >
            <Upload
              {...props}
              key={question._id}
              onChange={(info) => handleFileUpload(question._id, info)}
              disabled={!!fileNames[question._id]}
            >
              <Row>
                <Button icon={<UploadOutlined />} disabled={!!fileNames[question._id]}>
                  Select File
                </Button>
              </Row>
            </Upload>
          </Form.Item>
          {!!fileNames?.[question._id] && (
            <Row style={{ marginTop: 4 }}>
              <Col>{fileNames[question._id]}</Col>
              <CloseOutlined
                style={{ color: 'red', marginLeft: 2, marginTop: 5 }}
                key={question._id}
                onClick={() => handleRemoveFile(question._id)}
              />
            </Row>
          )}
        </Col>
      )
    }
    return null
  }

  const handleSubmit = async (values) => {
    const profileInfo = {
      name: values.fullName,
      phone: values.phoneNumber,
      email: values.email,
      dob: new Date(values.dob).toISOString(),
    }

    const status = await dispatch(updateProfile(profileInfo))

    if (status) {
      await onSubmit(values)
    }
  }
  return (
    show && (
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
              <DatePicker
                format={DATE}
                disabledDate={(current) => dayjs(current).isAfter(dayjs().subtract(1, 'day'))}
              />
            </Form.Item>

            {survey?.map(render)}
            {uploadTest.includes('cv') && (
              <Col style={{ marginBottom: 16 }}>
                <Form.Item
                  label='Upload CV'
                  name='attach_cv'
                  style={{ margin: 0 }}
                  rules={[
                    {
                      required: position?.require_attach_cv && !cvName ? true : false,
                      message: position?.require_attach_cv && !cvName ? 'Vui lòng đính kèm CV!' : undefined,
                    },
                  ]}
                >
                  <Upload {...cvProps} onChange={handleCvFileUpload} disabled={!!cvName}>
                    <Row>
                      <Button icon={<UploadOutlined />} disabled={!!cvName}>
                        Select File
                      </Button>
                    </Row>
                  </Upload>
                </Form.Item>
                {!!cvName && (
                  <Row style={{ marginTop: 4 }}>
                    <Col>{cvName}</Col>
                    <CloseOutlined style={{ color: 'red', marginLeft: 2, marginTop: 5 }} onClick={handleRemoveCvFile} />
                  </Row>
                )}
              </Col>
            )}
            {uploadTest.includes('cover_letter') && (
              <Col style={{ marginBottom: 16 }}>
                <Form.Item
                  label='Upload Cover Letter'
                  name='attach_cover_letter'
                  style={{ margin: 0 }}
                  rules={[
                    {
                      required: position?.require_attach_cover_letter && !coverLetterName ? true : false,
                      message:
                        position?.require_attach_cover_letter && !coverLetterName
                          ? 'Vui lòng đính kèm cover letter!'
                          : undefined,
                    },
                  ]}
                >
                  <Upload {...coverLetterProps} onChange={handleCoverLetterFileUpload} disabled={!!coverLetterName}>
                    <Row>
                      <Button icon={<UploadOutlined />} disabled={!!coverLetterName}>
                        Select File
                      </Button>
                    </Row>
                  </Upload>
                </Form.Item>
                {!!coverLetterName && (
                  <Row style={{ marginTop: 4 }}>
                    <Col>{coverLetterName}</Col>
                    <CloseOutlined
                      style={{ color: 'red', marginLeft: 2, marginTop: 5 }}
                      onClick={handleRemoveCoverLetterFile}
                    />
                  </Row>
                )}
              </Col>
            )}
            <Row align='center'>
              <ButtonDefault loading={loading} label='Tiếp tục' type='submit' />
            </Row>
          </Form>
        </div>
      </div>
    )
  )
}

export default SurveyModal
