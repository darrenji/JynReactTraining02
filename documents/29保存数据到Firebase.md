首先是一些帮助文件。
> app/helpers/api.js

<br>

	import { ref } from 'config/constants'
	
	function saveToDucks (duck) {
	  const duckId = ref.child('ducks').push().key
	  const duckPromise = ref.child(`ducks/${duckId}`).set({...duck, duckId})
	  return {
	    duckId,
	    duckPromise,
	  }
	}
	
	function saveToUsersDucks (duck, duckId) {
	  return ref.child(`usersDucks/${duck.uid}/${duckId}`)
	    .set({...duck, duckId})
	}
	
	function saveLikeCount (duckId) {
	  return ref.child(`likeCount/${duckId}`).set(0)
	}
	
	export function saveDuck (duck) {
	  const { duckId, duckPromise } = saveToDucks(duck)
	
	  return Promise.all([
	    duckPromise,
	    saveToUsersDucks(duck, duckId),
	    saveLikeCount(duckId),
	  ]).then(() => ({...duck, duckId}))
	}

<br>

> app/helpers/utils.js

<br>

	export function formatUserInfo (name, avatar, uid) {
	  return {
	    name,
	    avatar,
	    uid,
	  }
	}
	
	export function formatDuck (text, {name, avatar, uid}) {
	  return {
	    text,
	    name,
	    avatar,
	    uid,
	    timestamp: Date.now(),
	  }
	}

<br>
然后是一些action和reducer
> app/redux/modules/ducks.js

<br>

	import { saveDuck } from 'helpers/api'
	import { closeModal } from './modal'
	import { addSingleUsersDuck } from './usersDucks'
	
	const FETCHING_DUCK = 'FETCHING_DUCK'
	const FETCHING_DUCK_ERROR = 'FETCHING_DUCK_ERROR'
	const FETCHING_DUCK_SUCCESS = 'FETCHING_DUCK_SUCCESS'
	const ADD_DUCK = 'ADD_DUCK'
	const ADD_MULTIPLE_DUCKS = 'ADD_MULTIPLE_DUCKS'
	const REMOVE_FETCHING = 'REMOVE_FETCHING'
	
	function fetchingDuck () {
	  return {
	    type: FETCHING_DUCK,
	  }
	}
	
	function fetchingDuckError (error) {
	  console.warn(error)
	  return {
	    type: FETCHING_DUCK_ERROR,
	    error: 'Error fetching Duck',
	  }
	}
	
	function fetchingDuckSuccess (duck) {
	  return {
	    type: FETCHING_DUCK_SUCCESS,
	    duck,
	  }
	}
	
	function removeFetching () {
	  return {
	    type: REMOVE_FETCHING,
	  }
	}
	
	function addDuck (duck) {
	  return {
	    type: ADD_DUCK,
	    duck,
	  }
	}
	
	function addMultipleDucks (ducks) {
	  return {
	    type: ADD_MULTIPLE_DUCKS,
	    ducks,
	  }
	}
	
	export function duckFanout (duck) {
	  return function (dispatch, getState) {
	    const uid = getState().users.authedId
	    saveDuck(duck)
	      .then((duckWithID) => {
	        dispatch(addDuck(duckWithID))
	        dispatch(closeModal())
	        dispatch(addSingleUsersDuck(uid, duckWithID.duckId))
	      })
	      .catch((err) => {
	        console.warn('Error in duckFanout', err)
	      })
	  }
	}
	
	const initialState = {
	  isFetching: true,
	  error: '',
	}
	
	export default function ducks (state = initialState, action) {
	  switch (action.type) {
	    case FETCHING_DUCK :
	      return {
	        ...state,
	        isFetching: true,
	      }
	    case ADD_DUCK :
	    case FETCHING_DUCK_SUCCESS :
	      return {
	        ...state,
	        error: '',
	        isFetching: false,
	        [action.duck.duckId]: action.duck,
	      }
	    case FETCHING_DUCK_ERROR :
	      return {
	        ...state,
	        isFetching: false,
	        error: action.error,
	      }
	    case REMOVE_FETCHING :
	      return {
	        ...state,
	        error: '',
	        isFetching: false,
	      }
	    case ADD_MULTIPLE_DUCKS :
	      return {
	        ...state,
	        ...action.ducks,
	      }
	    default :
	      return state
	  }
	}

<br>

