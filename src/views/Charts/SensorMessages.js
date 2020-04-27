import React, { Fragment, useEffect } from 'react'
import {
	Grid, IconButton, Menu, ListItem, ListItemText, List, Tooltip, DialogTitle, DialogContent, Dialog, Divider, Link as MuiLink
} from '@material-ui/core'
import {
	MoreVert, KeyboardArrowLeft, KeyboardArrowRight, InsertChart, Close,
} from 'variables/icons'
import {
	CircularLoader, Caption, ItemG, InfoCard,
	DateFilterMenu,
	T
} from 'components'
import moment from 'moment'
import { dateTimeFormatter } from 'variables/functions'
import { changeDate } from 'redux/dateTime'
import TP from 'components/Table/TP'
import { Link } from 'react-router-dom'
import { useLocalization, useDispatch, useTheme, useSelector } from 'hooks'
import { useState } from 'react'
import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/src-noconflict/theme-monokai'

import sensorMessagesStyles from 'assets/jss/components/sensors/sensorMessagesStyles'


const SensorMessages = props => {
	//Hooks
	const t = useLocalization()
	const dispatch = useDispatch()
	const theme = useTheme()
	const classes = sensorMessagesStyles()
	//Redux
	const rowsPerPage = useSelector(s => s.appState.trp > 0 ? s.appState.trp : s.settings.trp)

	//State

	const [a, setA] = useState(null)
	const [openMessage, setOpenMessage] = useState(false)
	const [loading, setLoading] = useState(true)
	const [page, setPage] = useState(0)
	const [msg, setMsg] = useState(null)
	const [initialPeriod, setInitialPeriod] = useState(null)

	//Const
	const { getData, period, messages } = props

	const options = [
		{ id: 0, label: t('filters.dateOptions.today') },
		{ id: 1, label: t('filters.dateOptions.yesterday') },
		{ id: 2, label: t('filters.dateOptions.thisWeek') },
		{ id: 3, label: t('filters.dateOptions.7days') },
		{ id: 4, label: t('filters.dateOptions.30days') },
		{ id: 5, label: t('filters.dateOptions.90days') },
		{ id: 6, label: t('filters.dateOptions.custom') },
	]
	const timeTypes = [
		{ id: 0, format: 'lll dddd', chart: 'minute', tooltipFormat: 'LT' },
		{ id: 1, format: 'lll dddd', chart: 'hour', tooltipFormat: 'LT' },
		{ id: 2, format: 'lll dddd', chart: 'day', tooltipFormat: 'lll' },
		{ id: 3, format: 'lll dddd', chart: 'month', tooltipFormat: 'll' },
	]

	//useCallbacks

	//useEffects
	useEffect(() => {
		if (loading) {
			setLoading(false)
			let gData = async () => await getData()
			gData()
		}
	}, [getData, loading])
	useEffect(() => {
		if (period) {
			setLoading(true)
			let gData = async () => await getData()
			gData()
			setLoading(false)
		}
	}, [getData, period])
	// useEffect(() => {
	// 	if (period) {
	// 		setLoading(true)
	// 		let gData = async () => await getData()
	// 		gData()
	// 		setLoading(false)
	// 	}
	// }, [getData, period])
	//Handlers
	const disableFuture = () => {
		if (moment().diff(period.to, 'hour') <= 0) {
			return true
		}
		return false
	}
	const handleChangePage = (event, page) => setPage(page)

	const handleCloseMessage = () => {
		setMsg(null)
		setOpenMessage(false)

	}

	const handleOpenMessage = msg => e => {
		e.preventDefault()
		setMsg(msg)
		setOpenMessage(true)
	}

	const handleOpenActionsDetails = event => {
		setA(event.currentTarget)
	}

	const handleCloseActionsDetails = () => {
		setA(null)
	}

	const futureTester = (date, unit) => moment().diff(date, unit) <= 0
	const handleNextPeriod = () => {
		let from, to, diff
		if (!initialPeriod) {
			setInitialPeriod(period)
			// setState({ initialPeriod: period })
			if (period.menuId === 6) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).add(diff + 1, 'minute').startOf(timeTypes[period.timeType].chart)
				to = moment(period.to).add(diff + 1, 'minute').endOf(timeTypes[period.timeType].chart)
				to = futureTester(to, timeTypes[period.timeType].chart) ? moment() : to
			}
			if ([0, 1].indexOf(period.menuId) !== -1) {
				from = moment(period.from).add(1, 'day').startOf('day')
				to = moment(period.to).add(1, 'day').endOf('day')
				to = futureTester(to, 'hour') ? moment() : to

			}
			if (period.menuId === 2) {
				from = moment(period.from).add(1, 'week').startOf('week').startOf('day')
				to = moment(period.to).add(1, 'week').endOf('week').endOf('day')
				to = futureTester(to, 'day') ? moment() : to

			}
			if ([3, 4, 5].indexOf(period.menuId) !== -1) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).add(diff + 1, 'minute').startOf('day')
				to = moment(period.to).add(diff + 1, 'minute').endOf('day')
				to = futureTester(to, 'day') ? moment() : to
			}
		}
		else {
			if (initialPeriod.menuId === 6) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).add(diff + 1, 'minute').startOf(timeTypes[period.timeType].chart)
				to = moment(period.to).add(diff + 1, 'minute').endOf(timeTypes[period.timeType].chart)
				to = futureTester(to, timeTypes[period.timeType].chart) ? moment() : to

			}
			if ([0, 1].indexOf(initialPeriod.menuId) !== -1) {
				from = moment(period.from).add(1, 'day').startOf('day')
				to = moment(period.to).add(1, 'day').endOf('day')
				to = futureTester(to, 'hour') ? moment() : to
			}
			if (initialPeriod.menuId === 2) {
				from = moment(period.from).add(1, 'week').startOf('week').startOf('day')
				to = moment(period.to).add(1, 'week').endOf('week').endOf('day')
				to = futureTester(to, timeTypes[period.timeType].chart) ? moment() : to
				if (period.timeType === 2 || period.timeType === 3) {
					let dayDiff = to.diff(from, 'day')
					if (dayDiff <= 0) {
						return dispatch(changeDate(6, to, from, 1, period.id))
					}
				}
				else {
					return dispatch(changeDate(6, to, from, 2, period.id))
				}
			}
			if ([3, 4, 5].indexOf(initialPeriod.menuId) !== -1) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).add(diff + 1, 'minute').startOf('day')
				to = moment(period.to).add(diff + 1, 'minute').endOf('day')
				to = futureTester(to, 'day') ? moment() : to
			}
		}
		dispatch(changeDate(6, to, from, period.timeType, period.id))
	}
	const handlePreviousPeriod = () => {
		let from, to, diff
		if (!initialPeriod) {
			setInitialPeriod(period)
			if (period.menuId === 6) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).subtract(diff + 1, 'minute').startOf(timeTypes[period.timeType].chart)
				to = moment(period.to).subtract(diff + 1, 'minute').endOf(timeTypes[period.timeType].chart)
			}
			if ([0, 1].indexOf(period.menuId) !== -1) {
				from = moment(period.from).subtract(1, 'day').startOf('day')
				to = moment(period.to).subtract(1, 'day').endOf('day')
			}
			if (period.menuId === 2) {
				from = moment(period.from).subtract(1, 'week').startOf('week').startOf('day')
				to = moment(period.to).subtract(1, 'week').endOf('week').endOf('day')
			}
			if ([3, 4, 5].indexOf(period.menuId) !== -1) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).subtract(diff + 1, 'minute').startOf('day')
				to = moment(period.to).subtract(diff + 1, 'minute').endOf('day')
			}
		}
		else {
			if (initialPeriod.menuId === 6) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).subtract(diff + 1, 'minute').startOf(timeTypes[period.timeType].chart)
				to = moment(period.to).subtract(diff + 1, 'minute').endOf(timeTypes[period.timeType].chart)
			}
			if ([0, 1].indexOf(initialPeriod.menuId) !== -1) {
				from = moment(period.from).subtract(1, 'day').startOf('day')
				to = moment(period.to).subtract(1, 'day').endOf('day')
			}
			if (initialPeriod.menuId === 2) {
				from = moment(period.from).subtract(1, 'week').startOf('week').startOf('day')
				to = moment(period.to).subtract(1, 'week').endOf('week').endOf('day')
				if (period.timeType === 2 || period.timeType === 3) {
					let dayDiff = to.diff(from, 'day')
					if (dayDiff <= 0) {
						return dispatch(changeDate(6, to, from, 1, period.id))
					}
				}
				else {
					return dispatch(changeDate(6, to, from, 2, period.id))
				}
			}
			if ([3, 4, 5].indexOf(initialPeriod.menuId) !== -1) {
				diff = moment(period.to).diff(moment(period.from), 'minute')
				from = moment(period.from).subtract(diff + 1, 'minute').startOf('day')
				to = moment(period.to).subtract(diff + 1, 'minute').endOf('day')
			}
		}
		dispatch(changeDate(6, to, from, period.timeType, period.id))
	}

	const renderMessage = () => {
		return <Dialog
			open={openMessage}
			onClose={handleCloseMessage}
			aria-labelledby='alert-dialog-title'
			aria-describedby='alert-dialog-description'
			PaperProps={{
				style: {
					width: 600
				}
			}}
		>
			{msg ?
				<Fragment>
					<DialogTitle disableTypography >
						<ItemG container justify={'space-between'} alignItems={'center'}>

							{`${dateTimeFormatter(msg.created, true)} - ${msg.id}`}

							<IconButton aria-label="Close" style={{ color: '#fff' }} className={classes.closeButton} onClick={handleCloseMessage}>
								<Close />
							</IconButton>
						</ItemG>
					</DialogTitle>
					<DialogContent>
						<ItemG container>
							<ItemG xs={12}>
								<Caption>{t('messages.fields.data')}</Caption>
								<Divider />
								<div className={classes.editor}>
									<AceEditor
										// height={300}
										mode={'json'}
										theme={theme.palette.type === 'light' ? 'tomorrow' : 'monokai'}
										// onChange={handleCodeChange('js')}
										value={JSON.stringify(msg.data, null, 4)}
										showPrintMargin={false}
										style={{ width: '100%', height: '300px' }}
										name="seeMsgData"
									// editorProps={{ $blockScrolling: true }}
									/>
								</div>
							</ItemG>
						</ItemG>
					</DialogContent>
				</Fragment>
				: <div></div>}
		</Dialog>
	}


	const renderType = () => {
		if (!loading) {
			return (
				<Fragment>
					<List style={{ width: '100%' }}>
						{(messages && messages.length > 0) ?
							messages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n =>
								<ListItem key={n.id} button onClick={handleOpenMessage(n)} divider style={{ paddingLeft: 24 }}>
									<ListItemText style={{ margin: 0 }} primary={dateTimeFormatter(n.created, true)} secondary={n.id} />
								</ListItem>
							) : renderNoData()}
					</List>
					<TP
						count={messages ? messages.length : 0}
						page={page}
						t={t}
						handleChangePage={handleChangePage}
					/>
				</Fragment>
			)
		}
	}

	const renderMenu = () => {
		let displayTo = ''
		let displayFrom = ''
		if (period) {
			displayTo = dateTimeFormatter(period.to)
			displayFrom = dateTimeFormatter(period.from)

			return <ItemG container alignItems={'center'}>
				<ItemG style={{ width: 'auto' }} container alignItems={'center'}>
					<ItemG>
						<Tooltip title={t('tooltips.chart.previousPeriod')}>
							<IconButton onClick={() => handlePreviousPeriod(period)}>
								<KeyboardArrowLeft />
							</IconButton>
						</Tooltip>
					</ItemG>
					<ItemG>
						<Tooltip title={t('tooltips.chart.period')}>
							<DateFilterMenu
								button
								buttonProps={{
									style: {
										color: undefined,
										textTransform: 'none',
										padding: "8px 0px"
									}
								}}
								icon={
									<ItemG container justify={'center'}>
										<ItemG>
											<ItemG container style={{ width: 'min-content' }}>
												<ItemG xs={12}>
													<T noWrap component={'span'}>{`${displayFrom}`}</T>
												</ItemG>
												<ItemG xs={12}>
													<T noWrap component={'span'}> {`${displayTo}`}</T>
												</ItemG>
												<ItemG xs={12}>
													<T noWrap component={'span'}> {`${options[period ? period.menuId : 0].label}`}</T>
												</ItemG>
											</ItemG>

										</ItemG>

									</ItemG>
								}
								period={period}
								t={t} />
						</Tooltip>
					</ItemG>
					<ItemG>
						<Tooltip title={t('tooltips.chart.nextPeriod')}>
							<div>
								<IconButton onClick={handleNextPeriod} disabled={disableFuture(period)}>
									<KeyboardArrowRight />
								</IconButton>
							</div>
						</Tooltip>
					</ItemG>
				</ItemG>

				<ItemG>
					<Tooltip title={t('menus.menu')}>
						<IconButton
							aria-label='More'
							aria-owns={a ? 'long-menu' : null}
							aria-haspopup='true'
							onClick={handleOpenActionsDetails}>
							<MoreVert />
						</IconButton>
					</Tooltip>
				</ItemG>
				<Menu
					marginThreshold={24}
					id='long-menu'
					anchorEl={a}
					open={Boolean(a)}
					onClose={handleCloseActionsDetails}
					// onChange={handleVisibility}
					PaperProps={{ style: { minWidth: 250 } }}>

					{/* <ListItem button onClick={handleOpenDownloadModal}>
						<ListItemIcon><CloudDownload /></ListItemIcon>
						<ListItemText>{t('menus.export')}</ListItemText>
					</ListItem> */}

				</Menu>
			</ItemG>
		}
	}
	const renderNoData = () => {
		return <ItemG container justify={'center'}>
			<Caption> {t('devices.noData')}</Caption>
		</ItemG>
	}

	const renderNoPeriod = () => {
		return <ItemG container justify={'center'}>
			<ItemG xs={12} container justify={'center'}>
				<Caption>{t('devices.noPeriodSet')}</Caption>
			</ItemG>
			<ItemG xs={12} container justify={'center'}>
				<MuiLink component={Link} to={'/settings/#charts'}>
					<Caption>
						{t('devices.noPeriodSetLink')}
					</Caption>
				</MuiLink>
			</ItemG>
		</ItemG>
	}


	return (
		<Fragment>
			<InfoCard
				title={t('sidebar.messages')}
				// subheader={`${options[period.menuId].label}`}
				avatar={<InsertChart />}
				noExpand
				topAction={renderMenu()}
				content={
					<Grid container>
						{loading ? <div style={{ height: 300, width: '100%' }}><CircularLoader fill /></div> :
							period ?
								<ItemG xs={12}>
									{renderMessage()}
									{renderType()}
								</ItemG> :
								renderNoPeriod()
						}
					</Grid>}
			/>
		</Fragment >
	)

}

export default SensorMessages