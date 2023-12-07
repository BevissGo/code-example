import React, { useEffect, useState } from 'react'
import { Col, Form, InputNumber, Row, Select } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'

import ConfirmDialog from 'components/ConfirmDialog'
import { checkIsEdittingAndCampaignNotPending } from 'pages/CampaignPage/helpers'
import { getAllPositions } from 'api/business/position.api'
import { toastifyNotify } from 'helpers'

import CampaignPositionTestForm from '../CampaignPositionTestForm'

import './style.scss'

const CampaignPositionForm = ({
  form,
  field,
  index,
  onDelete,
  fieldLength,
  categoryTestList,
  uploadTestList,
  actionType,
  campaignStatus,
  atLeastRef,
  testQuestions,
  positionInfoRef,
  profileRequirementRef,
  addTestSectionRef,
  setTestQuestions,
  selectedPositionList,
  setSelectedPositionList,
}) => {
  const [categoryTest, setCategoryTest] = useState([])
  const [uploadTest, setUploadTest] = useState([])
  const [positionOptions, setPositionOptions] = useState([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [positionId, setPositionId] = useState(null)

  const { data: positionList } = useQuery(['GET_POSITION_LIST'], () => getAllPositions(), {
    onError: (error) => {
      toastifyNotify('error', error?.message ?? 'Failed to get all positions')
    },
    initialData: [],
  })

  useEffect(() => {
    const options = positionList
      ?.filter((position) => !selectedPositionList.includes(position.Id))
      ?.map((position) => {
        return {
          label: position.name,
          value: position.Id,
        }
      })

    setPositionOptions(options)
  }, [positionList, selectedPositionList])

  useEffect(() => {
    if (categoryTestList?.[field.name]?.length) {
      setCategoryTest(categoryTestList?.[field.name])
    } else {
      setCategoryTest([])
    }
  }, [categoryTestList, field.name])

  useEffect(() => {
    if (uploadTestList?.[field.name]?.length) {
      setUploadTest(uploadTestList?.[field.name])
    } else {
      setUploadTest([])
    }
  }, [uploadTestList, field.name])

  useEffect(() => {
    if (positionId) return

    setPositionId(form.getFieldValue(['positions', index, 'position_id']))
  }, [form, index, positionId])

  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  return (
    <Col ref={atLeastRef} className='campaign-position-form'>
      <Row ref={positionInfoRef} gutter={[40, 8]}>
        <Col span={12}>
          <Form.Item
            label={<span className='campaign-position-form__form-label'>Position Title</span>}
            name={[field.name, 'position_id']}
            rules={[{ required: true, message: 'Please select position!' }]}
          >
            <Select
              size='large'
              placeholder='Select position'
              options={positionOptions}
              disabled={checkIsEdittingAndCampaignNotPending({ actionType, campaignStatus })}
              onChange={(value) => {
                setPositionId(value)
                let tempArray = [...selectedPositionList]
                tempArray.splice(index, 1, value)
                setSelectedPositionList(tempArray)
              }}
            />
          </Form.Item>
        </Col>
        <Col span={9}>
          <Form.Item
            label={<span className='campaign-position-form__form-label--short'>Quantity</span>}
            name={[field.name, 'amount']}
            rules={[{ required: true, message: 'Please fill in amount!' }]}
          >
            <InputNumber
              className='campaign-position-form__input-number'
              placeholder='Fill in amount'
              min={1}
              upHandler={<UpOutlined style={{ fontSize: 12 }} />}
              downHandler={<DownOutlined style={{ fontSize: 12 }} />}
              disabled={checkIsEdittingAndCampaignNotPending({ actionType, campaignStatus })}
            />
          </Form.Item>
        </Col>
      </Row>

      <CampaignPositionTestForm
        form={form}
        field={field}
        index={index}
        noPosition={index + 1}
        categoryTest={categoryTest}
        setCategoryTest={setCategoryTest}
        uploadTest={uploadTest}
        setUploadTest={setUploadTest}
        actionType={actionType}
        fieldLength={fieldLength}
        handleDelete={handleDelete}
        campaignStatus={campaignStatus}
        testQuestions={testQuestions}
        setTestQuestions={setTestQuestions}
        profileRequirementRef={profileRequirementRef}
        addTestSectionRef={addTestSectionRef}
      />

      <ConfirmDialog
        validateString='YES'
        description={'Are you sure you want to delete this position?'}
        visible={showDeleteDialog}
        onClose={(e) => {
          setShowDeleteDialog(false)

          if (e === 'confirm') {
            onDelete(index)
          }
        }}
      />
    </Col>
  )
}

export default CampaignPositionForm
