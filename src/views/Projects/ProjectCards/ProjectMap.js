import React, { Component, Fragment } from 'react'
import { InfoCard, Caption, Dropdown, ItemG } from 'components';
import { Map, Layers } from 'variables/icons'
import { Grid, Checkbox, MenuItem, Menu, IconButton } from '@material-ui/core';
import OpenStreetMap from 'components/Map/OpenStreetMap';

export default class ProjectMap extends Component {
	constructor(props) {
		super(props)

		this.state = {
			heatMap: false,
			actionAnchorVisibility: null,
			mapTheme: props.mapTheme
		}
	}
	visibilityOptions = [
		{ id: 0, label: this.props.t("map.themes.0") },
		{ id: 1, label: this.props.t("map.themes.1") },
		{ id: 2, label: this.props.t("map.themes.2") },
		{ id: 3, label: this.props.t("map.themes.3") },
		{ id: 4, label: this.props.t("map.themes.4") },
		{ id: 5, label: this.props.t("map.themes.5") },
		{ id: 6, label: this.props.t("map.themes.6") }
	]
	handleVisibility = e => (event) => {
		if (event)
			event.preventDefault()
		this.setState({ mapTheme: e, actionAnchorVisibility: null })
	}
	handleOpenMenu = e => {
		this.setState({ actionAnchorVisibility: e.currentTarget })
	}
	handleCloseMenu = e => {
		this.setState({ actionAnchorVisibility: null })
	}
	renderMenu = () => {
		const { t } = this.props
		const { actionAnchorVisibility, mapTheme } = this.state
		return <Fragment>
			<ItemG>
				<IconButton title={'Map layer'} variant={'fab'} onClick={this.handleOpenMenu}>
					<Layers />
				</IconButton>
				<Menu
					id='long-menu2'
					anchorEl={actionAnchorVisibility}
					open={Boolean(actionAnchorVisibility)}
					onClose={this.handleCloseMenu}
					PaperProps={{
						style: {
							minWidth: 250
						}
					}}>
					{this.visibilityOptions.map(op => {
						return <MenuItem key={op.id} value={op.id} button onClick={this.handleVisibility(op.id)} selected={mapTheme === op.id ? true : false}>
							{op.label}
						</MenuItem>
					})}
					{/* </List> */}
				</Menu>
			</ItemG><Dropdown menuItems={
				[{ label: t('actions.heatMap'), icon: <Checkbox checked={this.state.heatMap} />, func: () => this.setState({ heatMap: !this.state.heatMap }) }, ]
			} />
		</Fragment>
	}
	render() {
		const { devices, t } = this.props
		const { mapTheme } = this.state

		return (
			<InfoCard
				title={t('devices.cards.map')}
				subheader={`Heatmap: ${this.state.heatMap ? t('actions.on') : t('actions.off')}`}
				expanded={true}
				avatar={<Map />}
				topAction={this.renderMenu()}
				hiddenContent={
					<Grid container justify={'center'}>
						{devices.length > 0 ? <OpenStreetMap t={t} mapTheme={mapTheme} heatMap={this.state.heatMap} heatData={this.props.heatData} markers={devices} /> : <Caption>{t('projects.noAvailableDevices')}</Caption>}
					</Grid>
				} />

		)
	}
}
