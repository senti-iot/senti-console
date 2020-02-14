import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, withStyles, Fade } from '@material-ui/core';
import collectionStyles from 'assets/jss/views/deviceStyles';
import { CircularLoader, GridContainer, ItemGrid, AssignOrg, AssignProject, AssignDevice } from 'components';
import React, { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteCollection, unassignDeviceFromCollection } from 'variables/dataCollections';
import CollectionActiveDevice from 'views/Collections/CollectionCards/CollectionActiveDevice';
import CollectionDetails from 'views/Collections/CollectionCards/CollectionDetails';
import CollectionHistory from 'views/Collections/CollectionCards/CollectionHistory';
// import { getProject } from 'variables/dataProjects';
// import Search from 'components/Search/Search';
import { getWeather } from 'variables/dataDevices';
import moment from 'moment'
import teal from '@material-ui/core/colors/teal'
import { getWifiDaily, getWifiMinutely, getWifiHourly, getWifiSummary } from 'components/Charts/DataModel';
import { DataUsage, Timeline, Map, DeviceHub, History } from 'variables/icons';
// import Toolbar from 'components/Toolbar/Toolbar';
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import ChartDataPanel from 'views/Charts/ChartDataPanel';
import ChartData from 'views/Charts/ChartData';
import Maps from 'views/Maps/MapCard';
import { scrollToAnchor } from 'variables/functions';
import { getCollectionLS } from 'redux/data';
import { useLocalization, useLocation, useMatch, useSnackbar, useHistory } from 'hooks'

// const mapStateToProps = (state) => ({
// 	accessLevel: state.settings.user.privileges,
// 	language: state.settings.language,
// 	saved: state.favorites.saved,
// 	mapTheme: state.settings.mapTheme,
// 	periods: state.dateTime.periods,
// 	collection: state.data.collection,
// 	loading: !state.data.gotCollection
// })

// const mapDispatchToProps = (dispatch) => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	addToFav: (favObj) => dispatch(addToFav(favObj)),
// 	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
// 	finishedSaving: () => dispatch(finishedSaving()),
// 	getCollection: async id => dispatch(await getCollectionLS(id))
// })

