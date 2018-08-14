import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles, Button } from "@material-ui/core";

import {
	ItemGrid
} from "components";

import dashboardStyle from "assets/jss/material-dashboard-react/dashboardStyle";
import { getAllProjects } from "../../variables/dataProjects";
import GridContainer from "components/Grid/GridContainer";
import withLocalization from "components/Localization/T";
import DiscoverSenti from './DiscoverSenti';
import MediaCard from 'components/Cards/MediaCard';

import imgs from 'assets/img/Squared'
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
	renderAction = (text, func, right) => {
		const { t } = this.props
		return <Button size={"small"} color={"primary"} onClick={func} style={right ? { marginLeft: "auto" } : null}>{t(text)}</Button>
	}

	render() {
		const { classes, t } = this.props
		return (
			<Fragment>
				<DiscoverSenti t={t} />
				<GridContainer spacing={8}>
					<GridContainer className={classes.centerGrid} justify={"center"}>
						{/* <ItemGrid xs={12} sm={4} noMargin> */}
						<MediaCard
							img={imgs.hosting}
							header={t("dashboard.cardHeaders.onSiteSetup")}
							content={t("dashboard.cardContent.onSiteSetup")}
							leftAction={this.renderAction("actions.learnMore", () => alert("Hello"))}
							rightAction={this.renderAction("actions.startNow", () => alert("Hello"), true)}
						/>
						{/* </ItemGrid> */}
						{/* <ItemGrid xs={12} sm={4} noMargin> */}
						<MediaCard
							img={imgs.storage}
							header={t("dashboard.cardHeaders.projects")}
							content={t("dashboard.cardContent.projects")}
							leftAction={this.renderAction("actions.learnMore", () => alert("bing"))}
							rightAction={this.renderAction("actions.startNow", () => alert("Hello"), true)}
						/>
						{/* </ItemGrid> */}
						{/* <ItemGrid xs={12} sm={4} noMargin> */}
						<MediaCard
							img={imgs.devices}
							header={t("dashboard.cardHeaders.devices")}
							content={t("dashboard.cardContent.devices")}
							leftAction={this.renderAction("actions.learnMore", () => alert("Hello"))}
							rightAction={this.renderAction("actions.startNow", () => alert("Hello"), true)}
						/>

						{/* </ItemGrid> */}
						{/* <ItemGrid xs={12} sm={4} noMargin> */}
						<MediaCard
							img={imgs.data}
							header={t("dashboard.cardHeaders.data")}
							content={t("dashboard.cardContent.data")}
							leftAction={this.renderAction("actions.learnMore", () => alert("Hello"))}
							rightAction={this.renderAction("actions.startNow", () => alert("Hello"), true)}
						/>
						{/* </ItemGrid> */}
						{/* <ItemGrid xs={12} sm={4} noMargin> */}
						<MediaCard
							img={imgs.users}
							header={t("dashboard.cardHeaders.users")}
							content={t("dashboard.cardContent.users")}
							leftAction={this.renderAction("actions.learnMore", () => alert("Hello"))}
							rightAction={this.renderAction("actions.startNow", () => alert("Hello"), true)}
						/>
						{/* </ItemGrid> */}
						{/* <ItemGrid xs={12} sm={4} noMargin> */}
						<MediaCard
							img={imgs.settings}
							header={t("dashboard.cardHeaders.settings")}
							content={t("dashboard.cardContent.settings")}
							leftAction={this.renderAction("actions.learnMore", () => alert("Hello"))}
							rightAction={this.renderAction("actions.startNow", () => alert("Hello"), true)}
						/>
						{/* </ItemGrid> */}
						{/* <ItemGrid xs={12} sm={4} noMargin> */}
						<MediaCard
							img={imgs.notifications}
							header={t("dashboard.cardHeaders.notifications")}
							content={t("dashboard.cardContent.notifications")}
							leftAction={this.renderAction("actions.learnMore", () => alert("Hello"))}
							rightAction={this.renderAction("actions.startNow", () => alert("Hello"), true)}
						/>
						{/* </ItemGrid> */}
						{/* <ItemGrid xs={12} sm={4} noMargin> */}
						<MediaCard
							img={imgs.predictions}
							header={t("dashboard.cardHeaders.alerts")}
							content={t("dashboard.cardContent.alerts")}
							leftAction={this.renderAction("actions.learnMore", () => alert("Hello"))}
							rightAction={this.renderAction("actions.startNow", () => alert("Hello"), true)}
						/>
						{/* </ItemGrid> */}
						{/* <ItemGrid xs={12} sm={4} noMargin> */}
						<MediaCard
							img={imgs.sharing}
							header={t("dashboard.cardHeaders.api")}
							content={t("dashboard.cardContent.api")}
							leftAction={this.renderAction("actions.learnMore", () => alert("Hello"))}
							rightAction={this.renderAction("actions.startNow", () => alert("Hello"), true)}
						/>
						{/* </ItemGrid> */}
					</GridContainer>
				</GridContainer>
			</Fragment>
		);
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withLocalization()(withStyles(dashboardStyle)(Dashboard));
