import React, { Component } from 'react'
import Modal from '../Aux/Modal/Modal'
import { withTheme } from 'styled-components'
import CreateUser from './CreateUserForm'
import { Button } from 'odeum-ui'
import { Table, Th, Td, TableContainer, Tr, Trh } from './ManagementStyles'
import { getUsers } from 'utils/data'
import { LoaderSmall } from 'LoginStyles'

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
		await getUsers().then(data => {
			if (this._isMounted) {
				this.setState({ users: data })
			}
		})
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
				{this.state.users.length > 0 ?

					<TableContainer>
						<Table>
							<tbody>
								<Trh>
									<Th>Name</Th>
									<Th>E-mail</Th>
									<Th>Phone</Th>
									<Th>Organisation</Th>
								</Trh>
								{this.state.users.map((user, i) =>
									<Tr key={i}>
										<Td>{user.vcFirstName + ' ' + user.vcLastName}</Td>
										<Td><a href={'mailto:' + user.vcEmail}>{user.vcEmail}</a></Td>
										<Td>{user.vcPhone}</Td>
										<Td>{user.organisation.vcName}</Td>
									</Tr>
								)}
							</tbody>
						</Table>
					</TableContainer> : <LoaderSmall />
				}
				<Modal width={'330px'} height={'50%'} expand={this.state.createUserModal} horizontalControls={false} verticalControls={false}
					handleOverlay={this.closeModal}>
					<CreateUser closeModal={this.closeModal} />
				</Modal>

			</div >
		)
	}
}
export default withTheme(UserAdmin)
/* 	 */