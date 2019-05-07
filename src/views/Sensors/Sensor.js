import { withStyles, Fade } from '@material-ui/core';
import registryStyles from 'assets/jss/views/deviceStyles';
import { CircularLoader, GridContainer, ItemGrid } from 'components';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
// import { getProject } from 'variables/dataProjects';
import { getWeather } from 'variables/dataDevices';
import moment from 'moment'
import { DataUsage } from 'variables/icons';
// import Toolbar from 'components/Toolbar/Toolbar';
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { scrollToAnchor } from 'variables/functions';
import { getSensorLS } from 'redux/data';
// import SensorDetails from './SensorCards/SensorDetails';
import SensorDetails from './SensorCards/SensorDetails';
import SensorProtocol from './SensorCards/SensorProtocol';
// import { getSensorDataClean } from 'variables/dataRegistry';
import { getWMeterData } from 'components/Charts/DataModel';
// import { teal, red } from '@material-ui/core/colors';
// import ChartData from 'views/Charts/ChartData';
import DoubleChartData from 'views/Charts/DoubleChartData';
// import { colors } from 'variables/colors';
import { teal } from '@material-ui/core/colors';

class Sensor extends Component {
	constructor(props) {
		super(props)

		this.state = {
			//Date Filter
			//End Date Filter Tools
			registry: null,
			activeDevice: null,
			loading: true,
			anchorElHardware: null,
			openAssign: false,
			openUnassignDevice: false,
			openAssignOrg: false,
			openAssignDevice: false,
			openDelete: false,
			//Map
			loadingMap: true,
			heatData: null,
			//End Map
		}
		let prevURL = props.location.prevURL ? props.location.prevURL : '/sensors/list'
		props.setHeader('sidebar.device', true, prevURL, 'manage.devices')
	}

	format = 'YYYY-MM-DD+HH:mm'
	tabs = () => {
		const { t } = this.props
		return [
			{ id: 0, title: t('tabs.details'), label: <DataUsage />, url: `#details` },
			// { id: 1, title: t('tabs.data'), label: <Timeline />, url: `#data` },
			// { id: 2, title: t('tabs.map'), label: <Map />, url: `#map` },
			// { id: 3, title: t('tabs.activeDevice'), label: <DeviceHub />, url: `#active-device` },
			// { id: 4, title: t('tabs.history'), label: <History />, url: `#history` }
		]
	}

	reload = (msgId) => {
		this.snackBarMessages(msgId)
		this.getSensor(this.props.match.params.id)
	}
	getData = async (period) => { 
		const { hoverID } = this.state
		const { sensor } = this.props
		let newState = await getWMeterData([{
			name: sensor.name,
			id: sensor.id,
			lat: sensor.lat,
			long: sensor.lng,
			from: period.from,
			to: period.to,
			org: sensor.org ? sensor.org.name : "",
			color: teal[500]
		}], null, null, hoverID )
		return newState
	}
	getSensor = async (id) => {
		const { getSensor } = this.props
		await getSensor(id)
	}
	componentDidUpdate = async (prevProps) => {
		const { registry } = this.props
		if (prevProps.match.params.id !== this.props.match.params.id)
			await this.componentDidMount()
		if (registry && !prevProps.registry) {

			if (registry.activeDevice) {
				let data = await getWeather(registry.activeDevice, moment(), this.props.language)
				this.setState({ weather: data })
			}
		}
		if (this.props.id !== prevProps.id || this.props.to !== prevProps.to || this.props.timeType !== prevProps.timeType || this.props.from !== prevProps.from) {
			// this.handleSwitchDayHourSummary()
			// this.getHeatMapData()
		}
		if (this.props.saved === true) {
			const { registry } = this.props
			if (this.props.isFav({ id: registry.id, type: 'registry' })) {
				this.props.s('snackbars.favorite.saved', { name: registry.name, type: this.props.t('favorites.types.registry') })
				this.props.finishedSaving()
			}
			if (!this.props.isFav({ id: registry.id, type: 'registry' })) {
				this.props.s('snackbars.favorite.removed', { name: registry.name, type: this.props.t('favorites.types.registry') })
				this.props.finishedSaving()
			}
		}
	}
	componentDidMount = async () => {
		if (this.props.match) {
			let id = this.props.match.params.id
			if (id) {
				await this.getSensor(id).then(() => {
					// this.props.setBC('registry', this.props.registry.name)
				})
				this.props.setTabs({
					route: 0,
					id: 'registry',
					tabs: this.tabs(),
					hashLinks: true
				})
				if (this.props.location.hash !== '') {
					scrollToAnchor(this.props.location.hash)
				}
			}
		}
		else {
			this.props.history.push({
				pathname: '/404',
				prevURL: window.location.pathname
			})
		}
	}
	addToFav = () => {
		const { registry } = this.props
		let favObj = {
			id: registry.id,
			name: registry.name,
			type: 'registry',
			path: this.props.match.url
		}
		this.props.addToFav(favObj)
	}
	removeFromFav = () => {
		const { registry } = this.props
		let favObj = {
			id: registry.id,
			name: registry.name,
			type: 'registry',
			path: this.props.match.url
		}
		this.props.removeFromFav(favObj)
	}

