创建Feed内容页。

<br>

首先来到表现组件。
> app/components/Feed/Feed.js

<br>

	import React, { PropTypes } from 'react'
	
	export default function Feed(props){
	    return (
	        <div>Feed</div>
	    )
	}

<br>

表现组件被index.js管理
> app/components/index.js

<br>

	export Home from './Home/Home'
	export Navigation from './Navigation/Navigation'
	export Authenticate from './Authenticate/Authenticate'
	export FacebookAuthButton from './FacebookAuthButton/FacebookAuthButton'
	export Feed from './Feed/Feed'

<br>

容器组件
> app/components/containers/Feed/FeedContainer.js

<br>

	import React from 'react'
	import { Feed } from 'components'
	    
	const FeedContainer = React.createClass({
	    render(){
	        return (
	            <Feed />
	        )
	    }
	})
	        
	export default FeedContainer

<br>
容器组件也被index.js管理
> app/containers/index.js

<br>

	export MainContainer from './Main/MainContainer'
	export HomeContainer from './Home/HomeContainer'
	export AuthenticateContainer from './Authenticate/AuthenticateContainer'
	export FeedContainer from './Feed/FeedContainer'

<br>

来到路由
> app/config/routes.js

<br>
	
	import React from 'react'
	import { Router, Route, hashHistory, IndexRoute } from 'react-router'
	import { MainContainer, HomeContainer, AuthenticateContainer, FeedContainer } from '../containers'
	
	const routes = (
	    <Router history={hashHistory}>
	        <Route path='/' component={MainContainer}>
	            <Route path='auth' component={AuthenticateContainer} />
	            <Route path='feed' component={FeedContainer} />
	            <IndexRoute component={HomeContainer} />
	        </Route>
	    </Router>
	)
	
	export default routes

<br>

> http://localhost:8080/#/feed?_k=aetdi9

<br>