> app/redux/modules/userDucks.js

<br>

	const FETCHING_USERS_DUCKS = 'FETCHING_USERS_DUCKS'
	const FETCHING_USERS_DUCKS_ERROR = 'FETCHING_USERS_DUCKS_ERROR'
	const FETCHING_USERS_DUCKS_SUCCESS = 'FETCHING_USERS_DUCKS_SUCCESS'
	const ADD_SINGLE_USERS_DUCK = 'ADD_SINGLE_USERS_DUCK'
	
	function fetchingUsersDucks (uid) {
	  return {
	    type: FETCHING_USERS_DUCKS,
	    uid,
	  }
	}
	
	function fetchingUsersDucksError (error) {
	  console.warn(error)
	  return {
	    type: FETCHING_USERS_DUCKS_ERROR,
	    error: 'Error fetching Users Duck Ids',
	  }
	}
	
	function fetchingUsersDucksSuccess (uid, duckIds, lastUpdated) {
	  return {
	    type: FETCHING_USERS_DUCKS_SUCCESS,
	    uid,
	    duckIds,
	    lastUpdated,
	  }
	}
	
	export function addSingleUsersDuck (uid, duckId) {
	  return {
	    type: ADD_SINGLE_USERS_DUCK,
	    uid,
	    duckId,
	  }
	}
	
	const initialUsersDuckState = {
	  lastUpdated: 0,
	  duckIds: [],
	}
	
	function usersDuck (state = initialUsersDuckState, action) {
	  switch (action.type) {
	    case ADD_SINGLE_USERS_DUCK :
	      return {
	        ...state,
	        duckIds: state.duckIds.concat([action.duckId]),
	      }
	    default :
	      return state
	  }
	}
	
	const initialState = {
	  isFetching: true,
	  error: '',
	}
	
	export default function usersDucks (state = initialState, action) {
	  switch (action.type) {
	    case FETCHING_USERS_DUCKS :
	      return {
	        ...state,
	        isFetching: true,
	      }
	    case FETCHING_USERS_DUCKS_ERROR :
	      return {
	        ...state,
	        isFetching: false,
	        error: action.error,
	      }
	    case FETCHING_USERS_DUCKS_SUCCESS :
	      return {
	        ...state,
	        isFetching: false,
	        error: '',
	        [action.uid]: {
	          lastUpdated: action.lastUpdated,
	          duckIds: action.duckIds,
	        },
	      }
	    case ADD_SINGLE_USERS_DUCK :
	      return typeof state[action.uid] === 'undefined'
	        ? state
	        : {
	          ...state,
	          isFetching: false,
	          error: '',
	          [action.uid]: usersDuck(state[action.uid], action),
	        }
	    default :
	      return state
	  }
	}

<br>

> app/redux/modules/feed.js

<br>

	const SETTING_FEED_LISTENER = 'SETTING_FEED_LISTENER'
	const SETTING_FEED_LISTENER_ERROR = 'SETTING_FEED_LISTENER_ERROR'
	const SETTING_FEED_LISTENER_SUCCESS = 'SETTING_FEED_LISTENER_SUCCESS'
	const ADD_NEW_DUCK_ID_TO_FEED = 'ADD_NEW_DUCK_ID_TO_FEED'
	const RESET_NEW_DUCKS_AVAILABLE = 'RESET_NEW_DUCKS_AVAILABLE'
	
	function settingFeedListener () {
	  return {
	    type: SETTING_FEED_LISTENER,
	  }
	}
	
	function settingFeedListenerError (error) {
	  console.warn(error)
	  return {
	    type: SETTING_FEED_LISTENER_ERROR,
	    error: 'Error fetching feeds.',
	  }
	}
	
	function settingFeedListenerSuccess (duckIds) {
	  return {
	    type: SETTING_FEED_LISTENER_SUCCESS,
	    duckIds,
	  }
	}
	
	
	function addNewDuckIdToFeed (duckId) {
	  return {
	    type: ADD_NEW_DUCK_ID_TO_FEED,
	    duckId,
	  }
	}
	
	export function resetNewDucksAvailable () {
	  return {
	    type: RESET_NEW_DUCKS_AVAILABLE,
	  }
	}
	
	const initialState = {
	  newDucksAvailable: false,
	  newDucksToAdd: [],
	  isFetching: false,
	  error: '',
	  duckIds: [],
	}
	
	export default function feed (state = initialState, action) {
	  switch (action.type) {
	    case SETTING_FEED_LISTENER :
	      return {
	        ...state,
	        isFetching: true,
	      }
	    case SETTING_FEED_LISTENER_ERROR :
	      return {
	        ...state,
	        isFetching: false,
	        error: action.error,
	      }
	    case SETTING_FEED_LISTENER_SUCCESS :
	      return {
	        ...state,
	        isFetching: false,
	        error: '',
	        duckIds: action.duckIds,
	        newDucksAvailable: false,
	      }
	    case ADD_NEW_DUCK_ID_TO_FEED :
	      return {
	        ...state,
	        newDucksToAdd: [action.duckId, ...state.newDucksToAdd],
	        newDucksAvailable: true,
	      }
	    case RESET_NEW_DUCKS_AVAILABLE :
	      return {
	        ...state,
	        duckIds: [...state.newDucksToAdd, ...state.duckIds],
	        newDucksToAdd: [],
	        newDucksAvailable: false,
	      }
	    default :
	      return state
	  }
	}

