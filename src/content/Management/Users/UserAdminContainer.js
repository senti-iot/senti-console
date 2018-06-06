import React, { Component } from 'react'
import Modal from '../../Aux/Modal/Modal'
import { withTheme } from 'styled-components'
import CreateUser from './CreateUserForm'
import { Table, Th, Td, TableContainer, Tr, Trh, ClearTd, ClearTh } from '../ManagementStyles'
import { getUsers } from 'utils/data'
import { LoaderSmall } from 'LoginStyles'
import Checkbox from '../../Aux/CheckBox/CheckBox'
import { DropDown, DropDownContainer, DropDownButton, Margin, DropDownItem } from '../../Aux/DropDown/DropDown'

class UserAdmin extends Component {
	constructor(props) {
		super(props)
		this.state = {
			createUserModal: false,
			editUserModal: false,
			deleteUserModal: false,
			dropDown: false,
			users: [],
			selectedUsers: []
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
	//#region Modal Handling

	createUserOpenModal = () => this.setState({ createUserModal: true })
	editUserOpenModal = () => this.setState({ editUserModal: true })
	deleteUserOpenModal = () => this.setState({ deleteUserModal: true })
	closeNewUserModal = () => {
		this.setState({ createUserModal: false })
		this.getUsers()
	}
	closeEditUserModal = () => {
		this.setState({ editUserModal: false })
		this.getUsers()
	}
	closeDeleteUserModal = () => {
		this.setState({ deleteUserModal: false })
		this.getUsers()
	}

	//#endregion

	//#region Checkbox handling
	handleCheck = (id, checked) => {
		var newArr = this.state.selectedUsers
		if (checked)
			newArr.push(id)
		else
			newArr = newArr.filter(c => c !== id)
		this.setState({ selectedUsers: newArr })
	}
	isChecked = (user) => this.state.selectedUsers.indexOf(user.iUserID) !== -1 ? true : false
	//#endregion
	handleDropDown = (open) => e => {
		e.preventDefault()
		this.setState({ dropDown: open })
	}
	render() {
		return (
			<div style={{ width: '100%', height: '100%' }}>
				<DropDownContainer onMouseLeave={this.handleDropDown(false)} style={{ width: 200 }}>
					<DropDownButton onMouseEnter={this.handleDropDown(true)}>
						Functions
					</DropDownButton>
					<Margin />
					{this.state.dropDown && <DropDown style={{ width: '100%' }}>
						<DropDownItem style={{ width: '100%' }} onClick={this.createUserOpenModal}>Create New User</DropDownItem>
						<DropDownItem style={{ width: '100%' }} onClick={this.createUserOpenModal}>Edit Selected User</DropDownItem>
						<DropDownItem style={{ width: '100%' }} onClick={this.createUserOpenModal}><span style={{ color: 'red' }}>Delete Users</span></DropDownItem>

					</DropDown>}
				</DropDownContainer>
				{this.state.users.length > 0 ?

					<TableContainer>
						<Table>
							<tbody>
								<Trh>
									<ClearTh><Checkbox /></ClearTh>
									<Th>Name</Th>
									<Th>E-mail</Th>
									<Th>Phone</Th>
									<Th>Organisation</Th>
								</Trh>
								{this.state.users.map((user, i) =>
									<Tr key={i}>
										<ClearTd><Checkbox size={'small'} onChange={this.handleCheck} value={user.iUserID} isChecked={this.isChecked(user)} /></ClearTd>
										<Td className="tds">{user.vcFirstName + ' ' + user.vcLastName}</Td>
										<Td className="tds"><a href={'mailto:' + user.vcEmail}>{user.vcEmail}</a></Td>
										<Td className="tds">{user.vcPhone}</Td>
										<Td className="tds">{user.organisation.vcName}</Td>
									</Tr>
								)}
							</tbody>
						</Table>
					</TableContainer> : <LoaderSmall />
				}
				<Modal width={'330px'} height={'50%'} expand={this.state.createUserModal} horizontalControls={false} verticalControls={false}
					handleOverlay={this.closeNewUserModal}>
					<CreateUser closeModal={this.closeNewUserModal} />
				</Modal>

			</div >
		)
	}
}
export default withTheme(UserAdmin)
/* 	 */