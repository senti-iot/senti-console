import { Fade } from '@material-ui/core';
import { CircularLoader, GridContainer, ItemGrid, DeleteDialog } from 'components';
import React, { useEffect, Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataUsage, Code } from 'variables/icons';
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { scrollToAnchor } from 'variables/functions';
import { getFunctionLS } from 'redux/data';
import FunctionCode from './CloudCards/FunctionCode';
import FunctionDetails from './CloudCards/FunctionDetails';
import { deleteCFunction } from 'variables/dataFunctions';
import { useLocalization, useSnackbar, useHistory, useLocation, useMatch } from 'hooks'
import { useParams } from 'react-router-dom';

const CloudFunction = props => {
	//Hooks
	const history = useHistory()
	const s = useSnackbar().s
	const t = useLocalization()
	const dispatch = useDispatch()
	const location = useLocation()
	const params = useParams()
	const match = useMatch()

	//Redux
	const accessLevel = useSelector(state => state.settings.user.privileges)
	const saved = useSelector(state => state.favorites.saved)
	const cloudfunction = useSelector(state => state.data.cloudfunction)
	const loading = useSelector(state => !state.data.gotFunction)

	//State
	const [openDelete, setOpenDelete] = useState(false)

	//Const
	const { setTabs, setHeader, setBC } = props

	//useEffect

	useEffect(() => {
		if (saved === true) {
			if (dispatch(isFav({ id: cloudfunction.id, type: 'cloudfunction' }))) {
				s('snackbars.favorite.saved', { name: cloudfunction.name, type: t('favorites.types.cloudfunction') })
				dispatch(finishedSaving())
			}
			if (!dispatch(isFav({ id: cloudfunction.id, type: 'cloudfunction' }))) {
				s('snackbars.favorite.removed', { name: cloudfunction.name, type: t('favorites.types.cloudfunction') })
				dispatch(finishedSaving())
			}
		}
	}, [cloudfunction, dispatch, s, saved, t])

	useEffect(() => {
		const asyncFunc = async () => {
			if (params) {
				let id = params.id
				if (id) {
					await dispatch(await getFunctionLS(id))

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
		asyncFunc()
		// eslint-disable-next-line
	}, [])
	useEffect(() => {
		if (cloudfunction) {
			const tabs = [
				{ id: 0, title: t('tabs.details'), label: <DataUsage />, url: `#details` },
				{ id: 1, title: t('tabs.code'), label: <Code />, url: `#code` }
			]
			setTabs({
				route: 0,
				id: 'cloudfunction',
				tabs: tabs,
				hashLinks: true
			})

			let prevURL = location.prevURL ? location.prevURL : '/functions/list'
			setHeader('sidebar.cloudfunction', true, prevURL, 'manage.cloudfunctions')
			setBC('cloudfunction', cloudfunction.name)
		}
	}, [cloudfunction, location.prevURL, setBC, setHeader, setTabs, t])

	const addToFavorites = () => {
		let favObj = {
			id: cloudfunction.id,
			name: cloudfunction.name,
			type: 'cloudfunction',
			path: match.url
		}
		dispatch(addToFav(favObj))
	}
	const removeFromFavorites = () => {
		let favObj = {
			id: cloudfunction.id,
			name: cloudfunction.name,
			type: 'cloudfunction',
			path: match.url
		}
		dispatch(removeFromFav(favObj))
	}
	const isFavorite = (id) => dispatch(isFav({ id: id, type: 'cloudfunction' }))
	//TODO
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

	const handleDeleteSensor = async () => {
		if (dispatch(isFav(cloudfunction.id)))
			removeFromFavorites()
		await deleteCFunction(cloudfunction.id).then(() => {
			handleCloseDeleteDialog()
			// snackBarMessages(1)
			history.push('/functions/list')
		})
	}

	const renderDeleteDialog = () => {
		return <DeleteDialog
			t={t}
			title={'dialogs.delete.title.cloudfunction'}
			message={'dialogs.delete.message.cloudfunction'}
			messageOpts={{ cf: cloudfunction.name }}
			open={openDelete}
			single
			handleCloseDeleteDialog={handleCloseDeleteDialog}
			handleDelete={handleDeleteSensor}
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
					<ItemGrid xs={12} noMargin id="details">
						<FunctionDetails
							cloudfunction={cloudfunction}
							handleOpenDeleteDialog={handleOpenDeleteDialog}
							isFav={isFavorite(cloudfunction.id)}
							addToFav={addToFavorites}
							removeFromFav={removeFromFavorites}
							accessLevel={accessLevel}
						/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin id='code'>
						<FunctionCode
							cloudfunction={cloudfunction}
						/>
					</ItemGrid>
				</GridContainer></Fade>
				: renderLoader()}
		</Fragment>
	)
}

export default CloudFunction
