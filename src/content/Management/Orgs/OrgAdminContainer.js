import React, { Component } from 'react'
import Modal from 'content/Aux/Modal/Modal'
import CreateOrg from './CreateOrgForm'
import { withTheme } from 'styled-components'
import { getOrgs, deleteOrgs } from 'utils/data'
import { Table, Th, Td, TableContainer, Tr, TableScroll, Trh, ClearTh, ClearTd } from '../ManagementStyles'
import { LoaderSmall } from 'LoginStyles'
import Checkbox from '../../Aux/CheckBox/CheckBox'
import { DropDownContainer, DropDownButton, Margin, DropDown, DropDownItem } from '../../Aux/DropDown/DropDown'
import EditOrgForm from './EditOrgForm'

class OrgAdmin extends Component {
	constructor(props) {
		super(props)
		this.state = {
			createOrgModal: false,
			editOrgModal: false,
			deleteOrgModal: false,
			dropDown: false,
			orgs: [],
			selectedOrgs: [],
			editOrg: null
		}
	}
	componentWillMount = () => {
		this._isMounted = 1
		this.getOrgs()
	}
	componentWillUnmount = () => {
		this._isMounted = 0
	}

	getOrgs = async () => {
		var data = await getOrgs()
		if (this._isMounted === 1) {
			this.setState({ orgs: data })
		}
	}
	deleteOrgs = async () => {
		await deleteOrgs(this.state.selectedOrgs)
		this.getOrgs()
	}
	createOrgModal = () => this.setState({ createOrgModal: true })
	editOrgModal = () => this.setState({ editOrgModal: true })
	deleteOrgModal = () => this.setState({ deleteOrgModal: true })
	closeCreateOrgModal = () => {
		this.setState({ createOrgModal: false })
		this.getOrgs()
	}
	closeEditOrgModal = () => {
		this.setState({ editOrgModal: false })
		this.getOrgs()
	}
	closeDeleteOrgModal = () => {
		this.setState({ deleteOrgModal: false })
		this.getOrgs()
	}

	handleCheck = (id, checked) => {
		var newArr = this.state.selectedOrgs
		if (checked)
			newArr.push(id)
		else {
			console.log(id)
			newArr = newArr.filter(c => c !== id)
		}
		this.setState({ selectedOrgs: newArr, editOrg: this.state.orgs.find(i => i.iOrgID === newArr[0]) })
	}
	isChecked = (org) => this.state.selectedOrgs.indexOf(org.iOrgID) !== -1 ? true : false
	//#endregion
	handleDropDown = (open) => e => {
		e.preventDefault()
		this.setState({ dropDown: open })
	}
	render() {
		const { orgs, createOrgModal, editOrgModal } = this.state
		return (
			<div style={{ width: '100%', height: '100%' }}>
				<DropDownContainer onMouseLeave={this.handleDropDown(false)} style={{ width: 200 }}>
					<DropDownButton onMouseEnter={this.handleDropDown(true)}>
						Functions
					</DropDownButton>
					<Margin />
					{this.state.dropDown && <DropDown style={{ width: '100%' }}>
						<DropDownItem style={{ width: '100%' }} onClick={this.createOrgModal}>Create New Organisation</DropDownItem>
						<DropDownItem style={{ width: '100%' }} onClick={this.editOrgModal}>Edit Selected Organisation</DropDownItem>
						<DropDownItem style={{ width: '100%' }} onClick={this.deleteOrgs}><span style={{ color: 'red' }}>Delete Organisations</span></DropDownItem>

					</DropDown>}
				</DropDownContainer>

				{orgs.length > 0 ?
					<TableContainer>
						<TableScroll>
							<Table>
								<thead>
									<Trh>
										<ClearTh><Checkbox /></ClearTh>
										<Th>Name</Th>
										<Th>Address</Th>
										<Th>Country</Th>
										<Th>City</Th>
										<Th>Website</Th>
									</Trh>
								</thead>
								<tbody>
									{orgs.map((org, i) =>
										<Tr key={i}>
											<ClearTd><Checkbox onChange={this.handleCheck} isChecked={this.isChecked(org)} value={org.iOrgID} /> </ClearTd>
											<Td>{org.vcName}</Td>
											<Td>{org.vcAddress}</Td>
											<Td>{org.vcCountry}</Td>
											<Td>{org.vcCity}</Td>
											<Td><a href={org.vcURL ? org.vcURL : null} target='_blank'>{org.vcURL ? org.vcName : null}</a></Td>
										</Tr>
									)}
									{/* {this.renderFakeUsers()} Overflow Testing*/}
								</tbody>
							</Table>
						</TableScroll>
					</TableContainer > : <LoaderSmall />
				}
				<Modal width={'330px'} height={'50%'} expand={createOrgModal} horizontalControls={false} verticalControls={false}
					handleOverlay={this.closeCreateOrgModal}>
					<CreateOrg closeModal={this.closeCreateOrgModal} />
				</Modal>
				<Modal width={'330px'} height={'50%'} expand={editOrgModal} horizontalControls={false} verticalControls={false}
					handleOverlay={this.closeEditOrgModal}>
					<EditOrgForm closeModal={this.closeEditOrgModal} org={this.state.editOrg} />
				</Modal>
			</div >
		)
	}
}

export default withTheme(OrgAdmin)