<br>
然后这些reducer被一个index.js管理
> app/redux/modules/index.js

<br>

	export users from './users'
	export modal from './modal'
	export ducks from './ducks'
	export usersDucks from './usersDucks'
	export feed from './feed'

<br>

然后就是表现组件了
> app/components/Modal/Modal.js

<br>

	import React, { PropTypes } from 'react'
	import { default as ReactModal } from 'react-modal'
	import {
	  newDuckTop, pointer, newDuckInputContainer,
	  newDuckInput, submitDuckBtn, darkBtn } from './styles.css'
	import { formatDuck } from 'helpers/utils'
	
	const modalStyles = {
	  content: {
	    width: 350,
	    margin: '0px auto',
	    height: 220,
	    borderRadius: 5,
	    background: '#EBEBEB',
	    padding: 0,
	  },
	}
	
	const { object, string, func, bool } = PropTypes
	Modal.propTypes = {
	  duckText: string.isRequired,
	  closeModal: func.isRequired,
	  isOpen: bool.isRequired,
	  isSubmitDisabled: bool.isRequired,
	  openModal: func.isRequired,
	  duckFanout: func.isRequired,
	  updateDuckText: func.isRequired,
	  user: object.isRequired,
	}
	
	export default function Modal (props) {
	  function submitDuck () {
	    return props.duckFanout(formatDuck(props.duckText, props.user))
	  }
	
	  return (
	    <span className={darkBtn} onClick={props.openModal}>
	      {'Duck'}
	      <ReactModal style={modalStyles} isOpen={props.isOpen} onRequestClose={props.closeModal}>
	        <div className={newDuckTop}>
	          <span>{'Compose new Duck'}</span>
	          <span onClick={props.closeModal} className={pointer}>{'X'}</span>
	        </div>
	        <div className={newDuckInputContainer}>
	          <textarea
	            onChange={(e) => props.updateDuckText(e.target.value)}
	            value={props.duckText}
	            maxLength={140}
	            type='text'
	            className={newDuckInput}
	            placeholder="What's on your mind?" />
	        </div>
	        <button
	          className={submitDuckBtn}
	          disabled={props.isSubmitDisabled}
	          onClick={submitDuck}>
	            {'Duck'}
	        </button>
	      </ReactModal>
	    </span>
	  )
	}

<br>

最后是容器组件
> app/containers/Modal/ModalContainer.js

<br>

	import { bindActionCreators } from 'redux'
	import { connect } from 'react-redux'
	import { Modal } from 'components'
	import * as modalActionCreators from 'redux/modules/modal'
	import * as ducksActionCreators from 'redux/modules/ducks'
	
	function mapStateToProps ({modal, users}, props) {
	  const duckTextLength = modal.duckText.length
	  return {
	    user: users[users.authedId] ? users[users.authedId].info : {},
	    duckText: modal.duckText,
	    isOpen: modal.isOpen,
	    isSubmitDisabled: duckTextLength <= 0 || duckTextLength > 140,
	  }
	}
	
	function mapDispatchToProps (dispatch, props) {
	  return bindActionCreators({
	    ...modalActionCreators,
	    ...ducksActionCreators,
	  }, dispatch)
	}
	
	export default connect(
	  mapStateToProps,
	  mapDispatchToProps
	)(Modal)

<br>