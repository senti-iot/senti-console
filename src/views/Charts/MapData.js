import React, { Fragment, PureComponent } from 'react';
import {
	Grid, IconButton, withStyles, Hidden, Tooltip, TableRow, Table, TableBody, Menu, ListItem, ListItemIcon, ListItemText,
} from '@material-ui/core';
import {
	DonutLargeRounded,
	PieChartRounded,
	BarChart as BarChartIcon,
	ShowChart, Assignment, MoreVert, CloudDownload,
} from 'variables/icons'
import { CircularLoader, Caption, ItemG, InfoCard, T } from 'components';
import deviceStyles from 'assets/jss/views/deviceStyles';
import { connect } from 'react-redux'
import moment from 'moment'
import { dateTimeFormatter } from 'variables/functions'
import { changeYAxis } from 'redux/appState'
import { changeRawData, removeChartPeriod } from 'redux/dateTime'
import { getSensor } from 'variables/dataSensors';
import { getGraph, getPeriod, handleSetDate } from 'redux/dsSystem';
import TC from 'components/Table/TC'

class MapData extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			device: {
				name: ''
			},
			raw: props.raw ? props.raw : false,
			actionAnchor: null,
			openDownload: false,
			visibility: false,
			resetZoom: false,
			zoomDate: [],
			loading: true,
			chartType: 'linear',
			initialPeriod: null
		}
	}

	displayFormat = 'DD MMMM YYYY HH:mm'
	image = null
	options = [
		{ id: 0, label: this.props.t('filters.dateOptions.today') },
		{ id: 1, label: this.props.t('filters.dateOptions.yesterday') },
		{ id: 2, label: this.props.t('filters.dateOptions.thisWeek') },
		{ id: 3, label: this.props.t('filters.dateOptions.7days') },
		{ id: 4, label: this.props.t('filters.dateOptions.30days') },
		{ id: 5, label: this.props.t('filters.dateOptions.90days') },
		{ id: 6, label: this.props.t('filters.dateOptions.custom') },
	]
	timeTypes = [
		{ id: 0, format: 'lll dddd', chart: 'minute', tooltipFormat: 'LT' },
		{ id: 1, format: 'lll dddd', chart: 'hour', tooltipFormat: 'LT' },
		{ id: 2, format: 'lll dddd', chart: 'day', tooltipFormat: 'lll' },
		{ id: 3, format: 'lll dddd', chart: 'month', tooltipFormat: 'll' },
	]
	visibilityOptions = [
		{ id: 0, icon: <PieChartRounded />, label: this.props.t('charts.type.pie') },
		{ id: 1, icon: <DonutLargeRounded />, label: this.props.t('charts.type.donut') },
		{ id: 2, icon: <BarChartIcon />, label: this.props.t('charts.type.bar') },
		{ id: 3, icon: <ShowChart />, label: this.props.t('charts.type.line') }
	]
	componentDidMount = async () => {
		const { loading } = this.state
		if (loading) {
			await this.getData()
		}
	}
	// getDeviceData = async (d, func) => {
	// 	let nD = d
	// 	nD.data = func()
	// 	return nD
	// }
	// asyncForEach = async (array, callback) => {
	// 	for (let index = 0; index < array.length; index++) {
	// 		await callback(array[index], index, array)
	// 	}
	// }

	getData = async () => {
		const { g } = this.props

		let device = await getSensor(g.dataSource.deviceId)
		console.log(device)
		this.setState({
			device: device, loading: false
		})


	}
	componentDidUpdate = async (prevProps) => {
		if (prevProps.g !== this.props.g || prevProps.g.dataSource !== this.props.g.dataSource ) {
			this.setState({ loading: true }, async () => {
				await this.getData()
			})
		}
	}

	componentWillUnmount = () => {
		this._isMounted = 0
		// this.setState({
		// 	raw: this.props.raw ? this.props.raw : false,
		// 	actionAnchor: null,
		// 	openDownload: false,
		// 	visibility: false,
		// 	resetZoom: false,
		// 	zoomDate: [],
		// 	loading: true,
		// 	chartType: 'linear',
		// 	initialPeriod: null
		// })
	}
	handleChangeChartType = (type) => {
		this.setState({
			chartType: type
		})
	}
	handleCloseDownloadModal = () => {
		this.setState({ openDownload: false })
	}
	handleOpenDownloadModal = () => {
		this.setState({ openDownload: true, actionAnchor: null })
	}
	handleOpenActionsDetails = event => {
		this.setState({ actionAnchor: event.currentTarget });
	}

	handleCloseActionsDetails = () => {
		this.setState({ actionAnchor: null });
	}

	handleVisibility = () => (event) => {
		if (event)
			event.preventDefault()
		// this.props.changeChartType(this.props.period, id)
		this.setState({ actionAnchorVisibility: null })
	}

	renderTitle = (small) => {
		const { title } = this.props
		return <ItemG container alignItems={'center'} justify={small ? 'center' : undefined}>
			{small ? null :
				<Hidden xsDown>
					<ItemG xs zeroMinWidth>
						<Tooltip enterDelay={1000} title={title}>
							<div>
								<T noWrap variant={'h6'}>{title}</T>
							</div>
						</Tooltip>
					</ItemG>
				</Hidden>
			}
		</ItemG>
	}
	relDiff(oldNumber, newNumber) {
		var decreaseValue = oldNumber - newNumber;
		return ((decreaseValue / oldNumber) * 100).toFixed(3);
	}
	renderType = () => {
		const { loading, data } = this.state
		if (!loading) {
			return <div style={{ maxHeight: 300, overflowX: 'auto', width: '100%' }}>
				<Table>
					<TableBody >
						{data.map((a, i) => {
							return <TableRow key={i}>
								<TC label={a.label} />
								<TC content={
									<T style={{ fontWeight: 500 }}>
										{`${a.data} ${a.unit}`}
									</T>
								} />
							</TableRow>
						}
						)}
					</TableBody>
				</Table>
			</div>
		}
		else return this.renderNoData()
	}
	disableFuture = () => {
		const { period } = this.props
		if (moment().diff(period.to, 'hour') <= 0) {
			return true
		}
		return false
	}
	renderMenu = () => {
		const { t } = this.props
		const { actionAnchor } = this.state
		// let displayTo = dateTimeFormatter(period.to)
		// let displayFrom = dateTimeFormatter(period.from)
		return <ItemG container>
			<Tooltip title={t('menus.menu')}>
				<IconButton
					aria-label='More'
					aria-owns={actionAnchor ? 'long-menu' : null}
					aria-haspopup='true'
					onClick={this.handleOpenActionsDetails}>
					<MoreVert />
				</IconButton>
			</Tooltip>
			<Menu
				marginThreshold={24}
				id='long-menu'
				anchorEl={actionAnchor}
				open={Boolean(actionAnchor)}
				onClose={this.handleCloseActionsDetails}
				onChange={this.handleVisibility}
				PaperProps={{ style: { minWidth: 250 } }}>

				<ListItem button onClick={this.handleOpenDownloadModal}>
					<ListItemIcon><CloudDownload /></ListItemIcon>
					<ListItemText>{t('menus.export')}</ListItemText>
				</ListItem>


			</Menu>
		</ItemG>
	}
	renderNoData = () => {
		return <ItemG container justify={'center'}>
			<Caption> {this.props.t('devices.noData')}</Caption>
		</ItemG>
	}

	renderIcon = () => {
		return <Assignment />
	}

	renderSmallTitle = (small) => {
		const { title, classes } = this.props
		return <ItemG xs={12} container>
			<T className={classes.smallTitle} variant={'h6'}>{title}</T>
		</ItemG>
	}

	render() {
		const { classes, color, g } = this.props
		const { loading } = this.state
		let small = g ? g.grid ? g.grid.w <= 4 ? true : false : false : false

		return (
			<Fragment>
				<InfoCard
					color={color}
					title={this.renderTitle(small)}
					// subheader={`${this.options[period.menuId].label}, ${period.raw ? t('collections.rawData') : t('collections.calibratedData')}`}
					avatar={this.renderIcon()}
					noExpand
					headerClasses={{
						root: small ? classes.smallSubheader : classes.subheader
					}}
					bodyClasses={{
						root: small ? classes.smallBody : classes.body
					}}
					topAction={this.renderMenu()}
					background={this.props.color}
					content={
						<Grid container style={{ height: '100%', width: '100%' }}>
							{loading ? <div style={{ height: '100%', width: '100%' }}><CircularLoader notCentered /></div> :
								<Fragment>
									<span>{this.state.device? this.state.device.name : ''}</span> 
									{/* <Hidden xsDown>
										{small ? this.renderSmallTitle() : null}
									</Hidden>
									<Hidden smUp>
										{this.renderSmallTitle()}
									</Hidden>
									{this.renderType()} */}
								</Fragment>
							}
						
						</Grid>}
				/>
			</Fragment >
		);
	}
}
const mapStateToProps = (state, ownProps) => ({
	g: getGraph(state, ownProps.gId, ownProps.create),
	period: getPeriod(state, ownProps.gId, ownProps.create)
})

const mapDispatchToProps = dispatch => ({
	handleSetDate: async (dId, gId, p) => dispatch(await handleSetDate(dId, gId, p)),
	changeYAxis: (val) => dispatch(changeYAxis(val)),
	removePeriod: (pId) => dispatch(removeChartPeriod(pId)),
	changeRawData: (p) => dispatch(changeRawData(p))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(deviceStyles, { withTheme: true })(MapData))