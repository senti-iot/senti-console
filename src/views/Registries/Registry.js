import { Fade } from '@material-ui/core';
import { CircularLoader, GridContainer, ItemGrid, DeleteDialog } from 'components';
import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataUsage, DeviceHub, Wifi } from 'variables/icons';
// import Toolbar from 'components/Toolbar/Toolbar';
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { scrollToAnchor } from 'variables/functions';
import { getRegistryLS } from 'redux/data';
import RegistryDetails from './RegistryCards/RegistryDetails';
import RegistryDevices from './RegistryCards/RegistryDevices';
import { deleteRegistry } from 'variables/dataRegistry';
import { useLocalization, useSnackbar, useHistory, useMatch, useLocation } from 'hooks';
import RegistryProtocol from 'views/Registries/RegistryProtocol'


const Registry = props => {
	//Hooks
	const dispatch = useDispatch()
	const s = useSnackbar().s
	const t = useLocalization()
	const history = useHistory()
	const match = useMatch()
	const location = useLocation()


	//Redux
	const saved = useSelector(store => store.favorites.saved)
	const registry = useSelector(store => store.data.registry)
	const loading = useSelector(store => !store.data.gotRegistry)

	//State
	const [openDelete, setOpenDelete] = useState(false)

	//Const
	const { setBC, setTabs, setHeader } = props

	//useCallbacks
	const isFavorite = useCallback(id => dispatch(isFav({ id: id, type: 'registry' })), [dispatch])

	const getReg = useCallback(async id => {
		if (!registry) {
			await dispatch(await getRegistryLS(match.params.id))
		}
		if (registry) {
			if (match.params.id !== registry.uuid) {
				await dispatch(await getRegistryLS(match.params.id))
			}
		}
	}, [dispatch, match.params.id, registry])
	//useEffects

	/**
	 * Use Effect for favorites handling
	 */
	useEffect(() => {
		if (saved === true) {
			if (isFavorite(registry.uuid)) {
				s('snackbars.favorite.saved', { name: registry.name, type: t('favorites.types.registry') })
				dispatch(finishedSaving())
			}
			if (!isFavorite(registry.uuid)) {
				s('snackbars.favorite.removed', { name: registry.name, type: t('favorites.types.registry') })
				dispatch(finishedSaving())
			}
		}

	}, [saved, match, dispatch, registry, s, t, isFavorite])

	useEffect(() => {
		const gReg = async () => await getReg()
		gReg()

		//eslint-disable-next-line
	}, [])

	useEffect(() => {
		if (registry) {
			const tabs = () => {
				return [
					{ id: 0, title: t('tabs.details'), label: <DataUsage />, url: `#details` },
					{ id: 1, title: t('tabs.devices'), label: <DeviceHub />, url: `#devices` },
					{ id: 2, title: t("registries.fields.protocol"), label: <Wifi />, url: `#protocol` }
				]
			}
			setBC('registry', registry.name)
			setTabs({
				route: 0,
				id: 'registry',
				tabs: tabs(),
				hashLinks: true
			})
			let prevURL = location.prevURL ? location.prevURL : '/registries/list'
			setHeader('registries.fields.registry', true, prevURL, 'manage.registries')
			if (location.hash !== '') {
				scrollToAnchor(location.hash)
			}
		}

	})

	//Handlers

	const addToFavorites = () => {
		let favObj = {
			id: registry.uuid,
			name: registry.name,
			description: registry.description,
			type: 'registry',
			path: match.url,
			orgName: registry.org.name,
			orgUUID: registry.org.uuid,
		}
		dispatch(addToFav(favObj))
	}
	const removeFromFavorites = () => {
		let favObj = {
			id: registry.uuid,
			name: registry.name,
			type: 'registry',
			path: match.url
		}
		dispatch(removeFromFav(favObj))
	}

	//TODO snackbarMessages

	// const snackBarMessages = (msg) => {
	// 	switch (msg) {
	// 		default:
	// 			break
	// 	}
	// }

	const handleOpenDeleteDialog = () => {
		setOpenDelete(true)
	}
	const handleCloseDeleteDialog = () => {
		setOpenDelete(false)
	}
	const handleDeleteRegistry = async () => {
		if (dispatch(isFav({ id: registry.uuid, type: 'registry' })))
			removeFromFavorites()
		await deleteRegistry(registry.uuid).then(() => {
			handleCloseDeleteDialog()
			// snackBarMessages(1)
			history.push('/registries/list')
		})
	}
	const renderDeleteDialog = () => {
		return <DeleteDialog
			t={t}
			title={'dialogs.delete.title.registry'}
			message={'dialogs.delete.message.registry'}
			messageOpts={{ registry: registry.name }}
			open={openDelete}
			single
			handleCloseDeleteDialog={handleCloseDeleteDialog}
			handleDelete={handleDeleteRegistry}
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
						<RegistryDetails
							isFav={isFavorite(registry.uuid)}
							addToFav={addToFavorites}
							removeFromFav={removeFromFavorites}
							registry={registry}
							handleOpenDeleteDialog={handleOpenDeleteDialog}
						/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin id={'devices'}>
						<RegistryDevices
							registry={registry}
							devices={registry.devices}
							t={t}
						/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin id={'protocol'}>
						<RegistryProtocol
							registry={registry}
						/>
					</ItemGrid>
				</GridContainer></Fade>
				: renderLoader()}
		</Fragment>
	)
}

export default Registry
