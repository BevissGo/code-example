import React from 'react'
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min'

import CandidateList from './CandidateList'
import CandidateEdit from './CandidateEdit'
import CandidateDetail from './CandidateDetail'

function CandidatesPage() {
  return (
    <Switch>
      <Route path='/business/candidates' exact component={CandidateList} />
      <Route path='/business/candidates/:userId' exact component={CandidateDetail} />
      <Route path='/business/candidates/:userId/edit' exact component={CandidateEdit} />
    </Switch>
  )
}

export default CandidatesPage
