import React, { Component } from 'react'

import { Typography } from '@material-ui/core';

class NotFound extends Component {
	componentDidMount = () => {
	  this.props.setHeader('404', true)
	}
	
	render() {
		return (

			<Typography variant={'h2'}>
							404
			</Typography>

		)
	}
}

export default NotFound