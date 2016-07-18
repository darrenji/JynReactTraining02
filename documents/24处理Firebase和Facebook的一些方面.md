> https://firebase.google.com/

<br>

> 使用gmail邮箱密码登录

<br>

> 点击"go to console"

<br>

> 点击"新建项目"

darren-test-project

<br>

> 点击"创建项目"

<br>

> 点击左边的"Auth"

<br>

> 点击"登录方法"

<br>

> 点击"Facebook"

<br>

> 点击"启用"

<br>

> 点击下方的链接：https://darren-test-project-40961.firebaseapp.com/__/auth/handler

<br>

> https://developers.facebook.com/

<br>

> 登录

<br>

> 点击"注册"

<br>

> 在弹出窗口中，接受成为开发者，点击"注册",点击"完成"

<br>

> 点击"Add a New App"

<br>

> 点击"网站"

darren-test-app

<br>

> 点击"Create New Facebook App ID"

输入邮箱，选择类别和子类别

<br>

> 点击"创建应用编号"

<br>

> 通过安全认证

<br>

> 点击右上角的"Skip Quck Start"

<br>

> 点击左边的"添加产品"

<br>

> 点击"Facebook登录"栏的"Get Started"

<br>

> 把https://darren-test-project-40961.firebaseapp.com/__/auth/handler拷贝到"有效OAuth跳转网址"这个文本框中

<br>

> 点击右下角的"保存更改"

<br>

> 点击左上角的"控制面板"

<br>

<br>

> 拷贝应用编号，粘贴到Firebase下的"应用ID"文本框

<br>

> 拷贝应用密匙，粘贴到Firebase下的"应用密匙"文本框

<br>

> 点击"保存"

<br>

> 在firebase中，点击左上角的"darren-test-project"

<br>

> 点击"将Firebase添加到您的网页应用"

<br>

> 拷贝下script之间的代码

<br>


	<script src="https://www.gstatic.com/firebasejs/3.2.0/firebase.js"></script>
	<script>
	  // Initialize Firebase
	  var config = {
	    apiKey: "AIzaSyAkAqd73_GC41fPiXsv2sHcsFc1ldLbDU0",
	    authDomain: "darren-test-project-40961.firebaseapp.com",
	    databaseURL: "https://darren-test-project-40961.firebaseio.com",
	    storageBucket: "darren-test-project-40961.appspot.com",
	  };
	  firebase.initializeApp(config);
	</script>
    
<br>
> npm install --save firebase

<br>

> app/config/constants.js

<br>

	import firebase from 'firebase'
	
	var config = {
	    apiKey: "AIzaSyAkAqd73_GC41fPiXsv2sHcsFc1ldLbDU0",
	    authDomain: "darren-test-project-40961.firebaseapp.com",
	    databaseURL: "https://darren-test-project-40961.firebaseio.com",
	    storageBucket: "darren-test-project-40961.appspot.com",
	  };
	firebase.initializeApp(config);
	
	export const ref = firebase.database().ref()
	export const firebaseAuth = firebase.auth

<br>
接着是与firebase交互的部分。
> app/helpers/auth.js

<br>

	import { ref, firebaseAuth } from 'config/constants'
	
	export default function auth () {
	  return firebaseAuth().signInWithPopup(new firebase.auth.FacebookAuthProvider())
	}
	
	export function checkIfAuthed (store) {
	  return store.getState().isAuthed === true
	}
	
	export function logout () {
	  return firebaseAuth().signOut()
	}
	
	export function saveUser (user) {
	  return ref.child(`users/${user.uid}`)
	    .set(user)
	    .then(() => user)
	}


<br>

