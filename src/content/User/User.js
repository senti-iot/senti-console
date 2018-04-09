import React, { Component } from 'react'
import { UserContainer, UserName, UserAvatar } from './UserStyles'

const userObj = {
	name: 'Andrei',
	img: 'https://d30y9cdsu7xlg0.cloudfront.net/png/17241-200.png'
}
export default class User extends Component {
	constructor(props) {
		super(props)

		this.state = {
			userObj: userObj //this.props.userObj
		}
	}

	render() {
		return (
			<UserContainer>
				<UserName>{this.state.userObj.name}</UserName>
				<UserAvatar
					style={{
						background: 'white',
						height: 40,
						width: 40,
						borderRadius: '50%'
					}}
					src={this.state.userObj.img} alt={'IMG'} />
			</UserContainer>
		)
	}
}