// @Andrei
const Collection = props => {
	const t = useLocalization()
	const s = useSnackbar().s
	const dispatch = useDispatch()
	const location = useLocation()
	const match = useMatch()
	const history = useHistory()

	const accessLevel = useSelector(state => state.settings.user.privileges)
	const language = useSelector(state => state.settings.language)
	const saved = useSelector(state => state.favorites.saved)
	const mapTheme = useSelector(state => state.settings.mapTheme)
	const periods = useSelector(state => state.dateTime.periods)
	const collection = useSelector(state => state.data.collection)
	const loading = useSelector(state => !state.data.gotCollection)

	// const [stateCollection, setStateCollection] = useState(null)
	const [activeDevice, /* setActiveDevice */] = useState(null)
	const [/* stateLoading */, setStateLoading] = useState(true)
	// const [anchorElHardware, setAnchorElHardware] = useState(null)
	const [openAssign, setOpenAssign] = useState(false)
	const [openUnassignDevice, setOpenUnassignDevice] = useState(false)
	const [openAssignOrg, setOpenAssignOrg] = useState(false)
	const [openAssignDevice, setOpenAssignDevice] = useState(false)
	const [openDelete, setOpenDelete] = useState(false)
	// const [loadingMap, setLoadingMap] = useState(true)
	const [heatData, /* setHeatData */] = useState(null)
	const [weather, setWeather] = useState(null) // added
	const [hoverID, /* setHoverID */] = useState(null) // added
	const [/* loadingData */, setLoadingData] = useState(true) // added
	const [/* anchorEl */, setAnchorEl] = useState(null) // added

	let prevURL = props.location.prevURL ? props.location.prevURL : '/collections/list'
	props.setHeader('collections.fields.collection', true, prevURL, 'collections')

	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		//Date Filter
	// 		//End Date Filter Tools
	// 		collection: null,
	// 		activeDevice: null,
	// 		loading: true,
	// 		anchorElHardware: null,
	// 		openAssign: false,
	// 		openUnassignDevice: false,
	// 		openAssignOrg: false,
	// 		openAssignDevice: false,
	// 		openDelete: false,
	// 		//Map
	// 		loadingMap: true,
	// 		heatData: null,
	// 		//End Map
	// 	}
	// 	let prevURL = props.location.prevURL ? props.location.prevURL : '/collections/list'
	// 	props.setHeader('collections.fields.collection', true, prevURL, 'collections')
	// }

	// let format = 'YYYY-MM-DD+HH:mm'
	const tabs = () => {
		// const { t } = this.props
		return [
			{ id: 0, title: t('tabs.details'), label: <DataUsage />, url: `#details` },
			{ id: 1, title: t('tabs.data'), label: <Timeline />, url: `#data` },
			{ id: 2, title: t('tabs.map'), label: <Map />, url: `#map` },
			{ id: 3, title: t('tabs.activeDevice'), label: <DeviceHub />, url: `#active-device` },
			{ id: 4, title: t('tabs.history'), label: <History />, url: `#history` }
		]
	}
	// getActiveDevice = async (id) => {
	// 	let device = await getDevice(id)
	// 	if (device.lat && device.long) {

	// 	}
	// 	return device ? this.setState({ activeDevice: device, loading: false }) : this.setState({ loading: false })
	// }
	const getCollection = () => {
		// to fix the error 'getCollection' is not defined
	}

	const reload = (msgId) => {
		snackBarMessages(msgId)
		getCollection(match.params.id)
	}
	// getCollectionProject = async (rs) => {
	// 	const { collection } = this.props
	// 	let project = await getProject(rs)
	// 	this.setState({ collection: { ...collection, project: project }, loadingProject: false })
	// }
	const getCollectionFunc = async (id) => {
		// const { getCollection } = this.props
		dispatch(await getCollectionLS(id))
	}

	useEffect(() => {
		const asyncFunc = async () => {
			await componentDidMount()

			if (collection) {
				if (collection.activeDevice) {
					let data = await getWeather(collection.activeDevice, moment(), language)
					setWeather(data)
				}
			}
		}
		asyncFunc()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [match.params.id])

	useEffect(() => {
		if (saved === true) {
			if (dispatch(isFav({ id: collection.id, type: 'collection' }))) {
				s('snackbars.favorite.saved', { name: collection.name, type: t('favorites.types.collection') })
				dispatch(finishedSaving())
			}
			if (!dispatch(isFav({ id: collection.id, type: 'collection' }))) {
				s('snackbars.favorite.removed', { name: collection.name, type: t('favorites.types.collection') })
				dispatch(finishedSaving())
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [saved])
	// componentDidUpdate = async (prevProps) => {
	// 	const { collection } = this.props
	// 	if (prevProps.match.params.id !== this.props.match.params.id)
	// 		await this.componentDidMount()
	// 	if (collection && !prevProps.collection) {

	// 		if (collection.activeDevice) {
	// 			let data = await getWeather(collection.activeDevice, moment(), this.props.language)
	// 			this.setState({ weather: data })
	// 		}
	// 	}
	// 	if (this.props.id !== prevProps.id || this.props.to !== prevProps.to || this.props.timeType !== prevProps.timeType || this.props.from !== prevProps.from) {
	// 		// this.handleSwitchDayHourSummary()
	// 		// this.getHeatMapData()
	// 	}
	// 	if (this.props.saved === true) {
	// 		const { collection } = this.props
	// 		if (this.props.isFav({ id: collection.id, type: 'collection' })) {
	// 			this.props.s('snackbars.favorite.saved', { name: collection.name, type: this.props.t('favorites.types.collection') })
	// 			this.props.finishedSaving()
	// 		}
	// 		if (!this.props.isFav({ id: collection.id, type: 'collection' })) {
	// 			this.props.s('snackbars.favorite.removed', { name: collection.name, type: this.props.t('favorites.types.collection') })
	// 			this.props.finishedSaving()
	// 		}
	// 	}
	// }

	useEffect(() => {
		componentDidMount()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	const componentDidMount = async () => {
		if (match) {
			let id = match.params.id
			if (id) {
				await getCollection(id).then(() => {
					props.setBC('collection', collection.name)
				})
				props.setTabs({
					route: 0,
					id: 'collection',
					tabs: tabs(),
					hashLinks: true
				})
				if (location.hash !== '') {
					scrollToAnchor(location.hash)
				}
			}
		}
		else {
			history.push({
				pathname: '/404',
				prevURL: window.location.pathname
			})
		}
	}
	const addToFavorites = () => {
		// const { collection } = this.props
		let favObj = {
			id: collection.id,
			name: collection.name,
			type: 'collection',
			path: match.url
		}
		dispatch(addToFav(favObj))
	}
	const removeFromFavorites = () => {
		// const { collection } = this.props
		let favObj = {
			id: collection.id,
			name: collection.name,
			type: 'collection',
			path: match.url
		}
		dispatch(removeFromFav(favObj))
	}

	const handleSwitchDayHourSummary = async (p) => {
		let diff = moment.duration(moment(p.to).diff(moment(p.from))).days()
		switch (p.menuId) {
			case 0:// Today
			case 1:// Yesterday
				return await getWifiHourlyFunc(p);
			case 2:// This week
				return parseInt(diff, 10) > 0 ? getWifiDailyFunc(p) : getWifiHourlyFunc(p)
			case 3:// Last 7 days
			case 4:// 30 days
			case 5:// 90 Days
				return await getWifiDailyFunc(p);
			case 6:
				return await handleSetCustomRange(p)
			default:
				return await getWifiDailyFunc(p);
		}
	}

	const handleSetCustomRange = (p) => {
		switch (p.timeType) {
			case 0:
				return getWifiMinutelyFunc(p)
			case 1:
				return getWifiHourlyFunc(p)
			case 2:
				return getWifiDailyFunc(p)
			case 3:
				return getWifiSummaryFunc(p)
			default:
				break;
		}
	}

	const getWifiSummaryFunc = async (p) => {
		// const { hoverID } = this.state
		// const { collection } = this.props
		setLoadingData(true)
		// this.setState({ loadingData: true })
		let newState = await getWifiSummary('collection', [{
			dcId: collection.id,
			dcName: collection.name,
			project: collection.project ? collection.project.title : "",
			org: collection.org ? collection.org.name : "",
			name: collection.name,
			id: collection.activeDevice ? collection.activeDevice.id : collection.id,
			lat: collection.activeDeviceStats ? collection.activeDeviceStats.lat : 0,
			long: collection.activeDeviceStats ? collection.activeDeviceStats.long : 0,
			color: teal[500]
		}], p.from, p.to, hoverID, p.raw)

		return newState
	}
	const getWifiHourlyFunc = async (p) => {
		// const { hoverID } = this.state
		// const { collection } = this.props
		setLoadingData(true)
		// this.setState({ loadingData: true })
		let newState = await getWifiHourly('collection', [{
			dcId: collection.id,
			dcName: collection.name,
			project: collection.project ? collection.project.title : "",
			org: collection.org ? collection.org.name : "",
			name: collection.name,
			id: collection.activeDevice ? collection.activeDevice.id : collection.id,
			lat: collection.activeDeviceStats ? collection.activeDeviceStats.lat : 0,
			long: collection.activeDeviceStats ? collection.activeDeviceStats.long : 0,
			color: teal[500]
		}], p.from, p.to, hoverID, p.raw)

		return newState
	}

	const getWifiMinutelyFunc = async (p) => {
		// const { hoverID } = this.state
		// const { collection } = this.props
		setLoadingData(true)
		// this.setState({ loadingData: true })
		let newState = await getWifiMinutely('collection', [{
			dcId: collection.id,
			dcName: collection.name,
			project: collection.project ? collection.project.title : "",
			org: collection.org ? collection.org.name : "",
			name: collection.name,
			id: collection.id,
			lat: collection.activeDeviceStats ? collection.activeDeviceStats.lat : 0,
			long: collection.activeDeviceStats ? collection.activeDeviceStats.long : 0,
			color: teal[500]
		}], p.from, p.to, hoverID, p.raw)

		return newState

	}

	const getWifiDailyFunc = async (p) => {
		// const { hoverID } = this.state
		// const { collection } = this.props
		setLoadingData(true)
		// this.setState({ loadingData: true })
		let newState = await getWifiDaily('collection', [{
			dcId: collection.id,
			dcName: collection.name,
			project: collection.project ? collection.project.title : "",
			org: collection.org ? collection.org.name : "",
			name: collection.name,
			id: collection.id,
			lat: collection.activeDeviceStats ? collection.activeDeviceStats.lat : 0,
			long: collection.activeDeviceStats ? collection.activeDeviceStats.long : 0,
			color: teal[500]
		}], p.from, p.to, hoverID, p.raw)

		return newState
	}

	const snackBarMessages = (msg) => {
		// const { s, t, collection } = this.props
		let name = collection.name ? collection.name : t('collections.noName')
		let deviceName = activeDevice ? activeDevice.name : null
		let deviceId = activeDevice ? activeDevice.id : null
		let id = collection ? collection.id : null
		switch (msg) {
			case 1:
				s('snackbars.unassign.deviceFromCollection', { collection: `${name} (${id})`, device: collection.activeDeviceStats.id })
				break
			case 2:
				s('snackbars.assign.collectionToOrg', { collection: `${name} (${id})`, org: collection.org.name })
				break
			case 5:
				s('snackbars.deviceUpdated', { device: `${deviceName}(${deviceId})` })
				break;
			case 7:
				s('snackbars.assign.collectionToProject', { collection: `${name} (${id})`, project: collection.project.title })
				break
			case 6:
				s('snackbars.assign.deviceToCollection', { collection: `${name} (${id})`, device: deviceId ? deviceId : "" })
				break
			case 4:
				s('snackbars.collectionDeleted')
				break
			default:
				break
		}
	}

	const handleOpenDeleteDialog = () => {
		setOpenDelete(true)
		// this.setState({ openDelete: true })
	}

	const handleCloseDeleteDialog = () => {
		setOpenDelete(false)
		// this.setState({ openDelete: false })
	}

	const handleDeleteCollection = async () => {
		// const { collection } = this.props
		await deleteCollection(collection.id).then(rs => {
			setOpenDelete(false)
			// this.setState({
			// 	openDelete: false
			// })
			if (rs) {
				snackBarMessages(4)
				history.push('/collections/list')
			}

		})
	}

	const handleOpenAssignDevice = () => {
		setOpenAssignDevice(true)
		setAnchorEl(null)
		// this.setState({ openAssignDevice: true, anchorEl: null })
	}

	const handleCancelAssignDevice = () => {
		setOpenAssignDevice(false)
		// this.setState({ openAssignDevice: false })
	}

	const handleCloseAssignDevice = async (reload) => {
		// const { collection } = this.props

		if (reload) {
			setStateLoading(true)
			setOpenAssignDevice(false)
			// this.setState({ loading: true, openAssignDevice: false })
			if (collection) {
				await getCollectionFunc(collection.id).then(() => {
					snackBarMessages(6)
				})
			}
		}
		else {
			setOpenAssignDevice(false)
			// this.setState({ openAssignDevice: false })
		}
	}

	const handleOpenAssignOrg = () => {
		setOpenAssignOrg(true)
		setAnchorEl(null)
		// this.setState({ openAssignOrg: true, anchorEl: null })
	}

	// const handleCancelAssignOrg = () => {
	// 	setOpenAssignOrg(false)
	// 	// this.setState({ openAssignOrg: false })
	// }

	const handleCloseAssignOrg = async (reload) => {
		// const { collection } = this.props

		if (reload) {
			setStateLoading(true)
			setOpenAssignOrg(false)
			// this.setState({ loading: true, openAssignOrg: false })
			await getCollectionFunc(collection.id).then(() => {
				snackBarMessages(2)
			})
		}
	}

	const handleOpenAssignProject = () => {
		setOpenAssign(true)
		setAnchorEl(null)
		// this.setState({ openAssign: true, anchorEl: null })
	}

	const handleCancelAssignProject = () => {
		setOpenAssign(false)
		// this.setState({ openAssign: false })
	}

	const handleCloseAssignProject = async (reload) => {
		// const { collection } = this.props

		if (reload) {
			setStateLoading(true)
			setAnchorEl(null)
			setOpenAssign(false)
			// this.setState({ loading: true, anchorEl: null, openAssign: false })
			await getCollectionFunc(collection.id).then(() => {
				snackBarMessages(7)
			})
		}
	}

	const handleOpenUnassignDevice = () => {
		setOpenUnassignDevice(true)
		// this.setState({
		// 	openUnassignDevice: true
		// })
	}
	const handleCloseUnassignDevice = () => {
		setOpenUnassignDevice(false)
		setAnchorEl(null)
		// this.setState({
		// 	openUnassignDevice: false, anchorEl: null
		// })
	}
	const handleUnassignDevice = async () => {
		// const { collection } = this.props
		await unassignDeviceFromCollection({
			id: collection.id,
			deviceId: collection.activeDeviceStats.id
		}).then(async rs => {
			if (rs) {
				handleCloseUnassignDevice()
				setStateLoading(true)
				// this.setState({ loading: true })
				snackBarMessages(1)
				await getCollectionFunc(collection.id)
			}
		})
	}

	const renderLoader = () => {
		return <CircularLoader />
	}

	// const renderAssignDevice = () => {
	// 	// const { t, collection } = this.props
	// 	// const { openAssignDevice } = this.state
	// 	return (
	// 		<Dialog
	// 			open={openAssignDevice}
	// 			onClose={handleCloseAssignDevice}
	// 		>
	// 			<DialogTitle disableTypography>
	// 				<DialogActions>
	// 					<Search />
	// 				</DialogActions>
	// 				<DialogContentText id='alert-dialog-description'>
	// 					{t('dialogs.unassign', { id: collection.id, name: collection.name, what: collection.org.name })}
	// 				</DialogContentText>
	// 			</DialogTitle>
	// 		</Dialog>
	// 	)
	// }

	const renderConfirmUnassign = () => {
		// const { t, collection } = this.props
		return <Dialog
			open={openUnassignDevice}
			onClose={handleCloseUnassignDevice}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
		>
			<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.unassign.title.deviceFromCollection')}</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					{t('dialogs.unassign.message.deviceFromCollection', { device: collection.activeDevice.id, collection: collection.name })}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCloseUnassignDevice} color='primary'>
					{t('actions.no')}
				</Button>
				<Button onClick={handleUnassignDevice} color='primary' autoFocus>
					{t('actions.yes')}
				</Button>
			</DialogActions>
		</Dialog>
	}

	const renderDeleteDialog = () => {
		// const { openDelete } = this.state
		// const { t, collection } = this.props
		return (
			<Dialog
				open={openDelete}
				onClose={handleCloseDeleteDialog}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
			>
				<DialogTitle disableTypography id='alert-dialog-title'>{t('dialogs.delete.title.collection')}</DialogTitle>
				<DialogContent>
					<DialogContentText id='alert-dialog-description'>
						{t('dialogs.delete.message.collection', { collection: collection.name })}
					</DialogContentText>

				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDeleteDialog} color='primary'>
						{t('actions.cancel')}
					</Button>
					<Button onClick={handleDeleteCollection} color='primary' autoFocus>
						{t('actions.yes')}
					</Button>
				</DialogActions>
			</Dialog>
		)
	}

	const handleDataSize = (i) => {
		let visiblePeriods = 0
		periods.forEach(p => p.hide === false ? visiblePeriods += 1 : visiblePeriods)
		if (visiblePeriods === 1)
			return 12
		if (i === periods.length - 1 && visiblePeriods % 2 !== 0 && visiblePeriods > 2)
			return 12
		return 6
	}

	const { classes } = props
	// const { weather, openAssign, openAssignOrg, } = this.state
	return (
		<Fragment>
			{!loading ? <Fade in={true}>
				<GridContainer justify={'center'} alignContent={'space-between'}>
					<AssignDevice
						collectionId={collection.id}
						orgId={collection.org.id}
						handleCancel={handleCancelAssignDevice}
						handleClose={handleCloseAssignDevice}
						open={openAssignDevice}
						t={t}
					/>
					<AssignProject
						collectionId={[collection]}
						open={openAssign}
						handleClose={handleCloseAssignProject}
						handleCancel={handleCancelAssignProject}
						t={t}
					/>
					<AssignOrg
						collections
						collectionId={[collection]}
						open={openAssignOrg}
						handleClose={handleCloseAssignOrg}
						t={t}
					/>
					{collection.activeDeviceStats ? renderConfirmUnassign() : null}
					{renderDeleteDialog()}
					{/* {this.renderAssignDevice()} */}
					<ItemGrid xs={12} noMargin id='details'>
						<CollectionDetails
							isFav={dispatch(isFav({ id: collection.id, type: 'collection' }))}
							addToFav={addToFavorites}
							removeFromFav={removeFromFavorites}
							collection={collection}
							weather={weather}
							history={history}
							match={match}
							handleOpenAssignProject={handleOpenAssignProject}
							handleOpenUnassignDevice={handleOpenUnassignDevice}
							handleOpenAssignOrg={handleOpenAssignOrg}
							handleOpenDeleteDialog={handleOpenDeleteDialog}
							handleOpenAssignDevice={handleOpenAssignDevice}
							t={t}
							accessLevel={accessLevel}
						/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin id={'data'}>
						<ChartDataPanel />
					</ItemGrid>
					{periods.map((period, i) => {
						if (period.hide) { return null }
						return <ItemGrid xs={12} md={handleDataSize(i)} noMargin key={i} id={i}>
							<ChartData
								period={period}
								single
								getData={handleSwitchDayHourSummary}
								// device={activeDevice}
								history={history}
								match={match}
								t={t}
							/>
						</ItemGrid>
					})}
					{collection.activeDevice ? <ItemGrid xs={12} noMargin id='map'>
						<Maps
							single
							reload={reload}
							device={collection.activeDevice}
							mapTheme={mapTheme}
							markers={collection.activeDevice ? [collection.activeDevice] : []}
							weather={weather}
							loading={loading}
							heatData={heatData}
							t={t}
						/>
					</ItemGrid> : null}
					<ItemGrid xs={12} noMargin id={'active-device'}>
						<CollectionActiveDevice
							collection={collection}
							history={history}
							device={collection.activeDevice}
							accessLevel={accessLevel}
							classes={classes}
							t={t}
						/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin id={'history'}>
						<CollectionHistory
							classes={classes}
							collection={collection}
							history={history}
							match={match}
							t={t}
						/>
					</ItemGrid>
				</GridContainer></Fade>
				: renderLoader()}
		</Fragment>
	)
}

export default withStyles(collectionStyles)(Collection)
