import React, { Component } from 'react'
import { ItemG, InfoCard, CircularLoader, CustomDateTime, Caption, ItemGrid, Info } from '../../../components/index';
import { ShowChart, PieChartRounded, DonutLargeRounded, BarChart, DateRange, Visibility, ExpandMore, MoreVert } from '../../../variables/icons';
import { getDataDaily } from 'variables/dataCollections'
import moment from 'moment';
import { shortDateFormat } from '../../../variables/functions';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import { withTheme, Select, FormControl, Hidden, Divider, MenuItem, FormHelperText, ListItem, ListItemIcon, ListItemText, Collapse, List, IconButton, Menu, Checkbox } from '@material-ui/core';
import { colors } from '../../../variables/colors';
import classNames from 'classnames';
import { getDataHourly } from '../../../variables/dataCollections';

class CollectionData extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			from: moment().subtract(7, 'd').startOf('day'),
			to: moment().endOf('day'),
			raw: false,
			charts: {
				barDataSets: null,
				roundDataSets: null,
				lineDataSets: null,
			},
			dateFilterInputID: 1,
			timeType: 0,
			openCustomDate: false,
			display: 2,
			visibility: false,
		}
	}
	format = "YYYY-MM-DD+HH:mm"
	barOpts = {
		display: false,
		position: 'bottom',
		fullWidth: true,
		reverse: false,

		labels: {
			padding: 10
		}
	}
	options = [
		{ id: 0, label: this.props.t("filters.dateOptions.today") },
		{ id: 5, label: this.props.t("filters.dateOptions.yesterday") },
		{ id: 6, label: this.props.t("filters.dateOptions.thisWeek") },
		{ id: 1, label: this.props.t("filters.dateOptions.7days") },
		{ id: 2, label: this.props.t("filters.dateOptions.30days") },
		{ id: 3, label: this.props.t("filters.dateOptions.90days") },
		{ id: 4, label: this.props.t("filters.dateOptions.custom") },
	]
	visibilityOptions = [
		{ id: 0, icon: <PieChartRounded />, label: this.props.t("charts.type.pie") },
		{ id: 1, icon: <DonutLargeRounded />, label: this.props.t("charts.type.donut") },
		{ id: 2, icon: <BarChart />, label: this.props.t("charts.type.bar") },
		{ id: 3, icon: <ShowChart />, label: this.props.t("charts.type.line") }
	]
	componentDidMount = () => {
		this.handleWifiDaily()
	}

	handleCloseDialog = () => {
		this.setState({ openCustomDate: false })
		if (this.state.timeType === 1) {
			this.handleWifiDaily()
		}
		else {
			this.handleWifiHourly()
		}
	}
	handleCancelCustomDate = () => {
		this.setState({
			loading: false, openCustomDate: false
		})
	}
	handleCustomCheckBox = (e) => {
		this.setState({ timeType: parseInt(e.target.value, 10) })
	}
	handleCustomDate = date => e => {
		this.setState({
			[date]: e
		})
	}
	handleOpenActionsDetails = event => {
		this.setState({ actionAnchor: event.currentTarget });
	}
	handleCloseActionsDetails = () => {
		this.setState({ actionAnchor: null });
	}
	handleWifiHourly = async () => {
		const { collection } = this.props
		const { from, to, raw } = this.state
		let data = await getDataHourly(collection.id, moment(from).format(this.format), moment(to).format(this.format), raw)
		if (data) {
			let dataArr = Object.keys(data).map(r => ({ id: shortDateFormat(r), value: data[r] }))
			this.setState({
				data: data,
				charts: {
					lineDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: colors[18],
							// borderWidth: 1,
							data: dataArr.map(rd => parseInt(rd.value, 10)),
							backgroundColor: colors[18],
							fill: false,
							lineTension: 0.1,
							borderCapStyle: 'butt',
							borderJoinStyle: 'miter',
							pointBorderColor: colors[18]
						}]

					},
					roundDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: "#FFF",
							borderWidth: 1,
							data: dataArr.map(rd => parseInt(rd.value, 10)),
							// backgroundColor: dataArr.map(() => getRandomColor())
							backgroundColor: dataArr.map((rd, id) => colors[id])
						}]
					},
					barDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: "#FFF",
							borderWidth: 1,
							data: dataArr.map(rd => parseInt(rd.value, 10)),
							backgroundColor: dataArr.map((rd, id) => colors[id])
						}
						]
					}
				},
				loading: false
			})
		}
	}
	handleWifiDaily = async () => {
		const { collection } = this.props
		const { from, to, raw } = this.state
		let data = await getDataDaily(collection.id, moment(from).format(this.format), moment(to).format(this.format), raw)
		if (data) {
			let dataArr = Object.keys(data).map(r => ({ id: shortDateFormat(r), value: data[r] }))
			this.setState({
				data: data,
				charts: {
					lineDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: colors[18],
							// borderWidth: 1,
							data: dataArr.map(rd => parseInt(rd.value, 10)),
							backgroundColor: colors[18],
							fill: false,
							lineTension: 0.1,
							borderCapStyle: 'butt',
							borderJoinStyle: 'miter',
							pointBorderColor: colors[18]
						}]
						
					},
					roundDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: "#FFF",
							borderWidth: 1,
							data: dataArr.map(rd => parseInt(rd.value, 10)),
							// backgroundColor: dataArr.map(() => getRandomColor())
							backgroundColor: dataArr.map((rd, id) => colors[id])
						}]
					},
					barDataSets: {
						labels: dataArr.map(rd => rd.id),
						datasets: [{
							borderColor: "#FFF",
							borderWidth: 1,
							data: dataArr.map(rd => parseInt(rd.value, 10)),
							backgroundColor: dataArr.map((rd, id) => colors[id])
						}
						]
					}
				},
				loading: false
			})
		}
	}
	handleDateFilter = (event) => {
		let id = event.target.value
		if (id !== 4) {
			this.handleSetDate(id)
		}
		else {
			this.setState({ loading: true, openCustomDate: true, dateFilterInputID: id })
		}
	}
	handleSwitchDayHour = () => {
		let id = this.state.dateFilterInputID
		switch (id) {
			case 0:
				this.handleWifiHourly();
				break;
			case 1:
				this.handleWifiDaily();
				break;
			case 2:
				this.handleWifiDaily();
				break;
			case 3:
				this.handleWifiDaily();
				break;
			default:
				this.handleWifiDaily();
				break;

		}
	}

	handleSetDate = (id) => {
		let to = null
		let from = null
		switch (id) {
			case 0: // Today
				from = moment().startOf('day')
				to = moment().endOf('day')
				break;
			case 1: // Last 7 days
				from = moment().subtract(7, 'd').startOf('day')
				to = moment().endOf('day')
				break;
			case 2: // last 30 days
				from = moment().subtract(30, 'd').startOf('day')
				to = moment().endOf('day')
				break;
			case 3: // last 90 days
				from = moment().subtract(90, 'd').startOf('day')
				to = moment().endOf('day')
				break;
			case 5:
				from = moment().subtract(1, 'd').startOf('day')
				to = moment().endOf('day')
				break;
			case 6:
				from = moment().startOf('week').startOf('day')
				to = moment().endOf('day')
				break;
			default:
				break;
		}
		this.setState({
			dateFilterInputID: id,
			to: to,
			from: from,
			loading: true,
			roundDataSets: null,
			barDataSets: null
		}, this.handleSwitchDayHour)
	}
	renderCustomDateDialog = () => {
		const { classes, t } = this.props
		const { openCustomDate, to, from, timeType } = this.state
		return openCustomDate ? <CustomDateTime
			openCustomDate={openCustomDate}
			handleCloseDialog={this.handleCloseDialog}//
			handleCustomDate={this.handleCustomDate}
			to={to}
			from={from}
			timeType={timeType}
			handleCustomCheckBox={this.handleCustomCheckBox}//
			handleCancelCustomDate={this.handleCancelCustomDate}//
			t={t}
			classes={classes}
		/> : null
	}
	renderDateFilter = () => {
		const { classes, t } = this.props
		const { dateFilterInputID, to, from } = this.state
		let displayTo = shortDateFormat(to)
		let displayFrom = shortDateFormat(from)
		return (
			<div className={classes.root}>
				<Hidden mdDown>
					<DateRange className={classes.leftIcon} />
				</Hidden>
				<FormControl className={classes.formControl}>
					<Select
						value={this.state.dateFilterInputID}
						onChange={this.handleDateFilter}
						inputProps={{
							name: 'data-dateFilter',
							id: 'data-dateFilterInput',
						}}
					>
						<ItemGrid >
							<Caption>{this.options[this.options.findIndex(d => d.id === dateFilterInputID ? true : false)].label}</Caption>
							{/* <Info>{`${from.substr(0, 10)} - ${to.substr(0, 10)}`}</Info> */}
							<Info>{`${displayFrom} - ${displayTo}`}</Info>
						</ItemGrid>
						<Divider />
						<MenuItem value={0}>{t("filters.dateOptions.today")}</MenuItem>
						<MenuItem value={5}>{t("filters.dateOptions.yesterday")}</MenuItem>
						<MenuItem value={6}>{t("filters.dateOptions.thisWeek")}</MenuItem>
						<MenuItem value={1}>{t("filters.dateOptions.7days")}</MenuItem>
						<MenuItem value={2}>{t("filters.dateOptions.30days")}</MenuItem>
						<MenuItem value={3}>{t("filters.dateOptions.90days")}</MenuItem>
						<Divider />
						<MenuItem value={4}>{t("filters.dateOptions.custom")}</MenuItem>
					</Select>
					<FormHelperText>{`${displayFrom} - ${displayTo}`}</FormHelperText>
				</FormControl>
			</div>
		)
	}
	handleRawData = () => { 
		this.setState({ loading: true, actionAnchor: null, raw: !this.state.raw }, () => this.handleWifiDaily())
		
	}
	renderMenu = () => {
		const { actionAnchor } = this.state
		const { classes, t } = this.props
		return <ItemGrid container noMargin noPadding>
			<ItemG>
				<Hidden mdDown>
					{this.renderDateFilter()}
				</Hidden>
			</ItemG>
			<ItemG>
				<IconButton
					aria-label="More"
					aria-owns={actionAnchor ? 'long-menu' : null}
					aria-haspopup="true"
					onClick={this.handleOpenActionsDetails}>
					<MoreVert />
				</IconButton>
			</ItemG>
			<Menu
				id="long-menu"
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
				<div>
					<Hidden lgUp>
						<ListItem>
							{this.renderDateFilter()}
						</ListItem>
					</Hidden>
				</div>
				<ListItem button onClick={() => this.handleRawData()}>
					<ListItemIcon>
						<Checkbox
							checked={this.state.raw}
							// disabled
							className={classes.noPadding}
						/>
					</ListItemIcon>
					<ListItemText>
						{t("collections.rawData")}
					</ListItemText>
				</ListItem>
				<ListItem button onClick={() => { this.setState({ visibility: !this.state.visibility }) }}>
					<ListItemIcon>
						<Visibility />
					</ListItemIcon>
					<ListItemText inset primary={t("filters.options.graphType")} />
					<ExpandMore className={classNames({
						[classes.expandOpen]: this.state.visibility,
					}, classes.expand)} />
				</ListItem>
				<Collapse in={this.state.visibility} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						{this.visibilityOptions.map(op => {
							return <ListItem key={op.id} button className={classes.nested} onClick={() => this.setState({ display: op.id })}>
								<ListItemIcon>
									{op.icon}
								</ListItemIcon>
								<ListItemText inset primary={op.label} />
							</ListItem>
						})}
					</List>
				</Collapse>
				))}
			</Menu>
		</ItemGrid>
	}

	renderLoader = () => <CircularLoader notCentered />
	renderType = () => {
		const { display } = this.state
		switch (display) {
			case 0:
				return this.state.charts.roundDataSets ? <div style={{ maxHeight: 400 }}>
					<Pie
						height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : window.innerHeight - 200}
						legend={this.legendOpts}
						data={this.state.charts.roundDataSets}
						options={{
							maintainAspectRatio: false,
						}}
					/> </div>
					: this.renderNoDataFilters()

			case 1:
				return this.state.charts ? this.state.charts.roundDataSets ? <div style={{ maxHeight: 400 }}>
					<Doughnut
						height={this.props.theme.breakpoints.width("md") < window.innerWidth ? 400 : window.innerHeight - 200}
						legend={this.legendOpts}
						options={{
							maintainAspectRatio: false,
						}}
						data={this.state.charts.roundDataSets}
					/> </div>
					 : this.renderNoDataFilters() : this.renderNoDataFilters()
		   case 2:
				return this.state.charts ? this.state.charts.barDataSets ? <div style={{ maxHeight: 400 }}>
					<Bar
						data={this.state.charts.barDataSets}
						legend={this.barOpts}
						height={this.props.theme.breakpoints.width("md") < window.innerWidth ? window.innerHeight / 4 : window.innerHeight - 200}
						options={{
							maintainAspectRatio: false,
						}}
					/> </div>
					: this.renderNoDataFilters() : this.renderNoDataFilters()
			case 3: 
				return this.state.charts ? this.state.charts.lineDataSets ?
					<div style={{ maxHeight: 400 }}>
						<Line
							data={this.state.charts.lineDataSets}
							legend={this.barOpts}
							height={400}
							// height={this.props.theme.breakpoints.width("md") < window.innerWidth ? window.innerHeight / 4 : window.innerHeight - 200}
							options={{
								maintainAspectRatio: false,
							}}
						/>
					</div>
					: this.renderNoDataFilters() : this.renderNoDataFilters()

			default:
				break;
		}
	}
	render() {
		const { t, classes } = this.props
		const { loading, raw } = this.state
		return (
			<InfoCard
				noExpand
				topAction={this.renderMenu()}
				title={t("collections.cards.data")}

				content={
					<ItemG container>
						{this.renderCustomDateDialog()}
						{loading ? this.renderLoader() : <ItemG xs={12}>
							<Caption className={classes.bigCaption2}>{raw ? t("collections.rawData") : t("collections.calibratedData")}</Caption>
							{this.renderType()}
						</ItemG>}
					</ItemG>
				}
			/>
		)
	}
}

export default withTheme()(CollectionData)
