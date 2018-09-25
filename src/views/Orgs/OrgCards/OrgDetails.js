import React, { Component } from 'react'
import { InfoCard, ItemGrid, Caption, Info } from 'components';
import { Grid, IconButton, Menu, MenuItem } from '@material-ui/core';
import { Business, MoreVert, Edit, Delete } from '@material-ui/icons'
var countries = require("i18n-iso-countries")

class OrgDetails extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 actionAnchor: null
	  }
	}
    handleOpenActionsDetails = event => {
    	this.setState({ actionAnchor: event.currentTarget });
    }

    handleCloseActionsDetails = () => {
    	this.setState({ actionAnchor: null });
    }
	deleteOrg = () => {
		this.handleCloseActionsDetails()
		this.props.deleteOrg()
	}
	render() {
    	const { actionAnchor } = this.state
    	const { t, org, classes } = this.props
    	return (
    		<InfoCard title={org.name} avatar={<Business />} subheader={""}
    			noExpand
    			topAction={<ItemGrid noMargin noPadding>
    				<IconButton
    					aria-label="More"
    					aria-owns={actionAnchor ? 'long-menu' : null}
    					aria-haspopup="true"
    					onClick={this.handleOpenActionsDetails}>
    					<MoreVert />
    				</IconButton>
    				<Menu
    					id="long-menu"
    					anchorEl={actionAnchor}
    					open={Boolean(actionAnchor)}
    					onClose={this.handleCloseActionsDetails}
    					PaperProps={{
    						style: {
    							maxHeight: 200,
    							minWidth: 200
    						}
    					}}>
    					<MenuItem onClick={() => this.props.history.push(`${this.props.match.url}/edit`)}>
    						<Edit className={classes.leftIcon} />{t("menus.editOrg")}
    					</MenuItem>
    					<MenuItem onClick={this.deleteOrg}>
    						<Delete className={classes.leftIcon} />{t("menus.deleteOrg")}
    					</MenuItem>
						))}
    				</Menu>
    			</ItemGrid>}
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
    							{t("orgs.fields.zip")}
    						</Caption>
    						<Info>
    							{org.zip}
    						</Info>
    					</ItemGrid>
    					<ItemGrid>
    						<Caption>
    							{t("orgs.fields.city")}
    						</Caption>
    						<Info>
    							{org.city}
    						</Info>
    					</ItemGrid>
    					<ItemGrid xs={12} />
    					<ItemGrid>
    						<Caption>
    							{t("orgs.fields.region")}
    						</Caption>
    						<Info>
    							{org.region}
    						</Info>
    					</ItemGrid>
    					<ItemGrid>
    						<Caption>
    							{t("orgs.fields.country")}
    						</Caption>
    						<Info>
    							{org.country.length === 2 ? countries.getName(org.country, this.props.language)
    								: org.country}
    						</Info>
    					</ItemGrid>
    					<ItemGrid xs={12}>
    						<Caption>
    							{t("orgs.fields.url")}
    						</Caption>
    						<Info>
    							<a href={ org.url } target={"_blank"}>
    								{org.url}
    							</a>
    						</Info>
    					</ItemGrid>
    					{/* {org.org.id > 0 ?
    						<ItemGrid xs={12}>
    							<Caption>
    								{t("orgs.fields.parentOrg")}
    							</Caption>
    							<Info>
    								<Link to={`/org/${org.org.id}`}>
    									{org.org.name}
    								</Link>
    							</Info>
    						</ItemGrid> : null} */}
    					<ItemGrid>
    						<Caption>
    							{t("orgs.fields.CVR")}
    						</Caption>
    						<Info>
    							{org.aux ? org.aux.cvr : null}
    						</Info>
    					</ItemGrid>
    					<ItemGrid>
    						<Caption>
    							{t("orgs.fields.EAN")}
    						</Caption>
    						<Info>
    							{org.aux ? org.aux.ean : null}
    						</Info>
    					</ItemGrid>
    				</Grid>
    			}
    		/>
    	)
	}
}

export default OrgDetails
