import React, { Component, Fragment } from 'react'
import { InfoCard, Caption, Dropdown, ItemG } from 'components';
import { Map, Layers, DeviceHub, WhatsHot } from 'variables/icons'
import { Grid, /* Checkbox,  */MenuItem, Menu, IconButton } from '@material-ui/core';
import OpenStreetMap from 'components/Map/OpenStreetMap';
import { connect } from 'react-redux'
import { changeMapTheme, changeHeatMap } from 'redux/appState';

class ProjectMap extends Component {
	constructor(props) {
		super(props)

		this.state = {
			actionAnchorVisibility: null,
		}
	}
	visibilityOptions = [
		{ id: 0, label: this.props.t("map.themes.0") },
		{ id: 1, label: this.props.t("map.themes.1") },
		{ id: 2, label: this.props.t("map.themes.2") },
		{ id: 3, label: this.props.t("map.themes.3") },
		{ id: 4, label: this.props.t("map.themes.4") },
		{ id: 5, label: this.props.t("map.themes.5") },
		{ id: 6, label: this.props.t("map.themes.6") },
		{ id: 7, label: this.props.t('map.themes.7') }
	]
	handleVisibility = e => (event) => {
		if (event)
			event.preventDefault()
		this.props.changeMapTheme(e)
		this.setState({ actionAnchorVisibility: null })
	}
	handleOpenMenu = e => {
		this.setState({ actionAnchorVisibility: e.currentTarget })
	}
	handleCloseMenu = e => {
		this.setState({ actionAnchorVisibility: null })
	}
	renderMenu = () => {
		const { t, mapTheme } = this.props
		const { actionAnchorVisibility } = this.state
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
			</ItemG>
			<Dropdown menuItems={[
				{ label: t('actions.heatMap'), selected: this.props.heatMap, icon: <WhatsHot style={{ padding: "0px 12px" }}/>, func: () => this.props.changeHeatMap( !this.props.heatMap ) },
				{ label: t('actions.goToDevice'), icon: <DeviceHub style={{ padding: "0px 12px" }} />, func: () => this.flyToMarkers() } ]
			} />
		</Fragment>
	}
	getRef = (ref) => {
		this.map = ref
	}
	flyToMarkers = () => {
		const { devices } = this.props
		if (this.map) {
			this.map.leafletElement.flyToBounds(devices.map(d => d.lat && d.long ? [d.lat, d.long] : null))
		}
	}
	render() {
		const { devices, t, heatMap, mapTheme, heatData } = this.props
		return (
			<InfoCard
				noPadding
				title={t('devices.cards.map')}
				subheader={`Heatmap: ${heatMap ? t('actions.on') : t('actions.off')}`}
				expanded={true}
				avatar={<Map />}
				topAction={this.renderMenu()}
				hiddenContent={
					<Grid container justify={'center'}>
						{devices.length > 0 ?
							<OpenStreetMap
								iRef={this.getRef}
								t={t}
								mapTheme={mapTheme}
								heatMap={heatMap}
								heatData={heatData}
								markers={devices} /> : <Caption>{t('projects.noAvailableDevices')}</Caption>}
					</Grid>
				} />

		)
	}
}
const mapStateToProps = (state) => ({
	mapTheme: state.appState.mapTheme ? state.appState.mapTheme : state.settings.mapTheme,
	heatMap: state.appState.heatMap ? state.appState.heatMap : false
})

const mapDispatchToProps = (dispatch) => ({
	changeMapTheme: value => dispatch(changeMapTheme(value)),
	changeHeatMap: value => dispatch(changeHeatMap(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProjectMap)