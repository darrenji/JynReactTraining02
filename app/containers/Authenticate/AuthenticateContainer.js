import React, { PropTypes } from 'react'
import { Authenticate } from 'components'
import auth from 'helpers/auth'
import { connect } from 'react-redux'

const AuthenticateContainer = React.createClass({
  propTypes: {
    isFetching: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired
  },
  handleAuth () {
    auth().then((user) => {
      console.log(user)
    })
  },
  render () {
    return (
      <Authenticate
        onAuth={this.handleAuth}
        isFetching={false}
        error={''} />
    )
  },
})

function mapStateToProps(state){
    console.log('State', state)
    return {}
}

export default connect(mapStateToProps)(AuthenticateContainer)