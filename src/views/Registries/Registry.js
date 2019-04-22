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
import { getRegistryLS } from 'redux/data';
import RegistryDetails from './RegistryCards/RegistryDetails';

class Registry extends Component {
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
		let prevURL = props.location.prevURL ? props.location.prevURL : '/registries/list'
		props.setHeader('registrys.fields.registry', true, prevURL, 'registrys')
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
		this.getRegistry(this.props.match.params.id)
	}

	getRegistry = async (id) => {
		const { getRegistry } = this.props
		await getRegistry(id)
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
				await this.getRegistry(id).then(() => {
					this.props.setBC('registry', this.props.registry.name)
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


	render() {
		const { history, match, t, accessLevel, registry, loading } = this.props
		console.log(registry)
		return (
			<Fragment>
				{!loading ? <Fade in={true}>
					<GridContainer justify={'center'} alignContent={'space-between'}>
						<ItemGrid xs={12} noMargin id='details'>
							<RegistryDetails
								isFav={this.props.isFav({ id: registry.id, type: 'registry' })}
								addToFav={this.addToFav}
								removeFromFav={this.removeFromFav}
								registry={registry}
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
	registry: state.data.registry,
	loading: !state.data.gotRegistry
})

const mapDispatchToProps = (dispatch) => ({
	isFav: (favObj) => dispatch(isFav(favObj)),
	addToFav: (favObj) => dispatch(addToFav(favObj)),
	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
	finishedSaving: () => dispatch(finishedSaving()),
	getRegistry: async id => dispatch(await getRegistryLS(1, id))
})


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(registryStyles)(Registry))
