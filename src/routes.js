import React from 'react'
import {
    BrowserRouter,
    Switch,
    Route,
} from 'react-router-dom'

function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/' />
                <Route exact path='/blog/:title' />
                <Route exact path='/blog' />
                <Route exact path='/which-disc' />
                <Route exact path='/policy-terms' />
                <Route exact path='/what-disc' />
            </Switch>
        </BrowserRouter>
    )
}

export default Routes