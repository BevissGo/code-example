import React from 'react'
import { Col, Row } from 'antd'
import { capitalize } from 'lodash'

import CustomModal from 'components/CustomModal'

import FooterSurveyDetailModal from './FooterSurveyDetailModal'

import './style.scss'

function SurveyDetailModal({ data, isOpen, handleCloseModal, handleEditSurvey, handleDeleteSurvey }) {
  const { surveyName, questions } = data

  return (
    <div className='survey-detail-modal'>
      <CustomModal title={surveyName} isOpen={isOpen} handleCloseModal={handleCloseModal}>
        <div className='survey-detail-modal__body'>
          {questions?.map((question, index) => {
            return (
              <div key={index} className='survey-detail-modal__question-group'>
                <p className='survey-detail-modal__question-index'>Question {index + 1}</p>
                <p className='survey-detail-modal__question'>{question.question}</p>
                <Row>
                  <Col span={8}>
                    <Row gutter={[30]}>
                      <Col>
                        <p className='survey-detail-modal__type-title'>Type</p>
                      </Col>
                      <Col>
                        <p className='survey-detail-modal__type-content'>
                          {question.requiredAnswer ? 'Required' : 'Optional'}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={8}>
                    <Row gutter={[30]}>
                      <Col>
                        <p className='survey-detail-modal__format-title'>Format</p>
                      </Col>
                      <Col>
                        <p className='survey-detail-modal__format-content'>{capitalize(question.typeAnswer)}</p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            )
          })}
        </div>

        <FooterSurveyDetailModal handleEditSurvey={handleEditSurvey} handleDeleteSurvey={handleDeleteSurvey} />
      </CustomModal>
    </div>
  )
}

export default SurveyDetailModal
