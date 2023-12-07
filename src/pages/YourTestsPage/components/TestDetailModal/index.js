import React from 'react'

import CustomModal from 'components/CustomModal'

import TestInformationDetail from './TestInformationDetail'
import FooterTestDetailModal from './FooterTestDetailModal'
import QuestionAndAnswerList from './TestQuestionAndAnswerList'

function TestDetailModal({ testData, isOpen, handleCloseModal, handleEditTest, handleDeleteTest }) {
  return (
    <CustomModal title={testData.testName} isOpen={isOpen} handleCloseModal={handleCloseModal}>
      <TestInformationDetail testData={testData} />

      <QuestionAndAnswerList testData={testData} />

      <FooterTestDetailModal handleEditTest={handleEditTest} handleDeleteTest={handleDeleteTest} />
    </CustomModal>
  )
}

export default TestDetailModal
