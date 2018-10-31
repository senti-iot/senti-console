import React, { Component } from 'react'
// import PropTypes from 'prop-types'

class BarChart extends Component {
	static propTypes = {

	}
	constructor(props) {
	  super(props)
	
	  this.state = {
		  tooltip: {
			  show: false,
			  title: '',
			  top: 0,
			  left: 0,
			  data: []
		 }
	  }
	}
	
	render() {
		return (
			<div>

			</div>
		)
	}
}

export default BarChart
