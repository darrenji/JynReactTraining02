现在任何人都可以看到feed内容页，我们想让登录后再Feed内容页。

<br>

Route组件的onEnter属性用来接收一个回调函数，通过这个回调函数可以判断是否登录。

<br>

生成路由之前接收一个回调函数，用来判断是否验证通过
> app/config/routes.js

<br>

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

<br>

> app/index.js

<br>


	import ReactDOM from 'react-dom'
	import React from 'react'
	import getRoutes from './config/routes'
	import { createStore, applyMiddleware } from 'redux'
	import users from 'redux/modules/users'
	import { Provider } from 'react-redux'
	import thunk from 'redux-thunk'    
	import { checkIfAuthed } from 'helpers/auth'
	
	const store = createStore(users, applyMiddleware(thunk))
	
	function checkAuth (nextState, replace) {
	  const isAuthed = checkIfAuthed(store)
	  const nextPathName = nextState.location.pathname
	  if (nextPathName === '/' || nextPathName === '/auth') {
	    if (isAuthed === true) {
	      replace('/feed')
	    }
	  } else {
	    if (isAuthed !== true) {
	      replace('/auth')
	    }
	  }
	}
	
	
	ReactDOM.render(
	    <Provider store={store}>
	        {getRoutes(checkAuth)}
	    </Provider>,
	    document.getElementById('app')
	)

<br>


> app/helpers/auth.js

<br>

	export default function auth () {
	  return new Promise((resolve, reject) => {
	    setTimeout(() => resolve({
	      name: 'Tyler McGinnis',
	      avatar: 'https://pbs.twimg.com/profile_images/378800000605536525/891a881bde93a1fc3e289528fb859b96_400x400.jpeg',
	      uid: 'the-uid'
	    }), 2000)
	  })
	}
	    
	export function checkIfAuthed(store){
	    return store.getState().isAuthed
	}

<br>

> localhost:8080

<br>