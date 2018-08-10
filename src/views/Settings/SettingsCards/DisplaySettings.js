import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { InfoCard, ItemGrid, DSelect } from 'components';
import { Laptop } from '@material-ui/icons'
import { Grid, ListItem, List, ListItemText, withStyles } from '@material-ui/core';
import { settingsStyles } from 'assets/jss/components/settings/settingsStyles';
// Discover Senti
//List rows per page on Tables
// Menu Location
// Dark Mode
// Themes?

class DisplaySettings extends Component {

	static propTypes = {
		language: PropTypes.string.isRequired
	}
	
	changeLang = (e) => this.props.changeLanguage(e.target.value)
	changeTRP = (e) => this.props.changeTRP(e.target.value)
	changeTheme = (e) => this.props.changeTheme(e.target.value)
	changeSideBarLoc = (e) => this.props.changeSideBarLoc(e.target.value)
	changeDiscoverSenti = e => this.props.changeDiscoverSenti(e.target.value)

	render() {
		const { language, trp, sideBar, discSentiVal, theme, classes, t } = this.props
		let discSenti = [
			{ value: 1, label: t("actions.yes") },
			{ value: 0, label: t("actions.no") }
		]
		let languages = [
			{ value: "en", label: t("settings.languages.en") },
			{ value: "dk", label: t("settings.languages.dk") }
		]
		let themes = [
			{ value: "dark", label: t("settings.themes.dark") },
			{ value: "light", label: t("settings.themes.light") }
		]
		let trps = [
			{ value: 5, label: 5 },
			{ value: 10, label: 10 },
			{ value: 25, label: 25 },
			{ value: 50, label: 50 },
			{ value: 100, label: 100 }
		]
		let sideBarLocs = [
			{ value: 0, label: t("settings.sideBarLeft") },
			{ value: 1, label: t("settings.sideBarRight") }
		]
		return (
			<InfoCard
				noExpand
				avatar={<Laptop />}
				title={"Display"}
				content={
					<Grid container>
						<List className={classes.list}>
							<ListItem divider>
								<ItemGrid container zeroMargin noPadding alignItems={"center"}>
									<ListItemText>{t("settings.discoverSenti")}</ListItemText>
									<DSelect menuItems={discSenti} value={discSentiVal} func={this.changeDiscoverSenti} />
								</ItemGrid>
							</ListItem>
							<ListItem divider>
								<ItemGrid container zeroMargin noPadding alignItems={"center"}>
									<ListItemText>{t("settings.language")}</ListItemText>
									<DSelect menuItems={languages} value={language} func={this.changeLang} />
								</ItemGrid>
							</ListItem>
							<ListItem divider>
								<ItemGrid container zeroMargin noPadding alignItems={"center"}>
									<ListItemText>{t("settings.trp")}</ListItemText>
									<DSelect menuItems={trps} value={trp} func={this.changeTRP} />
								</ItemGrid>
							</ListItem>
							<ListItem divider>
								<ItemGrid container zeroMargin noPadding alignItems={"center"}>
									<ListItemText>{t("settings.sideBarLoc")}</ListItemText>
									<DSelect menuItems={sideBarLocs} value={sideBar} func={this.changeSideBarLoc} />
								</ItemGrid>
							</ListItem>
							<ListItem >
								<ItemGrid container zeroMargin noPadding alignItems={"center"}>
									<ListItemText>{t("settings.theme")}</ListItemText>
									<DSelect menuItems={themes} value={theme} func={this.changeTheme} />
								</ItemGrid>
							</ListItem>
						</List>
					</Grid>
				}
			/>
		)
	}
}
export default withStyles(settingsStyles)(DisplaySettings)