import React from 'react'
import { container, innerContainer } from './styles.css'
import { Navigation } from 'components'

const MainContainer = React.createClass({
  render () {
    return (
      <div className={container}>
        <Navigation isAuthed={true} />
        <div className={innerContainer}>
          {this.props.children}
        </div>
      </div>
    )
  },
})

export default MainContainer
