import React from 'react'
import { Spin } from 'antd'
import { useSelector, shallowEqual } from 'react-redux'

import i18nVN from 'i18n/locales/vn'
import Chart from 'pages/DashBoard/components/Chart'
import Filter from 'pages/DashBoard/components/Candidates/Filter'
import CandidateComponent from 'pages/DashBoard/components/Candidates'

import './style.scss'

const { LineChart, HorizontalChart}  = Chart

const CandidateContainer = () => {
  const {
    pages: { business: { dashboard: { candidate: contentPage }}}
  } = i18nVN.src

  const { candidatesObj, numberOfCandidate, filtersCandidate, isFetching, profilePatterns } = useSelector((state) => ({
    candidatesObj: state.dashboardReducer.candidates,
    numberOfCandidate: state.dashboardReducer.numberOfCandidate,
    filtersCandidate: state.dashboardReducer.filtersCandidate,
    isFetching: state.dashboardReducer.isFetching,
    profilePatterns: state.dashboardReducer.profilePatterns,
  }), shallowEqual)

  const dataCandidates = candidatesObj?.candidates || []
  const pagesize = candidatesObj?.countRow || 1
  const chartInWeek = numberOfCandidate?.numberCandidateWeek || []
  const chartCandidateInPosition = numberOfCandidate?.numberCandidatePositon || []
  return (
    <div className='wrapper-candidate'>
      <div className='wrapper-candidate__title-header-candidate'>{contentPage.title}</div>
      <div className='wrapper-candidate__divider'/>
      <div className='wrapper-candidate__flex-row-center'>
        <div className='container_position' style={{ flex: 1, marginRight:30}}>
          <Filter data={profilePatterns} contentPage={contentPage.filter} />
          {isFetching ? (
            <div className='candidate-loading'>
              <Spin />
            </div>
          ): (
          <CandidateComponent data={dataCandidates} pagesize={pagesize} filters={filtersCandidate} contentPage={contentPage.listCandidate} />
          )}
        </div>
        <div>
          <LineChart dataChart={chartInWeek} contentPage={contentPage.lineChart}/>
          <HorizontalChart dataChart={chartCandidateInPosition} contentPage={contentPage.horizontalChart}/>
        </div>
      </div>
    </div>
  )
}

export default CandidateContainer
