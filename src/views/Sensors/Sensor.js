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
import { getSensorLS, unassignSensor } from 'redux/data';
// import SensorDetails from './SensorCards/SensorDetails';
import SensorDetails from './SensorCards/SensorDetails';
import SensorProtocol from './SensorCards/SensorProtocol';
import SensorData from './SensorCards/SensorData';
// import ChartDataPanel from 'views/Charts/ChartDataPanel';
// import { getSensorDataClean } from 'variables/dataRegistry';
// import { teal, red } from '@material-ui/core/colors';
// import ChartData from 'views/Charts/ChartData';
// import { colors } from 'variables/colors';
// import ChartData from 'views/Charts/ChartData';

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
	getSensor = async (id) => {
		const { getSensor } = this.props
		await getSensor(id)
	}
	componentDidUpdate = async (prevProps) => {
		const { registry } = this.props
		// if (prevProps.match.params.id !== this.props.match.params.id)
		// await this.componentDidMount()
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
			const { sensor } = this.props
			if (this.props.isFav({ id: sensor.id, type: 'sensor' })) {
				this.props.s('snackbars.favorite.saved', { name: sensor.name, type: this.props.t('favorites.types.device') })
				this.props.finishedSaving()
			}
			if (!this.props.isFav({ id: sensor.id, type: 'sensor' })) {
				this.props.s('snackbars.favorite.removed', { name: sensor.name, type: this.props.t('favorites.types.device') })
				this.props.finishedSaving()
			}
		}
	}
	componentWillUnmount = () => {
		this.props.unassignSensor()
	}
	componentDidMount = async () => {
		if (this.props.match) {
			let id = this.props.match.params.id
			if (id) {
				await this.getSensor(id).then(() => {
					this.props.setBC('sensor', this.props.sensor.name)
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
		const { sensor } = this.props
		let favObj = {
			id: sensor.id,
			name: sensor.name,
			type: 'sensor',
			path: this.props.match.url
		}
		this.props.addToFav(favObj)
	}
	removeFromFav = () => {
		const { sensor } = this.props
		let favObj = {
			id: sensor.id,
			name: sensor.name,
			type: 'sensor',
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

	handleDataSize = (i) => {
		let visiblePeriods = 0
		const { sensor } = this.props
		if (sensor.metadata) {
			if (sensor.metadata.dataKeys) {
				sensor.metadata.dataKeys.forEach(p => visiblePeriods += 1)
				if (visiblePeriods === 1)
					return 12
				if (i === this.props.sensor.metadata.dataKeys.length - 1 && visiblePeriods % 2 !== 0 && visiblePeriods > 2)
					return 12
				return 6
			}
			else {
				return 12
			}
		}
		else {
			return 12
		}
	}

	renderLoader = () => {
		return <CircularLoader />
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
						{/* <ItemGrid xs={12} noMargin id={'data'}> */}
						{/* <ChartDataPanel t={this.props.t} /> */}
						{/* </ItemGrid> */}
						{sensor.dataKeys ? sensor.dataKeys.map((k, i) => {
							console.log(k)
							return <ItemGrid xs={12} md={this.handleDataSize(i)} noMargin key={i} id={i}>
								<SensorData
									periods={periods}
									sensor={sensor}
									history={history}
									match={match}
									t={t}
									v={k.key}
									nId={k.nId}

								/></ItemGrid>
						}
						) : null }
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
	getSensor: async id => dispatch(await getSensorLS(id)),
	unassignSensor: () => dispatch(unassignSensor())
})


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(registryStyles)(Sensor))