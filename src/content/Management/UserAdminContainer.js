import React, { Component } from 'react'
import ExpandedCard from '../Aux/Modal/ExpandedCard'
import { withTheme } from 'styled-components'
import CreateUser from './CreateUserForm'
import { Button } from 'odeum-ui'
import { Table, Th, Td } from './ManagementStyles'
import { getUsers } from 'utils/data'

class UserAdmin extends Component {
	constructor(props) {
		super(props)
		this.state = {
			createUserModal: false,
			users: []
		}
	}
	componentWillMount = () => {
		this._isMounted = 1
		this.getUsers()
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}

	getUsers = async () => {
		var data = await getUsers()
		if (this._isMounted) {
			this.setState({ users: data })
		}
	}

	closeModal = () => {
		this.setState({ createUserModal: false })
		this.getUsers()
	}
	render() {
		return (
			<div style={{ width: '100%', height: '100%' }}>
				Administration of Users
				<Button onClick={() => this.setState({ createUserModal: true })} color={this.props.theme.button.background} label={'Create new User'} />
				{this.state.users ?
					<Table>
						<table style={{ borderCollapse: 'collapse', width: '100%' }}>
							<tbody>
								<tr>
									<Th>Name</Th>
									<Th>E-mail</Th>
									<Th>Phone</Th>
									<Th>Organisation</Th>
								</tr>
								{this.state.users.map((user, i) =>
									<tr key={i}>
										<Td>{user.vcFirstName + ' ' + user.vcLastName}</Td>
										<Td><a href={'mailto:' + user.vcEmail}>{user.vcEmail}</a></Td>
										<Td>{user.vcPhone}</Td>
										<Td>{user.organisation.vcName}</Td>
									</tr>
								)}
							</tbody>
						</table>
					</Table > : null
				}
				<ExpandedCard width={'330px'} height={'50%'} cardExpand={this.state.createUserModal} horizontalControls={false} verticalControls={false}
					handleVerticalExpand={this.closeModal}>
					<CreateUser closeModal={this.closeModal} />
				</ExpandedCard>

			</div >
		)
	}
}
export default withTheme(UserAdmin)