当点击"Login with facebook"后，验证通过跳转到Feed内容页。

<br>

> app/redux/modules/users.js

<br>

	import auth from 'helpers/auth'
	
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

要用到组件中的路由属性router
> app/containers/Authenticate/AuthenticateContianer.js

<br>

	import React, { PropTypes } from 'react'
	import { Authenticate } from 'components'
	
	import { connect } from 'react-redux'
	import { bindActionCreators } from 'redux'
	import * as userActionCreators from 'redux/modules/users'
	
	
	const AuthenticateContainer = React.createClass({
	  propTypes: {
	    isFetching: PropTypes.bool.isRequired,
	    error: PropTypes.string.isRequired,
	    fetchAndHandleAuthedUser: PropTypes.func.isRequired
	  },
	  contextTypes:{
	      router: PropTypes.object.isRequired
	  },
	  handleAuth (e) {
	    e.preventDefault()
	    this.props.fetchAndHandleAuthedUser()
	        .then(() => this.context.router.replace('feed'))
	  },
	  render () {
	    console.log(this.props.isFetching)
	    return (
	      <Authenticate
	        onAuth={this.handleAuth}
	        isFetching={this.props.isFetching}
	        error={this.props.error} />
	    )
	  },
	})
	
	function mapStateToProps(state){
	    console.log('State', state)
	    return {
	        isFetching: state.isFetching,
	        error: state.error
	    }
	}
	
	function mapDispatchToProps(dispatch){
	    return bindActionCreators(userActionCreators, dispatch)
	}
	
	export default connect(mapStateToProps, mapDispatchToProps)(AuthenticateContainer)

<br>

