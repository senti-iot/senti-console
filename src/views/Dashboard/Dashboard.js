import React, { Fragment } from "react"
import PropTypes from "prop-types"
import { withStyles, Button, Hidden } from "@material-ui/core"

import dashboardStyle from "assets/jss/material-dashboard-react/dashboardStyle"
import GridContainer from "components/Grid/GridContainer"
import withLocalization from "components/Localization/T"
import DiscoverSenti from './DiscoverSenti'
import MediaCard from 'components/Cards/MediaCard'
import { connect } from 'react-redux'
import imgs from 'assets/img/Squared'
import { ItemG } from 'components';

class Dashboard extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			value: 0,
			projects: [],
			devices: 0
		}
		props.setHeader("Senti.Cloud", false, '', "dashboard")
	}


	componentDidMount = async () => {
		
	}

	componentWillUnmount = () => {
		this._isMounted = 0
	}

	handleChange = (value) => {
		this.setState({ value })
	}

	handleChangeIndex = index => {
		this.setState({ value: index })
	}

	renderAction = (text, func, right) => {
		const { t } = this.props
		return <Button size={"small"} color={"primary"} onClick={func} style={right ? { marginLeft: "auto" } : null}>{t(text)}</Button>
	}

	render() {
		const { discoverSenti, t } = this.props
		return (
			<Fragment>
				{discoverSenti ? <DiscoverSenti t={t} /> : null}
				<Hidden smDown>
					<GridContainer spacing={8} justify={"center"}>
						<ItemG justify xs={4}><MediaCard
							img={imgs.hosting}
							header={t("dashboard.cardHeaders.onSiteSetup")}
							content={t("dashboard.cardContent.onSiteSetup")}
							leftAction={this.renderAction("actions.learnMore", () => alert(t("dialogs.warnings.wip")))}
							rightAction={this.renderAction("actions.startNow", () => alert(t("dialogs.warnings.wip")), true)}
						/></ItemG>
						<ItemG justify xs={4}><MediaCard
							img={imgs.storage}
							header={t("dashboard.cardHeaders.projects")}
							content={t("dashboard.cardContent.projects")}
							leftAction={this.renderAction("actions.learnMore", () => alert(t("dialogs.warnings.wip")))}
							rightAction={this.renderAction("actions.startNow", () => alert(t("dialogs.warnings.wip")), true)}
						/></ItemG>
						<ItemG justify xs={4}><MediaCard
							img={imgs.devices}
							header={t("dashboard.cardHeaders.devices")}
							content={t("dashboard.cardContent.devices")}
							leftAction={this.renderAction("actions.learnMore", () => alert(t("dialogs.warnings.wip")))}
							rightAction={this.renderAction("actions.startNow", () => alert(t("dialogs.warnings.wip")), true)}
						/></ItemG>
						<ItemG justify xs={4}><MediaCard
							img={imgs.data}
							header={t("dashboard.cardHeaders.data")}
							content={t("dashboard.cardContent.data")}
							leftAction={this.renderAction("actions.learnMore", () => alert(t("dialogs.warnings.wip")))}
							rightAction={this.renderAction("actions.startNow", () => alert(t("dialogs.warnings.wip")), true)}
						/></ItemG>
						<ItemG justify xs={4}>	<MediaCard
							img={imgs.users}
							header={t("dashboard.cardHeaders.users")}
							content={t("dashboard.cardContent.users")}
							leftAction={this.renderAction("actions.learnMore", () => alert(t("dialogs.warnings.wip")))}
							rightAction={this.renderAction("actions.startNow", () => alert(t("dialogs.warnings.wip")), true)}
						/></ItemG>
						<ItemG justify xs={4}>	<MediaCard
							img={imgs.settings}
							header={t("dashboard.cardHeaders.settings")}
							content={t("dashboard.cardContent.settings")}
							leftAction={this.renderAction("actions.learnMore", () => alert(t("dialogs.warnings.wip")))}
							rightAction={this.renderAction("actions.startNow", () => alert(t("dialogs.warnings.wip")), true)}
						/></ItemG>
						<ItemG justify xs={4}>	<MediaCard
							img={imgs.notifications}
							header={t("dashboard.cardHeaders.notifications")}
							content={t("dashboard.cardContent.notifications")}
							leftAction={this.renderAction("actions.learnMore", () => alert(t("dialogs.warnings.wip")))}
							rightAction={this.renderAction("actions.startNow", () => alert(t("dialogs.warnings.wip")), true)}
						/></ItemG>
						<ItemG justify xs={4}>	<MediaCard
							img={imgs.predictions}
							header={t("dashboard.cardHeaders.alerts")}
							content={t("dashboard.cardContent.alerts")}
							leftAction={this.renderAction("actions.learnMore", () => alert(t("dialogs.warnings.wip")))}
							rightAction={this.renderAction("actions.startNow", () => alert(t("dialogs.warnings.wip")), true)}
						/></ItemG>
						<ItemG justify xs={4}>	<MediaCard
							img={imgs.sharing}
							header={t("dashboard.cardHeaders.api")}
							content={t("dashboard.cardContent.api")}
							leftAction={this.renderAction("actions.learnMore", () => alert(t("dialogs.warnings.wip")))}
							rightAction={this.renderAction("actions.startNow", () => alert(t("dialogs.warnings.wip")), true)}
						/></ItemG>
					</GridContainer>
				</Hidden>
				<Hidden mdUp>
					<GridContainer spacing={8} justify={"center"}>

						<ItemG justify xs={12}><MediaCard
							img={imgs.hosting}
							header={t("dashboard.cardHeaders.onSiteSetup")}
							content={t("dashboard.cardContent.onSiteSetup")}
							leftAction={this.renderAction("actions.learnMore", () => alert(t("dialogs.warnings.wip")))}
							rightAction={this.renderAction("actions.startNow", () => alert(t("dialogs.warnings.wip")), true)}
						/></ItemG>
						<ItemG justify xs={12}><MediaCard
							img={imgs.storage}
							header={t("dashboard.cardHeaders.projects")}
							content={t("dashboard.cardContent.projects")}
							leftAction={this.renderAction("actions.learnMore", () => alert(t("dialogs.warnings.wip")))}
							rightAction={this.renderAction("actions.startNow", () => alert(t("dialogs.warnings.wip")), true)}
						/></ItemG>
						<ItemG justify xs={12}><MediaCard
							img={imgs.devices}
							header={t("dashboard.cardHeaders.devices")}
							content={t("dashboard.cardContent.devices")}
							leftAction={this.renderAction("actions.learnMore", () => alert(t("dialogs.warnings.wip")))}
							rightAction={this.renderAction("actions.startNow", () => alert(t("dialogs.warnings.wip")), true)}
						/></ItemG>
						<ItemG justify xs={12}><MediaCard
							img={imgs.data}
							header={t("dashboard.cardHeaders.data")}
							content={t("dashboard.cardContent.data")}
							leftAction={this.renderAction("actions.learnMore", () => alert(t("dialogs.warnings.wip")))}
							rightAction={this.renderAction("actions.startNow", () => alert(t("dialogs.warnings.wip")), true)}
						/></ItemG>
						<ItemG justify xs={12}>	<MediaCard
							img={imgs.users}
							header={t("dashboard.cardHeaders.users")}
							content={t("dashboard.cardContent.users")}
							leftAction={this.renderAction("actions.learnMore", () => alert(t("dialogs.warnings.wip")))}
							rightAction={this.renderAction("actions.startNow", () => alert(t("dialogs.warnings.wip")), true)}
						/></ItemG>
						<ItemG justify xs={12}>	<MediaCard
							img={imgs.settings}
							header={t("dashboard.cardHeaders.settings")}
							content={t("dashboard.cardContent.settings")}
							leftAction={this.renderAction("actions.learnMore", () => alert(t("dialogs.warnings.wip")))}
							rightAction={this.renderAction("actions.startNow", () => alert(t("dialogs.warnings.wip")), true)}
						/></ItemG>
						<ItemG justify xs={12}>	<MediaCard
							img={imgs.notifications}
							header={t("dashboard.cardHeaders.notifications")}
							content={t("dashboard.cardContent.notifications")}
							leftAction={this.renderAction("actions.learnMore", () => alert(t("dialogs.warnings.wip")))}
							rightAction={this.renderAction("actions.startNow", () => alert(t("dialogs.warnings.wip")), true)}
						/></ItemG>
						<ItemG justify xs={12}>	<MediaCard
							img={imgs.predictions}
							header={t("dashboard.cardHeaders.alerts")}
							content={t("dashboard.cardContent.alerts")}
							leftAction={this.renderAction("actions.learnMore", () => alert(t("dialogs.warnings.wip")))}
							rightAction={this.renderAction("actions.startNow", () => alert(t("dialogs.warnings.wip")), true)}
						/></ItemG>
						<ItemG justify xs={12}>	<MediaCard
							img={imgs.sharing}
							header={t("dashboard.cardHeaders.api")}
							content={t("dashboard.cardContent.api")}
							leftAction={this.renderAction("actions.learnMore", () => alert(t("dialogs.warnings.wip")))}
							rightAction={this.renderAction("actions.startNow", () => alert(t("dialogs.warnings.wip")), true)}
						/></ItemG>
					</GridContainer>
				</Hidden>
			</Fragment>
		)
	}
}

Dashboard.propTypes = {
	classes: PropTypes.object.isRequired
}
const mapStateToProps = (state) => ({
	discoverSenti: state.settings.discSentiVal
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(withLocalization()(withStyles(dashboardStyle)(Dashboard)))