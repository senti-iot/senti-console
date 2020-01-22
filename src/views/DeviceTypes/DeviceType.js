import { withStyles, Fade } from '@material-ui/core';
import deviceTypeStyles from 'assets/jss/views/deviceStyles';
import { CircularLoader, GridContainer, ItemGrid, DeleteDialog } from 'components';
import React, { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { getProject } from 'variables/dataProjects';
import { getWeather } from 'variables/dataDevices';
import moment from 'moment'
import { DataUsage, CloudUpload, StorageIcon } from 'variables/icons';
// import Toolbar from 'components/Toolbar/Toolbar';
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { scrollToAnchor } from 'variables/functions';
import { getDeviceTypeLS } from 'redux/data';
import DeviceTypeDetails from './DeviceTypeCards/DeviceTypeDetails';
import DeviceTypeMetadata from './DeviceTypeCards/DeviceTypeMetadata';
import DeviceTypeCloudFunctions from './DeviceTypeCards/DeviceTypeCloudFunctions';
import { deleteDeviceType } from 'variables/dataDeviceTypes';
import { useLocalization } from 'hooks';

// const mapStateToProps = (state) => ({
// 	accessLevel: state.settings.user.privileges,
// 	language: state.settings.language,
// 	saved: state.favorites.saved,
// 	mapTheme: state.settings.mapTheme,
// 	periods: state.dateTime.periods,
// 	deviceType: state.data.deviceType,
// 	loading: !state.data.gotDeviceType
// })

// const mapDispatchToProps = (dispatch) => ({
// 	isFav: (favObj) => dispatch(isFav(favObj)),
// 	addToFav: (favObj) => dispatch(addToFav(favObj)),
// 	removeFromFav: (favObj) => dispatch(removeFromFav(favObj)),
// 	finishedSaving: () => dispatch(finishedSaving()),
// 	getDeviceType: async (id) => dispatch(await getDeviceTypeLS(id))
// })

const DeviceType = props => {
	const dispatch = useDispatch()
	const t = useLocalization()

	const accessLevel = useSelector(store => store.settings.user.privileges)
	const language = useSelector(store => store.settings.language)
	const saved = useSelector(store => store.favorites.saved)
	const mapTheme = useSelector(store => store.settings.mapTheme)
	const periods = useSelector(store => sessionStorage.dateTime.periods)
	const deviceType = useSelector(store => store.data.deviceType)
	const loading = useSelector(store => !store.data.gotDeviceType)

	const [stateLoading, setStateLoading] = useState(true)
	const [openDelete, setOpenDelete] = useState(false)
	const [weather, setWeather] = useState(null)

	let prevURL = props.location.prevURL ? props.location.prevURL : '/deviceTypes/list'
	props.setHeader('sidebar.devicetype', true, prevURL, 'manage.devicetypes')

	const format = 'YYYY-MM-DD+HH:mm'
	const tabs = () => {
		return [
			{ id: 0, title: t('tabs.details'), label: <DataUsage />, url: `#details` },
			{ id: 1, title: t('tabs.metadata'), label: <StorageIcon />, url: `#metadata` },
			{ id: 2, title: t('tabs.cloudfunctions'), label: <CloudUpload />, url: `#cloudfunctions` },
			// { id: 1, title: t('tabs.data'), label: <Timeline />, url: `#data` },
			// { id: 2, title: t('tabs.map'), label: <Map />, url: `#map` },
			// { id: 3, title: t('tabs.activeDevice'), label: <DeviceHub />, url: `#active-device` },
			// { id: 4, title: t('tabs.history'), label: <History />, url: `#history` }
		]
	}

	const reload = (msgId) => {
		snackBarMessages(msgId)
		getDeviceType(props.match.params.id)
	}

	const getDeviceType = async (id) => {
		await getDeviceType(id)
	}

	useEffect(() => {
		const asyncFunc = async () => {
			if (deviceType.activeDevice) {
				let data = await getWeather(deviceType.activeDevice, moment(), props.language)
				setWeather(data)
			}

			if (props.saved === true) {
				if (dispatch(isFav(({ id: deviceType.id, type: 'deviceType' })))) {
					props.s('snackbars.favorite.saved', { name: deviceType.name, type: t('favorites.types.deviceType') })
					dispatch(finishedSaving())
				}
				if (!dispatch(isFav(({ id: deviceType.id, type: 'deviceType' })))) {
					props.s('snackbars.favorite.removed', { name: deviceType.name, type: t('favorites.types.deviceType') })
					dispatch(finishedSaving())
				}
			}
		}
		asyncFunc()
	}, [props.match.params.id, deviceType])
	// const componentDidUpdate = async (prevProps) => {
	// 	if (prevProps.match.params.id !== props.match.params.id)
	// 		// await componentDidMount()
	// 		if (deviceType && !prevProps.deviceType) {

	// 			if (deviceType.activeDevice) {
	// 				let data = await getWeather(deviceType.activeDevice, moment(), props.language)
	// 				setWeather(data)
	// 			}
	// 		}
	// 	if (props.id !== prevProps.id || props.to !== prevProps.to || props.timeType !== prevProps.timeType || props.from !== prevProps.from) {
	// 		// this.handleSwitchDayHourSummary()
	// 		// this.getHeatMapData()
	// 	}
	// 	if (props.saved === true) {
	// 		if (dispatch(isFav(({ id: deviceType.id, type: 'deviceType' })))) {
	// 			props.s('snackbars.favorite.saved', { name: deviceType.name, type: t('favorites.types.deviceType') })
	// 			dispatch(finishedSaving())
	// 		}
	// 		if (!dispatch(isFav(({ id: deviceType.id, type: 'deviceType' })))) {
	// 			props.s('snackbars.favorite.removed', { name: deviceType.name, type: t('favorites.types.deviceType') })
	// 			dispatch(finishedSaving())
	// 		}
	// 	}
	// }

	useEffect(() => {
		const asyncFunc = async () => {
			if (props.match) {
				let id = props.match.params.id
				if (id) {
					await getDeviceType(id).then(() => {
						props.setBC('devicetype', deviceType.name)
					})
					props.setTabs({
						route: 0,
						id: 'deviceType',
						tabs: tabs(),
						hashLinks: true
					})
					if (props.location.hash !== '') {
						scrollToAnchor(props.location.hash)
					}
				}
			}
			else {
				props.history.push({
					pathname: '/404',
					prevURL: window.location.pathname
				})
			}
		}
		asyncFunc()
	}, [])
	// const componentDidMount = async () => {
	// 	if (props.match) {
	// 		let id = props.match.params.id
	// 		if (id) {
	// 			await getDeviceType(id).then(() => {
	// 				props.setBC('devicetype', deviceType.name)
	// 			})
	// 			props.setTabs({
	// 				route: 0,
	// 				id: 'deviceType',
	// 				tabs: tabs(),
	// 				hashLinks: true
	// 			})
	// 			if (props.location.hash !== '') {
	// 				scrollToAnchor(props.location.hash)
	// 			}
	// 		}
	// 	}
	// 	else {
	// 		props.history.push({
	// 			pathname: '/404',
	// 			prevURL: window.location.pathname
	// 		})
	// 	}
	// }

	const addToFav = () => {
		let favObj = {
			id: deviceType.id,
			name: deviceType.name,
			type: 'deviceType',
			path: props.match.url
		}
		dispatch(addToFav(favObj))
	}

	const removeFromFav = () => {
		let favObj = {
			id: deviceType.id,
			name: deviceType.name,
			type: 'deviceType',
			path: props.match.url
		}
		dispatch(removeFromFav(favObj))
	}

	const snackBarMessages = (msg) => {
		switch (msg) {
			default:
				break
		}
	}

	const handleOpenDeleteDialog = () => {
		setOpenDelete(true)
	}
	const handleCloseDeleteDialog = () => {
		setOpenDelete(false)
	}
	const handleDeleteDT = async () => {
		if (dispatch(isFav(deviceType.id)))
			removeFromFav()
		await deleteDeviceType(deviceType.id).then(() => {
			handleCloseDeleteDialog()
			snackBarMessages(1)
			props.history.push('/devicetypes/list')
		})
	}

	const renderDeleteDialog = () => {
		return <DeleteDialog
			t={t}
			title={'dialogs.delete.title.deviceType'}
			message={'dialogs.delete.message.deviceType'}
			messageOpts={{ deviceType: deviceType.name }}
			open={openDelete}
			single
			handleCloseDeleteDialog={handleCloseDeleteDialog}
			handleDelete={handleDeleteDT}
		/>
	}


	const renderLoader = () => {
		return <CircularLoader />
	}

	const { history, match } = props
	return (
		<Fragment>
			{!loading ? <Fade in={true}>
				<GridContainer justify={'center'} alignContent={'space-between'}>
					{renderDeleteDialog()}
					<ItemGrid xs={12} noMargin id='details'>
						<DeviceTypeDetails
							isFav={dispatch(isFav(({ id: deviceType.id, type: 'deviceType' })))}
							addToFav={addToFav}
							removeFromFav={removeFromFav}
							handleOpenDeleteDialog={handleOpenDeleteDialog}
							deviceType={deviceType}
							history={history}
							match={match}
							t={t}
							accessLevel={accessLevel}
						/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin id={'metadata'}>
						<DeviceTypeMetadata
							deviceType={deviceType}
							t={t}
						/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin id={'cloudfunctions'}>
						<DeviceTypeCloudFunctions
							deviceType={deviceType}
							t={t}
						/>
					</ItemGrid>
				</GridContainer></Fade>
				: renderLoader()}
		</Fragment>
	)
}

export default withStyles(deviceTypeStyles)(DeviceType)
