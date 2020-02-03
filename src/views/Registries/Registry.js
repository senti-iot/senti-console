import { withStyles, Fade } from '@material-ui/core';
import registryStyles from 'assets/jss/views/deviceStyles';
import { CircularLoader, GridContainer, ItemGrid, DeleteDialog } from 'components';
import React, { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataUsage, DeviceHub } from 'variables/icons';
// import Toolbar from 'components/Toolbar/Toolbar';
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { scrollToAnchor } from 'variables/functions';
import { getRegistryLS } from 'redux/data';
import RegistryDetails from './RegistryCards/RegistryDetails';
import RegistryDevices from './RegistryCards/RegistryDevices';
import { deleteRegistry } from 'variables/dataRegistry';
import { useLocalization, useSnackbar } from 'hooks';


const Registry = props => {
	//Hooks
	const dispatch = useDispatch()
	const s = useSnackbar().s
	const t = useLocalization()

	//Redux
	const accessLevel = useSelector(store => store.settings.user.privileges)
	const saved = useSelector(store => store.favorites.saved)
	const registry = useSelector(store => store.data.registry)
	const loading = useSelector(store => !store.data.gotRegistry)

	//State
	const [openDelete, setOpenDelete] = useState(false)

	//Const

	useEffect(() => {
		if (saved === true) {
			if (dispatch(isFav({ id: registry.id, type: 'registry' }))) {
				s('snackbars.favorite.saved', { name: registry.name, type: t('favorites.types.registry') })
				dispatch(finishedSaving())
			}
			if (!dispatch(isFav({ id: registry.id, type: 'registry' }))) {
				s('snackbars.favorite.removed', { name: registry.name, type: t('favorites.types.registry') })
				dispatch(finishedSaving())
			}
		}

	}, [saved, props.match, dispatch, registry, s, t])

	useEffect(() => {
		const getReg = async () => {
			if (props.match) {
				let id = props.match.params.id
				if (id) {
					await dispatch(await getRegistryLS(id))

				}
			}
		}
		getReg()
		if (props.location.hash !== '') {
			scrollToAnchor(props.location.hash)
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
			props.setBC('registry', registry.name)
			props.setTabs({
				route: 0,
				id: 'registry',
				tabs: tabs(),
				hashLinks: true
			})
			let prevURL = props.location.prevURL ? props.location.prevURL : '/registries/list'
			props.setHeader('registries.fields.registry', true, prevURL, 'manage.registries')
		}

	})
	// const componentDidMount = async () => {
	// 	if (props.match) {
	// 		let id = props.match.params.id
	// 		if (id) {
	// 			await getRegistry(id).then(() => props.registry ? props.setBC('registry', props.registry.name) : null
	// 			)
	// 			props.setTabs({
	// 				route: 0,
	// 				id: 'registry',
	// 				tabs: tabs(),
	// 				hashLinks: true
	// 			})
	// 			if (props.location.hash !== '') {
	// 				scrollToAnchor(props.location.hash)
	// 			}
	// 		}
	// 	}
	// 	else {
	// 		this.props.history.push({
	// 			pathname: '/404',
	// 			prevURL: window.location.pathname
	// 		})
	// 	}
	// }
	const addToFavorites = () => {
		let favObj = {
			id: registry.id,
			name: registry.name,
			type: 'registry',
			path: props.match.url
		}
		dispatch(addToFav(favObj))
	}
	const removeFromFavorites = () => {
		let favObj = {
			id: registry.id,
			name: registry.name,
			type: 'registry',
			path: props.match.url
		}
		dispatch(removeFromFav(favObj))
	}

	const snackBarMessages = (msg) => {
		// const { s, t, registry } = this.props

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
	const handleDeleteRegistry = async () => {
		if (dispatch(isFav(registry.id)))
			removeFromFav()
		await deleteRegistry(registry.id).then(() => {
			handleCloseDeleteDialog()
			snackBarMessages(1)
			props.history.push('/registries/list')
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

	const { history, match } = props
	return (
		<Fragment>
			{!loading ? <Fade in={true}>
				<GridContainer justify={'center'} alignContent={'space-between'}>
					{renderDeleteDialog()}
					<ItemGrid xs={12} noMargin id='details'>
						<RegistryDetails
							isFav={dispatch(isFav({ id: registry.id, type: 'registry' }))}
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

export default withStyles(registryStyles)(Registry)
