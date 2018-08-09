import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { InfoCard, ItemGrid, DSelect } from 'components';
import { Build } from '@material-ui/icons'
import { Grid, ListItem, List, ListItemText, withStyles } from '@material-ui/core';
import { settingsStyles } from 'assets/jss/components/settings/settingsStyles';
import DInput from 'components/CustomInput/DInput';

//Method ( Time/ Hits) + how many minutes/hits
//Notifications
//
class CalibrationSettings extends Component {
	static propTypes = {
	}

	changeCalType = e => this.props.changeCalType(e.target.value)
	chnageCount = val => this.props.changeCount(val)

	render() {
		const { classes, t } = this.props
		const { calibration, count } = this.props
		const calibrations = [
			{ value: 0, label: t("settings.calibration.time") },
			{ value: 1, label: t("settings.calibration.count") }
		]
		const counts = [
			{ value: 0, label: 200 },
			{ value: 1, label: 10 },
			// { value: 2, label: 20 },
			// { value: 3, label: 30 },
			// { value: 4, label: 40 },
			// { value: 5, label: 50 },
			// { value: 6, label: 60 },
		]
		return (
			<InfoCard
				noExpand
				avatar={<Build />}
				title={"Calibration"}
				content={
					<Grid container>
						<List className={classes.list}>
							<ListItem divider>
								<ItemGrid container zeroMargin noPadding alignItems={"center"}>
									<ListItemText>{t("settings.calibration.text")}</ListItemText>
									<DSelect menuItems={calibrations} value={calibration} func={this.changeCalType} />
								</ItemGrid>
							</ListItem>
							<ListItem divider>
								<ItemGrid container zeroMargin noPadding alignItems={"center"}>
									<ListItemText>{t("settings.trp")}</ListItemText>
									<DInput menuItems={counts} value={count} func={this.changeCount} />
								</ItemGrid>
							</ListItem>
							<ListItem divider>
								<ItemGrid container zeroMargin noPadding alignItems={"center"}>
									<ListItemText>{t("settings.sideBarLoc")}</ListItemText>
									{/* <DSelect menuItems={sideBarLocs} value={sideBarLoc} func={this.changeSideBarLoc} /> */}
								</ItemGrid>
							</ListItem>
							<ListItem >
								<ItemGrid container zeroMargin noPadding alignItems={"center"}>
									<ListItemText>{t("settings.theme")}</ListItemText>
									{/* <DSelect menuItems={themes} value={theme} func={this.changeTheme} /> */}
								</ItemGrid>
							</ListItem>
						</List>
					</Grid>
				}
			/>
		)
	}
}

export default withStyles(settingsStyles)(CalibrationSettings)