import { Fade } from '@material-ui/core';
import { CircularLoader, GridContainer, ItemGrid, DeleteDialog } from 'components';
import React, { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataUsage, CloudUpload, StorageIcon } from 'variables/icons';
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { scrollToAnchor } from 'variables/functions';
import { getDeviceTypeLS } from 'redux/data';
import DeviceTypeDetails from './DeviceTypeCards/DeviceTypeDetails';
import DeviceTypeMetadata from './DeviceTypeCards/DeviceTypeMetadata';
import DeviceTypeCloudFunctions from './DeviceTypeCards/DeviceTypeCloudFunctions';
import { deleteDeviceType } from 'variables/dataDeviceTypes';
import { useLocalization, useSnackbar, useHistory } from 'hooks';
import { useRouteMatch, useLocation } from 'react-router-dom';



const DeviceType = props => {
	//Hooks

	const dispatch = useDispatch()
	const t = useLocalization()
	const s = useSnackbar().s
	const history = useHistory()
	const match = useRouteMatch()
	const location = useLocation()

	//Redux

	const accessLevel = useSelector(store => store.settings.user.privileges)
	const saved = useSelector(store => store.favorites.saved)
	const deviceType = useSelector(store => store.data.deviceType)
	const loading = useSelector(store => !store.data.gotDeviceType)

	//State

	const [openDelete, setOpenDelete] = useState(false)

	//Const

	//useEffects
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
	}, [match.params.id, deviceType, saved, dispatch, t, s])

	useEffect(() => {
		const getDT = async () => {
			if (match) {
				let id = match.params.id
				await dispatch(await getDeviceTypeLS(id))
			}
		}
		getDT()
		if (location.hash !== '') {
			scrollToAnchor(location.hash)
		}
		//eslint-disable-next-line
	}, [])
	useEffect(() => {
		if (deviceType) {
			const tabs = [
				{ id: 0, title: t('tabs.details'), label: <DataUsage />, url: `#details` },
				{ id: 1, title: t('tabs.metadata'), label: <StorageIcon />, url: `#metadata` },
				{ id: 2, title: t('tabs.cloudfunctions'), label: <CloudUpload />, url: `#cloudfunctions` },
			]

			props.setTabs({
				route: 0,
				id: 'deviceType',
				tabs: tabs,
				hashLinks: true
			})
			props.setBC('devicetype', deviceType.name)
			let prevURL = location.prevURL ? location.prevURL : '/deviceTypes/list'
			props.setHeader('sidebar.devicetype', true, prevURL, 'manage.devicetypes')
		}
	}, [deviceType, location, props, t])

	//handlers

	//#region Favorites
	const isFavorite = (id) => dispatch(isFav({ id: id, type: 'devicetype' }))
	const addToFavFunc = () => {
		let favObj = {
			id: deviceType.id,
			name: deviceType.name,
			type: 'devicetype',
			path: match.url
		}
		dispatch(addToFav(favObj))
	}

	const removeFromFavFunc = () => {
		let favObj = {
			id: deviceType.id,
			name: deviceType.name,
			type: 'devicetype',
			path: match.url
		}
		dispatch(removeFromFav(favObj))
	}
	//#endregion

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
		if (isFavorite(deviceType.id))
			removeFromFavFunc()
		await deleteDeviceType(deviceType.id).then(() => {
			handleCloseDeleteDialog()
			snackBarMessages(1)
			history.push('/devicetypes/list')
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
							isFav={isFavorite(deviceType.id)}
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

export default DeviceType
