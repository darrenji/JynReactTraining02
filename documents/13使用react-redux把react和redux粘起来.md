组件和createStore之间需要一个glue胶水，那就是react-redux.
> npm install --save react-redux

<br>
> app/index.js

<br>

	import ReactDOM from 'react-dom'
	import React from 'react'
	import routes from './config/routes'
	import { createStore } from 'redux'
	import users from 'redux/modules/users'
	import { Provider } from 'react-redux'
	
	const store = createStore(users)
	
	ReactDOM.render(
	    <Provider store={store}>
	        {routes}
	    </Provider>,
	    document.getElementById('app')
	)

