import React, { Component } from 'react'
import Modal from 'content/Aux/Modal/Modal'
import CreateOrg from './CreateOrgForm'
import { withTheme } from 'styled-components'
import { getOrgs, deleteOrgs } from 'utils/data'
import { Table, Th, Td, TableContainer, Tr, TableScroll, Trh, ClearTh, ClearTd, RedButton } from '../ManagementStyles'
import { LoaderSmall } from 'LoginStyles'
import Checkbox from '../../Aux/CheckBox/CheckBox'
import { DropDownContainer, DropDownButton, Margin, DropDown, DropDownItem } from '../../Aux/DropDown/DropDown'
import EditOrgForm from './EditOrgForm'
import { Button } from 'odeum-ui'

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
		if (this._isMounted === 1) {
			this.setState({ orgs: [] })
			var data = await getOrgs()
			this.setState({ orgs: data })
		}
	}
	deleteOrgs = () => async e => {
		e.preventDefault()
		await deleteOrgs(this.state.selectedOrgs).then(rs => {
			this.setState({ selectedOrgs: [] })
			this.getOrgs()
			this.closeDeleteOrgModal()
		})
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
	renderOrgNames = () => {
		var names = []
		this.state.selectedOrgs.map(p => {
			let org = this.state.orgs.find(o => o.iOrgID === p)
			if (org)
				return names.push(org.vcName)
			else
				return null
		})
		return names
	}
	renderDeleteOrg = () => {
		return <Modal
			verticalControls={false}
			horizontalControls={false}
			width={400}
			height={300}
			expand={this.state.deleteOrgModal}
			handleOverlay={this.closeDeleteOrgModal}>

			<div>
				<div style={{ margin: 10, overflow: 'hidden' }}>Er du sikker på, at du vil slette:
					<ul style={{ height: '250px', width: '350px', overflowY: 'auto' }}>
						{this.renderOrgNames().map((e, index) => {
							return <li key={index} style={{ fontWeight: 700 }}> {e} </li>
						})}
					</ul>
				</div>
				<div style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center', justifyContent: 'center' }}>
					<RedButton label={"Ja"} color={this.props.theme.button.background} onClick={this.deleteOrgs()} />
					<Button label={"Nej"} color={this.props.theme.button.background} onClick={this.closeDeleteOrgModal} />
				</div>
			</div>
		</Modal>
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
						<DropDownItem style={{ width: '100%' }} onClick={this.deleteOrgModal}><span style={{ color: 'red' }}>Delete Organisations</span></DropDownItem>

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
											<Td className="tds">{org.vcName}</Td>
											<Td className="tds">{org.vcAddress}</Td>
											<Td className="tds">{org.vcCountry}</Td>
											<Td className="tds">{org.vcCity}</Td>
											<Td className="tds"><a href={org.vcURL ? org.vcURL : null} target='_blank' title={org.vcURL}>{org.vcURL ? org.vcName : null}</a></Td>
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
				{this.renderDeleteOrg()}
			</div >
		)
	}
}

export default withTheme(OrgAdmin)