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
import withLocalization from "components/Localization/T";

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
		const { t } = this.props
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
											<h3>{t("sidebar.projects")}</h3>
											<div className={this.props.classes.section}>{t("dashboard.projects.s1")}</div>
											<div className={this.props.classes.section}>{t("dashboard.projects.s2")}</div>
										</div>
									</ItemGrid>
									<ItemGrid xs>
										<div className={this.props.classes.typo}>
											<h3>{t("sidebar.devices")}</h3>
											<div className={this.props.classes.section}>{t("dashboard.devices.s1")}</div>
											<div className={this.props.classes.section}>{t("dashboard.devices.s2")}</div>
										</div>
									</ItemGrid>
									<ItemGrid xs>
										<div className={this.props.classes.typo}>
											<h3>Data</h3>
											<div className={this.props.classes.section}>{t("dashboard.data.s1")}</div>
											<div className={this.props.classes.section}>{t("dashboard.data.s2")}</div>
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

export default withLocalization()(withStyles(dashboardStyle)(Dashboard));