> app/redux/modules/users.js,依然是所有的Action Creator

	import auth, { logout, saveUser } from 'helpers/auth'
	import { formatUserInfo } from 'helpers/utils'
	
	const AUTH_USER = 'AUTH_USER'
	const UNAUTH_USER = 'UNAUTH_USER'
	const FETCHING_USER = 'FETCHING_USER'
	const FETCHING_USER_FAILURE = 'FETCHING_USER_FAILURE'
	const FETCHING_USER_SUCCESS = 'FETCHING_USER_SUCCESS'
	const REMOVE_FETCHING_USER = 'REMOVE_FETCHING_USER'
	
	export function authUser (uid) {
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
	
	export function fetchingUserSuccess (uid, user, timestamp) {
	  return {
	    type: FETCHING_USER_SUCCESS,
	    uid,
	    user,
	    timestamp,
	  }
	}
	
	export function fetchAndHandleAuthedUser () {
	  return function (dispatch) {
	    dispatch(fetchingUser())
	    return auth().then(({user, credential}) => {
	      const userData = user.providerData[0]
	      const userInfo = formatUserInfo(userData.displayName, userData.photoURL, user.uid)
	      return dispatch(fetchingUserSuccess(user.uid, userInfo, Date.now()))
	    })
	    .then(({user}) => saveUser(user))
	    .then((user) => dispatch(authUser(user.uid)))
	    .catch((error) => dispatch(fetchingUserFailure(error)))
	  }
	}
	
	export function logoutAndUnauth () {
	  return function (dispatch) {
	    logout()
	    dispatch(unauthUser())
	  }
	}
	
	export function removeFetchingUser () {
	  return {
	    type: REMOVE_FETCHING_USER
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
	  isFetching: true,
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
	    case REMOVE_FETCHING_USER :
	      return {
	        ...state,
	        isFetching: false,
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

> app/helpers/utils.js,是一个帮助方法,被上面的users.js引用着

	export function formatUserInfo (name, avatar, uid) {
	  return {
	    name,
	    avatar,
	    uid,
	  }
	}

<br>

> app/containers/Main/MainContainer.js

<br>

	import React, { PropTypes } from 'react'
	import { connect } from 'react-redux'
	import { Navigation } from 'components'
	import { container, innerContainer } from './styles.css'
	import { bindActionCreators } from 'redux'
	import * as userActionCreators from 'redux/modules/users'
	import { formatUserInfo } from 'helpers/utils'
	import { firebaseAuth } from 'config/constants'
	
	const MainContainer = React.createClass({
	  propTypes: {
	    isAuthed: PropTypes.bool.isRequired,
	    authUser: PropTypes.func.isRequired,
	    fetchingUserSuccess: PropTypes.func.isRequired,
	    removeFetchingUser: PropTypes.func.isRequired,
	  },
	  contextTypes: {
	    router: PropTypes.object.isRequired,
	  },
	  componentDidMount () {
	    firebaseAuth().onAuthStateChanged((user) => {
	      if (user) {
	        const userData = user.providerData[0]
	        const userInfo = formatUserInfo(userData.displayName, userData.photoURL, user.uid)
	        this.props.authUser(user.uid)
	        this.props.fetchingUserSuccess(user.uid, userInfo, Date.now())
	        if (this.props.location.pathname === '/') {
	          this.context.router.replace('feed')
	        }
	      } else {
	         this.props.removeFetchingUser()
	      }
	    })
	  },
	  render () {
	    return this.props.isFetching === true
	      ? null
	      : <div className={container}>
	          <Navigation isAuthed={this.props.isAuthed} />
	          <div className={innerContainer}>
	            {this.props.children}
	          </div>
	        </div>
	  },
	})
	
	export default connect(
	  (state) => ({isAuthed: state.isAuthed, isFetching: state.isFetching}),
	  (dispatch) => bindActionCreators(userActionCreators, dispatch)
	)(MainContainer)

<br>

入口文件
> app/index.js

<br>

	import React from 'react'
	import ReactDOM from 'react-dom'
	import getRoutes from 'config/routes'
	import users from 'redux/modules/users'
	import thunk from 'redux-thunk'
	import { createStore, applyMiddleware } from 'redux'
	import { Provider } from 'react-redux'
	import { checkIfAuthed } from 'helpers/auth'
	
	const store = createStore(users, applyMiddleware(thunk))
	
	function checkAuth (nextState, replace) {
	  if (store.getState().isFetching === true) {
	    return
	  }
	
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
	document.getElementById('app'))

<br>























