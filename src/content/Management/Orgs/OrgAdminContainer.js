import React, { Component } from 'react'
import Modal from 'content/Aux/Modal/Modal'
import CreateOrg from './CreateOrgForm'
import { Button } from 'odeum-ui'
import { withTheme } from 'styled-components'
import { getOrgs } from 'utils/data'
import { Table, Th, Td, TableContainer, Tr, TableScroll, Trh, ClearTh, ClearTd } from '../ManagementStyles'
import { LoaderSmall } from 'LoginStyles'
import Checkbox from '../../Aux/CheckBox/CheckBox'

class OrgAdmin extends Component {
	constructor(props) {
		super(props)
		this.state = {
			createOrgModal: false,
			orgs: []
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
	closeModal = () => {
		this.setState({ createOrgModal: false })
		this.getOrgs()
	}
	openModal = () => {
		this.setState({ createOrgModal: true })
	}
	renderFakeUsers = () => {
		var arr = []
		for (let index = 0; index < 100; index++) {
			arr.push(<Tr key={index}>
				<Td>{index}</Td>
				<Td>{index}</Td>
				<Td>{index}</Td>
				<Td>{index}</Td>
				<Td>{index}</Td>
			</Tr>)
		}
		console.log(arr)
		return arr
	}
	render() {
		const { theme } = this.props
		const { orgs, createOrgModal } = this.state
		return (
			<div style={{ width: '100%', height: '100%' }}>
				Administration of Organisations
				<Button icon={'group_add'} iconSize={20} onClick={this.openModal} color={theme.button.background} label={'Create new Organisation'} />
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
											<ClearTd><Checkbox /> </ClearTd>
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
					handleOverlay={this.closeModal}>
					<CreateOrg closeModal={this.closeModal} />
				</Modal>
			</div >
		)
	}
}

export default withTheme(OrgAdmin)