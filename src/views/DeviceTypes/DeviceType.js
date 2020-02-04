import { withStyles, Fade } from '@material-ui/core';
import deviceTypeStyles from 'assets/jss/views/deviceStyles';
import { CircularLoader, GridContainer, ItemGrid, DeleteDialog } from 'components';
import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { getProject } from 'variables/dataProjects';
// import { getWeather } from 'variables/dataDevices';
// import moment from 'moment'
import { DataUsage, CloudUpload, StorageIcon } from 'variables/icons';
// import Toolbar from 'components/Toolbar/Toolbar';
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { scrollToAnchor } from 'variables/functions';
import { getDeviceTypeLS } from 'redux/data';
import DeviceTypeDetails from './DeviceTypeCards/DeviceTypeDetails';
import DeviceTypeMetadata from './DeviceTypeCards/DeviceTypeMetadata';
import DeviceTypeCloudFunctions from './DeviceTypeCards/DeviceTypeCloudFunctions';
import { deleteDeviceType } from 'variables/dataDeviceTypes';
import { useLocalization, useSnackbar } from 'hooks';

const DeviceType = props => {
	//Hooks

	const dispatch = useDispatch()
	const t = useLocalization()
	const s = useSnackbar().s

	//Redux

	const accessLevel = useSelector(store => store.settings.user.privileges)
	const saved = useSelector(store => store.favorites.saved)
	const deviceType = useSelector(store => store.data.deviceType)
	const loading = useSelector(store => !store.data.gotDeviceType)

	//State

	const [openDelete, setOpenDelete] = useState(false)

	//Const



	const tabs = useCallback(() => {
		return [
			{ id: 0, title: t('tabs.details'), label: <DataUsage />, url: `#details` },
			{ id: 1, title: t('tabs.metadata'), label: <StorageIcon />, url: `#metadata` },
			{ id: 2, title: t('tabs.cloudfunctions'), label: <CloudUpload />, url: `#cloudfunctions` },
		]
	}, [t])

	// const getDeviceType = async (id) => {
	// 	await getDeviceTypeLS(id)
	// }

	useEffect(() => {
		const asyncFunc = async () => {
			if (saved === true) {
				if (dispatch(isFav(({ id: deviceType.id, type: 'deviceType' })))) {
					s('snackbars.favorite.saved', { name: deviceType.name, type: t('favorites.types.devicetype') })
					dispatch(finishedSaving())
				}
				if (!dispatch(isFav(({ id: deviceType.id, type: 'deviceType' })))) {
					s('snackbars.favorite.removed', { name: deviceType.name, type: t('favorites.types.devicetype') })
					dispatch(finishedSaving())
				}
			}
		}
		asyncFunc()
	}, [props.match.params.id, deviceType, saved, dispatch, t, s])

	useEffect(() => {
		const getDT = async () => {
			if (props.match) {
				let id = props.match.params.id
				await dispatch(await getDeviceTypeLS(id))
			}
		}
		getDT()
		if (props.location.hash !== '') {
			scrollToAnchor(props.location.hash)
		}
		//eslint-disable-next-line
	}, [])
	useEffect(() => {
		if (deviceType) {

			props.setTabs({
				route: 0,
				id: 'deviceType',
				tabs: tabs(),
				hashLinks: true
			})
			props.setBC('devicetype', deviceType.name)
			let prevURL = props.location.prevURL ? props.location.prevURL : '/deviceTypes/list'
			props.setHeader('sidebar.devicetype', true, prevURL, 'manage.devicetypes')
		}
	}, [deviceType, props, tabs])

<<<<<<< HEAD
	const addToFavorite = () => {
=======
	const addToFavFunc = () => {
>>>>>>> 14bc69624e1552b0a6371abab49cb65e6a20f461
		let favObj = {
			id: deviceType.id,
			name: deviceType.name,
			type: 'devicetype',
			path: props.match.url
		}
		dispatch(addToFav(favObj))
	}

<<<<<<< HEAD
	const removeFromFavorite = () => {
=======
	const removeFromFavFunc = () => {
>>>>>>> 14bc69624e1552b0a6371abab49cb65e6a20f461
		let favObj = {
			id: deviceType.id,
			name: deviceType.name,
			type: 'devicetype',
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

	return (
		<Fragment>
			{!loading ? <Fade in={true}>
				<GridContainer justify={'center'} alignContent={'space-between'}>
					{renderDeleteDialog()}
					<ItemGrid xs={12} noMargin id='details'>
						<DeviceTypeDetails
							isFav={dispatch(isFav(({ id: deviceType.id, type: 'deviceType' })))}
							addToFav={addToFavFunc}
							removeFromFav={removeFromFavFunc}
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
