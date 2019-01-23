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
	ExpandMore, Visibility, ShowChart, ArrowUpward, CloudDownload,
} from 'variables/icons'
import {
	CircularLoader, Caption, ItemG, InfoCard, BarChart,
	LineChart,
	DoughnutChart,
	PieChart,
	ExportModal
} from 'components';
import deviceStyles from 'assets/jss/views/deviceStyles';
import classNames from 'classnames';
import { connect } from 'react-redux'
import moment from 'moment'
import { dateTimeFormatter } from 'variables/functions'
import { changeChartType } from 'redux/appState'
import { changeDate } from 'redux/dateTime'

class CollectionData extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			actionAnchor: null,
			openDownload: false,
			visibility: false,
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
		{ id: 2, format: 'll dddd', chart: 'day', tooltipFormat: 'll' },
		{ id: 3, format: 'll dddd', chart: 'month', tooltipFormat: 'll' },
	]
	visibilityOptions = [
		{ id: 0, icon: <PieChartRounded />, label: this.props.t('charts.type.pie') },
		{ id: 1, icon: <DonutLargeRounded />, label: this.props.t('charts.type.donut') },
		{ id: 2, icon: <BarChartIcon />, label: this.props.t('charts.type.bar') },
		{ id: 3, icon: <ShowChart />, label: this.props.t('charts.type.line') }
	]

	componentWillUnmount = () => {
		this._isMounted = 0
	}

	handleOpenDownloadModal = () => {
		this.setState({ openDownload: true, actionAnchor: null })
	}

	handleCloseDownloadModal = () => {
		this.setState({ openDownload: false })
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

	renderType = () => {
		const { roundDataSets, lineDataSets, barDataSets, title, timeType, setHoverID, t, device, chartType } = this.props
		switch (chartType) {
			case 0:
				return roundDataSets ?
					<ItemG container >
						{roundDataSets.map((d, i) => {
							return <ItemG key={i} xs={12} direction={'column'} container justify={'center'}>
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
						{roundDataSets.map(d => {
							return <ItemG key={d.id} xs={12} direction={'column'} container justify={'center'}>
								<Typography align={'center'} variant={'subtitle1'}>{d.name}</Typography>
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
							</ItemG>
						})}
					</ItemG>
					: this.renderNoData()
			case 2:
				return barDataSets ? <div style={{ maxHeight: 400 }}>
					<BarChart
						obj={device}
						single
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
						single
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
					<IconButton title={'Reset zoom'} onClick={this.handleReverseZoomOnData}>
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
			</Menu>
		</Fragment>
	}
	renderNoData = () => {
		return <ItemG container justify={'center'}>
			<Caption> {this.props.t('devices.noData')}</Caption>
		</ItemG>
	}

	render() {
		const { raw, t, loading, to, from, dateOption, exportData } = this.props
		const { openDownload } = this.state
		let displayTo = dateTimeFormatter(to)
		let displayFrom = dateTimeFormatter(from)
		return (
			<InfoCard
				title={t('collections.cards.data')}
				subheader={`${this.options[dateOption].label}, ${raw ? t('collections.rawData') : t('collections.calibratedData')}, ${displayFrom} - ${displayTo}`}
				avatar={<Timeline />}
				noExpand
				topAction={this.renderMenu()}
				content={
					<Grid container>
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
							<ItemG xs={12}>
								{this.renderType()}
							</ItemG>}
					</Grid>}
			/>
				
	
		);
	}
}
CollectionData.propTypes = {
	device: PropTypes.object,
}
const mapStateToProps = (state) => ({
	chartType: state.appState.chartType !== null ? state.appState.chartType : state.settings.chartType
})

const mapDispatchToProps = dispatch => ({
	changeChartType: (val) => dispatch(changeChartType(val)),
	handleSetDate: (id, to, from, timeType) => dispatch(changeDate(id, to, from, timeType))
})


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(deviceStyles, { withTheme: true })(CollectionData))