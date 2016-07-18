import React from 'react'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import { MainContainer, HomeContainer, AuthenticateContainer, FeedContainer } from '../containers'
    
export default function getRoutes(checkAuth){
    return (
        <Router history={hashHistory}>
            <Route path='/' component={MainContainer}>
                <Route path='auth' component={AuthenticateContainer} onEnter={checkAuth} />
                <Route path='feed' component={FeedContainer} />
                <IndexRoute component={HomeContainer} onEnter={checkAuth} />
            </Route>
        </Router>
    )
}


