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
import { withStyles, Grid } from "material-ui";

import {
	StatsCard,
	RegularCard,
	ItemGrid
} from "components";


import dashboardStyle from "assets/jss/material-dashboard-react/dashboardStyle";
import { getAllProjects } from "../../variables/data";

class Dashboard extends React.Component {
	state = {
		value: 0,
		projects: []
	};
	componentDidMount = async () => {
		var projects = await getAllProjects()
		this.setState({ projects: projects })
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
				<RegularCard

					cardTitle={"Senti Cloud"}
					cardSubtitle={"API and React components for building Dashboard and tools for Senti-in-a-Box devices"}
					content={
						<div>
							<Grid container>
								<ItemGrid xs>
									<div className={this.props.classes.typo}>
										<h3>Declarative API</h3>
										<div className={this.props.classes.section}>ODEUM Code Help exhibits a simple NodeJS API for CRUD based persistance of help items and help indexes for an ODEUM Code App.</div>
										<div className={this.props.classes.section}>Create, Read, Update and Delete help items for a specific App ID and access the API through React components.</div>
									</div>
								</ItemGrid>
								<ItemGrid xs>
									<div className={this.props.classes.typo}>
										<h3>React Components</h3>
										<div className={this.props.classes.section}>ODEUM Code Help implements React components for creating, listing, editing and deleting help items for a designated ODEUM Web App.</div>
										<div className={this.props.classes.section}>Get ODEUM Code Help before your neighbor calls for help somewhere else.</div>
									</div>
								</ItemGrid>
								<ItemGrid xs>
									<div className={this.props.classes.typo}>
										<h3>Simple Form Setup</h3>
										<div className={this.props.classes.section}>Using our simple Form component you'll be on track with creating forms in minutes.</div>
										<div className={this.props.classes.section}>Creating fast and simple forms in React has never been easier.</div>
									</div>
								</ItemGrid>
							</Grid>
						</div>
					}>
				</RegularCard>
				<Grid container>
					<ItemGrid xs={12} sm={6} md={3}>
						<StatsCard
							icon={ViewModule}
							iconColor="green"
							title="Projects"
							description={this.state.projects.length}
							small="total"
							noStats
						/>
					</ItemGrid>
					<ItemGrid xs={12} sm={6} md={3}>
						<StatsCard
							icon={Store}
							iconColor="green"
							title="Devices"
							description="1"
							noStats
						/>
					</ItemGrid>
					<ItemGrid xs={12} sm={6} md={3}>
						<StatsCard
							icon={InfoOutline}
							iconColor="red"
							title="Fixed Issues"
							description="75"
							statIcon={LocalOffer}
							statText="Tracked from Github"
						/>
					</ItemGrid>
					<ItemGrid xs={12} sm={6} md={3}>
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
			// <Paper>

			// 	<Typography variant="headline" component="h2">
			// 		Senti Cloud
			// 	</Typography>
			// 	<Typography variant="headline" component="h3">
			// 		API and React components for building Dashboard and tools for Senti-in-a-Box devices
			// 	 </Typography>
			// 	<Grid container>
			// 		<ItemGrid xs={12} sm={12} md={12}>
			// 		</ItemGrid>
			// 	</Grid>
			// </Paper>
		);
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
