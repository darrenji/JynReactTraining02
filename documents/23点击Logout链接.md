当点击Logout链接，来到Logout对应的页面，需要更改状态，不再登录。

<br>

首先表现组件
> app/components/Logout/Logout.js

<br>

	import React, { PropTypes } from 'react'
	
	export default function Logout(props){
	    return(
	        <div>Logout</div>
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
	export Logout from './Logout/Logout'

<br>


容器组件需要拿Redux的dispatch触发某个Action
> app/containers/Logout/LogoutContainer.js

<br>

	import React, { PropTypes } from 'react'
	import { Logout } from 'components'
	import { logoutAndUnauth } from 'redux/modules/users'
	import { connect } from 'react-redux'
	    
	const LogoutContainer = React.createClass({
	    propTypes: {
	      dispatch: PropTypes.func.isRequired  
	    },
	    componentDidMount(){
	        this.props.dispatch(logoutAndUnauth())
	    },
	    render(){
	        return (
	            <Logout />
	        )
	    }
	})
	        
	export default connect()(LogoutContainer)

<br>

容器组件也被index.js管理
> app/containers/index.js

<br>

	export MainContainer from './Main/MainContainer'
	export HomeContainer from './Home/HomeContainer'
	export AuthenticateContainer from './Authenticate/AuthenticateContainer'
	export FeedContainer from './Feed/FeedContainer'
	export LogoutContainer from './Logout/LogoutContainer'

<br>

> app/redux/modules/users.js,其中的logoutAndUnauth方法被LogoutContainer.js用到了

<br>
	
	import { auth, logout } from 'helpers/auth'
	
	const AUTH_USER = 'AUTH_USER'
	const UNAUTH_USER = 'UNAUTH_USER'
	const FETCHING_USER = 'FETCHING_USER'
	const FETCHING_USER_FAILURE = 'FETCHING_USER_FAILURE'
	const FETCHING_USER_SUCCESS = 'FETCHING_USER_SUCCESS'
	
	function authUser (uid) {
	  return {
	    type: AUTH_USER,
	    uid,
	  }
	}
	
	function unauthUser () {
	  return {
	    type: UNAUTH_USER,
	  }
	}
	
	function fetchingUser () {
	  return {
	    type: FETCHING_USER,
	  }
	}
	
	function fetchingUserFailure (error) {
	  console.warn(error)
	  return {
	    type: FETCHING_USER_FAILURE,
	    error: 'Error fetching user.',
	  }
	}
	
	function fetchingUserSuccess (uid, user, timestamp) {
	  return {
	    type: FETCHING_USER_SUCCESS,
	    uid,
	    user,
	    timestamp,
	  }
	}
	
	export function fetchAndHandleAuthedUser(){
	  return function (dispatch) {
	    dispatch(fetchingUser())
	    return auth().then((user) => {
	        dispatch(fetchingUserSuccess(user.uid, user, Date.now()))
	        dispatch(authUser(user.uid))
	    })
	    .catch((error) => dispatch(fetchingUserFailure(error)))
	  }
	}
	    
	export function logoutAndUnauth(){
	    return function(dispatch){
	        logout()
	        dispatch(unauthUser())
	    }
	}
	
	const initialUserState = {
	  lastUpdated: 0,
	  info: {
	    name: '',
	    uid: '',
	    avatar: '',
	  },
	}
	
	function user (state = initialUserState, action) {
	  switch (action.type) {
	    case FETCHING_USER_SUCCESS :
	      return {
	        ...state,
	        info: action.user,
	        lastUpdated: action.timestamp,
	      }
	    default :
	      return state
	  }
	}
	
	const initialState = {
	  isFetching: false,
	  error: '',
	  isAuthed: false,
	  authedId: '',
	}
	
	export default function users (state = initialState, action) {
	  switch (action.type) {
	    case AUTH_USER :
	      return {
	        ...state,
	        isAuthed: true,
	        authedId: action.uid,
	      }
	    case UNAUTH_USER :
	      return {
	        ...state,
	        isAuthed: false,
	        authedId: '',
	      }
	    case FETCHING_USER:
	      return {
	        ...state,
	        isFetching: true,
	      }
	    case FETCHING_USER_FAILURE:
	      return {
	        ...state,
	        isFetching: false,
	        error: action.error,
	      }
	    case FETCHING_USER_SUCCESS:
	      return action.user === null
	        ? {
	          ...state,
	          isFetching: false,
	          error: '',
	        }
	        : {
	          ...state,
	          isFetching: false,
	          error: '',
	          [action.uid]: user(state[action.uid], action),
	        }
	    default :
	      return state
	  }
	}

<br>

其中的logout方法在auth.js中定义
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
	    
	export function logout(){
	    console.log('logged out')
	}

<br>

> app/config/routes.js

<br>
	
	import React from 'react'
	import { Router, Route, hashHistory, IndexRoute } from 'react-router'
	import { MainContainer, HomeContainer, AuthenticateContainer, FeedContainer, LogoutContainer } from '../containers'
	    
	export default function getRoutes(checkAuth){
	    return (
	        <Router history={hashHistory}>
	            <Route path='/' component={MainContainer}>
	                <Route path='auth' component={AuthenticateContainer} onEnter={checkAuth} />
	                <Route path='feed' component={FeedContainer} />
	                <Route path='logout' component={LogoutContainer} />
	                <IndexRoute component={HomeContainer} onEnter={checkAuth} />
	            </Route>
	        </Router>
	    )
	}








