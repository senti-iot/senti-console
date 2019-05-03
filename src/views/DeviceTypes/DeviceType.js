import { withStyles, Fade } from '@material-ui/core';
import deviceTypeStyles from 'assets/jss/views/deviceStyles';
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
import { getDeviceTypeLS } from 'redux/data';
import DeviceTypeDetails from './DeviceTypeCards/DeviceTypeDetails';

class DeviceType extends Component {
	constructor(props) {
		super(props)

		this.state = {
			//Date Filter
			//End Date Filter Tools
			deviceType: null,
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
		let prevURL = props.location.prevURL ? props.location.prevURL : '/deviceTypes/list'
		props.setHeader('deviceTypes.fields.deviceType', true, prevURL, 'deviceTypes')
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
		this.getDeviceType(this.props.match.params.id)
	}

	getDeviceType = async (id) => {
		const { getDeviceType } = this.props
		await getDeviceType(id)
	}
	componentDidUpdate = async (prevProps) => {
		const { deviceType } = this.props
		if (prevProps.match.params.id !== this.props.match.params.id)
			await this.componentDidMount()
		if (deviceType && !prevProps.deviceType) {

			if (deviceType.activeDevice) {
				let data = await getWeather(deviceType.activeDevice, moment(), this.props.language)
				this.setState({ weather: data })
			}
		}
		if (this.props.id !== prevProps.id || this.props.to !== prevProps.to || this.props.timeType !== prevProps.timeType || this.props.from !== prevProps.from) {
			// this.handleSwitchDayHourSummary()
			// this.getHeatMapData()
		}
		if (this.props.saved === true) {
			const { deviceType } = this.props
			if (this.props.isFav({ id: deviceType.id, type: 'deviceType' })) {
				this.props.s('snackbars.favorite.saved', { name: deviceType.name, type: this.props.t('favorites.types.deviceType') })
				this.props.finishedSaving()
			}
			if (!this.props.isFav({ id: deviceType.id, type: 'deviceType' })) {
				this.props.s('snackbars.favorite.removed', { name: deviceType.name, type: this.props.t('favorites.types.deviceType') })
				this.props.finishedSaving()
			}
		}
	}
	componentDidMount = async () => {
		if (this.props.match) {
			let id = this.props.match.params.id
			if (id) {
				await this.getDeviceType(id).then(() => {
					this.props.setBC('deviceType', this.props.deviceType.name)
				})
				this.props.setTabs({
					route: 0,
					id: 'deviceType',
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
		const { deviceType } = this.props
		let favObj = {
			id: deviceType.id,
			name: deviceType.name,
			type: 'deviceType',
			path: this.props.match.url
		}
		this.props.addToFav(favObj)
	}
	removeFromFav = () => {
		const { deviceType } = this.props
		let favObj = {
			id: deviceType.id,
			name: deviceType.name,
			type: 'deviceType',
			path: this.props.match.url
		}
		this.props.removeFromFav(favObj)
	}

	snackBarMessages = (msg) => {
		// const { s, t, deviceType } = this.props

		switch (msg) {
			default:
				break
		}
	}



	renderLoader = () => {
		return <CircularLoader />
	}


	render() {
		const { history, match, t, accessLevel, deviceType, loading } = this.props
		return (
			<Fragment>
				{!loading ? <Fade in={true}>
					<GridContainer justify={'center'} alignContent={'space-between'}>
						<ItemGrid xs={12} noMargin id='details'>
							<DeviceTypeDetails
								isFav={this.props.isFav({ id: deviceType.id, type: 'deviceType' })}
								addToFav={this.addToFav}
								removeFromFav={this.removeFromFav}
								deviceType={deviceType}
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
	deviceType: state.data.deviceType,
	loading: !state.data.gotDeviceType
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving()),
	getDeviceType: async id => dispatch(await getDeviceTypeLS(id))
})


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(deviceTypeStyles)(DeviceType))
