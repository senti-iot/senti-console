import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types'
import {
	Grid, IconButton, Menu, withStyles, ListItem,
	ListItemIcon, ListItemText, Collapse, List, Hidden, Checkbox, Typography,
} from '@material-ui/core';
import {
	Timeline, MoreVert,
	DonutLargeRounded,
	PieChartRounded,
	BarChart as BarChartIcon,
	ExpandMore, Visibility, ShowChart, ArrowUpward, CloudDownload, LinearScale
} from 'variables/icons'
import {
	CircularLoader, Caption, ItemG, /* CustomDateTime, */ InfoCard, BarChart,
	LineChart,
	DoughnutChart,
	PieChart,
	ExportModal,
	CustomDateTime,
} from 'components';
import deviceStyles from 'assets/jss/views/deviceStyles';
import classNames from 'classnames';
import { connect } from 'react-redux'
import moment from 'moment'
import { dateTimeFormatter } from 'variables/functions'
import { changeChartType, changeYAxis } from 'redux/appState'
import { changeDate, addCompare } from 'redux/dateTime'
import { getWifiDaily, getWifiHourly, getWifiMinutely, getWifiSummary } from 'components/Charts/DataModel';

class ProjectData extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			openCompare: false,
			actionAnchor: null,
			openDownload: false,
			visibility: false,
			resetZoom: false,
			zoomDate: [],
			loadingCompare: null,
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
	componentDidMount = () => {
		if (this.props.compares.length > 0) { 
			this.setState({ loadingCompare: false })
		}
	}

	componentWillUnmount = () => {
		this._isMounted = 0
	}
	handleCloseCompareModal = () => {
		this.setState({ actionAnchor: null, openCompare: false })
	}
	handleOpenCompareModal = () => {
		this.setState({ actionAnchor: null, openCompare: true })
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
		this.props.changeChartType(id)
		this.setState({ actionAnchorVisibility: null })
	}

	handleReverseZoomOnData = async () => {
		const { timeType } = this.props
		const { zoomDate } = this.state
		let startDate = null
		let endDate = null
		try {
			switch (timeType) {
				case 0:
					startDate = zoomDate.length > 1 ? moment(zoomDate[1].from).startOf('day') : zoomDate.length > 0 ? moment(zoomDate[0].from) : moment().subtract(7, 'days')
					endDate = zoomDate.length > 1 ? moment(zoomDate[1].to).endOf('day') : zoomDate.length > 0 ? moment(zoomDate[0].to) : moment()
					if (zoomDate.length === 1) {
						this.setState({ resetZoom: false, zoomDate: [] })
					}
					this.props.handleSetDate(6, endDate, startDate, 1, false)
					break;
				case 1:
					startDate = zoomDate.length > 0 ? moment(zoomDate[0].from) : moment().subtract(7, 'days')
					endDate = zoomDate.length > 0 ? moment(zoomDate[0].to) : moment()
					this.setState({ resetZoom: false, zoomDate: [] })
					this.props.handleSetDate(6, endDate, startDate, 2, false)
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
			const { timeType, lineDataSets } = this.props
			let date = null
			let startDate = null
			let endDate = null
			try {
				date = lineDataSets.datasets[elements[0]._datasetIndex].data[elements[0]._index].x
				switch (timeType) {
					case 1:
						startDate = moment(date).startOf('hour')
						endDate = moment(date).endOf('hour')
						this.setState({
							resetZoom: true, zoomDate: [...this.state.zoomDate, {
								from: this.props.from,
								to: moment(this.props.from, 'YYYY-MM-DD HH:mm').endOf('day')
							}]
						})
						this.props.handleSetDate(6, endDate, startDate, 0, false)
						break
					case 2:
						startDate = moment(date).startOf('day')
						endDate = moment(date).endOf('day')
						this.setState({
							resetZoom: true, zoomDate: [
								{
									from: this.props.from,
									to: this.props.to
								}
							]
						})
						this.props.handleSetDate(6, endDate, startDate, 1, false)
						break;
					default:
						break;
				}
			}
			catch (error) {
			}
		}
	}
	handleAddCompare = async (to, from, timeType) => {
		const { raw, project } = this.props
		this.setState({ loadingCompare: true }, this.handleCloseCompareModal)
		let dcs = project.dataCollections.map(d => {
			return {
				dcId: d.id,
				dcName: d.name,
				project: project ? project.title : "",
				org: d.org ? d.org.name : "",
				name: d.name,
				id: d.id,
				color: d.color,
				lat: d.activeDevice ? d.activeDevice.lat : 0,
				long: d.activeDevice ? d.activeDevice.long : 0
			}
		})
		let newState
		switch (timeType) {
			case 0:
				newState = await getWifiMinutely('collection', dcs, from, to, -1, raw)
				break;
			case 1:
				newState = await getWifiHourly('collection', dcs, from, to, -1, raw)
				break
			case 2:
				newState = await getWifiDaily('collection', dcs, from, to, -1, raw)
				break
			case 3:
				newState = await getWifiSummary('collection', dcs, from, to, -1, raw)
				break
			default:
				break;
		}
		this.props.addCompare(newState)
		this.setState({
			loadingCompare: false,
		})
	}
	renderCompares = () => {
		const { title, timeType, setHoverID, t, device, chartType, compares } = this.props
		return compares.map(c => {

			switch (chartType) {
				case 0:
					return c.roundDataSets ?
						<ItemG container >
							{c.roundDataSets.map((d, i) => {
								return <ItemG style={{ marginBottom: 30 }} key={i} xs={12} md={c.roundDataSets.length >= 2 ? 6 : 12} direction={'column'} container justify={'center'}>
									<div style={{ maxHeight: 300 }}>
										<PieChart
											height={300}
											title={title}
											single
											unit={this.timeTypes[timeType]}
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
					return c.roundDataSets ?
						<ItemG container >
							{c.roundDataSets.map((d, i) => {
								return <ItemG style={{ marginBottom: 30 }} key={i} xs={12} md={c.roundDataSets.length >= 2 ? 6 : 12} direction={'column'} container justify={'center'}>
									<div style={{ maxHeight: 300 }}>
										<DoughnutChart
											height={300}
											title={title}
											single
											unit={this.timeTypes[timeType]}
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
					return c.barDataSets ? <div style={{ maxHeight: 400 }}>
						<BarChart
							obj={device}
							unit={this.timeTypes[timeType]}
							onElementsClick={this.handleZoomOnData}
							setHoverID={setHoverID}
							data={c.barDataSets}
							t={t}
						/></div> : this.renderNoData()
				case 3:

					return c.lineDataSets ?
						<LineChart
							hoverID={this.props.hoverID}
							handleReverseZoomOnData={this.handleReverseZoomOnData}
							resetZoom={this.state.resetZoom}
							obj={device}
							unit={this.timeTypes[timeType]}
							onElementsClick={this.handleZoomOnData}
							setHoverID={setHoverID}
							data={c.lineDataSets}
							t={t}
						/> : this.renderNoData()
				default:
					return null
			}
		})
	}
	renderType = () => {
		const { roundDataSets, lineDataSets, barDataSets, title, timeType, setHoverID, t, device, chartType } = this.props
		switch (chartType) {
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
										unit={this.timeTypes[timeType]}
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
										unit={this.timeTypes[timeType]}
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
						obj={device}
						unit={this.timeTypes[timeType]}
						onElementsClick={this.handleZoomOnData}
						setHoverID={setHoverID}
						data={barDataSets}
						t={t}
					/></div> : this.renderNoData()
			case 3:

				return lineDataSets ?
					<LineChart
						hoverID={this.props.hoverID}
						handleReverseZoomOnData={this.handleReverseZoomOnData}
						resetZoom={this.state.resetZoom}
						obj={device}
						unit={this.timeTypes[timeType]}
						onElementsClick={this.handleZoomOnData}
						setHoverID={setHoverID}
						data={lineDataSets}
						t={t}
					/> : this.renderNoData()
			default:
				break;
		}
	}

	renderMenu = () => {
		const { actionAnchor, actionAnchorVisibility, resetZoom } = this.state
		const { classes, t } = this.props
		return <Fragment>
			<ItemG>
				<Collapse in={resetZoom}>
					<IconButton title={'Reset zoom'} /* color={'primary'} */ onClick={this.handleReverseZoomOnData}>
						<ArrowUpward />
					</IconButton>
				</Collapse>
			</ItemG>
			<ItemG>
				<Hidden smDown>
					<IconButton title={'Chart Type'} variant={'fab'} onClick={(e) => { this.setState({ actionAnchorVisibility: e.currentTarget }) }}>
						<Visibility />
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
				<ListItem button onClick={this.handleOpenDownloadModal}>
					<ListItemIcon><CloudDownload /></ListItemIcon>
					<ListItemText>{t('menus.export')}</ListItemText>
				</ListItem>
				<ListItem button onClick={this.handleOpenCompareModal}>
					<ListItemIcon></ListItemIcon>
					<ListItemText>{t('menus.charts.compare')}</ListItemText>
				</ListItem>
				<ListItem button onClick={this.props.handleRawData}>
					<ListItemIcon>
						<Checkbox
							checked={Boolean(this.props.raw)}
							className={classes.noPadding}
						/>
					</ListItemIcon>
					<ListItemText>
						{t('collections.rawData')}
					</ListItemText>
				</ListItem>
				<ListItem button onClick={() => this.props.changeYAxis(this.props.chartYAxis === 'linear' ? 'logarithmic' : 'linear')}>
					<ListItemIcon>
						{this.props.chartYAxis !== 'linear' ? <LinearScale /> : <Timeline />}
					</ListItemIcon>
					<ListItemText>
						{t(this.props.chartYAxis !== 'linear' ? 'settings.chart.YAxis.linear' : 'settings.chart.YAxis.logarithmic')}
					</ListItemText>
				</ListItem>
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
				</div>appState
			</Menu>
		</Fragment>
	}
	renderNoData = () => {
		return <ItemG container justify={'center'}>
			<Caption> {this.props.t('devices.noData')}</Caption>
		</ItemG>
	}

	render() {
		const { raw, t, loading, to, from, dateOption, exportData, timeType } = this.props
		const { openDownload, loadingCompare } = this.state
		let displayTo = dateTimeFormatter(to)
		let displayFrom = dateTimeFormatter(from)
		return (
			<Fragment>
				<InfoCard
					title={t('collections.cards.data')}
					subheader={`${this.options[dateOption].label}, ${raw ? t('collections.rawData') : t('collections.calibratedData')}, ${displayFrom} - ${displayTo}`}
					avatar={<Timeline />}
					noExpand
					topAction={this.renderMenu()}
					content={
						<Grid container>
							<CustomDateTime
								handleCancelCustomDate={this.handleCloseCompareModal}
								timeType={timeType}
								t={t}
								openCustomDate={this.state.openCompare}
								handleCloseDialog={this.handleAddCompare}
							/>
							<ExportModal
								raw={raw}
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
									<ItemG xs={12}>
										{loadingCompare === false ? this.renderCompares() : loadingCompare === true ? <CircularLoader notCentered /> : null}
									</ItemG>
								</Fragment>}
						</Grid>}
				/>
			</Fragment >
		);
	}
}
ProjectData.propTypes = {
	project: PropTypes.object.isRequired,
}
const mapStateToProps = (state) => ({
	chartType: state.appState.chartType !== null ? state.appState.chartType : state.settings.chartType,
	timeType: state.dateTime.timeType,
	chartYAxis: state.appState.chartYAxis,
	compares: state.dateTime.compares
})

const mapDispatchToProps = dispatch => ({
	changeChartType: (val) => dispatch(changeChartType(val)),
	handleSetDate: (id, to, from, timeType) => dispatch(changeDate(id, to, from, timeType)),
	changeYAxis: (val) => dispatch(changeYAxis(val)),
	addCompare: (compare) => dispatch(addCompare(compare))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(deviceStyles, { withTheme: true })(ProjectData))