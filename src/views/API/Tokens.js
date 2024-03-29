import { Paper, Dialog, IconButton, DialogContent, DialogTitle, DialogActions, Fade, Tooltip } from '@material-ui/core'
import TokensTable from 'components/API/TokensTable'
import TableToolbar from 'components/Table/TableToolbar'
import React, { useState, Fragment, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import { copyToClipboard, dateTimeFormatter } from 'variables/functions'
import { Delete, ViewList, Close, Add, Code, ContentCopy } from 'variables/icons'
import { GridContainer, CircularLoader, ItemG, Caption, Info, DeleteDialog, Link, TextF, /* AssignProject */ } from 'components'
import { customFilterItems } from 'variables/Filters'
import { getTokens, setTokens, sortData, getSensors, getRegistries, getUsers, /* getDeviceTypes */ } from 'redux/data'
import CreateToken from './CreateToken'
import { deleteTokens } from 'variables/dataTokens'
import { useLocalization, useMatch, useSnackbar } from 'hooks'
import tokensStyles from 'assets/jss/components/api/tokensStyles'

const Tokens = props => {

	//Hooks
	const dispatch = useDispatch()
	const t = useLocalization()
	const s = useSnackbar().s
	const match = useMatch()
	const classes = tokensStyles()

	//Redux
	const accessLevel = useSelector(state => state.settings.user.privileges)
	const tokens = useSelector(state => state.data.tokens)
	const loading = useSelector(state => !state.data.gottokens)
	const filters = useSelector(state => state.appState.filters.tokens)
	const user = useSelector(state => state.settings.user)
	const devices = useSelector(state => state.data.sensors)
	const registries = useSelector(state => state.data.registries)
	const deviceTypes = useSelector(state => state.data.deviceTypes)

	//State
	const [selected, setSelected] = useState([])
	const [openToken, setOpenToken] = useState(false)
	const [openNewToken, setOpenNewToken] = useState(false)
	const [openDeleteS, setOpenDeleteS] = useState(false)
	const [openDeleteM, setOpenDeleteM] = useState(false)
	const [order, setOrder] = useState('asc')
	const [orderBy, setOrderBy] = useState('id')
	const [token, setToken] = useState(null) // added

	//Const
	const { setHeader, setBC, setTabs } = props
	const ft = [
		{ key: 'name', name: t('tokens.fields.name'), type: 'string' },
		{ key: '', name: t('filters.freeText'), type: 'string', hidden: true },
	]

	const tokensHeader = [
		// { id: 'id', label: t('tokens.fields.id') },
		{ id: 'name', label: t('tokens.fields.name') },
		{ id: 'counter', label: t('api.fields.counter') },
		{ id: 'lastCall', label: t('api.fields.lastCall') },
		{ id: 'created', label: t('registries.fields.created') },
		{ id: 'createdBy', label: t('api.fields.createdBy') }
	]

	const options = () => {
		let allOptions = [
			{ label: t('menus.delete'), func: handleOpenDeleteDialogM, icon: Delete },
		]
		return allOptions
	}

	//useCallbacks
	const getData = useCallback(async (reload) => {
		dispatch(setTokens())
		if (accessLevel || user) {
			if (reload || tokens.length === 0) {
				await dispatch(await getUsers(true, user.org.aux?.odeumId, false))
				dispatch(await getSensors(true, user.org.aux?.odeumId, false))
				dispatch(await getRegistries(true, user.org.aux?.odeumId, false))
				await dispatch(await getTokens(user.uuid, true, accessLevel.apisuperuser ? true : false))
				// dispatch(await getDeviceTypes(true, user.org.aux?.odeumId, false))
			}

		}
	}, [accessLevel, dispatch, tokens.length, user])

	//useEffects

	useEffect(() => {
		getData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {

		const tabs = [
			{ id: 0, title: t('tooltips.listView'), label: <ViewList />, url: `list` }
		]

		setHeader('sidebar.api', false, '', 'manage.api')
		setBC('api')
		setTabs({
			id: 'api',
			tabs: tabs,
			route: 0
		})

	}, [setBC, setHeader, setTabs, t])

	//Handlers


	//#region Functions
	const handleAddNewToken = () => {
		setOpenNewToken(true)
	}

	const filterItemsFunc = (data) => {
		return customFilterItems(data, filters)
	}
	const snackBarTokens = (token) => {
		switch (token) {
			case 1:
				s('snackbars.deletedSuccess')
				break
			default:
				break
		}
	}


	//#endregion

	//#region Handlers

	const handleRequestSortFunc = key => (event, property, way) => {
		let newOrder = way ? way : order === 'desc' ? 'asc' : 'desc'
		if (property !== orderBy) {
			newOrder = 'asc'
		}
		dispatch(sortData(key, property, newOrder))
		setOrder(newOrder)
		setOrderBy(property)
	}

	const handleDeleteTokens = async () => {
		// const { selected } = this.state
		let r = await deleteTokens(selected)
		if (r) {
			setSelected([])
			setOpenDeleteM(false)
			getData(true)
			snackBarTokens(1)
		}
	}
	const handleDeleteToken = async () => {
		let r = await deleteTokens([token.id])
		if (r) {
			setSelected([])
			setToken(null)
			setOpenToken(false)
			setOpenDeleteS(false)
			getData(true)
			snackBarTokens(1)
		}
	}
	const handleSelectAllClick = (arr, checked) => {
		if (checked) {
			setSelected(arr)
			return
		}
		setSelected([])
	}

	const handleCheckboxClick = (event, id) => {
		event.stopPropagation()
		const selectedIndex = selected.indexOf(id)
		let newSelected = []

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id)
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1))
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1))
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			)
		}
		setSelected(newSelected)
	}

	const handleOpenDeleteDialogM = () => {
		setOpenDeleteM(true)
	}

	const handleCloseDeleteDialogM = () => {
		setOpenDeleteM(false)
	}

	const handleOpenDeleteDialogS = () => {
		setOpenDeleteS(true)
	}

	const handleCloseDeleteDialogS = () => {
		setOpenDeleteS(false)
	}

	const handleOpenToken = token => () => {
		setOpenToken(true)
		setToken(token)

	}
	const handleCloseToken = () => {
		setOpenToken(false)
		setToken(null)
	}
	const handleGetDeviceTypeName = tId => {
		let dtExists = deviceTypes.findIndex(f => f.uuid === tId)
		if (dtExists > -1) {
			return deviceTypes[dtExists].name
		}
		else return tId
	 }
	const handleGetRegistryName = tId => {
		let rExists = registries.findIndex(f => f.uuid === tId)
		if (rExists > -1) {
			return registries[rExists].name
		}
		else return tId
	}
	const handleGetDeviceName = tId => {
		let dExists = devices.findIndex(d => d.uuid === tId)
		if (dExists > -1) {
			return devices[dExists].name
		}
		else return tId
	}
	// /:token/registry/:regID/:from/:to/
	// /:token/registry/:regID/latest
	const renderRegistryEndpoints = tId => {
		let reg = registries[registries.findIndex(f => f.uuid === tId)]?.uuname
		return <ItemG xs={12}>
			<Caption>{t('sensors.fields.protocols.externalAPI')}</Caption>
			<ItemG xs={12}>
				<Caption>{t('registries.fields.protocols.http')} - {t('api.latest')}</Caption>
				<TextF
					id={'mqtt-state'}
					fullWidth
					label={''}
					readOnly
					value={`https://api.senti.cloud/{{API_TOKEN}}/registry/${reg}/latest`}
					InputProps={{
						endAdornment:
							<ItemG>
								<IconButton onClick={() => {
									s('snackbars.urlCopied')
									copyToClipboard(`https://api.senti.cloud/{{API_TOKEN}}/registry/${reg}/latest`)
								}
								}>
									<ContentCopy />
								</IconButton>
							</ItemG>
					}
					}
				/>
			</ItemG>
			<ItemG xs={12}>
				<Caption>{t('registries.fields.protocols.http')} - {t('api.period')}</Caption>
				<TextF
					id={'mqtt-state'}
					fullWidth
					label={''}
					readOnly
					value={`https://api.senti.cloud/{{API_TOKEN}}/registry/${reg}/{{FROM_DATE}}/{{TO_DATE}}`}
					InputProps={{
						endAdornment:
							<ItemG>
								<IconButton onClick={() => {
									s('snackbars.urlCopied')
									copyToClipboard(`https://api.senti.cloud/{{API_TOKEN}}/registry/${reg}/{{FROM_DATE}}/{{TO_DATE}}`)
								}
								}>
									<ContentCopy />
								</IconButton>
							</ItemG>
					}
					}
				/>
			</ItemG>
		</ItemG>
	}
	const renderDeviceEndpoints = id => {
		return <ItemG xs={12}>
			<Caption>{t('sensors.fields.protocols.externalAPI')}</Caption>
			<ItemG xs={12}>
				<Caption>{t('registries.fields.protocols.http')} - {t('api.latest')}</Caption>
				<TextF
					id={'mqtt-state'}
					fullWidth
					label={''}
					readOnly
					value={`https://api.senti.cloud/{{API_TOKEN}}/devicedata/${id}/latest`}
					InputProps={{
						endAdornment:
							<ItemG>
								<IconButton onClick={() => {
									s('snackbars.urlCopied')
									copyToClipboard(`https://api.senti.cloud/{{API_TOKEN}}/devicedata/${id}/latest`)
								}
								}>
									<ContentCopy />
								</IconButton>
							</ItemG>
					}
					}
				/>
			</ItemG>
			<ItemG xs={12}>
				<Caption>{t('registries.fields.protocols.http')} - {t('api.period')}</Caption>
				<TextF
					id={'mqtt-state'}
					fullWidth
					label={''}
					readOnly
					value={`https://api.senti.cloud/{{API_TOKEN}}/devicedata/${id}/{{FROM_DATE}}/{{TO_DATE}}`}
					InputProps={{
						endAdornment:
							<ItemG>
								<IconButton onClick={() => {
									s('snackbars.urlCopied')
									copyToClipboard(`https://api.senti.cloud/{{API_TOKEN}}/devicedata/${id}/{{FROM_DATE}}/{{TO_DATE}}`)
								}
								}>
									<ContentCopy />
								</IconButton>
							</ItemG>
					}
					}
				/>
			</ItemG>
			<ItemG xs={12}>
				<Caption>{t('registries.fields.protocols.http')} - {t('api.periodField')}</Caption>
				<TextF
					id={'mqtt-state'}
					fullWidth
					label={''}
					readOnly
					value={`https://api.senti.cloud/{{API_TOKEN}}/devicedata/${id}/{{FROM_DATE}}/{{TO_DATE}}/{{DATA_FIELD}}/?{{CLOUD_FUNCTION_ID}}`}
					InputProps={{
						endAdornment:
							<ItemG>
								<IconButton onClick={() => {
									s('snackbars.urlCopied')
									copyToClipboard(`https://api.senti.cloud/{{API_TOKEN}}/devicedata/${id}/{{FROM_DATE}}/{{TO_DATE}}/{{DATA_FIELD}}/?{{CLOUD_FUNCTION_ID}}`)
								}
								}>
									<ContentCopy />
								</IconButton>
							</ItemG>
					}
					}
				/>
			</ItemG>
		</ItemG>
	}
	const renderApiEndpoints = (type, id) => {
		switch (type) {
			case 0:
				return renderDeviceEndpoints(id)
			case 1:
				return renderRegistryEndpoints(id)
			default:
				break;
		}
	}
	const renderReference = (type, tId) => {
		switch (type) {
			case 0:
				return <Link to={{ pathname: `/sensor/${tId}`, prevURL: '/api/list' }}>
					<Info>
						{handleGetDeviceName(tId)}
					</Info>
				</Link>
			case 1:
				return <Link to={{ pathname: `/registry/${tId}`, prevURL: '/api/list' }}>
					<Info>
						{handleGetRegistryName(tId)}
					</Info>
				</Link>
			case 2:
				return <Link to={{ pathname: `/devicetype/${tId}`, prevURL: '/api/list' }}>
					<Info>
						{handleGetDeviceTypeName(tId)}
					</Info>
				</Link>

			default:
				break
		}
	}
	const renderType = (type) => {
		switch (type) {
			case 0:
				return t('tokens.fields.types.device')
			case 1:
				return t('tokens.fields.types.registry')
			case 2:
				return t('tokens.fields.types.devicetype')

			default:
				break
		}
	}
	const renderToken = () => {

		return <Dialog
			open={openToken}
			onClose={handleCloseToken}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
			PaperProps={{
				style: {
					width: 600
				}
			}}
		>
			{token ?
				<Fragment>
					<DialogTitle disableTypography >
						<ItemG container justify={'space-between'} alignItems={'center'}>
							{token.name}
							<ItemG container xs alignItems={'center'} justify={'flex-end'}>

								<Tooltip title={t('actions.delete')}>
									<IconButton className={classes.closeButton} onClick={handleOpenDeleteDialogS}>
										<Delete />
									</IconButton>
								</Tooltip>
								<Tooltip title={t('actions.close')}>
									<IconButton className={classes.closeButton} aria-label="Close" onClick={handleCloseToken}>
										<Close />
									</IconButton>
								</Tooltip>
							</ItemG>
						</ItemG>
					</DialogTitle>
					<DialogContent>
						<ItemG container>
							{/* <ItemG xs={6}>
								<Caption>{t('tokens.fields.name')}</Caption>
								<Info>{token.name}</Info>
							</ItemG> */}
							<ItemG xs={12}>
								<Caption>{t('tokens.fields.created')}</Caption>
								<Info>{dateTimeFormatter(token.created, true)}</Info>
							</ItemG>
							<ItemG xs={6}>
								<Caption>{t('tokens.fields.type')}</Caption>
								<Info>{renderType(token.type)}</Info>
							</ItemG>
							<ItemG xs={6}>
								<Caption>{t('tokens.fields.reference')}</Caption>
								{renderReference(token.type, token.type_id)}
							</ItemG>
							<ItemG xs={12}>
								{renderApiEndpoints(token.type, token.type_id)}
							</ItemG>
						</ItemG>

					</DialogContent>
					<DialogActions>

					</DialogActions>
				</Fragment>
				: <div />}
		</Dialog>
	}
	const renderDeleteDialogMultiple = () => {

		let data = selected.map(s => tokens[tokens.findIndex(t => t.id === s)])
		return <DeleteDialog
			t={t}
			title={'dialogs.delete.title.tokens'}
			message={'dialogs.delete.message.tokens'}
			open={openDeleteM}
			handleCloseDeleteDialog={handleCloseDeleteDialogM}
			icon={<Code />}
			handleDelete={handleDeleteTokens}
			data={data}
			dataKey={'name'}
		/>
	}

	const renderDeleteDialogSingle = () => {

		return <DeleteDialog
			t={t}
			title={'dialogs.delete.title.token'}
			message={'dialogs.delete.message.token'}
			messageOpts={{ token: token ? token.name : '' }}
			open={openDeleteS}
			single
			handleCloseDeleteDialog={handleCloseDeleteDialogS}
			handleDelete={handleDeleteToken}
		/>
	}


	const renderTableToolBarContent = () => {
		return <Fragment>
			<Tooltip title={t('menus.create.token')}>
				<IconButton aria-label='Add new token' onClick={handleAddNewToken}>
					<Add />
				</IconButton>
			</Tooltip>
		</Fragment>
	}

	const renderTableToolBar = () => {
		return <TableToolbar
			ft={ft}
			reduxKey={'tokens'}
			numSelected={selected.length}
			options={options}
			t={t}
			content={renderTableToolBarContent()}
		/>
	}
	const renderNewToken = () => {
		return <CreateToken
			t={t}
			openToken={openNewToken}
			handleClose={() => {
				setOpenNewToken(false)
				getData(true)
				// this.setState({
				// 	openNewToken: false
				// })
			}}
		/>
	}
	const renderTable = (items, handleClick, key) => {
		return <Fragment>
			{renderToken()}
			{renderNewToken()}
			<TokensTable
				data={filterItemsFunc(items)}
				handleCheckboxClick={handleCheckboxClick}
				handleClick={handleOpenToken}
				handleRequestSort={handleRequestSortFunc(key)}
				handleSelectAllClick={handleSelectAllClick}
				order={order}
				orderBy={orderBy}
				selected={selected}
				t={t}
				tableHead={tokensHeader}
			/>
		</Fragment>
	}

	const renderTokens = () => {
		return <GridContainer justify={'center'}>
			{loading ? <CircularLoader /> : <Fade in={true}><Paper className={classes.root}>
				{renderTableToolBar()}
				{renderTable(tokens, null, 'tokens')}
				{renderDeleteDialogMultiple()}
				{renderDeleteDialogSingle()}
			</Paper></Fade>
			}
		</GridContainer>
	}

	return (

		<Switch>
			<Route path={`${match.path}/list`} render={() => renderTokens()} />
			<Redirect path={`${match.path}`} to={`${match.path}/list`} />
		</Switch>

	)
}

export default Tokens