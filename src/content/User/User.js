import React, { Component } from 'react'
import { UserContainer, UserName, UserAvatar } from './UserStyles'
import { AppContext } from 'Login'
import { DropDownContainer, DropDownButton, Margin, DropDown, DropDownItem } from '../Aux/DropDown/DropDown'

// const userObj = {
// 	name: 'Andrei',
// 	img: 'https://d30y9cdsu7xlg0.cloudfront.net/png/17241-200.png'
// }
export default class User extends Component {
	constructor(props) {
		super(props)

		this.state = {
			userObj: '', //this.props.userObj
			dropDown: false
		}
	}
	handleUserDropDown = (open) => e => {
		this.setState({ dropDown: open })
	}
	render() {
		return (
			<AppContext.Consumer>
				{(context) => {
					if (context.user)
						return <UserContainer>
							<DropDownContainer onMouseLeave={this.handleUserDropDown(false)} style={{ width: 200 }}>
								<DropDownButton onMouseEnter={this.handleUserDropDown(true)}>
									<UserName>{context.user.vcFirstName + " " + context.user.vcLastName}</UserName>
									<UserAvatar
										style={{
											background: 'white',
											height: 40,
											width: 40,
											borderRadius: '50%'
										}}
										src={'https://d30y9cdsu7xlg0.cloudfront.net/png/17241-200.png'} alt={'IMG'} />
								</DropDownButton>
								<Margin />
								{this.state.dropDown && <DropDown style={{ width: '100%' }}>
									<DropDownItem style={{ width: '100%' }} onClick={context.logOut}>Log out</DropDownItem>
								</DropDown>}
							</DropDownContainer>
						</UserContainer>
				}
				}
			</AppContext.Consumer>
		)
	}
}
