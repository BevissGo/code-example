import React  from 'react'
import { Modal, Input, Select } from 'antd'
import { useSelector, shallowEqual } from 'react-redux'

const { Option } = Select

const SELECT_TEST = [
  {
    key: 'disc_test',
    label: 'DISC Test',
  },
  {
    key: 'iq_test',
    label: 'IQ Test',
  },
  {
    key: 'both',
    label: 'Both',
  },
]

const SELECT_IQ =[73, 92, 108, 125, 'other']


const ModalCustom = ({itemSelected = null,  isCreate = true, visible = false, onOk = () => {}, onCancel = () => {}, contentPage = {}}) => {
  const [params, setParams] = React.useState({
    name: '',
    category_test: null,
    profile_patterns: [],
    extra_question: '',
    fit_iq_score: null
  })

  const { profilePatterns } = useSelector((state) => ({
    profilePatterns: state.dashboardReducer.profilePatterns,
  }), shallowEqual)

  React.useEffect(() => {
    require('./modal.style.scss')
  },[])

  React.useState(() => {
    if(itemSelected){
      setParams(itemSelected)
    }
  },[itemSelected])

  const onSelect = (value) => {
    setParams({
      ...params,
      ...value
    })
  }

  const renderContentDisc = () => (
    <>
      <div className='modal-title' style={{marginBottom: 10}}>{contentPage.fitResultForDiscTest}</div>
      <Select
        value={params.profile_patterns}
        mode='multiple'
        placeholder={contentPage.chooseTheResult}
        style={{ width: '100%', height:39, marginRight: 15, marginBottom: 15, }}
        onChange={(value) => onSelect({profile_patterns: value})}>
        {profilePatterns.map(item => (
          <Option key={item._id} value={item.name}>{item.name}</Option>
          ))}
      </Select>
    </>
  )

  const renderContentIQ = () => (
    <>
      <div className='modal-title' style={{marginBottom: 10}}>{contentPage.fitResultForIqTest}</div>
      <Select
        value={params?.fit_iq_score}
        placeholder={contentPage.chooseTheResult}
        style={{ width: '100%', height:39, marginRight: 15, marginBottom: 15, }}
        onChange={(value) => onSelect({ fit_iq_score: value})}>
        {SELECT_IQ.map(item => (
          <Option key={item} value={item}>{item === 'other' ? item : `>${item}`}</Option>
          ))}
      </Select>
    </>
  )

  const renderContentBoth = () => (
    <>
      {renderContentDisc()}
      {renderContentIQ()}
    </>
  )

  const renderContent = () => {
    switch (params.category_test) {
      case 'disc_test':
        return renderContentDisc()
      case 'iq_test':
        return renderContentIQ()
      case 'both':
        return renderContentBoth()
      default:
        break
    }
  }

  return (
    <Modal
      title={`${isCreate ? contentPage.add : contentPage.edit } ${contentPage.title}`}
      centered
      visible={visible}
      width={723}
      onOk={() => onOk(params)}
      okButtonProps={{ style: { height: 49, width: 145 } }}
      cancelButtonProps={{ style: { height: 49, width: 145 } }}
      onCancel={onCancel}
    >
      <div className='modal-title' style={{marginBottom: 10,}}>{contentPage.title}</div>
      <Input
        value={params.name}
        style={{borderRadius: '8px', marginBottom: 15, height: 36}}
        placeholder={contentPage.fillPosition}
        onChange={event => {
          setParams({
            ...params,
            name: event.target.value
          })
        }}
      />
      <div className='modal-title'  style={{marginBottom: 10}}>{contentPage.chooseTheTest}</div>
      <Select
        value={params.category_test}
        placeholder={contentPage.chooseTheTestForPosition}
        style={{ width: '100%', height:39, marginRight: 15, marginBottom: 15, }}
        onChange={(value) => onSelect({category_test: value})}>
        {SELECT_TEST.map(item => (
          <Option key={item.key} value={item.key}>{item.label}</Option>
        ))}
      </Select>
      {renderContent()}
      {!!params.category_test && (
        <>
          <div className='modal-title' style={{marginBottom: 10,}}>{contentPage.addMoreQuestion}</div>
          <Input
            value={params.extra_question}
            onChange={event => {
              setParams({
                ...params,
                extra_question: event.target.value
              })
            }}
            style={{borderRadius: '8px', marginBottom: 15, height: 36}}
            placeholder={contentPage.fillQuestion}
          />
        </>
      )}
    </Modal>
  )
}

export default ModalCustom
