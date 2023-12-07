import React from 'react'
import _ from 'lodash'
import { Progress, Table } from 'antd'

import LineChart from 'components/LineChart'
import { LeftArrow } from '../Positions/res/icons'

import './style.scss'

const ProgressChart = ({
  percent = 87.5,
  onBack = () => {},
  dataObject = [],
  categoryTest = '',
  isLoading = false,
  contentPage = {}
}) => {
  const [itemSelected, setItemSelected] = React.useState(null)
  const typeCategoryRef = React.useRef(categoryTest)
  React.useState(() => {
    if(typeCategoryRef.current !== categoryTest){
      setItemSelected(null)
    }
  }, [categoryTest, typeCategoryRef.current])

  const dataCandidates = dataObject?.candidates
  const columns = [
    {
      title: contentPage.candidateName,
      dataIndex: 'name',
      width: 100,
    },
    {
      title: contentPage.answerExtraQuestion,
      dataIndex: 'answer_extra_question',
      width: 100,
    },
    {
      title: contentPage.result,
      dataIndex: 'result',
      width: 100,
    },
  ]

  const dataSource = dataCandidates?.map(item => ({
    name: item?.candidate?.name,
    result: categoryTest.includes('disc') ? item?.report?.profile_pattern : item?.iq_score,
    ...item
  }))

  return (
    <div className='line-chart-dashboard line-chart-dashboard__progress-bar'>
      <div style={{cursor: 'pointer'}} onClick={() => {
        itemSelected ? setItemSelected(null) : onBack()
      }}>
        <LeftArrow />
      </div>
      {itemSelected ? (
        <CustomerInfo item={itemSelected} categoryTest={categoryTest} contentPage={contentPage}/>
      ) : (
        <>
          <Progress
            style={{ textAlign:'center', width: '100%', marginBottom: 20 }}
            strokeWidth={8}
            strokeColor={'#E5C47C'}
            type='circle'
            format={() => percent + '%'}
            percent={percent}
          />
          <p className='line-chart-dashboard__title'>
            {`${percent}% ${contentPage.description}`}
          </p>
          <Table
            onRow={(record) => ({
              onClick : () => { setItemSelected(record) },
            })}
            loading={isLoading}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
          />
        </>
      )}

    </div>
  )
}


const CustomerInfo = ({ item, categoryTest, contentPage }) => {
  const [avatarObj, setAvtObj] = React.useState({})
  const candidate = item?.candidate
  const listChart = item?.report?.result?.difference
  return (
    <div >
      <div style={titleHeaderStyle}>
        {contentPage.candidateInformation}
      </div>
      <div style={{...containerCandidate, marginTop: '30px', marginBottom: '56px' }}>
        <img onError={() => {
          setAvtObj({
            ...avatarObj,
            [item?._id]: '/images/avt1.png'
          })
        }} src={avatarObj[item?._id] || candidate?.avatar} style={avatarStyle}/>
        <div>
          <div style={titleItemStyle}>{contentPage.candidateName}</div>
          <div style={{...contentItemStyle, fontSize: 18, }}>{candidate?.name}</div>
        </div>
      </div>
      {!_.isEmpty(listChart) &&  <LineChart dataChart={Object.values(listChart)} />}
      <div style={contentStyle}>
        <div style={titleItemStyle}>{contentPage.position}</div>
        <div style={contentItemStyle} >{item?.position}</div>
      </div>
      <div style={contentStyle}>
        <div style={titleItemStyle} className='txt-content-12'>{contentPage.email}</div>
        <div style={contentItemStyle}>{candidate?.email}</div>
      </div>
      <div style={contentStyle}>
        <div style={titleItemStyle}>{contentPage.facebookProfile}</div>
        <a
          style={{...contentItemStyle, textDecorationLine: 'underline'}}
          href={candidate?.facebook_profile_url}
          target='_blank'
          rel='noreferrer'
          >
          {candidate?.facebook_profile_url}
        </a>
      </div>
      <div style={contentStyle}>
        <div style={titleItemStyle}>
          {categoryTest.includes('disc') ? contentPage.discTestResult : contentPage.iqTestResult }
        </div>
        <div style={contentItemStyle} >
          {categoryTest.includes('disc') ? candidate?.profile_patterns : item?.iq_score}
        </div>
      </div>
    </div>
  )
}

const containerCandidate = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
}

const titleHeaderStyle = {
  fontFamily: 'ProximaNova-bold',
  fontStyle: 'normal',
  fontWeight: 'bold',
  fontSize: '24px',
  lineHeight: '29px',
  color: '#454545',
  marginTop: '56px',
}

const titleItemStyle = {
  fontFamily: 'ProximaNova-Regular',
  fontStyle: 'normal',
  fontWeight: 'normal',
  color: '#4F2108',
  fontSize: '12px',
  lineHeight: '12px',
  letterSpacing: '1px',
  marginTop: '10px',
}


const contentItemStyle = {
  fontFamily: 'ProximaNova-bold',
  fontStyle: 'normal',
  fontSize: '15px',
  lineHeight: '18px',
  color: '#454545',
  letterSpacing: '1px',
  marginTop: '7px'
}

const avatarStyle = {
  width: '100px',
  height: '100px',
  marginRight: '25px',
  borderRadius: '50px'
}

const contentStyle = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
}


export default ProgressChart
