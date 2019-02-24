import React, { Fragment, PureComponent } from 'react';
import {
	Grid, IconButton, Menu, withStyles, ListItem,
	ListItemIcon, ListItemText, Collapse, List, Hidden, Checkbox, Typography,
} from '@material-ui/core';
import {
	Timeline, MoreVert,
	DonutLargeRounded,
	PieChartRounded,
	BarChart as BarChartIcon,
	ExpandMore, Visibility, ShowChart, ArrowUpward, CloudDownload, LinearScale, Clear,
} from 'variables/icons'
import {
	CircularLoader, Caption, ItemG, /* CustomDateTime, */ InfoCard, BarChart,
	LineChart,
	DoughnutChart,
	PieChart,
	ExportModal,
	DateFilterMenu,
} from 'components';
import deviceStyles from 'assets/jss/views/deviceStyles';
import classNames from 'classnames';
import { connect } from 'react-redux'
import moment from 'moment'
import { dateTimeFormatter } from 'variables/functions'
import { changeYAxis } from 'redux/appState'
import { changeDate, removePeriod, changeChartType, changeRawData } from 'redux/dateTime'

class ChartData extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			actionAnchor: null,
			openDownload: false,
			visibility: false,
			resetZoom: false,
			zoomDate: [],
			loading: true,
			chartType: 'linear'
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
		const { period } = this.props
		const { loading } = this.state
		if (period && loading) {
			let newState = await this.props.getData(period)
			this.setState({ ...newState, loading: false })
		}
	}
	componentDidUpdate = async (prevProps, prevState) => {
		if (prevProps.period !== this.props.period || prevProps.period.timeType !== this.props.period.timeType || prevProps.period.raw !== this.props.period.raw) {
			this.setState({ loading: true }, async () => {
				let newState = await this.props.getData(this.props.period)
				this.setState({ ...newState, loading: false })
			})
		}
	}

	componentWillUnmount = () => {
		this._isMounted = 0
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

	handleVisibility = id => (event) => {
		if (event)
			event.preventDefault()
		this.props.changeChartType(this.props.period, id)
		this.setState({ actionAnchorVisibility: null })
	}

	handleReverseZoomOnData = async () => {
		const { period } = this.props
		const { zoomDate } = this.state
		let startDate = null
		let endDate = null
		try {
			switch (period.timeType) {
				case 0:
					startDate = zoomDate.length > 1 ? moment(zoomDate[1].from).startOf('day') : zoomDate.length > 0 ? moment(zoomDate[0].from) : moment().subtract(7, 'days')
					endDate = zoomDate.length > 1 ? moment(zoomDate[1].to).endOf('day') : zoomDate.length > 0 ? moment(zoomDate[0].to) : moment()
					if (zoomDate.length === 1) {
						this.setState({ resetZoom: false, zoomDate: [] })
					}
					this.props.handleSetDate(6, endDate, startDate, 1, period.id)
					break;
				case 1:
					startDate = zoomDate.length > 0 ? moment(zoomDate[0].from) : moment().subtract(7, 'days')
					endDate = zoomDate.length > 0 ? moment(zoomDate[0].to) : moment()
					this.setState({ resetZoom: false, zoomDate: [] })
					this.props.handleSetDate(6, endDate, startDate, 2, period.id)
					break;
				default:
					break;
			}
		}
		catch (e) {
		}
	}

	handleZoomOnData = async (elements) => {
		if (elements.length > 0) {
			const { period } = this.props
			const { lineDataSets } = this.state
			let date = null
			let startDate = null
			let endDate = null
			try {
				date = lineDataSets.datasets[elements[0]._datasetIndex].data[elements[0]._index].x
				switch (period.timeType) {
					case 1:
						startDate = moment(date).startOf('hour')
						endDate = moment(date).endOf('hour').diff(moment(), 'hour') >= 0 ? moment() : moment(date).endOf('hour')
						this.setState({
							resetZoom: true,
							zoomDate: [
								...this.state.zoomDate,
								{
									from: period.from,
									to: period.to
								}]
						})
						this.props.handleSetDate(6, endDate, startDate,  0, period.id)
						break
					case 2:
						startDate = moment(date).startOf('day')
						endDate = moment(date).endOf('day').diff(moment(), 'hour') >= 0 ? moment() : moment(date).endOf('day')
						this.setState({
							resetZoom: true,
							zoomDate: [{
								from: period.from,
								to: period.to
							}]
						})
						this.props.handleSetDate(6, endDate, startDate, 1, period.id)
						break;
					default:
						break;
				}
			}
			catch (error) {
			}
		}
	}

	renderType = () => {
		const { title, setHoverID, t, device, period, single, hoverID } = this.props
		const { loading } = this.state
		if (!loading) {
			const { roundDataSets, lineDataSets, barDataSets } = this.state
			switch (period.chartType) {
				case 0:
					return roundDataSets ?
						<ItemG container >
							{roundDataSets.map((d, i) => {
								return <ItemG style={{ marginBottom: 30 }} key={i} xs={12} md={roundDataSets.length >= 2 ? 6 : 12} direction={'column'} container justify={'center'}>
									<div style={{ maxHeight: 300 }}>
										<PieChart
											height={300}
											title={title}
											single
											unit={this.timeTypes[period.timeType]}
											setHoverID={setHoverID}
											data={d}
											t={t}
										/>
									</div>
									<Typography align={'center'} variant={'subtitle1'}>{d.name}</Typography>
								</ItemG>
							})}
						</ItemG>
						: this.renderNoData()
				case 1:
					return roundDataSets ?
						<ItemG container >
							{roundDataSets.map((d, i) => {
								return <ItemG style={{ marginBottom: 30 }} key={i} xs={12} md={roundDataSets.length >= 2 ? 6 : 12} direction={'column'} container justify={'center'}>
									<div style={{ maxHeight: 300 }}>
										<DoughnutChart
											height={300}
											title={title}
											single
											unit={this.timeTypes[period.timeType]}
											setHoverID={setHoverID}
											data={d}
											t={t}
										/>
									</div>
									<Typography align={'center'} variant={'subtitle1'}>{d.name}</Typography>
								</ItemG>
							})}
						</ItemG>
						: this.renderNoData()
				case 2:
					return barDataSets ? <div style={{ maxHeight: 400 }}>
						<BarChart
							single={single}
							obj={device}
							unit={this.timeTypes[period.timeType]}
							onElementsClick={this.handleZoomOnData}
							setHoverID={setHoverID}
							hoverID={hoverID}
							data={barDataSets}
							t={t}
						/></div> : this.renderNoData()
				case 3:

					return lineDataSets ?
						<LineChart
							chartYAxis={this.state.chartType}
							single={single}
							hoverID={this.props.hoverID}
							handleReverseZoomOnData={this.handleReverseZoomOnData}
							resetZoom={this.state.resetZoom}
							obj={device}
							unit={this.timeTypes[period.timeType]}
							onElementsClick={this.handleZoomOnData}
							setHoverID={setHoverID}
							data={lineDataSets}
							t={t}
						/> : this.renderNoData()
				default:
					break;
			}
		}
		else return this.renderNoData()
	}

	renderMenu = () => {
		const { actionAnchor, actionAnchorVisibility, resetZoom } = this.state
		const { classes, t, period } = this.props
		return <ItemG container>
			<ItemG>
				<DateFilterMenu period={period} t={t} />
			</ItemG>
			<Collapse in={resetZoom}>
				{resetZoom && <IconButton title={'Reset zoom'} onClick={this.handleReverseZoomOnData}>
					<ArrowUpward />
				</IconButton>}
			</Collapse>
			<ItemG>
				<Hidden smDown>
					<IconButton title={'Chart Type'} variant={'fab'} onClick={(e) => { this.setState({ actionAnchorVisibility: e.currentTarget }) }}>
						{this.renderIcon()}
					</IconButton>
					<Menu
						id='long-menu'
						anchorEl={actionAnchorVisibility}
						open={Boolean(actionAnchorVisibility)}
						onClose={() => this.setState({ actionAnchorVisibility: null })}
						PaperProps={{ style: { minWidth: 250 } }}>
						<List component='div' disablePadding>
							{this.visibilityOptions.map(op => {
								return <ListItem key={op.id} value={op.id} button className={classes.nested} onClick={this.handleVisibility(op.id)}>
									<ListItemIcon>
										{op.icon}
									</ListItemIcon>
									<ListItemText inset primary={op.label} />
								</ListItem>
							})}
						</List>
					</Menu>
				</Hidden>
			</ItemG>

			<ItemG>
				<IconButton
					aria-label='More'
					aria-owns={actionAnchor ? 'long-menu' : null}
					aria-haspopup='true'
					onClick={this.handleOpenActionsDetails}>
					<MoreVert />
				</IconButton>
			</ItemG>
			<Menu
				id='long-menu'
				anchorEl={actionAnchor}
				open={Boolean(actionAnchor)}
				onClose={this.handleCloseActionsDetails}
				onChange={this.handleVisibility}
				PaperProps={{ style: { minWidth: 250 } }}>
				<div>
					<Hidden mdUp>
						<ListItem button onClick={() => { this.setState({ visibility: !this.state.visibility }) }}>
							<ListItemIcon>
								<Visibility />
							</ListItemIcon>
							<ListItemText inset primary={t('filters.options.graphType')} />
							<ExpandMore className={classNames({
								[classes.expandOpen]: this.state.visibility,
							}, classes.expand)} />
						</ListItem>
						<Collapse in={this.state.visibility} timeout='auto' unmountOnExit>
							<List component='div' disablePadding>
								{this.visibilityOptions.map(op => {
									return <ListItem key={op.id} button className={classes.nested} onClick={this.handleVisibility(op.id)}>
										<ListItemIcon>
											{op.icon}
										</ListItemIcon>
										<ListItemText inset primary={op.label} />
									</ListItem>
								})}
							</List>
						</Collapse>
					</Hidden>
				</div>
				<ListItem button onClick={this.handleOpenDownloadModal}>
					<ListItemIcon><CloudDownload /></ListItemIcon>
					<ListItemText>{t('menus.export')}</ListItemText>
				</ListItem>
				<ListItem button onClick={() => this.props.changeRawData(period)}>
					<ListItemIcon>
						<Checkbox
							checked={period.raw}
							className={classes.noPadding}
						/>
					</ListItemIcon>
					<ListItemText>
						{t('collections.rawData')}
					</ListItemText>
				</ListItem>
				<ListItem button onClick={() => this.handleChangeChartType(this.state.chartType === 'linear' ? 'logarithmic' : 'linear')}>
					<ListItemIcon>
						{this.state.chartType !== 'linear' ? <LinearScale /> : <Timeline />}
					</ListItemIcon>
					<ListItemText>
						{t(this.state.chartType !== 'linear' ? 'settings.chart.YAxis.linear' : 'settings.chart.YAxis.logarithmic')}
					</ListItemText>
				</ListItem>
				<ListItem button onClick={() => { this.handleCloseActionsDetails(); this.props.removePeriod(period.id) }}>
					<ListItemIcon>
						<Clear />
					</ListItemIcon>
					<ListItemText>
						{t('menus.charts.deleteThisPeriod')}
					</ListItemText>
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
		const { period } = this.props
		switch (period.chartType) {
			case 0:
				return <PieChartRounded />
			case 1:
				return <DonutLargeRounded />
			case 2:
				return <BarChartIcon />
			case 3:
				return <ShowChart />
			default:
				break;
		}
	}
	render() {
		const { t, period } = this.props
		const { openDownload, loading, exportData } = this.state
		let displayTo = dateTimeFormatter(period.to)
		let displayFrom = dateTimeFormatter(period.from)
		return (
			<Fragment>
				<InfoCard
					title={`${displayFrom} - ${displayTo}`}
					subheader={`${this.options[period.menuId].label}, ${period.raw ? t('collections.rawData') : t('collections.calibratedData')}`}
					avatar={this.renderIcon()}
					noExpand
					topAction={this.renderMenu()}
					content={
						<Grid container>
							<ExportModal
								raw={period.raw}
								to={displayTo}
								from={displayFrom}
								data={exportData}
								open={openDownload}
								handleClose={this.handleCloseDownloadModal}
								t={t}
							/>
							{loading ? <CircularLoader notCentered /> :
								<Fragment>
									<ItemG xs={12}>
										{this.renderType()}
									</ItemG>
								</Fragment>}
						</Grid>}
				/>
			</Fragment >
		);
	}
}
const mapStateToProps = (state) => ({
})

const mapDispatchToProps = dispatch => ({
	handleSetDate: (id, to, from, timeType, pId) => dispatch(changeDate(id, to, from, timeType, pId)),
	changeYAxis: (val) => dispatch(changeYAxis(val)),
	removePeriod: (pId) => dispatch(removePeriod(pId)),
	changeChartType: (p, chartId) => dispatch(changeChartType(p, chartId)),
	changeRawData: (p) => dispatch(changeRawData(p))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(deviceStyles, { withTheme: true })(ChartData))