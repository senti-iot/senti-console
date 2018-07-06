import React, { Component } from 'react'
import { Button } from '@material-ui/core';

export default class ResetDevice extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 success: null
	  }
	}
	
	handleReset =async () => {
		console.log(this.props.match)
		await ResetDevice(this.props.match.params.id).then(rs => this.setState({ success: rs }))
	}
	render() {
		return (
	  	<div>
				<Button variant={'contained'}>
					Reset Device 
			  </Button>
	 	 </div>
		)
	}
}
