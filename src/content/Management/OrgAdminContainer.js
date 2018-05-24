import React, { Component } from 'react'
import ExpandedCard from 'content/Aux/Modal/ExpandedCard'
import CreateOrg from './CreateOrgForm'
import { Button } from 'odeum-ui'
import { withTheme } from 'styled-components'
import { getOrgs } from 'utils/data'
import { Table, Th, Td, TableContainer, Tr } from './ManagementStyles'
import { LoaderSmall } from 'LoginStyles'

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
	render() {
		const { theme } = this.props
		const { orgs, createOrgModal } = this.state
		return (
			<div style={{ width: '100%', height: '100%' }}>
				Administration of Organisations
				<Button icon={'group_add'} iconSize={20} onClick={this.openModal} color={theme.button.background} label={'Create new Organisation'} />
				{orgs.length > 0 ?
					<TableContainer>
						<Table>
							<tbody>
								<tr>
									<Th>Name</Th>
									<Th>Address</Th>
									<Th>Country</Th>
									<Th>City</Th>
									<Th>Website</Th>
								</tr>
								{orgs.map((org, i) =>
									<Tr key={i}>
										<Td className={'child'}>{org.vcName}</Td>
										<Td className={'child'}>{org.vcAddress}</Td>
										<Td className={'child'}>{org.vcCountry}</Td>
										<Td className={'child'}>{org.vcCity}</Td>
										<Td className={'child'}><a href={org.vcURL ? org.vcURL : null} target='_blank'>{org.vcURL ? org.vcName : null}</a></Td>
									</Tr>
								)}
							</tbody>
						</Table>
					</TableContainer > : <LoaderSmall />
				}
				<ExpandedCard width={'330px'} height={'50%'} expand={createOrgModal} horizontalControls={false} verticalControls={false}
					handleOverlay={this.closeModal}>
					<CreateOrg closeModal={this.closeModal} />
				</ExpandedCard>
			</div >
		)
	}
}

export default withTheme(OrgAdmin)