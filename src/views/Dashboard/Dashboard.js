import React from "react";
import PropTypes from "prop-types";
import {
	StoreRounded as Store,
	InfoOutlined,
	LocalOfferRounded as LocalOffer,
	UpdateRounded as Update,
	AccessibilityRounded as Accessibility,
	ViewModuleRounded as ViewModule
} from "@material-ui/icons";
import { withStyles, Grid } from "@material-ui/core";

import {
	StatsCard,
	RegularCard,
	ItemGrid
} from "components";


import dashboardStyle from "assets/jss/material-dashboard-react/dashboardStyle";
import { getAllProjects } from "../../variables/dataProjects";
import GridContainer from "components/Grid/GridContainer";

class Dashboard extends React.Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
			 value: 0,
			projects: [],
			devices: 0
	  }
		props.setHeader("Console", false)

	}
	setStateAsync(state) {
		return new Promise(resolve => {
			this.setState(state, resolve);
		});
	}

	componentDidMount = async () => {
		let projects = await getAllProjects()
		let devices = 0;
		projects.forEach(p => {
			return p.devices ? devices = devices + p.devices.length : ''
		});
		await this.setStateAsync({ projects: projects, devices: devices })
	}
	componentWillUnmount = () => {
	  this._isMounted = 0
	}
	
	handleChange = (value) => {
		this.setState({ value });
	};

	handleChangeIndex = index => {
		this.setState({ value: index });
	};
	render() {
		return (
			<GridContainer>
				<ItemGrid xs={12}>
					<RegularCard
						cardTitle={"Senti Cloud Console"}
						cardSubtitle={"Senti Cloud Console lets you control and manage all your Senti-in-a-Box Devices."}
						content={
							<div>
								<Grid container>
									<ItemGrid xs>
										<div className={this.props.classes.typo}>
											<h3>Projects</h3>
											<div className={this.props.classes.section}>Projects help you encapsulate Senti devices for at specific task and data collection use case.</div>
											<div className={this.props.classes.section}>You can create as many projects as you like, and you can bundle devices from all available locations.</div>
										</div>
									</ItemGrid>
									<ItemGrid xs>
										<div className={this.props.classes.typo}>
											<h3>Devices</h3>
											<div className={this.props.classes.section}>Devices are the actual physical device deployed into your environment. </div>
											<div className={this.props.classes.section}>Here you can name, configure and set up the devices used in your projects.</div>
										</div>
									</ItemGrid>
									<ItemGrid xs>
										<div className={this.props.classes.typo}>
											<h3>Data</h3>
											<div className={this.props.classes.section}>Viewing your data can be done through lists, cards and different types of graphs.</div>
											<div className={this.props.classes.section}>You can create reports and export data with very few clicks.</div>
										</div>
									</ItemGrid>
								</Grid>
							</div>
						}>
					</RegularCard>
				</ItemGrid>
				<ItemGrid container noPadding>
					<ItemGrid xs={12} sm={6} noMargin>
						<StatsCard
							icon={ViewModule}
							iconColor="green"
							title="Projects"
							description={this.state.projects.length}
							small="total"
							noStats
						/>
					</ItemGrid>
					<ItemGrid xs={12} sm={6} noMargin>
						<StatsCard
							icon={Store}
							iconColor="green"
							title="Devices"
							description={this.state.devices}
							noStats
						/>
					</ItemGrid>
					<ItemGrid xs={12} sm={6} noMargin>
						<StatsCard
							icon={InfoOutlined}
							iconColor="red"
							title="Fixed Issues"
							description="75"
							statIcon={LocalOffer}
							statText="Tracked from Github"
						/>
					</ItemGrid>
					<ItemGrid xs={12} sm={6} noMargin>
						<StatsCard
							icon={Accessibility}
							iconColor="blue"
							title="Followers"
							description="+245"
							statIcon={Update}
							statText="Just Updated"
						/>
					</ItemGrid>
				</ItemGrid>
			</GridContainer>
		);
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
