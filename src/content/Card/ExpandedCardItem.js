import React, { Component } from 'react'

export default class ExpandedCardItem extends Component {
	constructor(props) {
		super(props)

		this.state = {
			expand: false
		}
	}

	render() {
		return (
			<div onClick={this.props.handleVerticalExpand} style={{ position: 'absolute', zIndex: 10, top: '0', left: '0', width: '100%', height: '100%', background: '#ffffff99' }}>
				hello Andrei
			</div>
		)
	}
}