	snackBarMessages = (msg) => {
		// const { s, t, registry } = this.props

		switch (msg) {
			default:
				break
		}
	}

	renderLoader = () => {
		return <CircularLoader />
	}

	handleDataSize = (i) => {
		let visiblePeriods = 0
		this.props.periods.forEach(p => p.hide === false ? visiblePeriods += 1 : visiblePeriods)
		if (visiblePeriods === 1)
			return 12
		if (i === this.props.periods.length - 1 && visiblePeriods % 2 !== 0 && visiblePeriods > 2)
			return 12
		return 6
	}
	render() {
		const { history, match, t, accessLevel, sensor, loading, periods } = this.props
		return (
			<Fragment>
				{!loading ? <Fade in={true}>
					<GridContainer justify={'center'} alignContent={'space-between'}>
						<ItemGrid xs={12} noMargin id='details'>
							<SensorDetails
								isFav={this.props.isFav({ id: sensor.id, type: 'sensor' })}
								addToFav={this.addToFav}
								removeFromFav={this.removeFromFav}
								sensor={sensor}
								history={history}
								match={match}
								handleOpenAssignProject={this.handleOpenAssignProject}
								handleOpenUnassignDevice={this.handleOpenUnassignDevice}
								handleOpenAssignOrg={this.handleOpenAssignOrg}
								handleOpenDeleteDialog={this.handleOpenDeleteDialog}
								handleOpenAssignDevice={this.handleOpenAssignDevice}
								t={t}
								accessLevel={accessLevel}
							/>
						</ItemGrid>
						{periods.map((period, i) => {

							return <ItemGrid xs={12} md={this.handleDataSize(i)} noMargin key={i} id={i}>
								<DoubleChartData
								// single
									getData={this.getData}
									period={period}
									device={sensor}
									history={this.props.history}
									match={this.props.match}
									setHoverID={() => {}}
									t={this.props.t}
								/>
							</ItemGrid>
						})}
						<ItemGrid xs={12} noMargin id='details'>
							<SensorProtocol
								isFav={this.props.isFav({ id: sensor.id, type: 'sensor' })}
								addToFav={this.addToFav}
								removeFromFav={this.removeFromFav}
								sensor={sensor}
								history={history}
								match={match}
								handleOpenAssignProject={this.handleOpenAssignProject}
								handleOpenUnassignDevice={this.handleOpenUnassignDevice}
								handleOpenAssignOrg={this.handleOpenAssignOrg}
								handleOpenDeleteDialog={this.handleOpenDeleteDialog}
								handleOpenAssignDevice={this.handleOpenAssignDevice}
								t={t}
								accessLevel={accessLevel}
							/>
						</ItemGrid>
						{/* {this.props.periods.map((period, i) => { */}
						{/* if (period.hide) { return null } */}
						{/* return  */}
						{/* })} */}
					</GridContainer></Fade>
					: this.renderLoader()}
			</Fragment>
		)
	}
}
const mapStateToProps = (state) => ({
	accessLevel: state.settings.user.privileges,
	language: state.settings.language,
	saved: state.favorites.saved,
	mapTheme: state.settings.mapTheme,
	periods: state.dateTime.periods,
	sensor: state.data.sensor,
	loading: !state.data.gotSensor
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving()),
	getSensor: async id => dispatch(await getSensorLS(id))
})


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(registryStyles)(Sensor))
