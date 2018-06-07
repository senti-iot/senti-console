import React, { Component } from 'react'
import Modal from '../../Aux/Modal/Modal'
import { withTheme } from 'styled-components'
import CreateUserForm from './CreateUserForm'
import { Table, Th, Td, TableContainer, Tr, Trh, ClearTd, ClearTh, RedButton } from '../ManagementStyles'
import { getUsers, deleteUsers } from 'utils/data'
import { LoaderSmall } from 'LoginStyles'
import Checkbox from '../../Aux/CheckBox/CheckBox'
import { DropDown, DropDownContainer, DropDownButton, Margin, DropDownItem } from '../../Aux/DropDown/DropDown'
import EditUserForm from './EditUserForm'
import { Button } from 'odeum-ui'

class UserAdmin extends Component {
	constructor(props) {
		super(props)
		this.state = {
			createUserModal: false,
			editUserModal: false,
			deleteUserModal: false,
			dropDown: false,
			users: [],
			selectedUsers: [],
			editUser: null
		}
	}
	componentDidMount = () => {
		this._isMounted = 1
		this.getUsers()
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}

	getUsers = async () => {
		if (this._isMounted) {
			this.setState({ users: [] })
			await getUsers().then(data => {
				this.setState({ users: data })
			})
		}
	}
	deleteUsers = () => async e => {
		e.preventDefault()
		await deleteUsers(this.state.selectedUsers).then(rs => {
			this.getUsers()
			this.closeDeleteUserModal()
		})
	}
	//#region Modal Handling

	createUserModal = () => this.setState({ createUserModal: true })
	editUserModal = () => this.setState({ editUserModal: true })
	deleteUserModal = () => this.setState({ deleteUserModal: true })
	closeNewUserModal = () => {
		this.setState({ createUserModal: false, selectedUsers: [] })
		this.getUsers()
	}
	closeEditUserModal = () => {
		this.setState({ editUserModal: false, selectedUsers: [] })
		this.getUsers()
	}
	closeDeleteUserModal = () => {
		this.setState({ deleteUserModal: false, selectedUsers: [] })
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
		this.setState({ selectedUsers: newArr, editUser: this.state.users.find(i => i.iUserID === newArr[0]) })
	}
	isChecked = (user) => this.state.selectedUsers.indexOf(user.iUserID) !== -1 ? true : false
	//#endregion
	handleDropDown = (open) => e => {
		e.preventDefault()
		this.setState({ dropDown: open })
	}
	renderUserNames = () => {
		var names = []

		this.state.selectedUsers.map(u => {
			let user = this.state.users.find(user => user.iUserID === u)
			if (user)
				return names.push(user.vcFirstName + ' ' + user.vcLastName + ' - ' + user.vcEmail)
			else
				return null
		})
		return names
	}

	renderDeleteUsers = () => {
		return <Modal
			verticalControls={false}
			horizontalControls={false}
			width={400}
			height={300}
			expand={this.state.deleteUserModal}
			handleOverlay={this.closeDeleteUserModal}>

			<div>
				<div style={{ margin: 10, overflow: 'hidden' }}>Er du sikker på, at du vil slette:
					<ul style={{ height: '250px', width: '350px', overflowY: 'auto' }}>
						{this.renderUserNames().map((e, index) => {
							return <li key={index} style={{ fontWeight: 700 }}> {e} </li>
						})}
					</ul>
				</div>
				<div style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', justifyContent: 'center' }}>
					<RedButton label={"Ja"} color={this.props.theme.button.background} onClick={this.deleteUsers()} />
					<Button label={"Nej"} color={this.props.theme.button.background} onClick={this.closeDeleteUserModal} />
				</div>
			</div>
		</Modal>
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
						<DropDownItem style={{ width: '100%' }} onClick={this.createUserModal}>Create New User</DropDownItem>
						<DropDownItem style={{ width: '100%' }} onClick={this.editUserModal}>Edit Selected User</DropDownItem>
						<DropDownItem style={{ width: '100%' }} onClick={this.deleteUserModal}><span style={{ color: 'red' }}>Delete Users</span></DropDownItem>

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
					<CreateUserForm closeModal={this.closeNewUserModal} />
				</Modal>
				<Modal width={'330px'} height={'50%'} expand={this.state.editUserModal} horizontalControls={false} verticalControls={false}
					handleOverlay={this.closeEditUserModal}>
					<EditUserForm closeModal={this.closeEditUserModal} user={this.state.editUser} />
				</Modal>
				{this.renderDeleteUsers()}
			</div >
		)
	}
}
export default withTheme(UserAdmin)