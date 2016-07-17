上一节，全局层面React和Redux建立了联系。组件和Redux如何建立联系呢？

<br>

# 组件调用Redux的dispatch方法 #

比如说，Redux的dispatch方法用来触发action，组件如何能拿到Redux的dispatch方法呢？

	import React, { PropTypes } from 'react'
	import { connect } from 'react-redux'
	import { setUser } from '../actions'
	const MyComponent = React.createClass({
	  propTypes: {
	    dispatch: PropTypes.func.isRequired,
	  },
	  handleClick () {
	    this.props.dispatch(setUser('Tyler'))
	  },
	  render () {
	    return (
	      <div onClick={this.handleClick}> Hello </div>
	    )
	  }
	})
	export default connect()(MyComponent)
以上，使用react-redux的connect对象把组件包裹起来，让组件成为一个容器组件，这样组件就可以调用Redux的dispatch触发某个action，再通过Reducer来更改状态。

好，**组件可以调用Redux的dispatch了**。√

<br>
另外一个问题是：现在Redux已经管理状态了，**组件如何拿到Redux管理的状态呢**？

<br>

# 组件获取Redux管理的状态 #

假设，Redux管理的状态是这样的：

	{
	  authedId: 'tyler',
	  name: 'Tyler McGinnis'
	  isAuthed: true,
	  isFetching: false,
	  bio: 'Posuere ad repellendus odit sagittis? Non velit do mollitia dignissim, quam nihil cupidatat laboriosam'
	}

<br>

接下来，让组件获取状态：

	import React, { PropTypes } from 'react'
	import { connect } from 'react-redux'
	const MyComponent = React.createClass({
	  propTypes: {
	    name: PropTypes.string.isRequired,
	    bio: PropTypes.string.isRequired,
	  },
	  render () {
	    return (
	      <div>
	        <h1>{this.props.name}</h1>
	        <p>{this.props.bio}</p>
	      </div>
	    )
	  }
	})
	function mapStateToProps (state) {
	  return {
	    name: state.name,
	    bio: state.bio
	  }
	}
	export default connect(mapStateToProps)(MyComponent)


<br>
**组件可以调用Redux的dispatch了**。√
**组件可以获取Redux的状态了**。√

<br>
还有一个问题，在本篇的开头，组件可以拿到Redux的dispatch一个action,如果需要dispatch的action有很多呢？

<br>

	import React, { PropTypes } from 'react'
	import { connect } from 'react-redux'
	import { bindActionCreators } from 'redux'
	import * as actions from from '../actions'
	const MyComponent = React.createClass({
	  propTypes: {
	    name: PropTypes.string.isRequired,
	    setUser: PropTypes.func.isRequired,
	    addPost: PropTypes.func.isRequired,
	    fanoutPost: PropTypes.func.isRequired,
	  },
	  submit (post) {
	    addPost(post)
	    fanoutPost(post)
	  },
	  render () {
	    return <Post name={this.props.name} handleSubmit={this.submit} handleClear={this.props.setUser} />
	  }
	})
	function mapStateToProps (state) {
	   return {
	     name: state.name
	   }
	}
	function mapDispatchToProps (dispatch) {
	  return bindActionCreators(actions, dispatch)
	}
	export default connect(mapStateToProps, mapDispatchToProps)(MyComponent)
以上，通过redux的bindActionCreators对象，把所有action交给了dispatch，从而可以调用多个action,就像上面的addPost和fanoutPost方法。

<br>



