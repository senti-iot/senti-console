import { Fade } from '@material-ui/core';
import { CircularLoader, GridContainer, ItemGrid, DeleteDialog } from 'components';
import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataUsage, DeviceHub } from 'variables/icons';
// import Toolbar from 'components/Toolbar/Toolbar';
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { scrollToAnchor } from 'variables/functions';
import { getRegistryLS } from 'redux/data';
import RegistryDetails from './RegistryCards/RegistryDetails';
import RegistryDevices from './RegistryCards/RegistryDevices';
import { deleteRegistry } from 'variables/dataRegistry';
import { useLocalization, useSnackbar, useHistory, useMatch, useLocation } from 'hooks';


const Registry = props => {
	//Hooks
	const dispatch = useDispatch()
	const s = useSnackbar().s
	const t = useLocalization()
	const history = useHistory()
	const match = useMatch()
	const location = useLocation()
	//Redux
	const accessLevel = useSelector(store => store.settings.user.privileges)
	const saved = useSelector(store => store.favorites.saved)
	const registry = useSelector(store => store.data.registry)
	const loading = useSelector(store => !store.data.gotRegistry)

	//State
	const [openDelete, setOpenDelete] = useState(false)

	//Const
	const { setBC, setTabs, setHeader } = props

	//useCallbacks
	const isFavorite = useCallback(id => dispatch(isFav({ id: id, type: 'registry' })), [dispatch])

	//useEffects

	useEffect(() => {
		if (saved === true) {
			if (isFavorite(registry.id)) {
				s('snackbars.favorite.saved', { name: registry.name, type: t('favorites.types.registry') })
				dispatch(finishedSaving())
			}
			if (!isFavorite(registry.id)) {
				s('snackbars.favorite.removed', { name: registry.name, type: t('favorites.types.registry') })
				dispatch(finishedSaving())
			}
		}

	}, [saved, match, dispatch, registry, s, t, isFavorite])

	useEffect(() => {
		const getReg = async () => {
			if (match) {
				let id = match.params.id
				if (id) {
					await dispatch(await getRegistryLS(id))

				}
			}
		}
		getReg()
		if (location.hash !== '') {
			scrollToAnchor(location.hash)
		}
		//eslint-disable-next-line
	}, [])

	useEffect(() => {
		if (registry) {
			const tabs = () => {
				return [
					{ id: 0, title: t('tabs.details'), label: <DataUsage />, url: `#details` },
					{ id: 1, title: t('tabs.devices'), label: <DeviceHub />, url: `#devices` }
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
		}

	})

	//Handlers

	const addToFavorites = () => {
		let favObj = {
			id: registry.id,
			name: registry.name,
			type: 'registry',
			path: match.url
		}
		dispatch(addToFav(favObj))
	}
	const removeFromFavorites = () => {
		let favObj = {
			id: registry.id,
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
		if (dispatch(isFav(registry.id)))
			removeFromFav()
		await deleteRegistry(registry.id).then(() => {
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
							isFav={isFavorite(registry.id)}
							addToFav={addToFavorites}
							removeFromFav={removeFromFavorites}
							registry={registry}
							history={history}
							match={match}
							handleOpenDeleteDialog={handleOpenDeleteDialog}
							t={t}
							accessLevel={accessLevel}
						/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin id={'devices'}>
						<RegistryDevices
							devices={registry.devices}
							t={t}
						/>
					</ItemGrid>
				</GridContainer></Fade>
				: renderLoader()}
		</Fragment>
	)
}

export default Registry
