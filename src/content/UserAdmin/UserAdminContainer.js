import React, { Component } from 'react'
import ExpandedCard from '../Aux/Modal/ExpandedCard'
import { withTheme } from 'styled-components'
import CreateUser from './CreateUser'
import CreateOrg from './CreateOrg'
import { Button } from 'odeum-ui'

class UserAdmin extends Component {
	constructor(props) {
		super(props)
		this.state = {
			createUserModal: false,
			createOrgModal: false
		}
	}

	render() {
		return (
			<div>
				Administration of Users
				<Button onClick={() => this.setState({ createUserModal: true })} color={this.props.theme.button.background} label={'Create new User '} />
				<Button onClick={() => this.setState({ createOrgModal: true })} color={this.props.theme.button.background} label={'Create new Organisation'} />
				<ExpandedCard width={'330px'} height={'50%'} cardExpand={this.state.createUserModal} horizontalControls={false} verticalControls={false}
					handleVerticalExpand={() => this.setState({ createUserModal: false })}>
					<CreateUser closeModal={() => this.setState({ createUserModal: false })} />
				</ExpandedCard>
				<ExpandedCard width={'330px'} height={'50%'} cardExpand={this.state.createOrgModal} horizontalControls={false} verticalControls={false}
					handleVerticalExpand={() => this.setState({ createOrgModal: false })}>
					<CreateOrg closeModal={() => this.setState({ createOrgModal: false })} />
				</ExpandedCard>
			</div >
		)
	}
}
export default withTheme(UserAdmin)