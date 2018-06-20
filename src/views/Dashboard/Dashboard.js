import React from "react";
import PropTypes from "prop-types";
import {
	Store,
	InfoOutline,
	LocalOffer,
	Update,
	Accessibility,
	ViewModule
} from "@material-ui/icons";
import { withStyles, Grid } from "@material-ui/core";

import {
	StatsCard,
	RegularCard,
	ItemGrid
} from "components";


import dashboardStyle from "assets/jss/material-dashboard-react/dashboardStyle";
import { getAllProjects } from "../../variables/data";

class Dashboard extends React.Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
			 value: 0,
			projects: [],
			devices: 0
	  }
		props.setHeader("Dashboard")

	}
	

	componentDidMount = async () => {
		let projects = await getAllProjects()
		let devices = 0;
		projects.forEach(p => {
			return p.devices ? devices = devices + p.devices.length : ''
		});
		this.setState({ projects: projects, devices: devices })
	}

	handleChange = (value) => {
		this.setState({ value });
	};

	handleChangeIndex = index => {
		this.setState({ value: index });
	};
	render() {
		return (
			<React.Fragment>
				<Grid container>
					<ItemGrid xs={12}>
						<RegularCard
							cardTitle={"Senti Console"}
							cardSubtitle={"Senti is an open source IoT project that will make cities smarter through intelligent data collection and open API's."}
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
					<ItemGrid xs={4} >
						<StatsCard
							icon={ViewModule}
							iconColor="green"
							title="Projects"
							description={this.state.projects.length}
							small="total"
							noStats
						/>
					</ItemGrid>
					<ItemGrid xs={4} >
						<StatsCard
							icon={Store}
							iconColor="green"
							title="Devices"
							description={this.state.devices}
							noStats
						/>
					</ItemGrid>
					<ItemGrid xs={4} >
						<StatsCard
							icon={InfoOutline}
							iconColor="red"
							title="Fixed Issues"
							description="75"
							statIcon={LocalOffer}
							statText="Tracked from Github"
						/>
					</ItemGrid>
					<ItemGrid xs={4}>
						<StatsCard
							icon={Accessibility}
							iconColor="blue"
							title="Followers"
							description="+245"
							statIcon={Update}
							statText="Just Updated"
						/>
					</ItemGrid>
				</Grid>
			</React.Fragment>
		);
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
