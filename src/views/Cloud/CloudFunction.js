import { withStyles, Fade } from '@material-ui/core';
import cloudfunctionStyles from 'assets/jss/views/deviceStyles';
import { CircularLoader, GridContainer, ItemGrid, DeleteDialog } from 'components';
import React, { useEffect, Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataUsage, Code } from 'variables/icons';
// import Toolbar from 'components/Toolbar/Toolbar';
import { isFav, addToFav, removeFromFav, finishedSaving } from 'redux/favorites';
import { scrollToAnchor } from 'variables/functions';
import { getFunctionLS } from 'redux/data';
import FunctionCode from './CloudCards/FunctionCode';
import FunctionDetails from './CloudCards/FunctionDetails';
import { deleteCFunction } from 'variables/dataFunctions';
import { useLocalization, useSnackbar } from 'hooks'


// @Andrei
const Function = props => {
	const s = useSnackbar().s
	const t = useLocalization()
	const dispatch = useDispatch()
	const accessLevel = useSelector(state => state.settings.user.privileges)
	// const language = useSelector(state => state.settings.language)
	const saved = useSelector(state => state.favorites.saved)
	// const mapTheme = useSelector(state => state.settings.mapTheme)
	// const periods = useSelector(state => state.dateTime.periods)
	const cloudfunction = useSelector(state => state.data.cloudfunction)
	const loading = useSelector(state => !state.data.gotFunction)

	// const [stateLoading, setStateLoading] = useState(true)
	// const [anchorElHardware, setAnchorElHardware] = useState(null)
	const [openDelete, setOpenDelete] = useState(false)

	let prevURL = props.location.prevURL ? props.location.prevURL : '/functions/list'
	props.setHeader('sidebar.cloudfunction', true, prevURL, 'functions')

	// constructor(props) {
	// 	super(props)

	// 	this.state = {
	// 		loading: true,
	// 		anchorElHardware: null,
	// 		openDelete: false,
	// 	}
	// 	let prevURL = props.location.prevURL ? props.location.prevURL : '/functions/list'
	// 	props.setHeader('sidebar.cloudfunction', true, prevURL, 'functions')
	// }

	// let format = 'YYYY-MM-DD+HH:mm'
	const tabs = () => {
		// const { t } = this.props
		return [
			{ id: 0, title: t('tabs.details'), label: <DataUsage />, url: `#details` },
			{ id: 1, title: t('tabs.code'), label: <Code />, url: `#code` }
		]
	}

	// eslint-disable-next-line no-unused-vars
	const reload = async (msgId) => {
		snackBarMessages(msgId)
		dispatch(await getFunctionLS(props.match.params.id))
		// getFunction(props.match.params.id)
	}

	const getFunctionFunc = async (id) => {
		// const { getFunction } = props
		dispatch(await getFunctionLS(id))
		// await getFunction(id)
	}

	useEffect(() => {
		if (saved === true) {
			// const { cloudfunction } = this.props
			if (dispatch(isFav({ id: cloudfunction.id, type: 'cloudfunction' }))) {
				s('snackbars.favorite.saved', { name: cloudfunction.name, type: t('favorites.types.cloudfunction') })
				dispatch(finishedSaving())
			}
			if (!dispatch(isFav({ id: cloudfunction.id, type: 'cloudfunction' }))) {
				s('snackbars.favorite.removed', { name: cloudfunction.name, type: t('favorites.types.cloudfunction') })
				dispatch(finishedSaving())
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.match.params.id])

	useEffect(() => {
		const asyncFunc = async () => {
			if (props.match) {
				let id = props.match.params.id
				if (id) {
					await getFunctionFunc(id).then(() => cloudfunction ? props.setBC('cloudfunction', cloudfunction.name) : null
					)
					props.setTabs({
						route: 0,
						id: 'cloudfunction',
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// componentDidMount = async () => {
	// 	if (this.props.match) {
	// 		let id = this.props.match.params.id
	// 		if (id) {
	// 			await this.getFunction(id).then(() => this.props.cloudfunction ? this.props.setBC('cloudfunction', this.props.cloudfunction.name) : null
	// 			)
	// 			this.props.setTabs({
	// 				route: 0,
	// 				id: 'cloudfunction',
	// 				tabs: this.tabs(),
	// 				hashLinks: true
	// 			})
	// 			if (this.props.location.hash !== '') {
	// 				scrollToAnchor(this.props.location.hash)
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
		// const { cloudfunction } = this.props
		let favObj = {
			id: cloudfunction.id,
			name: cloudfunction.name,
			type: 'cloudfunction',
			path: props.match.url
		}
		dispatch(addToFav(favObj))
	}
	const removeFromFavorites = () => {
		// const { cloudfunction } = this.props
		let favObj = {
			id: cloudfunction.id,
			name: cloudfunction.name,
			type: 'cloudfunction',
			path: props.match.url
		}
		dispatch(removeFromFav(favObj))
	}

	const snackBarMessages = (msg) => {
		// const { s, t, cloudfunction } = this.props

		switch (msg) {
			default:
				break
		}
	}
	const handleOpenDeleteDialog = () => {
		setOpenDelete(true)
		// this.setState({
		// 	openDelete: true
		// })
	}
	const handleCloseDeleteDialog = () => {
		setOpenDelete(false)
		// this.setState({
		// 	openDelete: false
		// })
	}
	const handleDeleteSensor = async () => {
		// const { cloudfunction } = this.props
		if (dispatch(isFav(cloudfunction.id)))
			removeFromFavorites()
		await deleteCFunction(cloudfunction.id).then(() => {
			handleCloseDeleteDialog()
			snackBarMessages(1)
			props.history.push('/functions/list')
		})
	}
	const renderDeleteDialog = () => {
		// const { openDelete } = this.state
		// const { t } = this.props
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


	const { history, match } = props
	return (
		<Fragment>
			{!loading ? <Fade in={true}>
				<GridContainer justify={'center'} alignContent={'space-between'}>
					{renderDeleteDialog()}
					<ItemGrid xs={12} noMargin id="details">
						<FunctionDetails
							cloudfunction={cloudfunction}
							handleOpenDeleteDialog={handleOpenDeleteDialog}
							isFav={dispatch(isFav({ id: cloudfunction.id, type: 'cloudfunction' }))}
							addToFav={addToFavorites}
							removeFromFav={removeFromFavorites}
							history={history}
							t={t}
							accessLevel={accessLevel}
							match={match}
						/>
					</ItemGrid>
					<ItemGrid xs={12} noMargin id='code'>
						<FunctionCode
							theme={props.theme}
							cloudfunction={cloudfunction}
							t={t}
						/>
					</ItemGrid>
				</GridContainer></Fade>
				: renderLoader()}
		</Fragment>
	)
}

export default withStyles(cloudfunctionStyles, { withTheme: true })(Function)
