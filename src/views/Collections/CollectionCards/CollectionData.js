import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types'
import {
	Grid, IconButton, Menu, withStyles, ListItem,
	ListItemIcon, ListItemText, Collapse, List, Hidden, Checkbox,
} from '@material-ui/core';
import {
	Timeline, MoreVert,
	DonutLargeRounded,
	PieChartRounded,
	BarChart as BarChartIcon,
	ExpandMore, Visibility, ShowChart, /* CloudDownload */
} from 'variables/icons'
import {
	CircularLoader, Caption, ItemG, /* CustomDateTime, */ InfoCard, BarChart,
	LineChart,
	DoughnutChart,
	PieChart,
	// ExportModal
} from 'components';
import deviceStyles from 'assets/jss/views/deviceStyles';
// import { getDataSummary, getDataDaily, getDataHourly, getDataMinutely, /* getDataHourly */ } from 'variables/dataDevices';
import classNames from 'classnames';
import { connect } from 'react-redux'
import moment from 'moment'
import { dateTimeFormatter } from 'variables/functions'
// import DevicePDF from 'components/Exports/DevicePDF';

class CollectionData extends PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			from: moment().subtract(7, 'd').startOf('day'),
			to: moment().endOf('day'),
			actionAnchor: null,
			openDownload: false,
			display: props.chartType ? props.chartType : 3,
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
		{ id: 0, format: 'lll dddd', chart: 'minute' },
		{ id: 1, format: 'lll dddd', chart: 'hour' },
		{ id: 2, format: 'll dddd', chart: 'day' },
		{ id: 3, format: 'll dddd', chart: 'month' },
	]
	visibilityOptions = [
		{ id: 0, icon: <PieChartRounded />, label: this.props.t('charts.type.pie') },
		{ id: 1, icon: <DonutLargeRounded />, label: this.props.t('charts.type.donut') },
		{ id: 2, icon: <BarChartIcon />, label: this.props.t('charts.type.bar') },
		{ id: 3, icon: <ShowChart />, label: this.props.t('charts.type.line') }
	]

	getImage = () => {
	}

	componentWillUnmount = () => {
		this._isMounted = 0
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
		this.setState({ display: id, loading: true, actionAnchorVisibility: null })
	}

	handleCustomDate = date => e => {
		this.setState({
			[date]: e
		})
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
						this.props.handleSetDate(6, endDate, startDate, 0, false)
						break
					case 2:
						startDate = moment(date).startOf('day')
						endDate = moment(date).endOf('day')
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
	handleCancelCustomDate = () => {
		this.setState({
			loading: false, openCustomDate: false
		})
	}
	handleOpenDownloadModal = () => {
		this.setState({ openDownload: true, actionAnchor: null })
	}
	handleCloseDownloadModal = () => {
		this.setState({ openDownload: false })
	}

	renderType = () => {
		const { display } = this.state
		const { roundDataSets, lineDataSets, barDataSets, title, timeType, setHoverID, t, device } = this.props
		switch (display) {
			case 0:
				return roundDataSets ? <div style={{ maxHeight: 400 }}>
					<PieChart
						title={title}
						single //temporary
						unit={this.timeTypes[timeType]}
						// onElementsClick={this.handleZoomOnData}
						setHoverID={setHoverID}
						data={roundDataSets}
					/>
				</div>
					: this.renderNoData()
			case 1:
				return roundDataSets ?
					<div style={{ maxHeight: 400 }}>
						<DoughnutChart
							title={title}
							single //temporary
							unit={this.timeTypes[timeType]}
							// onElementsClick={this.handleZoomOnData}
							setHoverID={setHoverID}
							data={roundDataSets}
						/></div>
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
						// getImage={this.getImage}
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
		const { actionAnchor, actionAnchorVisibility } = this.state
		const { classes, t } = this.props
		return <Fragment>
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
						PaperProps={{
							style: {
								// maxHeight: 300,
								minWidth: 250
							}
						}}>					<List component='div' disablePadding>
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
				PaperProps={{
					style: {
						// maxHeight: 300,
						minWidth: 250
					}
				}}>
				{/*<div>
					<Hidden mdUp>
						<ListItem>
							{this.renderDateFilter()}
						</ListItem>
					</Hidden>
				</div> */}
				{/* <ListItem button onClick={this.handleOpenDownloadModal}>
					<ListItemIcon><CloudDownload /></ListItemIcon>
					<ListItemText>{t('data.download')}</ListItemText>
				</ListItem> */}
				<ListItem button onClick={this.props.handleRawData}>
					<ListItemIcon>
						<Checkbox
							checked={this.props.raw}
							// disabled
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
		const { raw, t, loading, to, from, dateOption } = this.props
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
	chartType: state.settings.chartType
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(deviceStyles, { withTheme: true })(CollectionData))