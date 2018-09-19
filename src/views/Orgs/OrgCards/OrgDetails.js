import React, { Component } from 'react'
import { InfoCard, ItemGrid, Caption, Info } from 'components';
import { Grid } from '@material-ui/core';
import { Business } from '@material-ui/icons'
import { Link } from 'react-router-dom'

export class OrgDetails extends Component {
	render() {
		const { t, org } = this.props
		return (
			<InfoCard title={org.name} avatar={<Business />} subheader={""}
				noExpand
				content={
					<Grid container>
						<ItemGrid>
							<Caption>
								{t("orgs.fields.address")}
							</Caption>
							<Info >
								{org.address}
							</Info>
						</ItemGrid>
						<ItemGrid>
							<Caption>
								{t("orgs.fields.city")}
							</Caption>
							<Info>
								{`${org.zip} ${org.city}`}
							</Info>
						</ItemGrid>
						<ItemGrid xs={12}>
							<Caption>
								{t("orgs.fields.url")}
							</Caption>
							<Info>
								<a href={org.url}>
									{org.url}
								</a>
							</Info>
						</ItemGrid>
						{org.org.id > 0 ?
							<ItemGrid>
								<Caption>
									{t("orgs.fields.parentOrg")}
								</Caption>
								<Info>
									<Link to={`/org/${org.org.id}`}>
										{org.org.name}
									</Link>
								</Info>
							</ItemGrid> : null}
					</Grid>
				}
			/>
		)
	}
}

export default OrgDetails
