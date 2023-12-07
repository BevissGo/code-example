import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Row, Tooltip } from 'antd'

import './style.scss'

const CampaignDetailLink = ({ copied, setCopied, testName, linkTest }) => {
  const handleCopy = (text) => setCopied(text)

  return (
    <Row justify='end'>
      <CopyToClipboard text={linkTest} onCopy={() => handleCopy(linkTest)}>
        <Tooltip placement='top' title={copied === linkTest ? 'Copied' : 'Copy Link'} color='#538dff'>
          <span className='campaign-detail-link'>{`${testName} Test`}</span>
        </Tooltip>
      </CopyToClipboard>
    </Row>
  )
}

export default CampaignDetailLink
