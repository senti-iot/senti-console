import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { InfoCard, ItemGrid } from 'components';
import { Laptop } from '@material-ui/icons'
import { Grid, ListItem, List, ListItemText, withStyles, FormControl, Select, Input, MenuItem } from '@material-ui/core';
// Discover Senti
//List rows per page on Tables
// Menu Location
// Dark Mode
// Themes?
const styles = theme => ({
	root: {
		width: '100%',
	},
	formControl: {
		marginTop: 16,
		marginBottom: 8,
		minWidth: 208,
		flexGrow: 1,
		maxWidth: 208
	},
});
class DisplaySettings extends Component {
	
	static propTypes = {
		language: PropTypes.string.isRequired
	}
	changeLang = (e) => {
		this.props.changeLanguage(e.target.value)
	}
	changeTRP = (e) => {
		this.props.changeTRP(e.target.value)
	}
	changeTheme = (e) => {
		this.props.changeTheme(e.target.value)
	}
	renderSelect = (menuItems, value, func) => {
		const { classes } = this.props
		return <FormControl className={this.props.classes.formControl}>
			{/* <InputLabel htmlFor="streetType-helper" classes={{ root: classes.label }}>{t("devices.fields.locType")}</InputLabel> */}
			<Select
				value={value}
				onChange={func}
				input={<Input name="streetType" id="streetType-helper" classes={{ root: classes.label }} />}
			>
				{menuItems.map((m, i) => {
					return <MenuItem key={i} value={m.value}>
						{m.label}
					</MenuItem>
				})}
				})}
			</Select>
		</FormControl>
	}

	render() {
		const { language, trp, theme, classes, t  } = this.props
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
		return (
			<InfoCard
				noExpand
				avatar={<Laptop />}
				title={"Display"}
				content={
					<Grid container>
						<List className={classes.root}>
							<ListItem divider>
								<ItemGrid container zeroMargin noPadding alignItems={"center"}>
									<ListItemText>{t("settings.language")}</ListItemText>
									{this.renderSelect(languages, language, this.changeLang)}
								</ItemGrid>
							</ListItem>
							<ListItem divider>
								<ItemGrid container zeroMargin noPadding alignItems={"center"}>
									<ListItemText>{t("settings.trp")}</ListItemText>
									{this.renderSelect(trps, trp, this.changeTRP)}
								</ItemGrid>
							</ListItem>
							<ListItem divider>
								<ItemGrid container zeroMargin noPadding alignItems={"center"}>
									<ListItemText>{t("settings.theme")}</ListItemText>
									{this.renderSelect(themes, theme, this.changeTheme)}
								</ItemGrid>
							</ListItem>
						</List>
					</Grid>
				}
			/>
		)
	}
}
export default withStyles(styles)(DisplaySettings)