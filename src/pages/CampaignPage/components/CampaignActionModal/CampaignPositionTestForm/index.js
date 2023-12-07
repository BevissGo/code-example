import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { without } from 'lodash'
import { DeleteOutlined } from '@ant-design/icons'
import { Button, Checkbox, Col, Form, InputNumber, Row, Select, Space } from 'antd'

import CustomCheckbox from 'components/CustomCheckbox'
import { checkIsEdittingAndCampaignNotPending } from 'pages/CampaignPage/helpers'
import { TEST_OPTIONS } from 'pages/CampaignPage/utils'
import { ruleNumberByCorrect, toastifyNotify } from 'helpers'
import { fetchCustomizedTestList } from 'api/business/customizedTest.api'
import { fetchProfilePatterns } from 'api/business/profilePatterns.api'
import { fetchSurveyList } from 'api/business/survey.api'

import CampaignUpload from '../CampaignUpload'

import './style.scss'

const { Option } = Select

const CampaignPositionTestForm = ({
  form,
  field,
  categoryTest,
  setCategoryTest,
  uploadTest,
  setUploadTest,
  actionType,
  fieldLength,
  handleDelete,
  campaignStatus,
  testQuestions,
  setTestQuestions,
  profileRequirementRef,
}) => {
  const [options, setOptions] = useState([])
  const [surveyOptions, setSurveyOptions] = useState([])
  const [selectedTestIdList, setSelectedTestIdList] = useState([])

  const { data: profilePatterns } = useQuery(['GET_PROFILE_PATTERNS'], () => fetchProfilePatterns(), {
    onError: (error) => {
      toastifyNotify('error', error?.message ?? 'Failed to fetch profile pattern')
    },
  })
  const testOptions = [...TEST_OPTIONS]
  testOptions[3].resultOption = [{ value: 'all' }, ...profilePatterns]

  const { data: testList } = useQuery(['GET_TEST_LIST'], () => fetchCustomizedTestList(), {
    onError: (error) => {
      toastifyNotify('error', error?.message ?? 'Failed to fetch custom test list')
    },
    initialData: [],
  })

  const { data: surveyList } = useQuery(['GET_SURVEY_LIST'], () => fetchSurveyList(), {
    onError: (error) => {
      toastifyNotify('error', error?.message ?? 'Failed to fetch survey list')
    },
    initialData: [],
  })

  useEffect(() => {
    const options = testList.map((test) => {
      return {
        label: test.testName,
        value: test.Id,
      }
    })

    setOptions(options)
  }, [testList])

  useEffect(() => {
    const options = surveyList.map((survey) => {
      return {
        label: survey.surveyName,
        value: survey.Id,
      }
    })

    setSurveyOptions([
      {
        label: 'Default Survey',
        value: 'defaultSurvey',
      },
      ...options,
    ])
  }, [surveyList])

  const handleSelectAll = (mode, test) => (value) => {
    const positionValues = form.getFieldValue('positions')

    if (mode !== 'multiple') {
      positionValues[field.name] = {
        ...positionValues[field.name],
        [field.name]: value,
      }
      form.setFieldsValue({ positions: positionValues })

      return value
    }

    if (value?.length && value.includes('all')) {
      if (
        (form.getFieldValue(['positions', field.name, test]) ?? [])?.length === 1 &&
        (form.getFieldValue(['positions', field.name, test]) ?? [])?.includes('all')
      ) {
        positionValues[field.name] = {
          ...positionValues[field.name],
          [test]: without(value, 'all'),
        }
        form.setFieldsValue({ positions: positionValues })

        return without(value, 'all')
      }

      if (!(form.getFieldValue(['positions', field.name, test]) ?? [])?.includes('all') && value.includes('all')) {
        positionValues[field.name] = {
          ...positionValues[field.name],
          [test]: ['all'],
        }

        form.setFieldsValue({ positions: positionValues })

        return ['all']
      }
    }

    if (
      !value.includes('all') &&
      testOptions.find((option) => option.value === test)?.resultOption.length === value.length + 1
    ) {
      positionValues[field.name] = {
        ...positionValues[field.name],
        [test]: ['all'],
      }
      form.setFieldsValue({ positions: positionValues })

      return ['all']
    }

    positionValues[field.name] = {
      ...positionValues[field.name],
      [test]: value,
    }
    form.setFieldsValue({ positions: positionValues })

    return value
  }

  const handleChangeTestCategory = (checkedValues) => {
    setCategoryTest(checkedValues)
    const positionValues = form.getFieldValue('positions')
    positionValues[field.name] = {
      ...positionValues[field.name],
      category_test: checkedValues,
    }

    form.setFieldsValue({ positions: positionValues })
  }

  return (
    <Col className='campaign-position-test-form'>
      <CampaignUpload
        form={form}
        field={field}
        uploadTest={uploadTest}
        setUploadTest={setUploadTest}
        actionType={actionType}
        campaignStatus={campaignStatus}
        profileRequirementRef={profileRequirementRef}
      />
      <Row>
        <Col span={5}>
          <p className='campaign-position-test-form__title'>
            <span className='campaign-position-test-form__require'>&#8727;</span>
            &nbsp;Type of Tests
          </p>
          {!categoryTest.length && (
            <span className='campaign-position-test-form__warning'>
              Please select at least 1 test among IQ, EQ, DiSC, Brain Ability tests
            </span>
          )}
        </Col>
        <Col span={19}>
          <Checkbox.Group
            name={[field.name, 'category_test']}
            value={categoryTest}
            onChange={handleChangeTestCategory}
            className='campaign-position-test-form__checkbox-group'
          >
            <Space direction='vertical' size='middle'>
              {testOptions.map((option, idx) => (
                <Col key={idx}>
                  <CustomCheckbox
                    name={[field.name, option.value]}
                    value={option.value}
                    checked={categoryTest.includes(option.value)}
                    disabled={checkIsEdittingAndCampaignNotPending({ actionType, campaignStatus })}
                  >
                    {option.label}
                  </CustomCheckbox>
                  <Row gutter={[40]} style={{ marginTop: 16 }}>
                    <Col span={12}>
                      {categoryTest.includes(option.value) && (
                        <Form.Item
                          name={[field.name, option.value]}
                          getValueFromEvent={handleSelectAll(option.mode, option.value)}
                          rules={[{ required: true, message: 'Please select result!' }]}
                        >
                          <Select
                            allowClear
                            mode={option.mode}
                            style={{ width: '100%', height: 40 }}
                            size={option.mode !== 'multiple' && 'large'}
                            placeholder='Select result'
                            disabled={checkIsEdittingAndCampaignNotPending({ actionType, campaignStatus })}
                          >
                            {option?.resultOption?.map((result) => (
                              <Option key={result.value} value={result.value}>
                                {option.value === 'disc_score' ? result?.name ?? 'All' : result.label}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      )}
                    </Col>
                    <Col span={12}>
                      {categoryTest.includes(option.value) && (
                        <Form.Item name={[field.name, `survey_${option.value}`]}>
                          <Select
                            style={{ width: '100%' }}
                            size='large'
                            placeholder='Select survey'
                            options={surveyOptions}
                            defaultValue={'defaultSurvey'}
                            disabled={checkIsEdittingAndCampaignNotPending({ actionType, campaignStatus })}
                          />
                        </Form.Item>
                      )}
                    </Col>
                  </Row>
                </Col>
              ))}
            </Space>
          </Checkbox.Group>
        </Col>
      </Row>
      <Form.List name={[field.name, 'test_list']}>
        {(testlist, { add: addTest, remove: removeTest }) => {
          return (
            <>
              {testlist?.map((test, testIndex) => {
                return (
                  <Row key={testIndex} gutter={[8]}>
                    <Col span={5}>
                      <Row>
                        <Col span={65}>
                          <Form.Item>
                            {!checkIsEdittingAndCampaignNotPending({ actionType, campaignStatus }) && (
                              <Button
                                style={{ marginTop: 6 }}
                                danger
                                type='text'
                                onClick={() => {
                                  const newTestQuestions = [...testQuestions]

                                  newTestQuestions.splice(testIndex, 1)
                                  setTestQuestions(newTestQuestions)

                                  const newSelectedTestIdList = [...selectedTestIdList]

                                  newSelectedTestIdList.splice(testIndex, 1)
                                  setSelectedTestIdList(newSelectedTestIdList)

                                  removeTest(test.name)
                                }}
                                icon={<DeleteOutlined />}
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={19}>
                          <Form.Item
                            name={[test.name, 'test_id']}
                            rules={[{ required: true, message: 'Please select test' }]}
                          >
                            <Select
                              style={{
                                width: '100%',
                              }}
                              placeholder='Select your test'
                              options={options}
                              size='large'
                              filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                              }
                              disabled={checkIsEdittingAndCampaignNotPending({ actionType, campaignStatus })}
                              onChange={(value) => {
                                const found = testList.find((e) => e.Id === value)

                                if (selectedTestIdList.includes(value)) {
                                  toastifyNotify('error', `This position have already had ${found?.testName} Test!`)

                                  const newTestQuestions = [...testQuestions]

                                  newTestQuestions.splice(testIndex, 1, undefined)
                                  setTestQuestions(newTestQuestions)

                                  const newSelectedTestIdList = [...selectedTestIdList]

                                  newSelectedTestIdList.splice(testIndex, 1, undefined)
                                  setSelectedTestIdList(newSelectedTestIdList)

                                  form.setFieldValue(
                                    ['positions', field.name, ['test_list'], [test.name], ['test_id']],
                                    null,
                                  )
                                } else {
                                  const newSelectedTestIdList = [...selectedTestIdList]

                                  if (!newSelectedTestIdList[testIndex]) {
                                    newSelectedTestIdList[testIndex] = value
                                    setSelectedTestIdList(newSelectedTestIdList)
                                  } else {
                                    newSelectedTestIdList.splice(testIndex, 1, value)
                                    setSelectedTestIdList(newSelectedTestIdList)
                                  }

                                  const newTestQuestions = [...testQuestions]

                                  if (!newTestQuestions[testIndex]) {
                                    newTestQuestions[testIndex] = found?.questionList?.length
                                    setTestQuestions(newTestQuestions)
                                  } else {
                                    newTestQuestions.splice(testIndex, 1, found?.questionList?.length)
                                    setTestQuestions(newTestQuestions)
                                  }
                                }
                              }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>

                    <Col span={19}>
                      <Row gutter={[40]}>
                        <Col span={12}>
                          <Form.Item
                            name={[test.name, 'fit_result']}
                            rules={[
                              {
                                required: true,
                                message: 'Please add the number of correct answers that is acceptable for your test',
                              },
                              {
                                pattern: new RegExp('^[0-9]+$'),
                                message: 'Field only accept integer',
                              },
                              ruleNumberByCorrect(
                                testQuestions[testIndex],
                                `Result should be equal or less than ${testQuestions[testIndex]}`,
                              ),
                            ]}
                          >
                            <InputNumber
                              placeholder='Fill in fit result for this test'
                              min={1}
                              addonAfter={`/${testQuestions[testIndex] ?? 0}`}
                              disabled={
                                !testQuestions[testIndex] ||
                                checkIsEdittingAndCampaignNotPending({ actionType, campaignStatus })
                              }
                              style={{ width: '100%' }}
                              size='large'
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item name={[test.name, 'survey_id']}>
                            <Select
                              style={{
                                width: '100%',
                              }}
                              placeholder='Select survey for this test'
                              options={surveyOptions}
                              defaultValue={'defaultSurvey'}
                              disabled={checkIsEdittingAndCampaignNotPending({ actionType, campaignStatus })}
                              size='large'
                              filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                )
              })}
              <Form.Item>
                {!checkIsEdittingAndCampaignNotPending({ actionType, campaignStatus }) && (
                  <Row justify='space-between' style={{ width: '100%' }}>
                    <Col>
                      {fieldLength > 1 && (
                        <Button
                          className='campaign-position-test-form__delete-position-btn'
                          shape='round'
                          size='middle'
                          onClick={handleDelete}
                        >
                          Delete Position
                        </Button>
                      )}
                    </Col>
                    <Col>
                      <Button
                        className='campaign-position-test-form__add-custom-test-btn'
                        type='primary'
                        shape='round'
                        size='middle'
                        onClick={() => addTest()}
                      >
                        Add custom test
                      </Button>
                    </Col>
                  </Row>
                )}
              </Form.Item>
            </>
          )
        }}
      </Form.List>
    </Col>
  )
}

export default CampaignPositionTestForm
