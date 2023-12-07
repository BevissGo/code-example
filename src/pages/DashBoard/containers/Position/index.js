import React from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import i18nVN from 'i18n/locales/vn'

import Positions from 'pages/DashBoard/components/Positions'
import Chart from 'pages/DashBoard/components/Chart'

import './style.scss'
import { fetchChartCandidate, fetchDashBoardCandidate, fetchDashBoardPositions } from 'redux/services/dashboard'
const { PieChart, ProgressChart}  = Chart

const PositionContainer = () => {
  const {
    pages: { business: { dashboard: { positionRecruitment: contentPage }}}
  } = i18nVN.src

  const dispatch = useDispatch()
  const [step, setStep] = React.useState(1)
  const [categoryTest, setTypeCategoryTest] = React.useState('disc_test')
  const [itemSelected, setItemSelected] = React.useState({})

  React.useEffect(()=> {
    dispatch(fetchDashBoardPositions({itemPerPage: 10, currentPage: 1, categoryTest: 'disc_test'}))
    dispatch(fetchChartCandidate())
  },[])

  React.useEffect(() => {
    setStep(1)
  },[categoryTest])

  const onClickItem = (item) => {
    setStep(2)
    dispatch(fetchDashBoardCandidate({ position: item?.name}))
    setItemSelected(item)
  }

  const { positionRecruiment, numberCandidatePositon, candidatesObj, isFetching } = useSelector((state) => ({
    positionRecruiment: state.dashboardReducer.positionRecruiment,
    numberCandidatePositon: state.dashboardReducer.numberOfCandidate.numberCandidatePositon,
    candidatesObj: state.dashboardReducer.candidates,
    isFetching: state.dashboardReducer.isFetching,
  }), shallowEqual)

  const data = positionRecruiment?.listPosition || []
  const totalItem = positionRecruiment?.countRow
  const mappingItemWithChart = (numberCandidatePositon || []).find(item => item?._id === itemSelected?._id) || {}
  return (
    <div className='wrapper-position'>
      <div className='wrapper-position__title-header-position'>{contentPage.title}</div>
      <div className='wrapper-position__divider'/>
      <div className='wrapper-position__flex-row-center'>
        <div className='container_position' style={{ flex: 1, marginRight:30}}>
          <Positions
            isFetching={isFetching}
            getTypeCategory={setTypeCategoryTest}
            onClickItem={onClickItem}
            data={data}
            totalItem={totalItem}
            contentPage={contentPage.listPosition}
          />
        </div>
          {step === 1 ? (
            <div>
              <PieChart data={numberCandidatePositon} contentPage={contentPage.pieChart}/>
            </div>
            ): (
              <div style={{
                display: 'flex',
                flexDirection: 'column'
              }}>
              <ProgressChart
                isLoading={isFetching}
                categoryTest={categoryTest}
                dataObject={candidatesObj}
                mappingItemWithChart={mappingItemWithChart}
                percent={mappingItemWithChart?.percentCandidateCompletedSurvey || 0}
                onBack={()=> setStep(1)}
                contentPage={contentPage.progressChart}
              />
              </div>
            )}
      </div>
    </div>
  )
}
export default PositionContainer
