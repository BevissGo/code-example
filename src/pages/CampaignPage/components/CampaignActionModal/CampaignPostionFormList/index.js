import React from 'react'
import { Card, Col, Form } from 'antd'

import CampaignPositionForm from '../CampaignPositionForm'

import './style.scss'

const CampaignPositionFormList = ({
  form,
  categoryTestList,
  uploadTestList,
  actionType,
  campaignStatus,
  atLeastRef,
  selectedPositionList,
  setSelectedPositionList,
  testQuestions,
  setTestQuestions,
  positionInfoRef,
  profileRequirementRef,
  addTestSectionRef,
}) => {
  return (
    <div className='campaign-position-form-list'>
      <Form.List name='positions' initialValue={[{ amount: '', category_test: [] }]}>
        {(fields, { remove: removePosition }) => {
          return (
            <>
              {fields.map((field, index) => (
                <Card key={field.key} bordered={false}>
                  <Col>
                    <CampaignPositionForm
                      form={form}
                      field={field}
                      index={index}
                      categoryTestList={categoryTestList}
                      uploadTestList={uploadTestList}
                      fieldLength={fields.length}
                      actionType={actionType}
                      campaignStatus={campaignStatus}
                      atLeastRef={atLeastRef}
                      testQuestions={testQuestions}
                      setTestQuestions={setTestQuestions}
                      selectedPositionList={selectedPositionList}
                      setSelectedPositionList={setSelectedPositionList}
                      positionInfoRef={positionInfoRef}
                      profileRequirementRef={profileRequirementRef}
                      addTestSectionRef={addTestSectionRef}
                      onDelete={(index) => {
                        let tempArray = [...selectedPositionList]
                        tempArray.splice(index, 1)
                        setSelectedPositionList(tempArray)
                        removePosition(field.name)
                      }}
                    />
                  </Col>
                </Card>
              ))}
            </>
          )
        }}
      </Form.List>
    </div>
  )
}

export default CampaignPositionFormList
