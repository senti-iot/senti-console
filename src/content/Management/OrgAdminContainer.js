import React, { Component } from 'react'
import ExpandedCard from 'content/Aux/Modal/ExpandedCard'
import CreateOrg from './CreateOrgForm'
import { Button } from 'odeum-ui'
import { withTheme } from 'styled-components'
import { getOrgs } from 'utils/data'
import { Table, Th, Td } from './ManagementStyles'

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
	render() {
		return (
			<div style={{ width: '100%', height: '100%' }}>
				Administration of Organisations
				<Button onClick={() => this.setState({ createOrgModal: true })} color={this.props.theme.button.background} label={'Create new Organisation'} />
				{this.state.orgs ?
					<Table>
						<table style={{ borderCollapse: 'collapse', width: '100%' }}>
							<tbody>
								<tr>
									<Th>Name</Th>
									<Th>Address</Th>
									<Th>Country</Th>
									<Th>City</Th>
									<Th>Website</Th>
								</tr>
								{this.state.orgs.map((org, i) =>
									<tr key={i}>
										<Td>{org.vcName}</Td>
										<Td>{org.vcAddress}</Td>
										<Td>{org.vcCountry}</Td>
										<Td>{org.vcCity}</Td>
										<Td><a href={org.vcURL ? org.vcURL : null} target='_blank'>{org.vcURL ? org.vcName : null}</a></Td>
									</tr>
								)}
							</tbody>
						</table>
					</Table > : null
				}
				<ExpandedCard width={'330px'} height={'50%'} cardExpand={this.state.createOrgModal} horizontalControls={false} verticalControls={false}
					handleVerticalExpand={this.closeModal}>
					<CreateOrg closeModal={this.closeModal} />
				</ExpandedCard>
			</div >
		)
	}
}

export default withTheme(OrgAdmin)